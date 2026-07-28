import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../store/WalletContext';
import { ShieldCheck, Plus, Search, Clock, CheckCircle, Lock } from 'lucide-react';
import { escrowContract } from '../services/stellar';

export const Dashboard: React.FC = () => {
  const { address } = useWallet();
  const [searchId, setSearchId] = useState('');
  const [queriedEscrow, setQueriedEscrow] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await escrowContract.get_escrow({ escrow_id: BigInt(searchId) });
      // The result might need to be resolved depending on binding output
      const { result: escrowData } = await result.simulate();
      if (escrowData) {
        setQueriedEscrow(escrowData);
      }
    } catch (err) {
      console.error(err);
      alert('Escrow not found or network error.');
    }
  };

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Wallet Disconnected</h2>
        <p className="text-slate-600 mb-6">Please connect your Freighter wallet to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600">Manage your active and completed escrows.</p>
        </div>
        <Link
          to="/escrow/create"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          New Escrow
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active</p>
            <p className="text-2xl font-bold text-slate-900">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Secured Volume</p>
            <p className="text-2xl font-bold text-slate-900">0 XLM</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">Find Escrow by ID</h2>
          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Escrow ID (e.g. 1)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="p-8 text-center text-slate-500">
          {queriedEscrow ? (
            <div className="text-left bg-slate-50 p-6 rounded-xl border border-slate-200 inline-block w-full max-w-xl">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-slate-900 text-xl">Escrow #{queriedEscrow.id?.toString()}</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                  {Object.keys(queriedEscrow.status || {})[0]}
                </span>
              </div>
              <div className="space-y-2 mb-6">
                <p className="text-sm"><span className="font-medium text-slate-500">Client:</span> <span className="font-mono">{queriedEscrow.client}</span></p>
                <p className="text-sm"><span className="font-medium text-slate-500">Freelancer:</span> <span className="font-mono">{queriedEscrow.freelancer}</span></p>
                <p className="text-sm"><span className="font-medium text-slate-500">Amount:</span> <span className="font-semibold text-slate-900">{(Number(queriedEscrow.amount) / 10000000).toFixed(2)} XLM</span></p>
              </div>
              <Link 
                to={`/escrow/${queriedEscrow.id?.toString()}`}
                className="w-full block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                Manage Escrow &rarr;
              </Link>
            </div>
          ) : (
            "No escrows found. Please search by ID or create a new one."
          )}
        </div>
      </div>
    </div>
  );
};
