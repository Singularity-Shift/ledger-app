#[test_only]
module ledge_addr::test {
    use std::string;
    use std::signer;
    use std::option;
    use std::vector;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin;
    use aptos_framework::account;
    use sshift_gpt::fees;
    use ledge_addr::message_minter;

    const EREGISTRY_NOT_FOUND: u64 = 1;
    const EBALANCE_NOT_MATCH: u64 = 2;

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

    #[test(aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200)]
    fun should_create_collection(
        aptos_framework: &signer, ledge: &signer, admin: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        message_minter::initialize_for_test(ledge);

        message_minter::create_collection(
            admin,
            string::utf8(b"A collection for testing"),
            string::utf8(b"Test Collection"),
            string::utf8(
                b"https://ledgerapp.fun/test/collection.json"
            ),
            option::some(6)
        );

        let registry = message_minter::get_registry();

        let registry_index = vector::length(&registry);

        assert!(registry_index > 0, EREGISTRY_NOT_FOUND);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x300
    )]
    fun should_mint_nft(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        user: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let user_addr = signer::address_of(user);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        account::create_account_for_test(user_addr);
        coin::register<AptosCoin>(user);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        mint_coin<TestCoin>(ledge, 20000000, user);

        message_minter::initialize_for_test(ledge);

        message_minter::set_config<TestCoin>(admin, 10000);

        message_minter::create_collection(
            admin,
            string::utf8(b"A collection for testing"),
            string::utf8(b"Test Collection"),
            string::utf8(
                b"https://ledgerapp.fun/test/collection.json"
            ),
            option::some(6)
        );

        let registry = message_minter::get_registry();

        message_minter::mint_nft<TestCoin>(
            user,
            registry[0],
            string::utf8(b"https://ledgerapp.fun/test/1.json")
        );

        assert!(coin::balance<TestCoin>(user_addr) == 19990000, EBALANCE_NOT_MATCH);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
