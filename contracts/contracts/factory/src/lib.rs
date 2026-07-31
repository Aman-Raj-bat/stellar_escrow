#![no_std]

#[cfg(test)]
mod test;

use soroban_sdk::{contract, contractimpl, contracttype, Symbol, Address, Env, IntoVal};
use trustpay_shared::errors::Error;

const TTL_THRESHOLD: u32 = 120_960;
const TTL_EXTEND: u32 = 518_400;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Nonce,
    EscrowContract, // Address of the escrow contract it communicates with
}

#[contract]
pub struct TrustPayFactory;

#[contractimpl]
impl TrustPayFactory {
    /// Initialize the factory with the address of the escrow manager contract
    pub fn init(env: Env, escrow_contract: Address) {
        env.storage().instance().set(&DataKey::EscrowContract, &escrow_contract);
    }

    pub fn create_escrow(
        env: Env,
        client: Address,
        freelancer: Address,
        amount: i128,
        token: Address,
    ) -> Result<u64, Error> {
        client.require_auth();

        if amount <= 0 {
            return Err(Error::AmountTooLow);
        }

        let escrow_contract: Address = env
            .storage()
            .instance()
            .get(&DataKey::EscrowContract)
            .expect("Factory not initialized");

        let mut nonce: u64 = env.storage().instance().get(&DataKey::Nonce).unwrap_or(0);
        nonce += 1;

        env.storage().instance().set(&DataKey::Nonce, &nonce);
        env.storage().instance().extend_ttl(TTL_THRESHOLD, TTL_EXTEND);

        let _res: () = env.invoke_contract(
            &escrow_contract,
            &Symbol::new(&env, "init_escrow"),
            (nonce, client, freelancer, amount, token).into_val(&env),
        );

        Ok(nonce)
    }
}
