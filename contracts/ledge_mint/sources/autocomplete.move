module ledge_addr::autocomplete {
    use std::signer;
    use aptos_std::smart_table::{Self, SmartTable};
    use aptos_framework::aptos_account;
    use aptos_framework::coin;
    use aptos_framework::event;
    use sshift_gpt::fees;
    use ledge_addr::message_minter;
    use aptos_std::type_info;

    struct Config has key {
        fees: u64,
        server: address
    }

    struct AutocompleteGenerated has key, store {
        payments: SmartTable<address, bool>
    }

    #[event]
    struct AutocompletePayment has store, drop {
        account: address,
        fees: u64,
        coin_addr: address
    }

    /// Not enough balance
    const ENOT_ENOUGH_BALANCE: u64 = 1;
    /// Wrong Coin
    const EINVALID_EMOJICOIN: u64 = 2;
    /// Resource account does not exists
    const ERESOURCE_ACCOUNT_NOT_FOUND: u64 = 3;
    /// Only server can execute this entry function
    const EONLY_SERVER: u64 = 4;

    fun init_module(sender: &signer) {
        let signer_addr = signer::address_of(sender);

        move_to(sender, Config { fees: 0, server: signer_addr });

        move_to(sender, AutocompleteGenerated { payments: smart_table::new() })
    }

    public entry fun set_new_server(sender: &signer, new_server: address) acquires Config {
        let sender_addr = signer::address_of(sender);

        let config = borrow_global_mut<Config>(@ledge_addr);

        assert!(sender_addr == config.server, EONLY_SERVER);

        config.server = new_server;
    }

    public entry fun set_fees(sender: &signer, amount: u64) acquires Config {
        let sender_addr = signer::address_of(sender);

        let config = borrow_global_mut<Config>(@ledge_addr);

        assert!(sender_addr == config.server, EONLY_SERVER);

        config.fees = amount;
    }

    public entry fun buy_autocomplete<Emojicoin>(
        sender: &signer
    ) acquires Config, AutocompleteGenerated {
        let (coin_addr, _amount) = message_minter::get_mint_settings();

        let coin_type = type_info::type_of<Emojicoin>();
        let emojicoin_addr = type_info::account_address(&coin_type);

        assert!(emojicoin_addr == coin_addr, EINVALID_EMOJICOIN);

        let config = borrow_global<Config>(@ledge_addr);

        let resource_account_exists = fees::resource_account_exists();

        assert!(resource_account_exists, ERESOURCE_ACCOUNT_NOT_FOUND);

        let resource_account_addr = fees::get_resource_account_address();

        let sender_addr = signer::address_of(sender);

        assert!(
            coin::balance<Emojicoin>(sender_addr) >= config.fees,
            ENOT_ENOUGH_BALANCE
        );

        aptos_account::transfer_coins<Emojicoin>(
            sender, resource_account_addr, config.fees
        );

        let autocomplete_generated =
            borrow_global_mut<AutocompleteGenerated>(@ledge_addr);

        smart_table::upsert(&mut autocomplete_generated.payments, sender_addr, true);

        event::emit(
            AutocompletePayment { account: sender_addr, fees: config.fees, coin_addr }
        );
    }

    public entry fun reset_payment(
        sender: &signer, account: address
    ) acquires AutocompleteGenerated, Config {
        let sender_addr = signer::address_of(sender);

        let config = borrow_global<Config>(@ledge_addr);

        assert!(sender_addr == config.server, EONLY_SERVER);

        let autocomplete_generated =
            borrow_global_mut<AutocompleteGenerated>(@ledge_addr);

        smart_table::upsert(&mut autocomplete_generated.payments, account, false);
    }

    #[view]
    public fun get_autocomplete_payment(account: address): bool acquires AutocompleteGenerated {
        let autocomplete_generated = borrow_global<AutocompleteGenerated>(@ledge_addr);

        *smart_table::borrow_with_default(&autocomplete_generated.payments, account, &false)
    }

    #[view]
    public fun get_config(): (u64, address) acquires Config {
        let config = borrow_global_mut<Config>(@ledge_addr);

        (config.fees, config.server)
    }

    #[test_only]
    public fun initialize_for_test(sender: &signer) {
        let signer_addr = signer::address_of(sender);

        move_to(sender, Config { fees: 0, server: signer_addr });

        move_to(sender, AutocompleteGenerated { payments: smart_table::new() })
    }
}
