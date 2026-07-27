#![no_std]

mod errors;
mod events;
mod storage_types;
mod test;

use errors::Error;
use storage_types::{DataKey, Escrow, EscrowStatus};
use soroban_sdk::{
    contract, contractimpl, token, Address, Env
};

#[contract]
pub struct TrustPayEscrow;

#[contractimpl]
impl TrustPayEscrow {
    /// Creates a new escrow agreement. Returns the Escrow ID.
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

        let mut nonce: u64 = env.storage().instance().get(&DataKey::Nonce).unwrap_or(0);
        nonce += 1;
        
        let escrow = Escrow {
            id: nonce,
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount,
            token,
            status: EscrowStatus::Created,
        };

        env.storage().persistent().set(&DataKey::Escrow(nonce), &escrow);
        env.storage().instance().set(&DataKey::Nonce, &nonce);

        events::created(&env, nonce, client, freelancer, amount);

        Ok(nonce)
    }

    /// Deposits funds into the escrow contract, moving it from `Created` to `Funded`.
    pub fn deposit(env: Env, escrow_id: u64) -> Result<(), Error> {
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        if escrow.status != EscrowStatus::Created {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(&escrow.client, &env.current_contract_address(), &escrow.amount);

        escrow.status = EscrowStatus::Funded;
        env.storage().persistent().set(&DataKey::Escrow(escrow_id), &escrow);

        events::funded(&env, escrow_id);

        Ok(())
    }

    /// Freelancer accepts the escrow, agreeing to start work.
    pub fn accept(env: Env, escrow_id: u64) -> Result<(), Error> {
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        if escrow.status != EscrowStatus::Funded {
            return Err(Error::InvalidStatus);
        }

        escrow.freelancer.require_auth();

        escrow.status = EscrowStatus::Accepted;
        env.storage().persistent().set(&DataKey::Escrow(escrow_id), &escrow);

        events::accepted(&env, escrow_id, escrow.freelancer.clone());

        Ok(())
    }

    /// Client releases funds to the freelancer after work is completed.
    pub fn release(env: Env, escrow_id: u64) -> Result<(), Error> {
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        if escrow.status != EscrowStatus::Accepted {
            return Err(Error::InvalidStatus);
        }

        escrow.client.require_auth();

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(&env.current_contract_address(), &escrow.freelancer, &escrow.amount);

        escrow.status = EscrowStatus::Released;
        env.storage().persistent().set(&DataKey::Escrow(escrow_id), &escrow);

        events::released(&env, escrow_id, escrow.client.clone());

        Ok(())
    }

    /// Freelancer refunds the client, returning funds to the client.
    pub fn refund(env: Env, escrow_id: u64) -> Result<(), Error> {
        let mut escrow: Escrow = env
            .storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;

        if escrow.status != EscrowStatus::Funded && escrow.status != EscrowStatus::Accepted {
            return Err(Error::InvalidStatus);
        }

        escrow.freelancer.require_auth();

        let token_client = token::Client::new(&env, &escrow.token);
        token_client.transfer(&env.current_contract_address(), &escrow.client, &escrow.amount);

        escrow.status = EscrowStatus::Refunded;
        env.storage().persistent().set(&DataKey::Escrow(escrow_id), &escrow);

        events::refunded(&env, escrow_id, escrow.freelancer.clone());

        Ok(())
    }
    
    /// Queries the status and details of an escrow
    pub fn get_escrow(env: Env, escrow_id: u64) -> Result<Escrow, Error> {
        env.storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)
    }
}
