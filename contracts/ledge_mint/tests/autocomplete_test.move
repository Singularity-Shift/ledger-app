#[test_only]
module ledge_addr::autocomplete_test {
    use std::string;
    use std::signer;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin;
    use aptos_framework::account;
    use sshift_gpt::fees;
    use ledge_addr::autocomplete;
    use ledge_addr::message_minter;

    const EREGISTRY_NOT_FOUND: u64 = 1;
    const EBALANCE_NOT_MATCH: u64 = 2;
    const COMPARATION_NOT_MATCH: u64 = 3;

    struct TestCoin {}

    fun create_resource_account(sender: &signer, admin: &signer) {
        let admin_addr = signer::address_of(admin);

        fees::initialize_for_test(sender);

        fees::create_resource_account(sender, b"test", vector[admin_addr]);

        fees::create_collector_object(admin);
    }

    fun mint_coin<CoinType>(admin: &signer, amount: u64, to: &signer) {
        let (burn_cap, freeze_cap, mint_cap) =
            coin::initialize<CoinType>(
                admin,
                string::utf8(b"Test"),
                string::utf8(b"Test coin"),
                8,
                true
            );

        coin::register<CoinType>(to);

        let coins = coin::mint<CoinType>(amount, &mint_cap);
        coin::deposit<CoinType>(signer::address_of(to), coins);
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_freeze_cap(freeze_cap);
    }

    #[
        test(
            aptos_framework = @0x1,
            ledge = @ledge_addr,
            admin = @0x200,
            server = @0x300,
            buyer = @0x400
        )
    ]
    fun should_buy_autocomplete(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        server: &signer,
        buyer: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let server_addr = signer::address_of(server);
        let buyer_addr = signer::address_of(buyer);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        account::create_account_for_test(buyer_addr);
        coin::register<AptosCoin>(buyer);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        autocomplete::initialize_for_test(ledge);

        autocomplete::set_new_server(ledge, server_addr);
        autocomplete::set_fees(server, 2000);

        mint_coin<TestCoin>(ledge, 20000000, buyer);

        message_minter::initialize_for_test(ledge);
        message_minter::set_config<TestCoin>(admin, 10000);

        autocomplete::buy_autocomplete<TestCoin>(buyer);

        let resource_account_addr = fees::get_resource_account_address();

        let balance = coin::balance<TestCoin>(resource_account_addr);

        assert!(balance == 2000, EBALANCE_NOT_MATCH);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[
        test(
            aptos_framework = @0x1,
            ledge = @ledge_addr,
            admin = @0x200,
            server = @0x300,
            buyer = @0x400
        )
    ]
    fun should_reset_payment(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        server: &signer,
        buyer: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let server_addr = signer::address_of(server);
        let buyer_addr = signer::address_of(buyer);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        account::create_account_for_test(buyer_addr);
        coin::register<AptosCoin>(buyer);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        autocomplete::initialize_for_test(ledge);

        autocomplete::set_new_server(ledge, server_addr);
        autocomplete::set_fees(server, 2000);

        mint_coin<TestCoin>(ledge, 20000000, buyer);

        message_minter::initialize_for_test(ledge);
        message_minter::set_config<TestCoin>(admin, 10000);

        autocomplete::buy_autocomplete<TestCoin>(buyer);

        let completed = autocomplete::get_autocomplete_payment(buyer_addr);

        assert!(completed == true, COMPARATION_NOT_MATCH);

        autocomplete::reset_payment(server, buyer_addr);

        let completed = autocomplete::get_autocomplete_payment(buyer_addr);

        assert!(completed == false, COMPARATION_NOT_MATCH);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(ledge = @ledge_addr, admin = @0x200, server = @0x300)]
    #[expected_failure(abort_code = 4, location = autocomplete)]
    fun should_not_set_new_server_not_allowed_account(
        ledge: &signer, admin: &signer, server: &signer
    ) {
        let server_addr = signer::address_of(server);

        autocomplete::initialize_for_test(ledge);

        autocomplete::set_new_server(admin, server_addr);
    }

    #[test(ledge = @ledge_addr, admin = @0x200)]
    #[expected_failure(abort_code = 4, location = autocomplete)]
    fun should_not_set_fees_not_allowed_account(
        ledge: &signer, admin: &signer
    ) {
        autocomplete::initialize_for_test(ledge);

        autocomplete::set_fees(admin, 2000);
    }

    #[
        test(
            aptos_framework = @0x1,
            ledge = @ledge_addr,
            admin = @0x200,
            server = @0x300,
            buyer = @0x400
        )
    ]
    #[expected_failure(abort_code = 4, location = autocomplete)]
    fun should_only_serve_reset_payment(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        server: &signer,
        buyer: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let server_addr = signer::address_of(server);
        let buyer_addr = signer::address_of(buyer);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        account::create_account_for_test(buyer_addr);
        coin::register<AptosCoin>(buyer);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        autocomplete::initialize_for_test(ledge);

        autocomplete::set_new_server(ledge, server_addr);
        autocomplete::set_fees(server, 2000);

        mint_coin<TestCoin>(ledge, 20000000, buyer);

        message_minter::initialize_for_test(ledge);
        message_minter::set_config<TestCoin>(admin, 10000);

        autocomplete::buy_autocomplete<TestCoin>(buyer);

        autocomplete::reset_payment(buyer, buyer_addr);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
