import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { ShieldCheck, Plus, Search, Clock, CheckCircle, Lock, SearchX } from 'lucide-react';
import { getEscrowContract } from '../services/stellar';
import { RecentActivity } from '../components/RecentActivity';
import { AlertMessage } from '../components/common/AlertMessage';
import { EmptyState } from '../components/common/EmptyState';
import { formatAddress, stroopsToXlm } from '../utils/formatters';
import type { EscrowData } from '../hooks/useEscrow';
import { motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const { address } = useWallet();
  const [searchId, setSearchId] = useState('');
  const [queriedEscrow, setQueriedEscrow] = useState<EscrowData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setQueriedEscrow(null);
    if (!searchId) return;

    try {
      const contract = getEscrowContract(searchId);
      const result = await contract.get_escrow();
      const { result: escrowData } = await result.simulate();
      if (escrowData) {
        setQueriedEscrow(escrowData as unknown as EscrowData);
      } else {
        setSearchError('Escrow not found.');
      }
    } catch (err: unknown) {
      console.error(err);
      setSearchError('Escrow not found or network error.');
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111216]/50 backdrop-blur-md p-10 rounded-[32px] border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner border border-white/10">
            <Lock className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Wallet Disconnected</h2>
          <p className="text-slate-400 font-light leading-relaxed">Please connect your Freighter wallet to manage your escrows and view the dashboard.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-400 font-light">Manage your active escrows and transactions.</p>
        </div>
        <Link
          to="/escrow/create"
          className="flex items-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(153,69,255,0.3)] hover:shadow-[0_0_30px_rgba(153,69,255,0.5)] hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          New Escrow
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -4 }} className="bg-[#111216]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-5 transition-all">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Completed</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-[#111216]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-5 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-xl flex items-center justify-center border border-amber-500/20 shadow-inner relative z-10">
            <Clock className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Active</p>
            <p className="text-3xl font-bold text-white">0</p>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="bg-[#111216]/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex items-center gap-5 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div className="w-14 h-14 bg-[#9945FF]/10 text-[#9945FF] rounded-xl flex items-center justify-center border border-[#9945FF]/20 shadow-inner relative z-10">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="relative z-10">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Secured Volume</p>
            <p className="text-3xl font-bold text-white flex items-baseline gap-2">
              0 <span className="text-sm font-medium text-slate-400 uppercase">XLM</span>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-transparent to-white/[0.02]">
          <h2 className="text-xl font-bold text-white">Find Escrow by ID</h2>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80 group">
              <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Escrow Address (C...)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-slate-800 focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 outline-none text-sm text-white placeholder-slate-600 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="p-8 text-center text-slate-500">
          {queriedEscrow ? (
            <div className="text-left bg-black/40 p-8 rounded-2xl border border-white/5 inline-block w-full max-w-xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#08B5E5]/5 rounded-full blur-[80px] pointer-events-none"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-bold text-white text-2xl tracking-tight">Escrow #{queriedEscrow.id?.toString()}</h3>
                <span className="bg-[#08B5E5]/10 border border-[#08B5E5]/20 text-[#08B5E5] px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase">
                  {Object.keys(queriedEscrow.status || {})[0]}
                </span>
              </div>
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Client</span> 
                  <span className="font-mono text-slate-300 bg-white/5 px-2 py-1 rounded">{formatAddress(queriedEscrow.client, 8)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Freelancer</span> 
                  <span className="font-mono text-slate-300 bg-white/5 px-2 py-1 rounded">{formatAddress(queriedEscrow.freelancer, 8)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Amount</span> 
                  <span className="font-bold text-white text-xl">{stroopsToXlm(queriedEscrow.amount)} XLM</span>
                </div>
              </div>
              <Link 
                to={`/escrow/${searchId}`}
                className="relative z-10 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(153,69,255,0.2)]"
              >
                Manage Escrow &rarr;
              </Link>
            </div>
          ) : (
            <>
              {searchError && <AlertMessage type="error" message={searchError} className="mb-6 text-left" />}
              <EmptyState 
                title="No Escrow Selected" 
                description="Search for an escrow by ID above or create a new one to get started." 
                icon={<SearchX className="w-8 h-8" />} 
              />
            </>
          )}
        </div>
      </div>
      
      <RecentActivity />
    </div>
  );
};
