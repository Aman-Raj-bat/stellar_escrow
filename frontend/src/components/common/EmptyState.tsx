import React from 'react';
import { FileQuestion } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon,
  className = ''
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center py-16 px-4 text-center bg-[#111216]/50 backdrop-blur-md rounded-2xl border border-slate-800 shadow-[0_8px_30px_rgba(0,0,0,0.4)] ${className}`}
    >
      <div className="relative w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner border border-white/5 bg-gradient-to-b from-white/5 to-transparent text-slate-300">
        <div className="absolute inset-0 bg-[#08B5E5]/10 rounded-full blur-md"></div>
        <div className="relative z-10">
          {icon || <FileQuestion className="w-8 h-8" />}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-light">{description}</p>
    </motion.div>
  );
};
