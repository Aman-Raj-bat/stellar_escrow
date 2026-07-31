#![no_std]

mod storage_types;
mod test;

use storage_types::DataKey;
use trustpay_shared::errors::Error;
use trustpay_shared::events;
use trustpay_shared::types::{Escrow, EscrowStatus};
use soroban_sdk::{contract, contractimpl, token, Address, Env};

const TTL_THRESHOLD: u32 = 120_960; // ~7 days
const TTL_EXTEND: u32 = 518_400; // ~30 days

#[contract]
pub struct TrustPayEscrow;

#[contractimpl]
impl TrustPayEscrow {
    /// Initializes a new escrow agreement.
    pub fn init_escrow(
        env: Env,
        id: u64,
        client: Address,
        freelancer: Address,
        amount: i128,
        token: Address,
    ) -> Result<(), Error> {
        if env.storage().persistent().has(&DataKey::Escrow(id)) {
            return Err(Error::InvalidStatus); // Reuse error
        }

        let escrow = Escrow {
            id,
            client: client.clone(),
            freelancer: freelancer.clone(),
            amount,
            token,
            status: EscrowStatus::Created,
        };

        env.storage().persistent().set(&DataKey::Escrow(id), &escrow);
        env.storage().persistent().extend_ttl(&DataKey::Escrow(id), TTL_THRESHOLD, TTL_EXTEND);

        events::created(&env, id, client, freelancer, amount);

        Ok(())
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
        env.storage().persistent().extend_ttl(&DataKey::Escrow(escrow_id), TTL_THRESHOLD, TTL_EXTEND);

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
        env.storage().persistent().extend_ttl(&DataKey::Escrow(escrow_id), TTL_THRESHOLD, TTL_EXTEND);

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
        env.storage().persistent().extend_ttl(&DataKey::Escrow(escrow_id), TTL_THRESHOLD, TTL_EXTEND);

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
        env.storage().persistent().extend_ttl(&DataKey::Escrow(escrow_id), TTL_THRESHOLD, TTL_EXTEND);

        events::refunded(&env, escrow_id, escrow.freelancer.clone());

        Ok(())
    }
    
    /// Queries the status and details of an escrow
    pub fn get_escrow(env: Env, escrow_id: u64) -> Result<Escrow, Error> {
        let escrow: Escrow = env.storage()
            .persistent()
            .get(&DataKey::Escrow(escrow_id))
            .ok_or(Error::EscrowNotFound)?;
        
        env.storage().persistent().extend_ttl(&DataKey::Escrow(escrow_id), TTL_THRESHOLD, TTL_EXTEND);

        Ok(escrow)
    }
}
