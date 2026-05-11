import React from 'react';
import { motion } from 'motion/react';
import { 
  Dna, 
  Leaf, 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Navigation2,
  BrainCircuit,
  Activity,
  History,
  MapPin,
  Clock,
  Car
} from 'lucide-react';
import { Card, Badge, SectionHeader } from './ui';
import { useData } from '../context/DataContext';
import { CouponWallet } from './SmartAds';

export const MobilityProfile: React.FC = () => {
  const { parkingHistory } = useData();
  
  const stats = [
    { label: 'Mobility Score', value: '94', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Efficiency', value: '88%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Eco Impact', value: '24kg', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Security', value: 'High', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ];

  const habits = [
    { label: 'Primary Context', value: 'University/Work', frequency: 72 },
    { label: 'Preferred Type', value: 'Covered + Security', frequency: 89 },
    { label: 'Peak Usage', value: '08:00 - 17:00', frequency: 65 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-fuchsia-500/20 rounded-xl flex items-center justify-center text-fuchsia-500">
             <Dna size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight italic">Mobility DNA™</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adaptive Driver Intelligence</p>
          </div>
        </div>
        <Badge variant="blue" className="bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-200">AI PROFILED</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="p-4 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-2 group hover:bg-white hover:shadow-xl transition-all"
          >
            <div className={`w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon size={14} />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
              <p className="text-xl font-black text-slate-900 tracking-tighter">{s.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 border-slate-100 bg-gradient-to-br from-fuchsia-50/50 to-blue-50/50">
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit size={14} className="text-fuchsia-500" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Learned Behavioral Insights</h4>
        </div>
        
        <div className="space-y-4">
          {habits.map((h, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">{h.label}</p>
                  <p className="text-xs font-black text-slate-800">{h.value}</p>
                </div>
                <span className="text-[9px] font-mono text-fuchsia-600 bg-fuchsia-100 px-1.5 py-0.5 rounded italic">
                  {h.frequency}% frequency
                </span>
              </div>
              <div className="h-1 bg-white rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${h.frequency}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/40 flex items-start gap-3">
           <Navigation2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
           <div>
             <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter mb-1">Predictive Choice Active</p>
             <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
               "System has optimized search for Zone A based on your 17:00 arrival pattern."
             </p>
           </div>
        </div>
      </Card>

      {/* Smart Coupons */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Zap size={16} className="text-primary" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Smart Rewards Wallet</h4>
        </div>
        <CouponWallet />
      </div>

      {/* Parking Memory Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History size={16} className="text-slate-400" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Parking Memory Timeline</h4>
        </div>
        
        <div className="space-y-3">
          {parkingHistory.length > 0 ? (
            parkingHistory.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-10"
              >
                {/* Timeline Line */}
                {idx !== parkingHistory.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-full bg-slate-100" />
                )}
                
                {/* Timeline Dot */}
                <div className="absolute left-2.5 top-2 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary z-10" />

                <Card className="p-4 border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-xs font-black text-slate-800 leading-none mb-1">{item.buildingName}</h5>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <MapPin size={8} />
                        <span>Lev {item.level} • {item.zone}</span>
                      </div>
                    </div>
                    <Badge variant="slate" className="text-[8px] px-1.5 py-0.5 font-mono">
                      {new Date(item.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <Clock size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-500 italic">Duration: {Math.floor(item.duration / 60)}h {item.duration % 60}m</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Car size={10} className="text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-500 italic">Network Fee: RM {item.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="p-10 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <History size={24} />
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Historical telemetry will appear here once you complete your first node session.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
