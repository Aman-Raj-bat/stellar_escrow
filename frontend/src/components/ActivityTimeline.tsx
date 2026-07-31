import React, { useEffect } from 'react';
import { useActivity } from '../hooks/useActivity';
import { ExternalLink, Copy } from 'lucide-react';
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Activity Timeline</h2>
        <p className="text-sm text-slate-500 mt-1">Immutable record of contract events</p>
      </div>

      <div className="p-6">
        {isLoading && activities.length === 0 ? (
          <LoadingState message="Loading timeline events..." />
        ) : activities.length === 0 ? (
          <EmptyState 
            title="No Activity Found"
            description="There are no events for this escrow yet."
          />
        ) : (
          <div className="relative border-l border-slate-200 ml-4 space-y-8 pb-4">
            {activities.map((activity, index) => (
              <div key={`${activity.id}-${index}`} className="relative pl-8">
                <span className="absolute -left-3.5 bg-white p-1 rounded-full border border-slate-200">
                  <EventIcon type={activity.type} />
                </span>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <h3 className="text-sm font-bold text-slate-900">Escrow {activity.type}</h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </span>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-2">
                  {activity.actor && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Actor:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-700">{formatAddress(activity.actor!, 8)}</span>
                        <button onClick={() => copyToClipboard(activity.actor!)} className="text-slate-400 hover:text-indigo-600" title="Copy Address">
                          {hasCopied ? <span className="text-emerald-500 text-[10px] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Tx Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700">{formatAddress(activity.txHash, 8)}</span>
                      <button onClick={() => copyToClipboard(activity.txHash)} className="text-slate-400 hover:text-indigo-600" title="Copy Hash">
                        {hasCopied ? <span className="text-emerald-500 text-[10px] font-bold">Copied!</span> : <Copy className="w-3 h-3" />}
                      </button>
                      <a href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 ml-1" title="View on Explorer">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Ledger:</span>
                    <span className="text-slate-700 font-medium">{activity.ledger}</span>
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
