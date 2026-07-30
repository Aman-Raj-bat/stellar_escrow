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
    error: 'bg-red-50 border-red-100 text-red-600',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    info: 'bg-indigo-50 border-indigo-100 text-indigo-700'
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
