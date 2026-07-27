use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotAuthorized = 1,
    EscrowNotFound = 2,
    InvalidStatus = 3,
    AmountTooLow = 4,
    TransferFailed = 5,
}
