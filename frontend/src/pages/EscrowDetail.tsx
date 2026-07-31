import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useEscrow } from '../hooks/useEscrow';
import { ShieldAlert, Loader2, CheckCircle, ExternalLink, ArrowLeft, Wallet, User, Hash, Coins } from 'lucide-react';

import { ActivityTimeline } from '../components/ActivityTimeline';
import { AlertMessage } from '../components/common/AlertMessage';
import { LoadingState } from '../components/common/LoadingState';
import { formatAddress, stroopsToXlm } from '../utils/formatters';

export const EscrowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { address } = useWallet();
  const { escrow, isLoading, error, txHash, currentStatus, deposit, accept, release, refund } = useEscrow(id);

  if (!id) {
    return <div className="text-center py-12">Invalid Escrow ID</div>;
  }

  const isClient = escrow?.client === address;
  const isFreelancer = escrow?.freelancer === address;

  // Amount conversion (Stroops to XLM)
  const displayAmount = escrow ? stroopsToXlm(escrow.amount) : '0.00';

  const explorerUrl = txHash ? `https://stellar.expert/explorer/testnet/tx/${txHash}` : null;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              Escrow #{id}
              {currentStatus && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
                  {currentStatus}
                </span>
              )}
            </h1>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Secured by Soroban Smart Contract
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500 mb-1">Contract ID</p>
            <p className="font-mono text-sm bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              {import.meta.env.VITE_CONTRACT_ID ? `${import.meta.env.VITE_CONTRACT_ID.slice(0, 8)}...${import.meta.env.VITE_CONTRACT_ID.slice(-8)}` : 'CAAAAAAA...2KB'}
            </p>
          </div>
        </div>

        {/* Notifications */}
        {error && <AlertMessage type="error" message={error} className="m-6" />}

        {txHash && (
          <div className="m-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm font-medium">
              <p>Transaction Successful!</p>
              <a href={explorerUrl!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline mt-1 text-emerald-800 hover:text-emerald-900">
                View on Stellar Expert <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {isLoading && !escrow && (
          <LoadingState message="Loading escrow details..." className="p-12" />
        )}

        {/* Escrow Details */}
        {escrow && (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Roles</h3>
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${isClient ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                      <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Client {isClient && <span className="text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded text-[10px]">YOU</span>}
                      </p>
                      <p className="font-mono text-sm break-all">{formatAddress(escrow.client, 8)}</p>
                    </div>
                    <div className={`p-4 rounded-xl border ${isFreelancer ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}>
                      <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                        <User className="w-3.5 h-3.5" /> Freelancer {isFreelancer && <span className="text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded text-[10px]">YOU</span>}
                      </p>
                      <p className="font-mono text-sm break-all">{formatAddress(escrow.freelancer, 8)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Financials</h3>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                        <Coins className="w-3.5 h-3.5" /> Amount Locked
                      </p>
                      <p className="text-2xl font-bold text-slate-900">{displayAmount} XLM</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5" /> Asset Address
                      </p>
                      <p className="font-mono text-sm break-all text-slate-600">{escrow.token}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Actions</h3>
                  
                  {!address && (
                    <div className="text-sm text-slate-500 flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                      <Wallet className="w-4 h-4" /> Please connect wallet to interact.
                    </div>
                  )}

                  {address && (
                    <div className="flex flex-col gap-3">
                      {isClient && currentStatus === 'Created' && (
                        <button
                          onClick={deposit}
                          disabled={isLoading}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Deposit Funds'}
                        </button>
                      )}

                      {isFreelancer && currentStatus === 'Funded' && (
                        <button
                          onClick={accept}
                          disabled={isLoading}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Accept Escrow'}
                        </button>
                      )}

                      {isClient && currentStatus === 'Accepted' && (
                        <button
                          onClick={release}
                          disabled={isLoading}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Release Funds to Freelancer'}
                        </button>
                      )}

                      {isFreelancer && (currentStatus === 'Funded' || currentStatus === 'Accepted') && (
                        <button
                          onClick={refund}
                          disabled={isLoading}
                          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm flex justify-center items-center gap-2 mt-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Refund Client (Cancel)'}
                        </button>
                      )}

                      {(!isClient && !isFreelancer) && (
                        <p className="text-sm text-slate-500 p-3 bg-slate-50 rounded-lg">
                          You are not a participant in this escrow.
                        </p>
                      )}
                      
                      {((isClient && currentStatus !== 'Created' && currentStatus !== 'Accepted') || 
                        (isFreelancer && currentStatus !== 'Funded' && currentStatus !== 'Accepted')) && (
                        <p className="text-sm text-slate-500 text-center italic">
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
      </div>
      
      <ActivityTimeline escrowId={id} />
    </div>
  );
};
