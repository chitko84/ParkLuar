import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock,
  Navigation2
} from 'lucide-react';
import { Badge } from './ui';

interface ConfidenceScoreProps {
  score?: number; // 0-100
  stability?: 'ELITE' | 'STABLE' | 'VOLATILE';
  isMonitoring?: boolean;
}

export const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ 
  score = 98, 
  stability = 'ELITE',
  isMonitoring = true 
}) => {
  const getColor = () => {
    if (score >= 95) return 'text-emerald-500';
    if (score >= 80) return 'text-blue-500';
    return 'text-amber-500';
  };

  const getBg = () => {
    if (score >= 95) return 'bg-emerald-500/10';
    if (score >= 80) return 'bg-blue-500/10';
    return 'bg-amber-500/10';
  };

  return (
    <div className={`p-4 rounded-[2rem] ${getBg()} border border-white/10 relative overflow-hidden backdrop-blur-md`}>
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Activity size={64} />
      </div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className={getColor()} />
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${getColor()}`}>AI Reservation Shield</span>
        </div>
        <Badge variant="success" className="text-[8px] font-mono bg-emerald-500/20 text-emerald-400 border-none">
          {stability}
        </Badge>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-baseline gap-1">
             <span className="text-3xl font-black text-slate-800 tracking-tighter">{score}%</span>
             <span className="text-[10px] font-black text-slate-400 uppercase">Confidence</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 mt-1 max-w-[140px]">
            Smart-monitored arrival window with zero congestion risk.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
           <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-4 h-4 rounded-full border border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                       <CheckCircle size={8} className="text-emerald-500" />
                    </div>
                 ))}
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Verified</span>
           </div>
           
           {isMonitoring && (
             <motion.div 
               animate={{ opacity: [1, 0.5, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="flex items-center gap-1 bg-white/40 px-2 py-0.5 rounded-full border border-white/20"
             >
                <div className="w-1 h-1 bg-blue-500 rounded-full" />
                <span className="text-[8px] font-black text-blue-600 uppercase">Live Sync</span>
             </motion.div>
           )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-3 gap-2 relative z-10">
         <div className="text-center">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter block mb-1">Impact</span>
            <div className="flex items-center justify-center gap-1 text-emerald-600">
               <TrendingUp size={10} />
               <span className="text-xs font-black">LOW</span>
            </div>
         </div>
         <div className="text-center">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter block mb-1">ETA Stability</span>
            <div className="flex items-center justify-center gap-1 text-blue-600">
               <Clock size={10} />
               <span className="text-xs font-black">99%</span>
            </div>
         </div>
         <div className="text-center">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter block mb-1">Reroutes</span>
            <div className="flex items-center justify-center gap-1 text-slate-600">
               <Navigation2 size={10} />
               <span className="text-xs font-black">0</span>
            </div>
         </div>
      </div>
    </div>
  );
};
