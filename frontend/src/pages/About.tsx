import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, ShieldCheck, Zap } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto text-center mb-20 relative z-10">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-6">
          Reimagining Trust in a Decentralized World.
        </h1>
        <p className="text-xl text-slate-400 font-light leading-relaxed">
          TrustPay was built with a simple mission: to eliminate the friction, high fees, and lack of transparency in traditional freelance payments. We leverage the power of the Stellar network and Soroban smart contracts to create a trustless ecosystem where work is fairly compensated.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative z-10 mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#111216]/60 backdrop-blur-md rounded-[32px] p-8 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-center group hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-20 h-20 mx-auto bg-black/40 rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-inner group-hover:scale-110 transition-transform group-hover:border-purple-500/50">
            <ShieldCheck className="w-10 h-10 text-[#9945FF]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Trustless Security</h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed">Funds are locked securely on-chain. Code is law, removing the need for a central authority to hold your money.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#111216]/60 backdrop-blur-md rounded-[32px] p-8 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-center group hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-20 h-20 mx-auto bg-black/40 rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-inner group-hover:scale-110 transition-transform group-hover:border-[#08B5E5]/50">
            <Zap className="w-10 h-10 text-[#08B5E5]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Instant Settlement</h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed">Built on Stellar, transactions settle in seconds with near-zero fees, ensuring freelancers get paid immediately upon approval.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#111216]/60 backdrop-blur-md rounded-[32px] p-8 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-center group hover:bg-white/[0.02] transition-colors"
        >
          <div className="w-20 h-20 mx-auto bg-black/40 rounded-full flex items-center justify-center border border-white/10 mb-6 shadow-inner group-hover:scale-110 transition-transform group-hover:border-emerald-500/50">
            <Globe2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-wide">Global Accessibility</h3>
          <p className="text-sm text-slate-400 font-light leading-relaxed">No borders, no currency conversion headaches. Anyone with a Stellar wallet can transact seamlessly anywhere in the world.</p>
        </motion.div>
      </div>

      <div className="bg-gradient-to-r from-[#9945FF]/10 to-[#08B5E5]/10 rounded-[32px] border border-white/10 p-12 text-center relative z-10 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Join the Web3 Freelance Revolution</h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto mb-8">
          Stop paying 20% platform fees. Start using TrustPay to manage your freelance contracts safely on the blockchain.
        </p>
        <a href="/escrow/create" className="inline-block bg-white text-black hover:bg-slate-200 px-8 py-4 rounded-xl font-bold transition-colors shadow-lg">
          Create an Escrow Now
        </a>
      </div>
    </div>
  );
};
