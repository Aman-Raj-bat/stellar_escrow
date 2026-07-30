# TrustPay - Stellar Soroban Escrow

TrustPay is a decentralized, non-custodial escrow platform built on the **Stellar Soroban** smart contract network. It allows clients to securely lock funds for freelancers, ensuring that payment is only released upon successful completion of work, or safely refunded in case of a dispute.

## 🚀 Features

- **Decentralized Escrow**: Powered entirely by a robust Rust-based Soroban Smart Contract.
- **Strict State Enforcement**: Funds can only move through approved lifecycle stages (`Created` ➔ `Funded` ➔ `Accepted` ➔ `Released` or `Refunded`).
- **Production-Ready Smart Contract**: Built-in TTL (Time-To-Live) management ensures long-running escrows are not archived by the network, keeping funds accessible.
- **Freighter Wallet Integration**: Deep integration with the Stellar Freighter extension, including strict network validation (Testnet).
- **Real-Time Activity Feed**: Tracks global and individual escrow events in real time by polling the Stellar RPC, optimized with browser visibility APIs to save bandwidth.
- **Modern UI**: Fully responsive, accessible, and typed frontend built with React, TypeScript, and Tailwind CSS.

---

## 🛠 Tech Stack

- **Smart Contracts**: Rust, Soroban SDK
- **Frontend**: React (Vite), TypeScript, Tailwind CSS
- **Blockchain Interface**: `@stellar/freighter-api`, `stellar-sdk`

---

## 📦 Project Structure

```
├── contracts/
│   ├── contracts/escrow/src/    # Core Soroban Rust smart contract
│   └── Cargo.toml               # Rust dependencies
└── frontend/
    ├── src/
    │   ├── components/          # Reusable UI components
    │   ├── contracts/           # Generated Soroban JS bindings
    │   ├── hooks/               # Custom React hooks (Wallet, Activity, Escrow)
    │   ├── pages/               # Application views
    │   └── services/            # Stellar RPC and Event services
    ├── eslint.config.js         # Strict linting rules
    └── package.json             # Node dependencies
```

---

## 💻 Running Locally

### Prerequisites
1. **Node.js** (v18+)
2. **Rust** (`cargo`, `rustup`) with the `wasm32v1-none` target installed.
3. **Freighter Wallet Extension** installed in your browser and switched to the **Stellar Testnet**.

### Starting the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Building the Smart Contract

If you want to manually build or deploy the Soroban contract:

1. Navigate to the contracts directory:
   ```bash
   cd contracts
   ```
2. Build the optimized WebAssembly binary:
   ```bash
   soroban contract build
   ```
   *(Ensure you have the soroban-cli installed)*

---

## 🔒 Security & Architecture

- **Auth Constraints**: Every state-mutating function on the contract uses `require_auth()` to guarantee that only the designated client or freelancer can authorize the transaction.
- **Error Handling**: The frontend implements top-level Error Boundaries, graceful fallback UI components, and safe RPC catch blocks.
- **Network Safety**: The application explicitly validates that the user's Freighter wallet is on the `TESTNET` before allowing connections.

---

## 📝 License

This project is licensed under the MIT License.
