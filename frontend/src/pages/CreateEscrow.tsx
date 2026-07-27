import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../store/WalletContext';
import { escrowContract, signAndSubmitTransaction } from '../services/stellar';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const CreateEscrow: React.FC = () => {
  const { address } = useWallet();
  const navigate = useNavigate();
  
  const [freelancer, setFreelancer] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('CDLZFC3SYJYDZT7K67VZ75HPJVIEWBE6PJUXYN3TYM67HY4Z32D4Z4R6'); // Native XLM dummy testnet token address (just as placeholder)
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
      await signAndSubmitTransaction(async () => {});
      
      // Convert amount to stroops (1 XLM = 10,000,000 stroops)
      const stroopsAmount = BigInt(parseFloat(amount) * 10000000);

      // Call the create_escrow function
      const result = await escrowContract.create_escrow({
        client: address,
        freelancer,
        amount: stroopsAmount,
        token,
      });

      // The result would have the escrow ID (or we can simulate it)
      // Wait for it to be mined
      await result.signAndSend({ signTransaction: true }); // Depending on bindings API

      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create escrow. Please check inputs and wallet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Escrow</h1>
        <p className="text-slate-600 mb-8">Securely lock funds for a freelancer. Funds will only be released when you approve the work.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

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
