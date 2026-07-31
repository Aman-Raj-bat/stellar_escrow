#!/bin/bash
set -e

echo "Starting TrustPay Smart Contract Deployment..."

# Ensure we are in the contracts directory
cd "$(dirname "$0")/.." || exit

# 1. Build the contracts
echo "Building contracts..."
cargo build --target wasm32-unknown-unknown --release

# 2. Optimize the contracts (Requires stellar-cli)
echo "Optimizing Escrow Wasm..."
stellar contract optimize \
  --wasm target/wasm32-unknown-unknown/release/trustpay_escrow.wasm \
  --out-dir target/wasm32-unknown-unknown/release/

echo "Optimizing Factory Wasm..."
stellar contract optimize \
  --wasm target/wasm32-unknown-unknown/release/trustpay_factory.wasm \
  --out-dir target/wasm32-unknown-unknown/release/

# Configuration variables
NETWORK="testnet"
SOURCE_ACCOUNT="default" # Assumes 'default' identity is configured in stellar-cli

# 3. Install the Escrow contract (We just need its hash for the factory)
echo "Installing Escrow contract..."
WASM_HASH=$(stellar contract install \
  --wasm target/wasm32-unknown-unknown/release/trustpay_escrow.optimized.wasm \
  --network $NETWORK \
  --source $SOURCE_ACCOUNT)

echo "Escrow Wasm Hash: $WASM_HASH"

# 4. Deploy the Factory contract
echo "Deploying Factory contract..."
FACTORY_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/trustpay_factory.optimized.wasm \
  --network $NETWORK \
  --source $SOURCE_ACCOUNT)

echo "Factory Contract ID: $FACTORY_ID"

# 5. Initialize the Factory contract
echo "Initializing Factory contract..."
stellar contract invoke \
  --id "$FACTORY_ID" \
  --network $NETWORK \
  --source $SOURCE_ACCOUNT \
  -- \
  init \
  --wasm_hash "$WASM_HASH"

echo "Initialization complete!"
echo "====================================================="
echo "✅ Deployment Successful!"
echo ""
echo "Please update your frontend environment variables:"
echo "VITE_CONTRACT_ID=\"$FACTORY_ID\""
echo "====================================================="
