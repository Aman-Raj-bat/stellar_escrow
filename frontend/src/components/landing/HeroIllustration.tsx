import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

// Custom Star SVG to match the reference's geometric four-pointed star
const GeometricStar = ({ className }: { className: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C12 0 12 10 24 12C24 12 14 12 12 24C12 24 12 14 0 12C0 12 10 12 12 0Z" />
  </svg>
);

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center pointer-events-none perspective-[1200px]">
      
      {/* Subtle Background Sparks/Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <GeometricStar className="absolute top-[10%] right-[20%] w-6 h-6 text-purple-400/40" />
        <GeometricStar className="absolute bottom-[20%] left-[10%] w-8 h-8 text-indigo-400/20" />
        <GeometricStar className="absolute top-[40%] left-[5%] w-4 h-4 text-[#08B5E5]/40" />
        <GeometricStar className="absolute bottom-[40%] right-[5%] w-5 h-5 text-[#9945FF]/40" />
        {/* Abstract plus crosses like the reference */}
        <div className="absolute top-[25%] left-[45%] text-slate-500/30 text-xl font-light leading-none">+</div>
        <div className="absolute bottom-[25%] right-[40%] text-slate-500/30 text-2xl font-light leading-none">+</div>
      </div>

      {/* The Glassmorphism Escrow Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: 20, rotateX: 10, rotateZ: -10, y: 30 }}
        animate={{ opacity: 1, rotateY: 15, rotateX: 15, rotateZ: -8, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10 w-[420px] max-w-[90vw] rounded-[24px] bg-[#1a1b23]/80 backdrop-blur-xl border border-white/10 shadow-[20px_30px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-8 overflow-hidden"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Inner Card Subtle Glows */}
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-[#9945FF]/10 rounded-full blur-[60px] pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#08B5E5]/10 rounded-full blur-[60px] pointer-events-none"></div>

        {/* Top Section */}
        <div className="flex justify-between items-start mb-12">
          {/* Smart Contract Chip Icon */}
          <div className="w-12 h-10 rounded-lg bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-inner">
             <div className="w-6 h-[18px] flex flex-col justify-between">
                <div className="w-full h-[2px] bg-slate-300 rounded-full opacity-80"></div>
                <div className="w-full h-[2px] bg-slate-300 rounded-full opacity-80"></div>
                <div className="w-full h-[2px] bg-slate-300 rounded-full opacity-80"></div>
                <div className="w-full h-[2px] bg-slate-300 rounded-full opacity-80"></div>
             </div>
          </div>
          <div className="text-xl font-bold italic tracking-wider text-white">TrustPay</div>
        </div>

        {/* Middle Section - Amount */}
        <div className="mb-10 font-mono">
           <div className="text-[32px] sm:text-[36px] text-white tracking-widest flex items-center drop-shadow-md">
             250.00 XLM
           </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-8 text-sm mb-6">
          <div>
            <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-widest font-semibold">Client</div>
            <div className="text-slate-200 font-medium font-mono text-sm tracking-wide">GD2X...8M9L</div>
          </div>
          <div>
            <div className="text-slate-400 mb-1 text-[10px] uppercase tracking-widest font-semibold">Freelancer</div>
            <div className="text-slate-200 font-medium font-mono text-sm tracking-wide">GCA3...P4V1</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-between items-end mt-8 border-t border-white/5 pt-6">
           <div>
             <div className="text-slate-400 mb-1.5 text-[10px] uppercase tracking-widest font-semibold">Status</div>
             <div className="flex items-center gap-1.5 text-emerald-400 font-medium text-sm">
                <Lock className="w-3.5 h-3.5" />
                Locked & Secured
             </div>
           </div>
           <div className="flex items-center gap-1.5 bg-[#08B5E5]/10 border border-[#08B5E5]/20 px-3 py-1.5 rounded-full">
             <ShieldCheck className="w-3.5 h-3.5 text-[#08B5E5]" />
             <span className="text-xs font-bold text-[#08B5E5] tracking-wide uppercase">Soroban</span>
           </div>
        </div>
      </motion.div>

    </div>
  );
};
