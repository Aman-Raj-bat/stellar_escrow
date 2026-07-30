import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { formatAddress } from '../utils/formatters';

export const MainLayout: React.FC = () => {
  const { address, connect, disconnect } = useWallet();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-indigo-600">
            <ShieldCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">TrustPay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/escrow/create" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Create Escrow
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {address ? (
              <div className="flex items-center gap-3">
                <div className="bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-700">
                    {formatAddress(address)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} TrustPay. Built on Stellar Soroban.
        </div>
      </footer>
    </div>
  );
};
