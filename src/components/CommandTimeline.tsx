import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useIntelligenceFeed, IntelligenceEvent, IntelligencePriority } from '../hooks/useIntelligenceFeed';
import { Badge } from './ui';
import { Activity, Clock } from 'lucide-react';

interface IntelligenceFeedProps {
  variant?: 'minimal' | 'full';
  className?: string;
  maxEvents?: number;
}

const PRIORITY_STYLES: Record<IntelligencePriority, { color: string, bg: string, label: string }> = {
  INFO: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'INFO' },
  OPTIMIZATION: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'OPTIMIZATION' },
  SURGE_EVENT: { color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'SURGE' },
  HIGH_DEMAND: { color: 'text-rose-400', bg: 'bg-rose-400/10', label: 'HIGH DEMAND' },
  SECURITY_VERIFIED: { color: 'text-indigo-400', bg: 'bg-indigo-400/10', label: 'VERIFIED' },
  INCIDENT: { color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'INCIDENT' },
  EMERGENCY: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'EMERGENCY' },
  PERSONALIZED: { color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10', label: 'PERSONALIZED' }
};

export const CommandTimeline: React.FC<IntelligenceFeedProps> = ({ variant = 'full', className = '', maxEvents = 6 }) => {
  const events = useIntelligenceFeed(maxEvents);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {variant === 'full' && (
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-blue-400 animate-pulse" />
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] font-mono">Live Activity Intelligence</h4>
          </div>
          <Badge className="bg-blue-900/50 text-blue-300 border-blue-800 text-[8px] font-black">STABLE_CONNECTION</Badge>
        </div>
      )}

      <div className="space-y-3 relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/5 z-0" />
        
        <AnimatePresence initial={false}>
          {events.map((event, idx) => {
            const style = PRIORITY_STYLES[event.priority];
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 12 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative z-10"
              >
                <div className="flex items-start gap-4">
                  {/* Pulse Dot */}
                  <div className="relative mt-1">
                    <div className={`w-8 h-8 rounded-xl ${style.bg} flex items-center justify-center border border-white/5`}>
                      <event.icon size={14} className={style.color} />
                    </div>
                    {idx === 0 && (
                       <div className={`absolute -inset-1 rounded-2xl ${style.bg} animate-ping opacity-50`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${style.color}`}>
                          {event.label}
                        </span>
                        {event.nodeId && (
                           <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">
                             NODE_{event.nodeId}
                           </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-white/20">
                        <Clock size={8} />
                        <span className="text-[9px] font-mono">{event.timestamp.split(' ')[0]}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs font-medium text-white/70 leading-relaxed truncate">
                      {event.description}
                    </p>
                    
                    {variant === 'full' && (
                      <div className="mt-2 flex items-center gap-3">
                         <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm ${style.bg} ${style.color}`}>
                           {style.label}
                         </span>
                         <div className="h-[1px] flex-1 bg-white/5" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
