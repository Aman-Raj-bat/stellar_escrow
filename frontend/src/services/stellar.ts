import { Client as EscrowClient } from '../contracts/escrow';
import { Client as FactoryClient } from '../contracts/factory';
import { StellarWalletsKit } from '@creit.tech/stellar-wallets-kit';
import { Networks } from '@creit.tech/stellar-wallets-kit/types';
import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';

export const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org';

StellarWalletsKit.init({
  selectedWalletId: 'freighter',
  network: Networks.TESTNET,
  modules: [
    new FreighterModule(),
    new xBullModule(),
    new AlbedoModule(),
  ],
});

export function getEscrowContract(contractId: string) {
  return new EscrowClient({
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId,
    rpcUrl,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signTransaction: async (tx: any, opts?: any) => {
      const xdr = typeof tx === 'string' ? tx : tx.toXDR();
      const result = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: 'Test SDF Network ; September 2015',
        ...opts
      });
      return result;
    },
  });
}

export const factoryContract = new FactoryClient({
  networkPassphrase: 'Test SDF Network ; September 2015',
  contractId: import.meta.env.VITE_CONTRACT_ID || 'CBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KB',
  rpcUrl,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signTransaction: async (tx: any, opts?: any) => {
    const xdr = typeof tx === 'string' ? tx : tx.toXDR();
    const result = await StellarWalletsKit.signTransaction(xdr, {
      networkPassphrase: 'Test SDF Network ; September 2015',
      ...opts
    });
    return result;
  },
});

/**
 * Ensures the Freighter wallet is connected and returns the public key.
 */
export async function ensureWalletConnection() {
  try {
    const { address } = await StellarWalletsKit.getAddress();
    if (!address) {
      throw new Error('Wallet is not connected.');
    }
    return address;
  } catch (error) {
    throw new Error('Wallet is not connected or request was rejected.', { cause: error });
  }
}
