#!/bin/bash
set -e

echo "Deploying TrustPay Smart Contracts to Testnet..."

if [ ! -d "contracts" ]; then
  echo "Error: Run this script from the project root directory."
  exit 1
fi

cd contracts

# Use stellar or soroban cli
CLI="stellar"
if ! command -v stellar &> /dev/null; then
    CLI="soroban"
fi

echo "Building contracts..."
cargo build --target wasm32v1-none --release

echo "Optimizing Escrow Contract..."
$CLI contract optimize --wasm target/wasm32v1-none/release/trustpay_escrow.wasm
echo "Optimizing Factory Contract..."
$CLI contract optimize --wasm target/wasm32v1-none/release/trustpay_factory.wasm

echo "Installing Escrow Contract WASM..."
ESCROW_WASM_HASH=$($CLI contract install \
  --wasm target/wasm32v1-none/release/trustpay_escrow.optimized.wasm \
  --source default \
  --network testnet)
echo "Escrow WASM installed with hash: $ESCROW_WASM_HASH"

echo "Deploying Factory Contract..."
FACTORY_ID=$($CLI contract deploy \
  --wasm target/wasm32v1-none/release/trustpay_factory.optimized.wasm \
  --source default \
  --network testnet)
echo "Factory deployed at: $FACTORY_ID"

echo "Initializing Factory with Escrow WASM hash..."
$CLI contract invoke \
  --id $FACTORY_ID \
  --source default \
  --network testnet \
  -- \
  init \
  --wasm_hash $ESCROW_WASM_HASH

echo ""
echo "Deployments successful!"
echo "Update your .env file with the following:"
echo "VITE_FACTORY_CONTRACT_ID=$FACTORY_ID"
