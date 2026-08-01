import React from 'react';
import { Link } from 'react-router-dom';
import { useActivity } from '../hooks/useActivity';
import { ExternalLink, ArrowRight, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { EventIcon } from './common/EventIcon';
import { LoadingState } from './common/LoadingState';
import { EmptyState } from './common/EmptyState';
import { AlertMessage } from './common/AlertMessage';
import { formatAddress } from '../utils/formatters';

export const RecentActivity: React.FC = () => {
  const { activities, isLoading, error } = useActivity();

  if (error) {
    return (
      <div className="mt-8">
        <AlertMessage type="error" message={`Failed to load recent activity. ${error}`} />
      </div>
    );
  }

  const recentEvents = activities.slice(0, 5);

  return (
    <div className="bg-[#111216]/60 backdrop-blur-md rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden mt-8">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-transparent to-white/[0.02]">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Recent Global Activity
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-light">Live updates from the Soroban smart contract</p>
        </div>
      </div>

      <div className="p-0">
        {isLoading && activities.length === 0 ? (
          <LoadingState message="Loading global activity..." className="py-12" />
        ) : activities.length === 0 ? (
          <EmptyState 
            title="No Activity Found"
            description="Be the first to create an escrow!"
          />
        ) : (
          <ul className="divide-y divide-white/5">
            {recentEvents.map((activity) => (
              <li key={activity.id} className="p-4 sm:px-6 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:border-purple-500/30 transition-colors shadow-inner">
                      <EventIcon type={activity.type} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-bold text-slate-200">
                          {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
                        </p>
                        <Link 
                          to={`/escrow/${activity.escrowId}`}
                          className="text-[10px] font-bold text-[#08B5E5] bg-[#08B5E5]/10 border border-[#08B5E5]/20 px-2 py-0.5 rounded-full hover:bg-[#08B5E5]/20 transition-colors tracking-widest uppercase"
                        >
                          Escrow #{activity.escrowId}
                        </Link>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-mono">
                        {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:block text-right">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Tx Hash</p>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-slate-400 hover:text-purple-400 flex items-center gap-1.5 justify-end transition-colors"
                      >
                        {formatAddress(activity.txHash, 6)}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <Link 
                      to={`/escrow/${activity.escrowId}`}
                      className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-full transition-all group-hover:translate-x-1"
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
