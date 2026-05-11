import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Card, Badge, Button } from './ui';
import { Clock, MapPin, Zap, Navigation2, X, Activity, Brain } from 'lucide-react';

export const CarFinderPanel = () => {
  const { activeSession, walkingRoute, toggleFindingCar } = useData();

  if (!activeSession?.isFindingCar || !walkingRoute) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="absolute bottom-28 left-4 right-4 md:left-auto md:right-8 md:w-96 z-[1000]"
    >
      <Card className="bg-slate-900 border-white/10 shadow-3xl rounded-[2.5rem] overflow-hidden p-0">
        {/* Header */}
        <div className="bg-blue-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                <Navigation2 size={20} className="animate-pulse" />
             </div>
             <div>
                <h3 className="text-white font-black italic tracking-tighter text-lg leading-tight">Return Navigation</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Active Walking Stream</p>
             </div>
          </div>
          <button 
            onClick={() => toggleFindingCar(false)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
             <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Walking ETA</span>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white italic">{walkingRoute.duration}</span>
                    <span className="text-lg font-black text-white/60 italic">MIN</span>
                 </div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="flex flex-col items-end">
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Distance</span>
                 <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white italic">{walkingRoute.distance}</span>
                    <span className="text-lg font-black text-white/60 italic">M</span>
                 </div>
              </div>
           </div>

           <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin size={12} />
                 </div>
                 <p className="text-xs font-bold text-white leading-relaxed">
                    Parked at <span className="text-blue-400">{activeSession.location.buildingName}</span>
                 </p>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap size={12} />
                 </div>
                 <p className="text-xs font-bold text-white/80 leading-relaxed">
                    Positioned on <span className="text-emerald-400">Level {activeSession.location.level}</span>, Zone <span className="text-emerald-400">{activeSession.location.zone}</span>
                 </p>
              </div>
           </div>

           {/* AI Guidance */}
           <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-start gap-4">
              <Brain size={20} className="text-primary mt-1 flex-shrink-0" />
              <div>
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Smart Assistant Insight</p>
                 <p className="text-xs font-bold text-white/90 leading-tight italic">
                    "Heavy rain detected nearby. Fastest covered walking route recommended through main entrance."
                 </p>
              </div>
           </div>

           <div className="pt-2">
              <Button 
                onClick={() => toggleFindingCar(false)}
                className="w-full bg-white text-slate-900 hover:bg-slate-100 h-16 rounded-2xl font-black text-base italic shadow-xl shadow-white/5"
              >
                End Guidance
              </Button>
           </div>
        </div>
      </Card>
    </motion.div>
  );
};
