import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { formatAddress } from '../utils/formatters';

export const MainLayout: React.FC = () => {
  const { address, connect, disconnect } = useWallet();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0b0c10] text-white selection:bg-purple-500/30">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#08B5E5]/5 blur-[120px]"></div>
      </div>

      <header className="sticky top-0 z-50 bg-[#0b0c10]/60 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white">
            <ShieldCheck className="w-8 h-8" />
            <span className="font-bold text-xl tracking-tight">TrustPay</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 z-10">
            <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors">
              Dashboard
            </Link>
            <Link to="/escrow/create" className="text-slate-300 hover:text-white font-medium transition-colors">
              Create Escrow
            </Link>
            <Link to="/how-it-works" className="text-slate-300 hover:text-white font-medium transition-colors">
              How it Works
            </Link>
            <Link to="/docs" className="text-slate-300 hover:text-white font-medium transition-colors">
              Docs
            </Link>
            <Link to="/about" className="text-slate-300 hover:text-white font-medium transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-4 z-10">
            {address ? (
              <div className="flex items-center gap-3">
                <div className="bg-white/5 border-white/10 text-white px-3 py-1.5 rounded-full border flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#08B5E5] shadow-[0_0_8px_#08B5E5]"></div>
                  <span className="text-sm font-medium tracking-wide">
                    {formatAddress(address)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="p-2 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-lg border border-transparent hover:border-white/10"
                  title="Disconnect"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md px-5 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-lg"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className={`flex-1 w-full relative z-10 ${isLandingPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'}`}>
        <Outlet />
      </main>

      <footer className="border-t border-white/5 py-8 relative z-10 bg-[#0b0c10]/80">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} TrustPay. Built on Stellar Soroban.
        </div>
      </footer>
    </div>
  );
};
