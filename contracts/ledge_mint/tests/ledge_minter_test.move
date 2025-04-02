#[test_only]
module ledge_addr::test {
    use std::string::{Self, String};
    use std::signer;
    use std::option;
    use std::vector;
    use aptos_framework::aptos_coin::{Self, AptosCoin};
    use aptos_framework::coin;
    use aptos_framework::account;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::primary_fungible_store;
    use aptos_framework::fungible_asset::{Self, MintRef, TransferRef, Metadata};
    use aptos_framework::timestamp;
    use aptos_token_objects::collection;
    use aptos_token::token as token_v1;
    use sshift_gpt::fees;
    use sshift_gpt::subscription::{Self};
    use ledge_addr::message_minter;

    const EREGISTRY_NOT_FOUND: u64 = 1;
    const EBALANCE_NOT_MATCH: u64 = 2;

    struct TestCoin {}

    struct FAController has key {
        mint_ref: MintRef,
        transfer_ref: TransferRef
    }

    fun create_resource_account(sender: &signer, admin: &signer) {
        let admin_addr = signer::address_of(admin);

        fees::initialize_for_test(sender);

        fees::create_resource_account(sender, b"test", vector[admin_addr]);

        fees::create_collector_object(admin);
    }

    fun create_move_bot(sender: &signer): token_v1::TokenDataId {
        let collection_name = string::utf8(b"Move Bot");
        let description = string::utf8(b"Move Bot collection");
        let collection_uri = string::utf8(b"Move Bot url");
        let token_name = string::utf8(b"Move Bots #10");
        let token_uri = string::utf8(b"My Token Move Bot");
        let maximum_supply = 0;
        let mutate_setting = vector<bool>[false, false, false];

        let resource_account_addr = fees::get_resource_account_address();

        // Create the nft collection.
        token_v1::create_collection(
            sender,
            collection_name,
            description,
            collection_uri,
            maximum_supply,
            mutate_setting
        );

        let token_data_id =
            token_v1::create_tokendata(
                sender,
                collection_name,
                token_name,
                string::utf8(b""),
                0,
                token_uri,
                resource_account_addr,
                1,
                0,
                token_v1::create_token_mutability_config(
                    &vector<bool>[false, false, false, false, true]
                ),
                vector<String>[string::utf8(b"given_to")],
                vector<vector<u8>>[b""],
                vector<String>[string::utf8(b"address")]
            );

        token_data_id
    }

    fun create_fa(): Object<Metadata> {
        let fa_owner_obj_constructor_ref = &object::create_object(@sshift_gpt_addr);
        let fa_owner_obj_signer = &object::generate_signer(fa_owner_obj_constructor_ref);

        let name = string::utf8(b"usdt test");

        let fa_obj_constructor_ref =
            &object::create_named_object(fa_owner_obj_signer, *string::bytes(&name));

        let fa_obj_signer = &object::generate_signer(fa_obj_constructor_ref);

        primary_fungible_store::create_primary_store_enabled_fungible_asset(
            fa_obj_constructor_ref,
            option::none(),
            name,
            string::utf8(b"USDT"),
            8,
            string::utf8(b"test"),
            string::utf8(b"usdt_project")
        );

        let fa_obj =
            object::object_from_constructor_ref<Metadata>(fa_obj_constructor_ref);

        let mint_ref = fungible_asset::generate_mint_ref(fa_obj_constructor_ref);
        let transfer_ref = fungible_asset::generate_transfer_ref(fa_obj_constructor_ref);

        move_to(
            fa_obj_signer,
            FAController { mint_ref, transfer_ref }
        );

        fa_obj
    }

    fun create_collection(
        creator: &signer,
        description: String,
        amount: u64,
        name: String,
        url: String
    ): address {
        let collection_obj_constructor_ref =
            collection::create_fixed_collection(
                creator,
                description,
                amount,
                name,
                option::none(),
                url
            );

        let collection_obj_signer =
            object::generate_signer(&collection_obj_constructor_ref);
        signer::address_of(&collection_obj_signer)
    }

    fun create_subscription(
        sender: &signer, admin: &signer
    ): (token_v1::TokenDataId, address, address) {
        let admin_addr = signer::address_of(admin);

        create_resource_account(sender, admin);

        fees::set_pending_admin(sender, admin_addr);

        fees::accept_admin(admin);

        let token_data_id = create_move_bot(admin);

        let collection_addr_1 =
            create_collection(
                admin,
                string::utf8(b"Sshift test v1"),
                5000,
                string::utf8(b"Sshift NFT v1"),
                string::utf8(
                    b"https://gateway.irys.xyz/manifest_id/collection.json"
                )
            );

        let collection_addr_2 =
            create_collection(
                admin,
                string::utf8(b"Sshift test v2"),
                5000,
                string::utf8(b"Sshift NFT v2"),
                string::utf8(
                    b"https://gateway.irys.xyz/manifest_id/collection.json"
                )
            );

        let collections_v2 = vector::empty();
        vector::push_back(&mut collections_v2, collection_addr_1);
        vector::push_back(&mut collections_v2, collection_addr_2);

        let discounts = vector::empty();
        vector::push_back(&mut discounts, 1000000);
        vector::push_back(&mut discounts, 2000000);

        subscription::init_module_test(sender);

        subscription::trigger_app(sender);

        let prices: vector<u64> = vector[
            200000000, 326000000, 434000000, 531000000, 622000000, 707000000, 789000000,
            866000000, 941000000, 1014000000, 1084000000, 1153000000, 1220000000,
            1285000000, 1350000000, 1412000000, 1474000000, 1535000000, 1594000000,
            1653000000, 1711000000, 1768000000, 1824000000, 1880000000, 1935000000,
            1989000000, 2043000000, 2096000000, 2148000000, 2200000000
        ];

        subscription::set_plan(
            admin,
            prices,
            collections_v2,
            discounts,
            admin_addr,
            string::utf8(b"Move Bot"),
            string::utf8(b"My Move Bot"),
            token_v1::get_tokendata_largest_property_version(admin_addr, token_data_id)
        );

        (token_data_id, collection_addr_1, collection_addr_2)
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

    fun mint_fa(sender: &signer, mint_ref: &MintRef, amount: u64) {
        let account_addr = signer::address_of(sender);

        primary_fungible_store::mint(mint_ref, account_addr, amount);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x300
    )]
    fun should_be_free_minting_for_subscribers(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        user: &signer
    ) acquires FAController {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);
        timestamp::set_time_has_started_for_testing(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let user_addr = signer::address_of(user);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        account::create_account_for_test(user_addr);
        coin::register<AptosCoin>(user);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_subscription(ledge, admin);

        mint_coin<TestCoin>(ledge, 20000000, user);

        let fa_obj = create_fa();

        let fa_addr = object::object_address(&fa_obj);

        let fa_controller = borrow_global<FAController>(fa_addr);

        mint_fa(user, &fa_controller.mint_ref, 20000000000000);

        fees::add_currency(admin, fa_addr);

        subscription::buy_plan(
            user,
            604800,
            vector::empty(),
            vector::empty(),
            fa_addr
        );

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

        assert!(coin::balance<TestCoin>(user_addr) == 20000000, EBALANCE_NOT_MATCH);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x201
    )]
    #[expected_failure(abort_code = 2, location = message_minter)]
    fun should_create_collection_only_by_admin(
        aptos_framework: &signer,
        ledge: &signer,
        admin: &signer,
        user: &signer
    ) {
        let (burn_cap, mint_cap) = aptos_coin::initialize_for_test(aptos_framework);

        let admin_addr = signer::address_of(admin);
        let user_addr = signer::address_of(user);

        account::create_account_for_test(user_addr);
        coin::register<AptosCoin>(user);

        account::create_account_for_test(admin_addr);
        coin::register<AptosCoin>(admin);

        aptos_coin::mint(aptos_framework, admin_addr, 20000000);

        create_resource_account(ledge, admin);

        fees::set_pending_admin(ledge, admin_addr);

        fees::accept_admin(admin);

        message_minter::initialize_for_test(ledge);

        message_minter::create_collection(
            user,
            string::utf8(b"A collection for testing"),
            string::utf8(b"Test Collection"),
            string::utf8(
                b"https://ledgerapp.fun/test/collection.json"
            ),
            option::some(6)
        );

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x201
    )]
    #[expected_failure(abort_code = 1, location = message_minter)]
    fun should_set_mint_price_only_by_admin(
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

        message_minter::set_config<TestCoin>(user, 10000);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x300
    )]
    #[expected_failure(abort_code = 4, location = message_minter)]
    fun should_not_mint_nft_if_it_is_disabled(
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

        message_minter::update_mint_enabled(admin, registry[0], false);

        message_minter::mint_nft<TestCoin>(
            user,
            registry[0],
            string::utf8(b"https://ledgerapp.fun/test/1.json")
        );

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(
        aptos_framework = @0x1, ledge = @ledge_addr, admin = @0x200, user = @0x300
    )]
    #[expected_failure(abort_code = 3, location = message_minter)]
    fun should_only_admin_disabled_mint(
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

        message_minter::update_mint_enabled(user, registry[0], false);

        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
