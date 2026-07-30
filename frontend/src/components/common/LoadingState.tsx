import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className = ''
}) => {
  return (
    <div className={`flex flex-col justify-center items-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
      {message && <p className="text-slate-500 font-medium">{message}</p>}
    </div>
  );
};
