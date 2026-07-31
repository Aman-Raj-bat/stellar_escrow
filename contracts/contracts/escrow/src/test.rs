#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, token, Address, Env};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
    let contract_id = env.register_stellar_asset_contract_v2(admin.clone()).address();
    token::StellarAssetClient::new(env, &contract_id)
}

#[test]
fn test_escrow_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    
    // Set up token
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    let token_id = token_client.address.clone();
    
    // Mint 1000 tokens to client
    token_client.mint(&client, &1000);
    assert_eq!(token::Client::new(&env, &token_id).balance(&client), 1000);

    // Deploy Escrow Contract
    let contract_id = env.register(TrustPayEscrow, ());
    let escrow_client = TrustPayEscrowClient::new(&env, &contract_id);

    // 1. Init Escrow
    let amount: i128 = 500;
    let escrow_id = 1u64;
    escrow_client.init_escrow(&escrow_id, &client, &freelancer, &amount, &token_id);

    let mut escrow = escrow_client.get_escrow();
    assert_eq!(escrow.status, EscrowStatus::Created);

    // 2. Deposit Funds
    escrow_client.deposit();
    
    // Verify funds moved from client to contract
    let token_c = token::Client::new(&env, &token_id);
    assert_eq!(token_c.balance(&client), 500);
    assert_eq!(token_c.balance(&contract_id), 500);
    
    escrow = escrow_client.get_escrow();
    assert_eq!(escrow.status, EscrowStatus::Funded);

    // 3. Accept Escrow
    escrow_client.accept();
    
    escrow = escrow_client.get_escrow();
    assert_eq!(escrow.status, EscrowStatus::Accepted);

    // 4. Release Funds
    escrow_client.release();

    // Verify funds moved from contract to freelancer
    assert_eq!(token_c.balance(&contract_id), 0);
    assert_eq!(token_c.balance(&freelancer), 500);

    escrow = escrow_client.get_escrow();
    assert_eq!(escrow.status, EscrowStatus::Released);
}
