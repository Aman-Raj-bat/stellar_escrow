import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Pickaxe, CheckCircle, Banknote } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Lock className="w-8 h-8 text-[#9945FF]" />,
      title: "1. Create & Lock",
      description: "The client creates a new escrow contract, specifying the freelancer's Stellar address and locking the agreed XLM amount securely on-chain.",
      color: "from-[#9945FF]/20 to-transparent"
    },
    {
      icon: <Pickaxe className="w-8 h-8 text-[#08B5E5]" />,
      title: "2. Accept & Build",
      description: "The freelancer reviews the contract terms directly on the dashboard. Upon agreement, they accept the escrow and begin the work.",
      color: "from-[#08B5E5]/20 to-transparent"
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-400" />,
      title: "3. Deliver & Review",
      description: "Work is delivered off-chain. The client reviews the final product to ensure it meets the initial project requirements.",
      color: "from-emerald-500/20 to-transparent"
    },
    {
      icon: <Banknote className="w-8 h-8 text-amber-400" />,
      title: "4. Release Funds",
      description: "Once satisfied, the client approves the release of funds. The smart contract instantly transfers the XLM directly to the freelancer's wallet.",
      color: "from-amber-500/20 to-transparent"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-purple-900/10 rounded-full blur-[150px] pointer-events-none"></div>
      
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#08B5E5]">TrustPay</span> Works
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Decentralized, trustless, and secure. Experience the future of freelance payments powered by Stellar Soroban smart contracts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-[#111216]/60 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:bg-white/[0.02] transition-colors relative overflow-hidden group"
          >
            <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${step.color} opacity-50 pointer-events-none`}></div>
            
            <div className="w-16 h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 mb-6 shadow-inner relative z-10 group-hover:scale-110 transition-transform">
              {step.icon}
            </div>
            
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide relative z-10">{step.title}</h3>
            <p className="text-sm text-slate-300 leading-relaxed relative z-10">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
