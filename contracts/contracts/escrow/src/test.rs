#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    token, Address, Env,
};

fn create_token_contract<'a>(env: &Env, admin: &Address) -> token::StellarAssetClient<'a> {
    let contract_id = env.register_stellar_asset_contract_v2(admin.clone()).address();
    token::StellarAssetClient::new(env, &contract_id)
}

fn setup_test(env: &Env) -> (Address, Address, token::StellarAssetClient, TrustPayEscrowClient) {
    env.mock_all_auths();
    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    
    let token_admin = Address::generate(&env);
    let token_client = create_token_contract(&env, &token_admin);
    
    let contract_id = env.register(TrustPayEscrow, ());
    let escrow_client = TrustPayEscrowClient::new(&env, &contract_id);
    
    (client, freelancer, token_client, escrow_client)
}

#[test]
fn test_happy_path() {
    let env = Env::default();
    let (client, freelancer, token_client, escrow_client) = setup_test(&env);
    let token_id = token_client.address.clone();
    
    token_client.mint(&client, &1000);

    // 1. Init Escrow
    escrow_client.init_escrow(&1, &client, &freelancer, &500, &token_id);
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Created);

    // 2. Deposit
    escrow_client.deposit();
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Funded);

    // 3. Accept
    escrow_client.accept();
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Accepted);

    // 4. Release
    escrow_client.release();
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Released);
    
    let token_c = token::Client::new(&env, &token_id);
    assert_eq!(token_c.balance(&freelancer), 500);
}

#[test]
fn test_refund_from_funded() {
    let env = Env::default();
    let (client, freelancer, token_client, escrow_client) = setup_test(&env);
    let token_id = token_client.address.clone();
    
    token_client.mint(&client, &1000);
    escrow_client.init_escrow(&1, &client, &freelancer, &500, &token_id);
    escrow_client.deposit();
    
    let token_c = token::Client::new(&env, &token_id);
    assert_eq!(token_c.balance(&client), 500); // 1000 - 500

    // Refund
    escrow_client.refund();
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Refunded);
    assert_eq!(token_c.balance(&client), 1000); // Back to 1000
}

#[test]
fn test_refund_from_accepted() {
    let env = Env::default();
    let (client, freelancer, token_client, escrow_client) = setup_test(&env);
    let token_id = token_client.address.clone();
    
    token_client.mint(&client, &1000);
    escrow_client.init_escrow(&1, &client, &freelancer, &500, &token_id);
    escrow_client.deposit();
    escrow_client.accept();
    
    let token_c = token::Client::new(&env, &token_id);

    // Refund
    escrow_client.refund();
    assert_eq!(escrow_client.get_escrow().status, EscrowStatus::Refunded);
    assert_eq!(token_c.balance(&client), 1000);
}

#[test]
fn test_invalid_state_transitions() {
    let env = Env::default();
    let (client, freelancer, token_client, escrow_client) = setup_test(&env);
    let token_id = token_client.address.clone();
    
    token_client.mint(&client, &1000);

    // Cannot operate before init
    assert_eq!(escrow_client.try_deposit().unwrap_err().unwrap(), Error::EscrowNotFound);

    escrow_client.init_escrow(&1, &client, &freelancer, &500, &token_id);

    // Cannot re-init
    assert_eq!(escrow_client.try_init_escrow(&1, &client, &freelancer, &500, &token_id).unwrap_err().unwrap(), Error::InvalidStatus);

    // Cannot accept, release, or refund from Created
    assert_eq!(escrow_client.try_accept().unwrap_err().unwrap(), Error::InvalidStatus);
    assert_eq!(escrow_client.try_release().unwrap_err().unwrap(), Error::InvalidStatus);
    assert_eq!(escrow_client.try_refund().unwrap_err().unwrap(), Error::InvalidStatus);

    escrow_client.deposit();

    // Cannot double deposit
    assert_eq!(escrow_client.try_deposit().unwrap_err().unwrap(), Error::InvalidStatus);
    // Cannot release from Funded
    assert_eq!(escrow_client.try_release().unwrap_err().unwrap(), Error::InvalidStatus);

    escrow_client.accept();

    // Cannot double accept
    assert_eq!(escrow_client.try_accept().unwrap_err().unwrap(), Error::InvalidStatus);

    escrow_client.release();

    // Cannot do anything from Released
    assert_eq!(escrow_client.try_deposit().unwrap_err().unwrap(), Error::InvalidStatus);
    assert_eq!(escrow_client.try_accept().unwrap_err().unwrap(), Error::InvalidStatus);
    assert_eq!(escrow_client.try_release().unwrap_err().unwrap(), Error::InvalidStatus);
    assert_eq!(escrow_client.try_refund().unwrap_err().unwrap(), Error::InvalidStatus);
}


