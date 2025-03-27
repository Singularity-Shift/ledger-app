module ledge_addr::message_minter {
    use std::option::{Self, Option};
    use std::signer;
    use std::string::{Self, String};
    use std::vector;

    use aptos_std::simple_map::{Self, SimpleMap};
    use aptos_std::string_utils;
    use aptos_std::type_info;

    use aptos_framework::aptos_account;
    use aptos_framework::event;
    use aptos_framework::object::{Self, Object, ObjectCore};
    use aptos_framework::coin;
    use aptos_token_objects::collection::{Self, Collection};
    use aptos_token_objects::royalty::{Self, Royalty};
    use aptos_token_objects::token::{Self, Token};

    use minter::token_components;

    use minter::collection_components;
    use sshift_gpt::fees;
    use sshift_gpt::subscription;

    /// Only admin can update mint fee collector
    const EONLY_ADMIN_CAN_UPDATE_MINT_FEE_COLLECTOR: u64 = 1;
    /// Only admin or creator can create collection
    const EONLY_ADMIN_CAN_CREATE_COLLECTION: u64 = 2;
    /// Only admin can update mint enabled
    const EONLY_ADMIN_CAN_UPDATE_MINT_ENABLED: u64 = 3;
    /// Mint is disabled
    const EMINT_IS_DISABLED: u64 = 4;
    /// Invalid collection URI
    const EINVALID_COLLECTION_URI: u64 = 5;
    /// Invalid collection URI
    const EINVALID_NFT_URI: u64 = 6;
    /// Invalid emojicoin
    const EINVALID_EMOJICOIN: u64 = 7;
    /// Resource account not exists
    const ERESOURCE_ACCOUNT_NOT_FOUND: u64 = 8;
    /// Not enough balance
    const ENOT_ENOUGH_BALANCE: u64 = 9;

    /// Default to mint 0 amount to creator when creating collection
    const DEFAULT_PRE_MINT_AMOUNT: u64 = 0;
    /// Default mint fee per NFT denominated in oapt (smallest unit of APT, i.e. 1e-8 APT)
    const DEFAULT_MINT_FEE_PER_NFT: u64 = 0;

    /// 100 years in seconds, we consider mint end time to be infinite when it is set to 100 years after start time
    const ONE_HUNDRED_YEARS_IN_SECONDS: u64 = 100 * 365 * 24 * 60 * 60;

    /// Category for allowlist mint stage
    const ALLOWLIST_MINT_STAGE_CATEGORY: vector<u8> = b"Allowlist mint stage";
    /// Category for public mint stage
    const PUBLIC_MINT_MINT_STAGE_CATEGORY: vector<u8> = b"Public mint stage";

    #[event]
    struct CreateCollectionEvent has store, drop {
        creator_addr: address,
        collection_owner_obj: Object<CollectionOwnerObjConfig>,
        collection_obj: Object<Collection>,
        name: String,
        description: String,
        uri: String
    }

    #[event]
    struct BatchMintNftsEvent has store, drop {
        collection_obj: Object<Collection>,
        nft_obj: Object<Token>,
        recipient_addr: address,
        mint_fee: u64
    }

    /// Unique per collection
    /// We need this object to own the collection object instead of contract directly owns the collection object
    /// This helps us avoid address collision when we create multiple collections with same name
    struct CollectionOwnerObjConfig has key {
        collection_obj: Object<Collection>,
        extend_ref: object::ExtendRef
    }

    /// Unique per collection
    struct CollectionConfig has key {
        // Key is stage, value is mint fee denomination
        mint_fee_per_nft_by_stages: SimpleMap<String, u64>,
        mint_enabled: bool,
        collection_owner_obj: Object<CollectionOwnerObjConfig>,
        extend_ref: object::ExtendRef
    }

    /// Global per contract
    struct Registry has key {
        collection_objects: vector<Object<Collection>>
    }

    /// Global per contract
    struct Config has key {
        emojicoin_fee_addr: Option<address>,
        mint_fee_amount: u64
    }

    /// If you deploy the module under an object, sender is the object's signer
    /// If you deploy the module under your own account, sender is your account's signer
    fun init_module(sender: &signer) {
        move_to(sender, Registry { collection_objects: vector::empty() });

        move_to(
            sender,
            Config { emojicoin_fee_addr: option::none(), mint_fee_amount: 0 }
        )
    }

    public entry fun set_config<Emojicoin>(
        sender: &signer, mint_amount_fees: u64
    ) acquires Config {
        let sender_addr = signer::address_of(sender);
        assert!(is_admin(sender_addr), EONLY_ADMIN_CAN_UPDATE_MINT_ENABLED);

        let coin_type = type_info::type_of<Emojicoin>();
        let emojicoin = type_info::account_address(&coin_type);

        let config = borrow_global_mut<Config>(@ledge_addr);

        config.emojicoin_fee_addr = option::some(emojicoin);
        config.mint_fee_amount = mint_amount_fees;
    }

    // ================================= Entry Functions ================================= //
    /// Update mint enabled
    public entry fun update_mint_enabled(
        sender: &signer, collection_obj: Object<Collection>, enabled: bool
    ) acquires CollectionConfig {
        let sender_addr = signer::address_of(sender);
        assert!(is_admin(sender_addr), EONLY_ADMIN_CAN_UPDATE_MINT_ENABLED);
        let collection_obj_addr = object::object_address(&collection_obj);
        let collection_config = borrow_global_mut<CollectionConfig>(collection_obj_addr);
        collection_config.mint_enabled = enabled;
    }

    /// Create a collection, only admin or creator can create collection
    public entry fun create_collection(
        sender: &signer,
        description: String,
        name: String,
        uri: String,
        royalty_percentage: Option<u64>
    ) acquires Registry {
        let sender_addr = signer::address_of(sender);
        assert!(
            is_admin(sender_addr),
            EONLY_ADMIN_CAN_CREATE_COLLECTION
        );

        let resource_account_exists = fees::resource_account_exists();

        assert!(resource_account_exists, ERESOURCE_ACCOUNT_NOT_FOUND);

        let resource_account_addr = fees::get_resource_account_address();

        let royalty = royalty(&mut royalty_percentage, resource_account_addr);

        let collection_owner_obj_constructor_ref = &object::create_object(@ledge_addr);
        let collection_owner_obj_signer =
            &object::generate_signer(collection_owner_obj_constructor_ref);

        let uri_len = string::length(&uri);
        let collection_json_suffix = string::utf8(b"/collection.json");
        let suffix_len = string::length(&collection_json_suffix);
        assert!(
            uri_len >= suffix_len
                && string::sub_string(&uri, uri_len - suffix_len, uri_len)
                    == collection_json_suffix,
            EINVALID_COLLECTION_URI
        );

        let collection_obj_constructor_ref =
            &collection::create_unlimited_collection(
                collection_owner_obj_signer,
                description,
                name,
                royalty,
                uri
            );
        let collection_obj_signer =
            &object::generate_signer(collection_obj_constructor_ref);
        let collection_obj =
            object::object_from_constructor_ref(collection_obj_constructor_ref);

        collection_components::create_refs_and_properties(collection_obj_constructor_ref);

        move_to(
            collection_owner_obj_signer,
            CollectionOwnerObjConfig {
                extend_ref: object::generate_extend_ref(
                    collection_owner_obj_constructor_ref
                ),
                collection_obj
            }
        );
        let collection_owner_obj =
            object::object_from_constructor_ref(collection_owner_obj_constructor_ref);
        move_to(
            collection_obj_signer,
            CollectionConfig {
                mint_fee_per_nft_by_stages: simple_map::new(),
                mint_enabled: true,
                extend_ref: object::generate_extend_ref(collection_obj_constructor_ref),
                collection_owner_obj
            }
        );

        let registry = borrow_global_mut<Registry>(@ledge_addr);
        vector::push_back(&mut registry.collection_objects, collection_obj);

        event::emit(
            CreateCollectionEvent {
                creator_addr: sender_addr,
                collection_owner_obj,
                collection_obj,
                name,
                description,
                uri
            }
        );
    }

    public entry fun mint_nft<Emojicoin>(
        sender: &signer, collection_obj: Object<Collection>, nft_metadata_uri: String
    ) acquires CollectionConfig, CollectionOwnerObjConfig, Config {
        let sender_addr = signer::address_of(sender);

        let collection_config =
            borrow_global<CollectionConfig>(object::object_address(&collection_obj));

        let collection_owner_obj = collection_config.collection_owner_obj;
        let collection_owner_config =
            borrow_global<CollectionOwnerObjConfig>(
                object::object_address(&collection_owner_obj)
            );
        let collection_owner_obj_signer =
            &object::generate_signer_for_extending(&collection_owner_config.extend_ref);

        let next_nft_id = *option::borrow(&collection::count(collection_obj)) + 1;

        let uri_len = string::length(&nft_metadata_uri);
        let nft_json_suffix = string_utils::format1(&b"{}.json", next_nft_id);
        let suffix_len = string::length(&nft_json_suffix);

        assert!(
            uri_len >= suffix_len
                && string::sub_string(&nft_metadata_uri, uri_len - suffix_len, uri_len)
                    == nft_json_suffix,
            EINVALID_NFT_URI
        );

        let config = borrow_global<Config>(@ledge_addr);

        let has_subscription =
            if (subscription::has_subscription_active(sender_addr)) {
                let (_start_time, _end_time, _upgrades, trial_version) =
                    subscription::get_plan(sender_addr);

                !trial_version
            } else { false };

        let fee =
            if (has_subscription) {
                config.mint_fee_amount / 2
            } else {
                config.mint_fee_amount
            };

        let emojicoin = option::borrow(&config.emojicoin_fee_addr);

        pay_for_mint<Emojicoin>(sender, fee, *emojicoin);

        let nft_obj_constructor_ref =
            &token::create(
                collection_owner_obj_signer,
                collection::name(collection_obj),
                // placeholder value, please read description from json metadata in offchain storage
                string_utils::to_string(&next_nft_id),
                // placeholder value, please read name from json metadata in offchain storage
                string_utils::to_string(&next_nft_id),
                royalty::get(collection_obj),
                nft_metadata_uri
            );
        token_components::create_refs(nft_obj_constructor_ref);
        let nft_obj = object::object_from_constructor_ref(nft_obj_constructor_ref);
        object::transfer(collection_owner_obj_signer, nft_obj, sender_addr);

        event::emit(
            BatchMintNftsEvent {
                recipient_addr: sender_addr,
                collection_obj,
                nft_obj,
                mint_fee: config.mint_fee_amount
            }
        );
    }

    // ================================= View  ================================= //

    #[view]
    public fun get_nft_minted(collection_obj: Object<Collection>): u64 {
        *option::borrow(&collection::count(collection_obj))
    }

    #[view]
    /// Get all collections created using this contract
    public fun get_registry(): vector<Object<Collection>> acquires Registry {
        let registry = borrow_global<Registry>(@ledge_addr);
        registry.collection_objects
    }

    #[view]
    /// Is mint enabled for the collection
    public fun is_mint_enabled(collection_obj: Object<Collection>): bool acquires CollectionConfig {
        let collection_addr = object::object_address(&collection_obj);
        let collection_config = borrow_global<CollectionConfig>(collection_addr);
        collection_config.mint_enabled
    }

    // ================================= Helpers ================================= //

    /// Check if sender is admin or owner of the object when package is published to object
    fun is_admin(sender: address): bool {
        if (sender == fees::get_admin()) { true }
        else {
            if (object::is_object(@ledge_addr)) {
                let obj = object::address_to_object<ObjectCore>(@ledge_addr);
                object::is_owner(obj, sender)
            } else { false }
        }
    }

    /// Pay for mint
    fun pay_for_mint<Emojicoin>(
        sender: &signer, mint_fees: u64, coin_addr: address
    ) {
        if (mint_fees > 0) {
            let sender_addr = signer::address_of(sender);
            let coin_type = type_info::type_of<Emojicoin>();
            let emojicoin_addr = type_info::account_address(&coin_type);

            assert!(emojicoin_addr == coin_addr, EINVALID_EMOJICOIN);

            let resource_account_exists = fees::resource_account_exists();

            assert!(resource_account_exists, ERESOURCE_ACCOUNT_NOT_FOUND);

            let resource_account_addr = fees::get_resource_account_address();

            assert!(
                coin::balance<Emojicoin>(sender_addr) > mint_fees,
                ENOT_ENOUGH_BALANCE
            );

            aptos_account::transfer_coins<Emojicoin>(
                sender, resource_account_addr, mint_fees
            );
        }
    }

    /// Create royalty object
    fun royalty(royalty_numerator: &mut Option<u64>, collector: address): Option<Royalty> {
        if (option::is_some(royalty_numerator)) {
            let num = option::extract(royalty_numerator);
            option::some(royalty::create(num, 100, collector))
        } else {
            option::none()
        }
    }

    #[test_only]
    public fun initialize_for_test(sender: &signer) {
        move_to(sender, Registry { collection_objects: vector::empty() });
        move_to(
            sender,
            Config { emojicoin_fee_addr: option::none(), mint_fee_amount: 0 }
        )
    }
}
