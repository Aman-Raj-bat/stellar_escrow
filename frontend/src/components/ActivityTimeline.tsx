import React from 'react';
import { useActivity } from '../hooks/useActivity';
import type { ActivityEventType } from '../services/activity';
import { Loader2, ExternalLink, Copy, FilePlus, ArrowDownToLine, Handshake, Send, RotateCcw, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EventIcon: React.FC<{ type: ActivityEventType }> = ({ type }) => {
  switch (type) {
    case 'CREATED': return <FilePlus className="w-5 h-5 text-blue-500" />;
    case 'FUNDED': return <ArrowDownToLine className="w-5 h-5 text-indigo-500" />;
    case 'ACCEPTED': return <Handshake className="w-5 h-5 text-emerald-500" />;
    case 'RELEASED': return <Send className="w-5 h-5 text-purple-500" />;
    case 'REFUNDED': return <RotateCcw className="w-5 h-5 text-amber-500" />;
    default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
};

export const ActivityTimeline: React.FC<{ escrowId: string }> = ({ escrowId }) => {
  const { activities, isLoading, error } = useActivity(escrowId);

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 text-center text-red-500">
        Failed to load activity timeline. {error}
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
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No activity found for this escrow yet.
          </div>
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
                        <span className="font-mono text-slate-700">{activity.actor.slice(0, 8)}...{activity.actor.slice(-8)}</span>
                        <button onClick={() => copyToClipboard(activity.actor!)} className="text-slate-400 hover:text-indigo-600" title="Copy Address">
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Tx Hash:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-700">{activity.txHash.slice(0, 8)}...{activity.txHash.slice(-8)}</span>
                      <button onClick={() => copyToClipboard(activity.txHash)} className="text-slate-400 hover:text-indigo-600" title="Copy Hash">
                        <Copy className="w-3 h-3" />
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
