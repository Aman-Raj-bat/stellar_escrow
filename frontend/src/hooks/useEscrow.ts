import { useState, useCallback, useEffect } from 'react';
import { escrowContract, ensureWalletConnection } from '../services/stellar';

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
      const idBigInt = BigInt(escrowId);
      const { result } = await escrowContract.get_escrow({ escrow_id: idBigInt });
      
      if (result) {
        setEscrow(result as any);
      } else {
        setError('Escrow not found.');
        setEscrow(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch escrow:', err);
      setError(err.message || 'Failed to fetch escrow details.');
      setEscrow(null);
    } finally {
      setIsLoading(false);
    }
  }, [escrowId]);

  useEffect(() => {
    fetchEscrow();
  }, [fetchEscrow]);

  const executeAction = async (actionName: string, actionFn: (id: bigint) => Promise<any>) => {
    if (!escrowId) {
      setError('No escrow ID provided.');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    setTxHash(null);

    try {
      await ensureWalletConnection();
      const idBigInt = BigInt(escrowId);
      
      const tx = await actionFn(idBigInt);
      const result = await tx.signAndSend();
      
      // Update transaction hash if available from Freighter response
      // Usually signAndSend returns an object with txHash or similar depending on bindings
      if (result && (result as any).hash) {
        setTxHash((result as any).hash);
      } else if (typeof result === 'string') {
        setTxHash(result);
      }

      await fetchEscrow(); // Refresh data
      return true;
    } catch (err: any) {
      console.error(`Failed to ${actionName}:`, err);
      setError(err.message || `Failed to ${actionName} escrow.`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deposit = () => executeAction('deposit', (escrow_id) => escrowContract.deposit({ escrow_id }));
  const accept = () => executeAction('accept', (escrow_id) => escrowContract.accept({ escrow_id }));
  const release = () => executeAction('release', (escrow_id) => escrowContract.release({ escrow_id }));
  const refund = () => executeAction('refund', (escrow_id) => escrowContract.refund({ escrow_id }));

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
