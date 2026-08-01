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
      
      const stroopsAmount = xlmToStroops(amount);

      const tx = await factoryContract.create_escrow({
        client: address,
        freelancer,
        amount: stroopsAmount,
        token,
      }, { publicKey: address });

      const escrowAddress = tx.result.unwrap();

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
    <div className="max-w-2xl mx-auto py-12 px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="bg-[#111216]/60 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/5 relative z-10">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Create Escrow</h1>
        <p className="text-slate-400 font-light mb-10 leading-relaxed">Securely lock funds for a freelancer. Funds will only be released when you approve the work.</p>

        {error && <AlertMessage type="error" message={error} className="mb-8" />}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Freelancer Stellar Address</label>
            <input
              type="text"
              required
              value={freelancer}
              onChange={(e) => setFreelancer(e.target.value)}
              placeholder="G..."
              className="w-full px-5 py-4 rounded-xl bg-black/40 border border-slate-800 focus:ring-1 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 outline-none transition-all font-mono text-sm text-white placeholder-slate-700 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Token Address</label>
            <input
              type="text"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="C..."
              className="w-full px-5 py-4 rounded-xl bg-black/20 border border-slate-800 focus:ring-1 focus:ring-[#9945FF]/50 focus:border-[#9945FF]/50 outline-none transition-all font-mono text-sm text-slate-400 shadow-inner cursor-not-allowed"
            />
            <p className="text-xs text-slate-600 mt-3 font-light">Currently defaults to Testnet Native XLM contract address.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Amount</label>
            <div className="relative group">
              <input
                type="number"
                required
                min="0.1"
                step="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100.00"
                className="w-full pl-5 pr-20 py-4 rounded-xl bg-black/40 border border-slate-800 focus:ring-1 focus:ring-[#08B5E5]/50 focus:border-[#08B5E5]/50 outline-none transition-all font-mono text-xl text-white placeholder-slate-700 shadow-inner"
              />
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <span className="text-slate-500 font-bold uppercase tracking-widest text-sm group-focus-within:text-[#08B5E5] transition-colors">XLM</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(153,69,255,0.2)] hover:shadow-[0_0_30px_rgba(153,69,255,0.4)] flex justify-center items-center gap-3 mt-4"
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
