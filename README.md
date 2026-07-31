# TrustPay

TrustPay is a secure, decentralized escrow application built on the Stellar network using Soroban smart contracts. It provides a trustless environment for clients and freelancers to securely lock funds, monitor milestones, and release payments upon successful completion of agreed-upon work.

## Features

- **Multi-wallet support (StellarWalletsKit)**: Seamlessly connect with multiple Stellar wallets including Freighter, xBull, and Albedo.
- **Smart contract powered escrow**: Fully decentralized escrow logic handling fund locking, release, and refunds.
- **Escrow lifecycle**: Clear state transitions (Created → Funded → Accepted → Released/Refunded).
- **Transaction tracking**: Real-time status visibility for all contract interactions.
- **Activity feed**: Event synchronization from the blockchain providing a transparent history of actions.
- **Wallet/network validation**: Automatic detection and enforcement of the Stellar Testnet.
- **Production-ready UI**: A beautiful, modern interface built with React, Tailwind CSS, and Framer Motion.
- **Responsive design**: Fully optimized for desktop, tablet, and mobile experiences.

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- Lucide React

### Backend / Smart Contract
- Rust
- Soroban SDK

### Blockchain
- Stellar Network (Testnet)
- Soroban RPC

### Wallets
- StellarWalletsKit (v2)
- Freighter
- xBull
- Albedo

### Tooling
- ESLint
- PostCSS

### Deployment
- *Pending Deployment environment*

## Architecture

TrustPay operates with a clean separation of concerns:

- **React Frontend**: A modern single-page application handling UI rendering, user input, and state visualization.
- **Wallet Layer**: Powered by `@creit.tech/stellar-wallets-kit`, managing secure connections and transaction signing without exposing private keys to the application.
- **Soroban Smart Contract**: A Rust-based contract deployed on Stellar that serves as the ultimate source of truth, enforcing business logic, verifying signatures, and managing the actual escrowed funds.
- **Event Synchronization**: The application continuously polls Soroban RPC for emitted contract events, providing a real-time, decentralized activity feed.
- **State Management**: A React Context-based approach handles the wallet connection state globally, while localized hooks (`useEscrow`, `useActivity`) manage specific feature states.

## Folder Structure

```
StellarEscrow/
├── contracts/                  # Soroban Smart Contracts
│   ├── contracts/
│   │   └── escrow/
│   │       ├── src/            # Rust contract source code
│   │       └── Cargo.toml      # Contract dependencies
│   ├── Makefile
│   └── Cargo.toml
├── frontend/                   # React Web Application
│   ├── src/
│   │   ├── assets/             # Images and static files
│   │   ├── components/         # Reusable UI components
│   │   ├── contracts/          # Generated TypeScript bindings for Soroban
│   │   ├── hooks/              # Custom React hooks (e.g., useEscrow, useWallet)
│   │   ├── layouts/            # Page layouts
│   │   ├── pages/              # Main application views
│   │   ├── services/           # External API and stellar-wallets-kit integration
│   │   ├── store/              # Global state (WalletContext)
│   │   ├── utils/              # Helper functions and formatters
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── README.md
```

## Installation

### Clone
```bash
git clone <your-repo-url>
cd StellarEscrow
```

### Install
```bash
cd frontend
npm install
```

### Environment variables
Copy the example environment file and update it with your specific configuration:
```bash
cp .env.example .env
```

### Run locally
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Build
```bash
npm run build
```

### Deploy
The generated `dist/` directory can be deployed to any static hosting provider such as Vercel, Netlify, or GitHub Pages.

## Environment Variables

The application requires the following environment variables to function correctly. See `.env.example` for a template.

- `VITE_RPC_URL`: The URL for the Soroban RPC server (e.g., `https://soroban-testnet.stellar.org`).
- `VITE_CONTRACT_ID`: The deployed ID of your Soroban smart contract.
- `VITE_NETWORK_PASSPHRASE`: The passphrase for the Stellar network in use (e.g., `Test SDF Network ; September 2015`).

## Smart Contract

- **Contract deployment**: The contract is written in Rust and compiled to WebAssembly (Wasm) before being deployed to the Stellar network using the stellar CLI.
- **Contract ID placeholder**: Currently deployed and referenced in `frontend/src/contracts/escrow/src/index.ts`.
- **Testnet network**: The current deployment targets the Stellar Testnet. Ensure your wallets are configured to operate on the Testnet.

## Wallet Support

TrustPay integrates `@creit.tech/stellar-wallets-kit` to provide a robust, multi-wallet experience. The application currently supports:
- **Freighter**: The official Stellar browser extension wallet.
- **xBull**: A popular cross-platform Stellar wallet.
- **Albedo**: A web-based wallet and signer for Stellar.

The kit automatically provides a unified modal for users to select their preferred wallet, streamlining the connection process.

## Screenshots

### Landing Page
*(Placeholder for Landing Page Screenshot)*

### Wallet Selection
*(Placeholder for Wallet Selection Screenshot)*

### Dashboard
*(Placeholder for Dashboard Screenshot)*

### Create Escrow
*(Placeholder for Create Escrow Screenshot)*

### Escrow Details
*(Placeholder for Escrow Details Screenshot)*

### Activity Feed
*(Placeholder for Activity Feed Screenshot)*

### Transaction Success
*(Placeholder for Transaction Success Screenshot)*

## Demo

- **Live Demo URL**: *(Placeholder for URL)*
- **Demo Video**: *(Placeholder for Video Link)*

## Transaction Verification

- **Contract Address**: `CBM7LY5JTAMIJBU3IC2U6TMW42WXXFWWVVUQ4R5OUUUX3SZV7JV5Z6TF`
- **Transaction Hash**: *(Placeholder)*
- **Stellar Expert**: [View Contract on Stellar.Expert](https://stellar.expert/explorer/testnet/contract/CBM7LY5JTAMIJBU3IC2U6TMW42WXXFWWVVUQ4R5OUUUX3SZV7JV5Z6TF)

## Future Roadmap

As TrustPay evolves into Level 3 and beyond, we plan to implement the following features:

- **Milestone escrow**: Releasing funds in stages based on project milestones.
- **Partial releases**: Allowing clients to release custom amounts of the total escrow.
- **Multi-signature approvals**: Requiring multiple parties (e.g., a mediator) to sign off on a release.
- **Notifications**: In-app and email notifications for contract state changes.
- **Dispute resolution**: A decentralized arbitration system to resolve conflicts between clients and freelancers.
- **Analytics**: Deep insights into user escrow history, total volume transacted, and success rates.
