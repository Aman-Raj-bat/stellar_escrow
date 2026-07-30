use soroban_sdk::{symbol_short, Address, Env, Symbol};
pub const ESCROW: Symbol = symbol_short!("ESCROW");
pub const CREATED: Symbol = symbol_short!("CREATED");
pub const FUNDED: Symbol = symbol_short!("FUNDED");
pub const ACCEPTED: Symbol = symbol_short!("ACCEPTED");
pub const RELEASED: Symbol = symbol_short!("RELEASED");
pub const REFUNDED: Symbol = symbol_short!("REFUNDED");

pub fn created(env: &Env, id: u64, client: Address, freelancer: Address, amount: i128) {
    let topics = (ESCROW, CREATED, id);
    env.events().publish(topics, (client, freelancer, amount));
}

pub fn funded(env: &Env, id: u64) {
    let topics = (ESCROW, FUNDED, id);
    env.events().publish(topics, id);
}

pub fn accepted(env: &Env, id: u64, freelancer: Address) {
    let topics = (ESCROW, ACCEPTED, id);
    env.events().publish(topics, freelancer);
}

pub fn released(env: &Env, id: u64, client: Address) {
    let topics = (ESCROW, RELEASED, id);
    env.events().publish(topics, client);
}

pub fn refunded(env: &Env, id: u64, freelancer: Address) {
    let topics = (ESCROW, REFUNDED, id);
    env.events().publish(topics, freelancer);
}
