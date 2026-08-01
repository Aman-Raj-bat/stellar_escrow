import React, { useEffect } from 'react';
import { useActivity } from '../hooks/useActivity';
import { ExternalLink, Copy, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EventIcon } from './common/EventIcon';
import { LoadingState } from './common/LoadingState';
import { EmptyState } from './common/EmptyState';
import { AlertMessage } from './common/AlertMessage';
import { useClipboard } from '../hooks/useClipboard';
import { formatAddress } from '../utils/formatters';

export const ActivityTimeline: React.FC<{ escrowId: string, refreshTrigger?: number }> = ({ escrowId, refreshTrigger = 0 }) => {
  const { activities, isLoading, error, refetch } = useActivity(escrowId);
  const { hasCopied, copyToClipboard } = useClipboard();

  useEffect(() => {
    if (refreshTrigger > 0) {
      refetch(true); // silent refetch
    }
  }, [refreshTrigger, refetch]);

  if (error) {
    return (
      <div className="mt-8">
        <AlertMessage type="error" message={`Failed to load activity timeline. ${error}`} />
      </div>
    );
  }

  return (
    <div className="bg-[#111216]/60 backdrop-blur-md rounded-[32px] shadow-[0_8px_40px_rgba(0,0,0,0.5)] border border-white/5 mt-8 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-[#08B5E5]/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="p-8 sm:p-10 border-b border-white/5 bg-gradient-to-r from-transparent to-white/[0.02] relative z-10">
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-3 tracking-tight">
          <History className="w-6 h-6 text-[#08B5E5]" />
          Activity Timeline
        </h2>
        <p className="text-sm text-slate-400 mt-2 font-light">Immutable record of smart contract events</p>
      </div>

      <div className="p-8 sm:p-10 relative z-10">
        {isLoading && activities.length === 0 ? (
          <LoadingState message="Loading timeline events..." className="py-12" />
        ) : activities.length === 0 ? (
          <EmptyState 
            title="No Activity Found"
            description="There are no events for this escrow yet."
          />
        ) : (
          <div className="relative border-l border-white/10 ml-4 space-y-10 pb-4">
            {activities.map((activity, index) => (
              <div key={`${activity.id}-${index}`} className="relative pl-8 group">
                <span className="absolute -left-4 bg-slate-900 p-1.5 rounded-full border border-slate-800 shadow-inner group-hover:border-purple-500/50 transition-colors">
                  <EventIcon type={activity.type} />
                </span>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <h3 className="text-base font-bold text-white tracking-wide">Escrow {activity.type}</h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-full uppercase tracking-widest">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <div className="bg-black/40 border border-slate-800 rounded-xl p-4 space-y-3 shadow-inner group-hover:bg-white/[0.02] transition-colors">
                  {activity.actor && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold uppercase tracking-widest">Actor:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-300">{formatAddress(activity.actor!, 8)}</span>
                        <button onClick={() => copyToClipboard(activity.actor!)} className="text-slate-500 hover:text-[#08B5E5] transition-colors" title="Copy Address">
                          {hasCopied ? <span className="text-emerald-400 text-[10px] font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <span className="text-slate-500 font-semibold uppercase tracking-widest">Tx Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300">{formatAddress(activity.txHash, 8)}</span>
                      <button onClick={() => copyToClipboard(activity.txHash)} className="text-slate-500 hover:text-[#08B5E5] transition-colors" title="Copy Hash">
                        {hasCopied ? <span className="text-emerald-400 text-[10px] font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <a href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#08B5E5] ml-1 transition-colors" title="View on Explorer">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                    <span className="text-slate-500 font-semibold uppercase tracking-widest">Ledger:</span>
                    <span className="text-slate-300 font-mono">{activity.ledger}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
