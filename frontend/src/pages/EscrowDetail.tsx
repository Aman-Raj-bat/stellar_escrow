import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useEscrow } from '../hooks/useEscrow';
import { ShieldAlert, Loader2, CheckCircle, ExternalLink, ArrowLeft, Wallet, User, Hash, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

import { ActivityTimeline } from '../components/ActivityTimeline';
import { AlertMessage } from '../components/common/AlertMessage';
import { LoadingState } from '../components/common/LoadingState';
import { formatAddress, stroopsToXlm } from '../utils/formatters';

export const EscrowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const { escrow, isLoading, error, txHash, currentStatus, deposit, accept, release, refund } = useEscrow(id);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAction = async (actionFn: () => Promise<boolean>) => {
    const success = await actionFn();
    if (success) setRefreshTrigger(prev => prev + 1);
  };

  if (!id) {
    return <div className="text-center py-12 text-slate-400">Invalid Escrow ID</div>;
  }

  const isClient = escrow?.client === address;
  const isFreelancer = escrow?.freelancer === address;

  const displayAmount = escrow ? stroopsToXlm(escrow.amount) : '0.00';
  const explorerUrl = txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#111216]/60 backdrop-blur-xl rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <div className="p-8 sm:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-transparent to-white/[0.02] relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-4 tracking-tight mb-2">
              Escrow Details
              {currentStatus && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#08B5E5]/10 text-[#08B5E5] border border-[#08B5E5]/20 uppercase tracking-widest">
                  {currentStatus}
                </span>
              )}
            </h1>
            <p className="text-slate-400 font-light flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" /> Secured by Soroban Smart Contract
            </p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">Contract Address</p>
            <p className="font-mono text-sm bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300" title={id}>
              {id.slice(0, 8)}...{id.slice(-8)}
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="px-8 sm:px-10 pt-8 relative z-10">
          {error && <AlertMessage type="error" message={error} className="mb-6" />}

          {txHash && (
            <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-start gap-4 backdrop-blur-md">
              <CheckCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div className="text-sm font-medium">
                <p className="text-emerald-300 text-base mb-1">Transaction Successful!</p>
                <a href={explorerUrl!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 underline mt-1 text-emerald-500 hover:text-emerald-400 transition-colors">
                  View on Stellar Expert <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {isLoading && !escrow && (
            <LoadingState message="Loading escrow details..." className="py-12" />
          )}
        </div>

        {/* Escrow Details */}
        {escrow && (
          <div className="p-8 sm:p-10 pt-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Roles</h3>
                  <div className="space-y-4">
                    <div className={`p-5 rounded-2xl border transition-all ${isClient ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_20px_rgba(153,69,255,0.1)]' : 'border-slate-800 bg-black/20'}`}>
                      <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <User className="w-4 h-4 text-slate-500" /> Client 
                        {isClient && <span className="text-[#08B5E5] bg-[#08B5E5]/10 border border-[#08B5E5]/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">YOU</span>}
                      </p>
                      <p className="font-mono text-sm text-slate-200 break-all">{formatAddress(escrow.client, 8)}</p>
                    </div>
                    <div className={`p-5 rounded-2xl border transition-all ${isFreelancer ? 'border-purple-500/50 bg-purple-500/10 shadow-[0_0_20px_rgba(153,69,255,0.1)]' : 'border-slate-800 bg-black/20'}`}>
                      <p className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <User className="w-4 h-4 text-slate-500" /> Freelancer 
                        {isFreelancer && <span className="text-[#08B5E5] bg-[#08B5E5]/10 border border-[#08B5E5]/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest">YOU</span>}
                      </p>
                      <p className="font-mono text-sm text-slate-200 break-all">{formatAddress(escrow.freelancer, 8)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Financials</h3>
                  <div className="bg-gradient-to-br from-black/40 to-black/10 p-6 rounded-2xl border border-white/5 space-y-6 shadow-inner">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <Coins className="w-4 h-4 text-purple-400" /> Amount Locked
                      </p>
                      <p className="text-4xl font-bold text-white tracking-tight">{displayAmount} <span className="text-lg text-slate-400 font-medium">XLM</span></p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-2 uppercase tracking-widest">
                        <Hash className="w-4 h-4 text-[#08B5E5]" /> Asset Address
                      </p>
                      <p className="font-mono text-xs break-all text-slate-400 bg-black/40 p-2 rounded-lg border border-slate-800">{escrow.token}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Actions</h3>
                  
                  {!address && (
                    <div className="text-sm text-slate-400 flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-slate-800">
                      <Wallet className="w-5 h-5 text-slate-500" /> Please connect wallet to interact.
                    </div>
                  )}

                  {address && (
                    <div className="flex flex-col gap-3">
                      {isClient && currentStatus === 'Created' && (
                        <button
                          onClick={() => handleAction(deposit)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(153,69,255,0.2)] hover:shadow-[0_0_30px_rgba(153,69,255,0.4)] flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deposit Funds'}
                        </button>
                      )}

                      {isFreelancer && currentStatus === 'Funded' && (
                        <button
                          onClick={() => handleAction(accept)}
                          disabled={isLoading}
                          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accept Escrow'}
                        </button>
                      )}

                      {isClient && currentStatus === 'Accepted' && (
                        <button
                          onClick={() => handleAction(release)}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(153,69,255,0.2)] hover:shadow-[0_0_30px_rgba(153,69,255,0.4)] flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Release Funds to Freelancer'}
                        </button>
                      )}

                      {isFreelancer && (currentStatus === 'Funded' || currentStatus === 'Accepted') && (
                        <button
                          onClick={() => handleAction(refund)}
                          disabled={isLoading}
                          className="w-full bg-transparent border border-white/10 hover:bg-white/5 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex justify-center items-center gap-2 mt-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Refund Client (Cancel)'}
                        </button>
                      )}

                      {(!isClient && !isFreelancer) && (
                        <p className="text-sm text-slate-400 p-4 bg-black/40 rounded-xl border border-slate-800 text-center font-light">
                          You are not a participant in this escrow.
                        </p>
                      )}
                      
                      {((isClient && currentStatus !== 'Created' && currentStatus !== 'Accepted') || 
                        (isFreelancer && currentStatus !== 'Funded' && currentStatus !== 'Accepted')) && (
                        <p className="text-sm text-slate-500 text-center italic font-light mt-2">
                          No actions available for your role in the current status.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      
      <div className="mt-8">
        <ActivityTimeline escrowId={id} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};
