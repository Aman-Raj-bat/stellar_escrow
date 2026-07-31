#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, token};
use trustpay_shared::types::EscrowStatus;
use trustpay_escrow::{TrustPayEscrow, TrustPayEscrowClient};

fn setup_factory(env: &Env) -> (Address, Address, Address, token::StellarAssetClient, TrustPayFactoryClient) {
    env.mock_all_auths();

    let factory_contract_id = env.register(TrustPayFactory, ());
    let factory_client = TrustPayFactoryClient::new(env, &factory_contract_id);

    let wasm_bytes = include_bytes!("../../../target/wasm32v1-none/release/trustpay_escrow.wasm");
    let wasm_hash = env.deployer().upload_contract_wasm(wasm_bytes.as_slice());

    factory_client.init(&wasm_hash);

    let client = Address::generate(env);
    let freelancer = Address::generate(env);
    let token_admin = Address::generate(env);
    
    let token_contract_id = env.register_stellar_asset_contract_v2(token_admin.clone()).address();
    let token_admin_client = token::StellarAssetClient::new(env, &token_contract_id);
    token_admin_client.mint(&client, &1000);
    
    (client, freelancer, token_contract_id, token_admin_client, factory_client)
}

#[test]
fn test_factory_creates_escrow() {
    let env = Env::default();
    let (client, freelancer, token_contract_id, _token_admin, factory_client) = setup_factory(&env);

    let amount = 100;
    let escrow_id = factory_client.create_escrow(&client, &freelancer, &amount, &token_contract_id);

    let escrow_client = TrustPayEscrowClient::new(&env, &escrow_id);
    let escrow = escrow_client.get_escrow();
    assert_eq!(escrow.id, 1);
    assert_eq!(escrow.client, client);
    assert_eq!(escrow.freelancer, freelancer);
    assert_eq!(escrow.amount, amount);
    assert_eq!(escrow.token, token_contract_id);
    assert_eq!(escrow.status, EscrowStatus::Created);
}

#[test]
fn test_amount_too_low() {
    let env = Env::default();
    let (client, freelancer, token_contract_id, _token_admin, factory_client) = setup_factory(&env);

    let res = factory_client.try_create_escrow(&client, &freelancer, &0, &token_contract_id);
    assert_eq!(res.unwrap_err().unwrap(), Error::AmountTooLow);
    
    let res = factory_client.try_create_escrow(&client, &freelancer, &-10, &token_contract_id);
    assert_eq!(res.unwrap_err().unwrap(), Error::AmountTooLow);
}

#[test]
#[should_panic(expected = "Factory not initialized")]
fn test_factory_not_initialized() {
    let env = Env::default();
    env.mock_all_auths();

    let factory_contract_id = env.register(TrustPayFactory, ());
    let factory_client = TrustPayFactoryClient::new(&env, &factory_contract_id);

    let client = Address::generate(&env);
    let freelancer = Address::generate(&env);
    let token_contract_id = Address::generate(&env);

    factory_client.create_escrow(&client, &freelancer, &100, &token_contract_id);
}

#[test]
fn test_multiple_escrows() {
    let env = Env::default();
    let (client, freelancer, token_contract_id, _token_admin, factory_client) = setup_factory(&env);

    let id1 = factory_client.create_escrow(&client, &freelancer, &100, &token_contract_id);
    let id2 = factory_client.create_escrow(&client, &freelancer, &200, &token_contract_id);
    
    assert_ne!(id1, id2);
    
    let escrow1 = TrustPayEscrowClient::new(&env, &id1).get_escrow();
    let escrow2 = TrustPayEscrowClient::new(&env, &id2).get_escrow();
    
    assert_eq!(escrow1.id, 1);
    assert_eq!(escrow2.id, 2);
}
