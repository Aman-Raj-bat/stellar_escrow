import React from 'react';
import { FilePlus, ArrowDownToLine, Handshake, Send, RotateCcw, AlertCircle } from 'lucide-react';
import type { ActivityEventType } from '../../services/activity';

interface EventIconProps {
  type: ActivityEventType;
}

export const EventIcon: React.FC<EventIconProps> = ({ type }) => {
  switch (type) {
    case 'CREATED': return <FilePlus className="w-5 h-5 text-blue-500" />;
    case 'FUNDED': return <ArrowDownToLine className="w-5 h-5 text-indigo-500" />;
    case 'ACCEPTED': return <Handshake className="w-5 h-5 text-emerald-500" />;
    case 'RELEASED': return <Send className="w-5 h-5 text-purple-500" />;
    case 'REFUNDED': return <RotateCcw className="w-5 h-5 text-amber-500" />;
    default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
  }
};
