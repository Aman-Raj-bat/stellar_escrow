#!/bin/bash
set -e

echo "Starting TrustPay Smart Contract Deployment..."

# Ensure we are in the contracts directory
cd "$(dirname "$0")/.." || exit

# 1 & 2. Build and Optimize the contracts
# In Stellar CLI v27+, 'stellar contract optimize' is deprecated.
# 'stellar contract build' handles both compiling (to wasm32v1-none) and optimizing.
echo "Building and optimizing contracts..."
stellar contract build

# Configuration variables
NETWORK="testnet"
SOURCE_ACCOUNT="default" # Assumes 'default' identity is configured in stellar-cli

# 3. Upload the Escrow contract (Previously 'install')
# 'stellar contract install' is deprecated in favor of 'stellar contract upload'.
echo "Uploading Escrow contract..."
WASM_HASH=$(stellar contract upload \
  --wasm target/wasm32v1-none/release/trustpay_escrow.wasm \
  --network $NETWORK \
  --source-account $SOURCE_ACCOUNT)

echo "Escrow Wasm Hash: $WASM_HASH"

# 4. Deploy the Factory contract
echo "Deploying Factory contract..."
FACTORY_ID=$(stellar contract deploy \
  --wasm target/wasm32v1-none/release/trustpay_factory.wasm \
  --network $NETWORK \
  --source-account $SOURCE_ACCOUNT)

echo "Factory Contract ID: $FACTORY_ID"

# 5. Initialize the Factory contract
echo "Initializing Factory contract..."
stellar contract invoke \
  --id "$FACTORY_ID" \
  --network $NETWORK \
  --source-account $SOURCE_ACCOUNT \
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
