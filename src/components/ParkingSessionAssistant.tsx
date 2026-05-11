import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  MapPin, 
  Navigation2, 
  AlertCircle, 
  TrendingUp, 
  Activity, 
  X, 
  ChevronRight, 
  RotateCcw,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Plus
} from 'lucide-react';
import { Card, Badge, Button, useToastStore } from './ui';
import { useData } from '../context/DataContext';

export const ParkingSessionAssistant: React.FC = () => {
  const { activeSession, extendSession, endSession, listings, toggleFindingCar } = useData();
  const { addToast } = useToastStore();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExtending, setIsExtending] = useState(false);

  const listing = useMemo(() => {
    return listings.find(l => l.id === activeSession?.listingId);
  }, [listings, activeSession]);

  useEffect(() => {
    if (!activeSession) return;

    const timer = setInterval(() => {
      const remaining = new Date(activeSession.endTime).getTime() - Date.now();
      setTimeLeft(Math.max(0, remaining));
      
      // Smart Warning Simulation
      if (Math.round(remaining / 60000) === 15) {
         addToast("Parking session ending in 15 mins. Congestion detected near KLCC corridor.", "warning");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession, addToast]);

  if (!activeSession) return null;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  const progress = (1 - (timeLeft / (new Date(activeSession.endTime).getTime() - new Date(activeSession.startTime).getTime()))) * 100;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50">
      <AnimatePresence>
        <motion.div
           initial={{ opacity: 0, y: 50, scale: 0.95 }}
           animate={{ opacity: 1, y: 0, scale: 1 }}
           exit={{ opacity: 0, y: 50, scale: 0.95 }}
        >
          <Card className="bg-slate-900 border-none rounded-[3rem] shadow-2xl p-8 text-white relative overflow-hidden flex flex-col gap-6">
             {/* Background Effects */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity size={100} className="text-blue-500" />
             </div>

             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                      <Clock size={24} className="animate-pulse" />
                   </div>
                   <div>
                      <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none mb-1">Active Session</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">ID: {activeSession.id.slice(-8).toUpperCase()}</p>
                   </div>
                </div>
                <Badge variant="blue" className="bg-emerald-500/20 text-emerald-400 border-none font-mono">AI MONITORED</Badge>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                   <div className="text-center md:text-left">
                      <div className="flex items-baseline gap-2 justify-center md:justify-start">
                         <span className="text-5xl font-black font-mono tracking-tighter">
                            {hours > 0 && `${hours}h `}{minutes}m <span className="text-blue-400 opacity-50">{seconds}s</span>
                         </span>
                         <span className="text-xs font-black text-slate-500 uppercase">Remaining</span>
                      </div>
                      <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <motion.div 
                           className={`h-full bg-gradient-to-r ${progress > 85 ? 'from-red-500 to-rose-400' : 'from-blue-500 to-emerald-400'}`}
                           style={{ width: `${100 - progress}%` }} 
                         />
                      </div>
                   </div>

                   <div className="flex items-center gap-4 py-4 border-b border-white/10">
                      <div className="flex -space-x-2">
                         <ShieldCheck size={16} className="text-emerald-500" />
                         <Zap size={16} className="text-amber-500" />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Vehicle Secured & Insured</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <Button 
                        onClick={() => extendSession(30)}
                        className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                      >
                         <Plus size={18} />
                         EXTEND 30M
                      </Button>
                      <Button 
                        onClick={endSession}
                        variant="outline" 
                        className="border-white/10 text-white hover:bg-white/10 bg-white/5 rounded-2xl h-14 font-black"
                      >
                         END SESSION
                      </Button>
                   </div>
                </div>

                <div className="bg-black/40 rounded-[2.5rem] p-6 border border-white/5 space-y-6">
                   <div className="flex items-center gap-2 mb-2">
                      <BrainCircuit size={14} className="text-blue-400" />
                      <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono">Mobility Insights</h4>
                   </div>

                   <div className="space-y-4">
                      {activeSession.assistantInsights.map((insight, idx) => (
                         <div key={idx} className="flex gap-3">
                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic">
                               "{insight}"
                            </p>
                         </div>
                      ))}
                   </div>

                   <div className="mt-6 pt-6 border-t border-white/5">
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-between text-white transition-all p-4 h-auto rounded-2xl border ${activeSession.isFindingCar ? 'bg-blue-600 border-blue-400' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        onClick={() => toggleFindingCar(!activeSession.isFindingCar)}
                      >
                         <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeSession.isFindingCar ? 'bg-white/20' : 'bg-blue-500/20 text-blue-400'}`}>
                               <Navigation2 size={16} className={activeSession.isFindingCar ? 'animate-bounce' : ''} />
                            </div>
                            <div className="text-left">
                               <p className={`text-[9px] font-black uppercase leading-none mb-1 ${activeSession.isFindingCar ? 'text-white/60' : 'text-slate-500'}`}>
                                  {activeSession.isFindingCar ? 'Navigation Active' : 'Locate My Vehicle'}
                               </p>
                               <p className="text-xs font-black text-white italic">{listing?.title || 'Active Node'}</p>
                            </div>
                         </div>
                         <ChevronRight size={16} className={activeSession.isFindingCar ? 'rotate-90' : 'text-slate-500'} />
                      </Button>
                   </div>
                </div>
             </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
