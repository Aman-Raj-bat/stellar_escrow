#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, token};
use trustpay_shared::types::EscrowStatus;

// To test cross-contract calls, we need to register both contracts in the environment.
// Since we don't have access to the escrow WASM in the factory tests directly unless we import it,
// we can use the `contractimport` or just register the Rust type directly.
// The easiest way is to register the `TrustPayEscrow` contract from the other crate.
use trustpay_escrow::{TrustPayEscrow, TrustPayEscrowClient};

#[test]
fn test_factory_creates_escrow() {
    let env = Env::default();
    env.mock_all_auths();

    // Register Escrow contract
    let escrow_contract_id = env.register(TrustPayEscrow, ());
    let escrow_client = TrustPayEscrowClient::new(&env, &escrow_contract_id);

    // Register Factory contract
    let factory_contract_id = env.register(TrustPayFactory, ());
    let factory_client = TrustPayFactoryClient::new(&env, &factory_contract_id);

    // Initialize Factory
    factory_client.init(&escrow_contract_id);

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
    assert_eq!(escrow_id, 1);

    // Verify state in Escrow contract
    let escrow = escrow_client.get_escrow(&escrow_id);
    assert_eq!(escrow.id, 1);
    assert_eq!(escrow.client, client);
    assert_eq!(escrow.freelancer, freelancer);
    assert_eq!(escrow.amount, amount);
    assert_eq!(escrow.token, token_contract_id);
    assert_eq!(escrow.status, EscrowStatus::Created);
}
