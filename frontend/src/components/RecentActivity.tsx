import React from 'react';
import { Link } from 'react-router-dom';
import { useActivity } from '../hooks/useActivity';
import type { ActivityEventType } from '../services/activity';
import { Loader2, ExternalLink, ArrowRight, FilePlus, ArrowDownToLine, Handshake, Send, RotateCcw, AlertCircle } from 'lucide-react';
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

export const RecentActivity: React.FC = () => {
  const { activities, isLoading, error } = useActivity(); // Fetch all without ID filter

  if (error) {
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 text-center text-red-500">
        Failed to load recent activity. {error}
      </div>
    );
  }

  // Show only top 5 recent events on dashboard
  const recentEvents = activities.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recent Global Activity</h2>
          <p className="text-sm text-slate-500 mt-1">Live updates from the smart contract</p>
        </div>
      </div>

      <div className="p-0">
        {isLoading && activities.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No activity found yet. Be the first to create an escrow!
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentEvents.map((activity) => (
              <li key={activity.id} className="p-4 sm:px-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                      <EventIcon type={activity.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                        </p>
                        <Link 
                          to={`/escrow/${activity.escrowId}`}
                          className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded hover:bg-indigo-100 transition-colors"
                        >
                          Escrow #{activity.escrowId}
                        </Link>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-xs font-medium text-slate-500">Tx Hash</p>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-slate-700 hover:text-indigo-600 flex items-center gap-1 justify-end"
                      >
                        {activity.txHash.slice(0, 6)}...{activity.txHash.slice(-6)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Link 
                      to={`/escrow/${activity.escrowId}`}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                      title="View Escrow"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
