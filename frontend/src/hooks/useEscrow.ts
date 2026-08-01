import { useState, useCallback, useEffect } from 'react';
import { getEscrowContract, ensureWalletConnection } from '../services/stellar';

export type EscrowStatusTag = 'Created' | 'Funded' | 'Accepted' | 'Released' | 'Refunded';

export interface EscrowData {
  id: bigint;
  client: string;
  freelancer: string;
  amount: bigint;
  token: string;
  status: Partial<Record<EscrowStatusTag, void>>; // Soroban enum representation
}

export function useEscrow(escrowId?: string) {
  const [escrow, setEscrow] = useState<EscrowData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const fetchEscrow = useCallback(async () => {
    if (!escrowId) return;
    try {
      setIsLoading(true);
      setError(null);
      const contract = getEscrowContract(escrowId);
      const { result } = await contract.get_escrow();
      
      if (result) {
        setEscrow(result as unknown as EscrowData);
      } else {
        setError('Escrow not found.');
        setEscrow(null);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch escrow:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Failed to fetch escrow details.');
      setEscrow(null);
    } finally {
      setIsLoading(false);
    }
  }, [escrowId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEscrow();
  }, [fetchEscrow]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeAction = async (actionName: string, actionFn: (contract: any, address: string) => Promise<any>) => {
    if (!escrowId) {
      setError('No escrow ID provided.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const address = await ensureWalletConnection();
      const contract = getEscrowContract(escrowId);
      
      const tx = await actionFn(contract, address);
      const result = await tx.signAndSend();
      
      // Update transaction hash if available from Freighter response
      // Usually signAndSend returns an object with txHash or similar depending on bindings
      const res = result as { hash?: string };
      if (res && res.hash) {
        setTxHash(res.hash);
      } else if (typeof result === 'string') {
        setTxHash(result);
      }

      await fetchEscrow(); // Refresh data
      return true;
    } catch (err: unknown) {
      console.error(`Failed to ${actionName}:`, err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || `Failed to ${actionName} escrow.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = () => executeAction('deposit', (contract, address) => contract.deposit({ publicKey: address }));
  const accept = () => executeAction('accept', (contract, address) => contract.accept({ publicKey: address }));
  const release = () => executeAction('release', (contract, address) => contract.release({ publicKey: address }));
  const refund = () => executeAction('refund', (contract, address) => contract.refund({ publicKey: address }));

  const currentStatus = escrow?.status ? Object.keys(escrow.status)[0] as EscrowStatusTag : null;

  return {
    escrow,
    isLoading,
    error,
    txHash,
    currentStatus,
    fetchEscrow,
    deposit,
    accept,
    release,
    refund,
  };
}
