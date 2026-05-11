import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Cpu, 
  Globe, 
  Navigation2,
  AlertCircle,
  Radio,
  Eye,
  Settings
} from 'lucide-react';
import { Card, Badge, Button } from './ui';
import { CommandTimeline } from './CommandTimeline';

export const OperationalCommand: React.FC = () => {
  const [uptime, setUptime] = useState('99.98%');
  const [load, setLoad] = useState(42);
  const [incidents, setIncidents] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad(prev => Math.min(100, Math.max(0, prev + (Math.random() * 10 - 5))));
      if (Math.random() > 0.8) setIncidents(p => p + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-slate-950 border-none rounded-[3rem] p-8 shadow-2xl overflow-hidden relative min-h-[700px] flex flex-col group">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(30,58,138,0.2),_transparent)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500/20 rounded-[2rem] flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
             <Radio size={32} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">System Status</h2>
              <Badge variant="blue" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Active</Badge>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] font-mono">City Parking Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/5 backdrop-blur-md">
           <div className="px-6 py-2 border-r border-white/10">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Uptime</p>
              <p className="text-sm font-black text-emerald-400 font-mono tracking-tighter">{uptime}</p>
           </div>
           <div className="px-6 py-2 border-r border-white/10">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">System Load</p>
              <p className="text-sm font-black text-blue-400 font-mono tracking-tighter">{Math.round(load)}%</p>
           </div>
           <div className="px-6 py-2">
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Alerts</p>
              <p className="text-sm font-black text-amber-400 font-mono tracking-tighter">{incidents}</p>
           </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        {/* Left Span: Visualization & Insights */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/5 border-white/5 p-6 rounded-[2.5rem] hover:bg-white/[0.08] transition-all">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-400">
                       <AlertTriangle size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white italic uppercase tracking-tight">Active Disruption Map</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Live Hotspot Tracking</p>
                    </div>
                 </div>
                 
                 <div className="h-48 relative bg-slate-900 rounded-3xl overflow-hidden border border-white/5 group-hover:border-amber-500/30 transition-all">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                       <Globe size={160} className="text-amber-500/20 animate-[spin_20s_linear_infinite]" />
                    </div>
                    <div className="absolute inset-0 p-4">
                       <div className="flex flex-col gap-3">
                          {[
                            { label: 'Damansara Link', state: 'CONGESTED', color: 'bg-red-500' },
                            { label: 'Bukit Bintang', state: 'SATURATED', color: 'bg-amber-500' },
                            { label: 'Mid Valley', state: 'OPTIMAL', color: 'bg-emerald-500' }
                          ].map((item, i) => (
                             <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${item.color} animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                                   <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">{item.label}</span>
                                </div>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded ${item.color}/20 text-white leading-none`}>
                                   {item.state}
                                </span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </Card>

              <Card className="bg-white/5 border-white/5 p-6 rounded-[2.5rem] hover:bg-white/[0.08] transition-all">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                       <Cpu size={20} />
                    </div>
                    <div>
                       <h4 className="text-sm font-black text-white italic uppercase tracking-tight">AI Optimization Engine</h4>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono">Throughput Max v2.1</p>
                    </div>
                 </div>

                 <div className="space-y-4">
                   <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
                      <div className="flex justify-between mb-2">
                         <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Accuracy</span>
                         <span className="text-[10px] font-black text-blue-400 font-mono italic">99.2%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: '99.2%' }}
                           transition={{ duration: 1.5, loop: Infinity }}
                           className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center">
                         <p className="text-[8px] font-black text-emerald-400 uppercase mb-1">New Routes</p>
                         <p className="text-xl font-black text-white tracking-tighter">1,248</p>
                      </div>
                      <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20 text-center">
                         <p className="text-[8px] font-black text-fuchsia-400 uppercase mb-1">Traffic drop</p>
                         <p className="text-xl font-black text-white tracking-tighter">-14%</p>
                      </div>
                   </div>
                 </div>
              </Card>
           </div>

           <Card className="bg-white/5 border-white/5 p-8 rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Shield size={120} className="text-white" />
              </div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                    <h3 className="text-xl font-black text-white tracking-tighter mb-2 italic">Smart Incident Override active.</h3>
                    <p className="text-xs font-bold text-slate-500 max-w-[400px] leading-relaxed">
                       Autonomous mitigation protocol is currently managing traffic flow in <span className="text-blue-400 italic font-black">Cluster MY-8</span> by dynamically adjusting pricing and accessibility.
                    </p>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl px-8 h-14 font-black">
                       AUDIT LOGS
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 h-14 font-black shadow-xl shadow-blue-600/30">
                       MANUAL OVERRIDE
                    </Button>
                 </div>
              </div>
           </Card>
        </div>

        {/* Right Span: Real-time Incident Feed */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                 <Radio size={14} className="text-red-500 animate-[pulse_1s_infinite]" />
                 <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono">Incident Interface</h4>
              </div>
              <Badge className="bg-white/5 text-slate-400 border-white/5 animate-pulse">MONITORING...</Badge>
           </div>
           
           <div className="bg-black/40 rounded-[2.5rem] border border-white/5 p-6 h-full flex flex-col min-h-[500px]">
              <div className="flex-1 overflow-hidden">
                 <CommandTimeline variant="minimal" maxEvents={10} className="h-full bg-transparent p-0 border-none shadow-none text-white" />
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <Eye size={16} className="text-blue-400" />
                    <div>
                       <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Visual Auth</p>
                       <p className="text-[9px] font-black text-white uppercase italic">Active</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <Settings size={16} className="text-slate-400" />
                    <div>
                       <p className="text-[8px] font-black text-slate-500 uppercase leading-none mb-1">Heuristics</p>
                       <p className="text-[9px] font-black text-white uppercase italic">Learning</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </Card>
  );
};
