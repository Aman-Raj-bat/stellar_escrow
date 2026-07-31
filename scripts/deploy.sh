#!/bin/bash
set -e

echo "Deploying TrustPay Smart Contracts to Testnet..."

if [ ! -d "contracts" ]; then
  echo "Error: Run this script from the project root directory."
  exit 1
fi

cd contracts

echo "Building contracts..."
cargo build --target wasm32v1-none --release

echo "Optimizing Escrow Contract..."
soroban contract optimize --wasm target/wasm32v1-none/release/trustpay_escrow.wasm
echo "Optimizing Factory Contract..."
soroban contract optimize --wasm target/wasm32v1-none/release/trustpay_factory.wasm

echo "Deploying Escrow Contract..."
ESCROW_ID=$(soroban contract deploy \
  --wasm target/wasm32v1-none/release/trustpay_escrow.optimized.wasm \
  --source default \
  --network testnet)
echo "Escrow deployed at: $ESCROW_ID"

echo "Deploying Factory Contract..."
FACTORY_ID=$(soroban contract deploy \
  --wasm target/wasm32v1-none/release/trustpay_factory.optimized.wasm \
  --source default \
  --network testnet)
echo "Factory deployed at: $FACTORY_ID"

echo "Initializing Factory with Escrow address..."
soroban contract invoke \
  --id $FACTORY_ID \
  --source default \
  --network testnet \
  -- \
  init \
  --escrow_contract $ESCROW_ID

echo ""
echo "Deployments successful!"
echo "Update your .env file with the following:"
echo "VITE_CONTRACT_ID=$ESCROW_ID"
echo "VITE_FACTORY_CONTRACT_ID=$FACTORY_ID"
