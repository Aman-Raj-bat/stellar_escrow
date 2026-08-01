import React from 'react';
import { ShieldAlert, CheckCircle, Info } from 'lucide-react';

export type AlertType = 'error' | 'success' | 'info';

interface AlertMessageProps {
  type: AlertType;
  message: string;
  className?: string;
}

export const AlertMessage: React.FC<AlertMessageProps> = ({ 
  type, 
  message, 
  className = ''
}) => {
  if (!message) return null;

  const styles = {
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    info: 'bg-[#08B5E5]/10 border-[#08B5E5]/20 text-[#08B5E5]'
  };

  const icons = {
    error: <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
  };

  return (
    <div className={`p-4 border rounded-xl flex items-start gap-3 ${styles[type]} ${className}`}>
      {icons[type]}
      <p className="text-sm font-medium leading-relaxed">{message}</p>
    </div>
  );
};
