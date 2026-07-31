#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, token};
use trustpay_shared::types::EscrowStatus;
use trustpay_escrow::{TrustPayEscrow, TrustPayEscrowClient};

#[test]
fn test_factory_creates_escrow() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Factory contract
    let factory_contract_id = env.register(TrustPayFactory, ());
    let factory_client = TrustPayFactoryClient::new(&env, &factory_contract_id);

    // Upload Escrow WASM using compiled bytes
    let wasm_bytes = include_bytes!("../../../target/wasm32v1-none/release/trustpay_escrow.wasm");
    let wasm_hash = env.deployer().upload_contract_wasm(wasm_bytes.as_slice());

    // Initialize Factory
    factory_client.init(&wasm_hash);

    // Setup actors and token
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let token_admin = Address::generate(&env);
    let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    
    let token_client = token::Client::new(&env, &token_contract_id);
    let token_admin_client = token::StellarAssetClient::new(&env, &token_contract_id);
    
    token_admin_client.mint(&client, &1000);

    let amount = 100;

    // Create Escrow via Factory
    let escrow_id = factory_client.create_escrow(&client, &freelancer, &amount, &token_contract_id);

    // Verify state in Escrow contract using the new escrow_id (which is an Address)
    let escrow_client = TrustPayEscrowClient::new(&env, &escrow_id);
    let escrow = escrow_client.get_escrow();
    assert_eq!(escrow.id, 1);
    assert_eq!(escrow.client, client);
    assert_eq!(escrow.freelancer, freelancer);
    assert_eq!(escrow.amount, amount);
    assert_eq!(escrow.token, token_contract_id);
    assert_eq!(escrow.status, EscrowStatus::Created);
}
