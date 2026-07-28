import { Client, networks } from '../contracts/escrow';
import { signTransaction, isAllowed, setAllowed, getAddress } from '@stellar/freighter-api';

export const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org';

export const escrowContract = new Client({
  networkPassphrase: networks.testnet.networkPassphrase,
  contractId: networks.testnet.contractId,
  rpcUrl,
  signTransaction,
});

/**
 * Ensures the Freighter wallet is connected and returns the public key.
 */
export async function ensureWalletConnection() {
  if (!(await isAllowed())) {
    await setAllowed();
  }
  
  const { address, error } = await getAddress();
  if (error || !address) {
    throw new Error('Freighter is locked or not connected.');
  }
  return address;
}
