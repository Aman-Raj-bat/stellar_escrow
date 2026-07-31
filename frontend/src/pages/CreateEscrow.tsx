import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { factoryContract, ensureWalletConnection } from '../services/stellar';
import { Loader2 } from 'lucide-react';
import { DEFAULT_TOKEN_ADDRESS } from '../utils/constants';
import { xlmToStroops } from '../utils/formatters';
import { AlertMessage } from '../components/common/AlertMessage';

export const CreateEscrow: React.FC = () => {
  const { address } = useWallet();
  const navigate = useNavigate();
  
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState(DEFAULT_TOKEN_ADDRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setError('Please connect your wallet first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (!freelancer.startsWith('G') || freelancer.length !== 56) {
        throw new Error('Invalid Stellar address format.');
      }
      
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error('Amount must be greater than 0.');
      }

      await ensureWalletConnection();
      
      // Convert amount to stroops (1 XLM = 10,000,000 stroops)
      const stroopsAmount = xlmToStroops(amount);

      // Call the create_escrow function on Factory
      const tx = await factoryContract.create_escrow({
        client: address,
        freelancer,
        amount: stroopsAmount,
        token,
      });

      // Get the returned address from the simulation result
      const escrowAddress = tx.result.unwrap();

      // Wait for it to be mined
      await tx.signAndSend();

      navigate(`/escrow/${escrowAddress}`);
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Failed to create escrow. Please check inputs and wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Escrow</h1>
        <p className="text-slate-600 mb-8">Securely lock funds for a freelancer. Funds will only be released when you approve the work.</p>

        {error && <AlertMessage type="error" message={error} className="mb-6" />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Freelancer Stellar Address</label>
            <input
              type="text"
              required
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
              placeholder="G..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Token Address</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="C..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-sm text-slate-500 bg-slate-50"
            />
            <p className="text-xs text-slate-500 mt-2">Currently defaults to Testnet Native XLM contract address.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Amount</label>
            <div className="relative">
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full pl-4 pr-16 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono text-lg"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-slate-500 font-semibold">XLM</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              'Lock Funds & Create Escrow'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
