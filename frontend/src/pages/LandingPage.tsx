import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Trustless Escrow on the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Stellar Network</span>
        </h1>
        <p className="text-xl text-slate-600">
          Secure your freelance contracts and payments with Soroban smart contracts. No middlemen. Instant settlements. Total peace of mind.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link 
            to="/escrow/create" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5"
          >
            Start an Escrow
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-3 rounded-xl font-semibold transition-all"
          >
            View Dashboard
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 w-full">
        {[
          {
            icon: ShieldCheck,
            title: "100% Trustless",
            desc: "Funds are locked in a decentralized smart contract, ensuring neither party can cheat."
          },
          {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Built on Stellar, settlements take seconds and cost fractions of a cent."
          },
          {
            icon: Lock,
            title: "Non-Custodial",
            desc: "We never hold your keys. You interact directly with the blockchain via Freighter."
          }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <feat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
