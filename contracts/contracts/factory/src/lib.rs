#![no_std]

#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, contracttype, Symbol, Address, BytesN, Env, IntoVal};
use trustpay_shared::errors::Error;

const TTL_THRESHOLD: u32 = 120_960;
const TTL_EXTEND: u32 = 518_400;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Nonce,
    EscrowWasmHash,
}

#[contract]
pub struct TrustPayFactory;

#[contractimpl]
impl TrustPayFactory {
    /// Initialize the factory with the WASM hash of the escrow contract
    pub fn init(env: Env, wasm_hash: BytesN<32>) {
        env.storage().instance().set(&DataKey::EscrowWasmHash, &wasm_hash);
    }

    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        amount: i128,
        token: Address,
    ) -> Result<Address, Error> {
        client.require_auth();

        if amount <= 0 {
            return Err(Error::AmountTooLow);
        }

        let wasm_hash: BytesN<32> = env
            .storage()
            .instance()
            .get(&DataKey::EscrowWasmHash)
            .expect("Factory not initialized");

        let mut nonce: u64 = env.storage().instance().get(&DataKey::Nonce).unwrap_or(0);
        nonce += 1;

        env.storage().instance().set(&DataKey::Nonce, &nonce);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        // Derive salt from nonce (could be anything unique)
        let mut salt_bytes = [0u8; 32];
        let nonce_bytes = nonce.to_be_bytes();
        salt_bytes[24..32].copy_from_slice(&nonce_bytes);
        let salt = BytesN::from_array(&env, &salt_bytes);

        // Deploy new escrow contract
        let escrow_address = env
            .deployer()
            .with_current_contract(salt)
            .deploy_v2(wasm_hash, ());

        // Initialize the new escrow contract
        let _res: () = env.invoke_contract(
            &escrow_address,
            &Symbol::new(&env, "init_escrow"),
            (nonce, client, freelancer, amount, token).into_val(&env),
        );

        Ok(escrow_address)
    }
}
