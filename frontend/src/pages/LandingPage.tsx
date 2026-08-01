import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroIllustration } from '../components/landing/HeroIllustration';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0b0c10] overflow-x-hidden w-full font-sans selection:bg-purple-500/30 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Faint grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        {/* Soft Lighting */}
        <div className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full bg-purple-900/10 blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#08B5E5]/5 blur-[120px]"></div>
      </div>
      
      {/* Main Hero Container */}
      <div className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <div className="flex-1 w-full max-w-[650px] z-10 lg:pr-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight leading-[1.1] mb-6"
          >
            Empowering <br />
            Freelance With <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9945FF] to-[#08B5E5]">
              TrustPay
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-slate-400 mb-12 max-w-[500px] leading-relaxed font-light"
          >
            The freelance industry is undergoing a significant transformation driven by advancements in smart contracts, known as trustless escrow.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-16"
          >
            <Link 
              to="/escrow/create" 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#08B5E5] hover:opacity-90 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(153,69,255,0.2)]"
            >
              Explore Now
              <ArrowUpRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/dashboard" 
              className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/5 text-slate-300 border border-slate-700 hover:border-slate-500 px-8 py-4 rounded-xl font-medium transition-all"
            >
              Request Demo
            </Link>
          </motion.div>

          {/* Statistics Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-wrap items-start gap-12 sm:gap-16 pt-8 border-t border-slate-800"
          >
            <div>
              <div className="text-3xl font-bold mb-2">135k+</div>
              <div className="text-slate-400 text-sm font-light">Users use TrustPay</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">20k</div>
              <div className="text-slate-400 text-sm font-light">Active Escrows</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-slate-400 text-sm font-light">Secure</div>
            </div>
          </motion.div>
        </div>

        {/* Right Content - Card Illustration */}
        <div className="flex-1 w-full lg:w-[50%] flex justify-center lg:justify-end z-10 mt-12 lg:mt-0">
          <HeroIllustration />
        </div>
      </div>

      {/* Bottom Feature Strip */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 pb-12 pt-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="w-full bg-[#111216]/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-6 text-sm text-slate-300 shadow-xl"
        >
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            <Star className="w-4 h-4 text-slate-600" fill="currentColor" />
            <span className="tracking-wide">Secure Transactions</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            <Star className="w-4 h-4 text-slate-600" fill="currentColor" />
            <span className="tracking-wide">Instant Settlement</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            <Star className="w-4 h-4 text-slate-600" fill="currentColor" />
            <span className="tracking-wide">Soroban Smart Contracts</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            <Star className="w-4 h-4 text-slate-600" fill="currentColor" />
            <span className="tracking-wide">Cross Border Payments</span>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-center">
            <Star className="w-4 h-4 text-slate-600" fill="currentColor" />
            <span className="tracking-wide">Trustless Future</span>
          </div>
          <Star className="hidden lg:block w-4 h-4 text-slate-600" fill="currentColor" />
        </motion.div>
      </div>
      
    </div>
  );
};
