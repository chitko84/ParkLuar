import React, { useState } from 'react';
import { 
  BarChart3, 
  ShieldCheck, 
  AlertCircle, 
  Activity, 
  CheckCircle2, 
  XCircle,
  Eye,
  Server,
  DollarSign,
  Users,
  TrendingUp,
  MapPin,
  Flag,
  ChevronRight,
  Search,
  Bell,
  Cpu,
  MoreVertical,
  ArrowUpRight,
  TrendingDown,
  MessageSquare,
  Star,
  Zap,
  Monitor,
  Globe,
  Wind,
  Navigation2,
  BrainCircuit,
  Thermometer,
  Car,
  Smartphone,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { CommandTimeline } from './CommandTimeline';
import { OperationalCommand } from './OperationalCommand';
import { Card, StatsCard, SectionHeader, Badge, Button } from './ui';
import { scanLogs, parkingListings, hosts, drivers, bookings } from '../data/mockData';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';
import { motion } from 'motion/react';

// Mock data for Admin insights
const smartZones = [
  { id: 'z1', name: 'KLCC / Golden Triangle', occupancy: 92, congestion: 85, price: 'RM 12.50', trend: 'rising', color: '#EF4444' },
  { id: 'z2', name: 'Bukit Bintang', occupancy: 88, congestion: 78, price: 'RM 10.00', trend: 'stable', color: '#F59E0B' },
  { id: 'z3', name: 'Bangsar / Mid Valley', occupancy: 74, congestion: 62, price: 'RM 8.50', trend: 'rising', color: '#3B82F6' },
  { id: 'z4', name: 'Subang Jaya / SS15', occupancy: 95, congestion: 92, price: 'RM 5.50', trend: 'peak', color: '#EF4444' },
  { id: 'z5', name: 'Damansara / IKEA', occupancy: 68, congestion: 45, price: 'RM 7.00', trend: 'falling', color: '#10B981' },
  { id: 'z6', name: 'Cyberjaya Tech Hub', occupancy: 42, congestion: 20, price: 'RM 4.00', trend: 'stable', color: '#10B981' },
];

const CityInsights = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
       {/* City Overview Hero */}
       <Card className="bg-black border-none rounded-[3.5rem] p-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-emerald-900/20" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary border border-white/10 backdrop-blur-md">
                      <Globe size={24} className="animate-[spin_10s_linear_infinite]" />
                   </div>
                   <div>
                       <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-1">Admin Dashboard</h2>
                      <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">City Overview</h1>
                   </div>
                </div>
                <p className="text-sm font-medium text-white/50 max-w-md mb-8 leading-relaxed">
                   Monitoring 1,400+ active parking spots. Track traffic, demand, and environmental impact across the city in real-time.
                </p>
                <div className="flex flex-wrap gap-4">
                   <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Online</span>
                   </div>
                   <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Region:</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Kuala Lumpur</span>
                   </div>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Active Drivers', value: '4,822', icon: Car, color: 'text-blue-400' },
                  { label: 'Live Sessions', value: '1,290', icon: Activity, color: 'text-emerald-400' },
                  { label: 'Avg Wait Time', value: '84s', icon: Zap, color: 'text-amber-400' },
                  { label: 'CO2 Saved', value: '12.4t', icon: Wind, color: 'text-indigo-400' },
                ].map((m, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
                     <m.icon size={20} className={`${m.color} mb-3 group-hover:scale-110 transition-transform`} />
                     <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{m.label}</p>
                     <h4 className="text-2xl font-black text-white tracking-tighter font-mono">{m.value}</h4>
                  </div>
                ))}
             </div>
          </div>
       </Card>

       {/* Smart Zone Monitoring Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-8 border-none bg-white rounded-[3rem] shadow-sm flex flex-col gap-8">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Parking Areas</h3>
                   <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Current status</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" size="sm" className="rounded-xl px-4 text-[9px] font-black uppercase tracking-widest">Download Data</Button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                   {smartZones.slice(0, 3).map((zone) => (
                      <div key={zone.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:border-primary/20 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{zone.name}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{zone.price} / avg hr</p>
                            </div>
                            <Badge className={`${zone.trend === 'peak' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'} border-none uppercase text-[8px] font-black px-2 py-0.5`}>
                               {zone.trend}
                            </Badge>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="flex-1 space-y-2">
                               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Occupancy</span>
                                  <span className="text-slate-900">{zone.occupancy}%</span>
                               </div>
                               <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${zone.occupancy}%` }}
                                    className="h-full bg-primary rounded-full transition-all"
                                  />
                               </div>
                            </div>
                            <div className="flex-1 space-y-2">
                               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Congestion</span>
                                  <span className="text-slate-900">{zone.congestion}%</span>
                               </div>
                               <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${zone.congestion}%` }}
                                    className={`h-full ${zone.congestion > 80 ? 'bg-rose-500' : 'bg-amber-500'} rounded-full transition-all`}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="space-y-4">
                   {smartZones.slice(3, 6).map((zone) => (
                      <div key={zone.id} className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4 group hover:border-primary/20 transition-all">
                         <div className="flex justify-between items-start">
                            <div>
                               <h4 className="text-sm font-black text-slate-900 leading-none mb-1">{zone.name}</h4>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{zone.price} / avg hr</p>
                            </div>
                            <Badge className={`${zone.trend === 'peak' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'} border-none uppercase text-[8px] font-black px-2 py-0.5`}>
                               {zone.trend}
                            </Badge>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="flex-1 space-y-2">
                               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Occupancy</span>
                                  <span className="text-slate-900">{zone.occupancy}%</span>
                               </div>
                               <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${zone.occupancy}%` }}
                                    className="h-full bg-primary rounded-full transition-all"
                                  />
                               </div>
                            </div>
                            <div className="flex-1 space-y-2">
                               <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Congestion</span>
                                  <span className="text-slate-900">{zone.congestion}%</span>
                               </div>
                               <div className="h-1 w-full bg-white rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${zone.congestion}%` }}
                                    className={`h-full ${zone.congestion > 80 ? 'bg-rose-500' : 'bg-amber-500'} rounded-full transition-all`}
                                  />
                               </div>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </Card>

          <OperationalCommand />
       </div>

       {/* Heatmap & Sustainability Pulse */}
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-3 p-8 border-none bg-white rounded-[3.5rem] shadow-sm flex flex-col gap-8 overflow-hidden relative">
             <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Parking Density Map</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live parking availability</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-rose-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-amber-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Normal</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low</span>
                  </div>
                </div>
             </div>

             <div className="relative h-80 bg-slate-950 rounded-[2.5rem] overflow-hidden group">
                <div className="absolute inset-0 z-0">
                   <img 
                      src="https://images.unsplash.com/photo-1548345666-a571648d9e3d?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover opacity-20 grayscale brightness-50" 
                   />
                </div>
                {/* Simulated Heatmap Layers */}
                <div className="absolute inset-0 z-10">
                   {[
                     { top: '30%', left: '40%', size: '120px', color: 'rgba(239, 68, 68, 0.4)', label: 'KLCC' },
                     { top: '45%', left: '30%', size: '100px', color: 'rgba(245, 158, 11, 0.3)', label: 'Bintang' },
                     { top: '65%', left: '55%', size: '150px', color: 'rgba(239, 68, 68, 0.5)', label: 'Subang' },
                     { top: '20%', left: '65%', size: '80px', color: 'rgba(16, 185, 129, 0.3)', label: 'Cyber' },
                     { top: '75%', left: '20%', size: '110px', color: 'rgba(59, 130, 246, 0.3)', label: 'Bangsar' },
                   ].map((spot, i) => (
                      <React.Fragment key={i}>
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                          transition={{ duration: 3 + i, repeat: Infinity }}
                          style={{ 
                            top: spot.top, 
                            left: spot.left, 
                            width: spot.size, 
                            height: spot.size,
                            backgroundColor: spot.color,
                            boxShadow: `0 0 50px ${spot.color}`,
                            filter: 'blur(30px)' 
                          }}
                          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                        />
                        <div 
                          style={{ top: spot.top, left: spot.left }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
                        >
                           <div className="w-1 h-1 bg-white rounded-full mb-1 shadow-[0_0_10px_white]" />
                           <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{spot.label}</span>
                        </div>
                      </React.Fragment>
                   ))}

                   {/* Grid Pins */}
                   <div className="absolute inset-0 flex items-center justify-center p-12 grid grid-cols-12 grid-rows-6 opacity-30">
                      {Array.from({ length: 72 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-center">
                           <div className="w-[1px] h-[1px] bg-white/20" />
                        </div>
                      ))}
                   </div>
                </div>

                <div className="absolute top-8 left-8 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl flex flex-col gap-1">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Traffic Map</p>
                   <h5 className="text-sm font-black text-white">Real-time Traffic Flow</h5>
                </div>
             </div>
          </Card>

          <Card className="p-8 border-none bg-emerald-950 text-white rounded-[3.5rem] shadow-xl flex flex-col gap-8 relative overflow-hidden group">
             <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                <Wind size={200} />
             </div>
             <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                      <Thermometer size={20} />
                   </div>
                   <h3 className="text-lg font-black tracking-tight leading-none">Environmental Impact</h3>
                </div>

                <div className="space-y-8 flex-1">
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Estimated Fuel Saved</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black tracking-tighter">842</span>
                         <span className="text-sm font-black text-emerald-400 pb-1 uppercase italic">Liters</span>
                      </div>
                      <p className="text-[9px] font-bold text-white/50 mt-1 italic">You saved RM 1,720 in energy costs.</p>
                   </div>
                   
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Idle Time Reduction</p>
                      <div className="flex items-end gap-2">
                         <span className="text-4xl font-black tracking-tighter text-blue-400">12.4k</span>
                         <span className="text-sm font-black text-blue-400 pb-1 uppercase italic">Minutes</span>
                      </div>
                      <p className="text-[9px] font-bold text-white/50 mt-1 italic">Estimated traffic saved for city commuters.</p>
                   </div>
                </div>

                <div className="mt-auto pt-8 border-t border-white/10">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <CheckCircle2 size={16} />
                      </div>
                      <p className="text-xs font-black text-white shadow-emerald-500/10 tracking-tight leading-tight">Efficiency Rating: <span className="text-emerald-400 italic underline">AA+ Certified</span></p>
                   </div>
                </div>
             </div>
          </Card>
       </div>
    </div>
  );
};

const gmvGrowthData = [
  { date: '2024-04-24', gmv: 4200, revenue: 630 },
  { date: '2024-04-25', gmv: 3800, revenue: 570 },
  { date: '2024-04-26', gmv: 5100, revenue: 765 },
  { date: '2024-04-27', gmv: 7400, revenue: 1110 },
  { date: '2024-04-28', gmv: 8200, revenue: 1230 },
  { date: '2024-04-29', gmv: 6900, revenue: 1035 },
  { date: '2024-04-30', gmv: 9500, revenue: 1425 },
];

const zonePerformance = [
  { zone: 'Bangsar South', bookings: 145, gmv: 2175, color: '#005CAF' },
  { zone: 'SS15 Subang', bookings: 132, gmv: 1980, color: '#60A5FA' },
  { zone: 'PJ Midtown', bookings: 98, gmv: 1470, color: '#34D399' },
  { zone: 'KLCC / Bukit Bintang', bookings: 86, gmv: 1290, color: '#F59E0B' },
  { zone: 'Bandar Sunway', bookings: 74, gmv: 1110, color: '#8B5CF6' },
];

const conversionFunnel = [
  { stage: 'App Open', count: 12400 },
  { stage: 'Search', count: 8200 },
  { stage: 'Check Spot', count: 4500 },
  { stage: 'Booking', count: 1200 },
];

export const AdminStats = () => {
  const [activeTab, setActiveTab] = useState<'intelligence' | 'logs' | 'users' | 'urban-iq'>('intelligence');

  const totalGMV = gmvGrowthData.reduce((acc, curr) => acc + curr.gmv, 0);
  const platformRevenue = totalGMV * 0.15; // 15% platform fee
  const residentPayouts = totalGMV * 0.85; // 85% to residents

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Platform Summary Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
           <Badge variant="blue" className="mb-2">ADMIN</Badge>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Marketplace Health</h1>
           <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">Real-time Spotlight</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
           <button onClick={() => setActiveTab('intelligence')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'intelligence' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Marketplace</button>
           <button onClick={() => setActiveTab('urban-iq')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'urban-iq' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>City Stats</button>
           <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'logs' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Activity History</button>
           <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Network</button>
        </div>
      </div>

      {activeTab === 'urban-iq' ? (
        <CityInsights />
      ) : activeTab === 'intelligence' ? (
        <>
          {/* Network System Status Banner */}
          <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-none shadow-[0_30px_60px_rgba(15,23,42,0.5)] p-8 mb-4 rounded-[3.5rem] relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
             <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
             
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-2xl shadow-2xl">
                      <Cpu size={36} className="text-primary animate-pulse" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                         <h4 className="text-lg font-black text-white tracking-[0.2em] uppercase italic leading-none">AI CORE: ONLINE</h4>
                      </div>
                      <p className="text-xs text-white/50 font-black uppercase tracking-[0.3em] font-mono">Smart Parking Assistant</p>
                      <div className="flex gap-4 mt-3">
                         <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 font-mono">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Status:</span>
                            <span className="text-[10px] font-black text-emerald-400">GOOD</span>
                         </div>
                         <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 font-mono">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Speed:</span>
                            <span className="text-[10px] font-black text-primary">FASTER</span>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                   {['VISION 4.0', 'CRYPTO PAY', 'GEO FENCE'].map(s => (
                      <div key={s} className="flex flex-col items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] min-w-[120px] group-hover:bg-white/10 transition-all cursor-default">
                         <Monitor size={18} className="text-white/30" />
                         <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">{s}</span>
                      </div>
                   ))}
                </div>
             </div>
          </Card>

          {/* Key Intelligence Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard label="Total Sales (7D)" value={`RM ${(totalGMV/1000).toFixed(1)}k`} icon={TrendingUp} trend={{ value: "18%", positive: true }} />
            <StatsCard label="Platform Fees" value={`RM ${(platformRevenue/1000).toFixed(1)}k`} icon={DollarSign} trend={{ value: "15%", positive: true }} />
            <StatsCard label="Host Payouts" value={`RM ${(residentPayouts/1000).toFixed(1)}k`} icon={Users} trend={{ value: "12%", positive: true }} />
            <StatsCard label="Total Spots" value={parkingListings.length} icon={MapPin} trend={{ value: "48 New", positive: true }} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Growth Trends */}
             <Card className="lg:col-span-2 p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                   <div>
                      <h3 className="text-lg font-black text-slate-900">GMV & Platform Fees</h3>
                      <p className="text-xs font-bold text-slate-500">Malaysia Network Growth Curve</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"/><span className="text-[10px] font-bold text-slate-400 uppercase">GMV</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"/><span className="text-[10px] font-bold text-slate-400 uppercase">REVENUE</span></div>
                   </div>
                </div>
                <div className="h-72">
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gmvGrowthData}>
                         <defs>
                            <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#005CAF" stopOpacity={0.1}/><stop offset="95%" stopColor="#005CAF" stopOpacity={0}/></linearGradient>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                         <XAxis dataKey="date" hide />
                         <YAxis hide />
                         <Tooltip contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', padding: '12px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                         <Area type="monotone" dataKey="gmv" stroke="#005CAF" strokeWidth={3} fill="url(#colorGmv)" />
                         <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fill="url(#colorRev)" />
                      </AreaChart>
                   </ResponsiveContainer>
                </div>
             </Card>

             {/* Zone Performance */}
             <Card className="p-6 flex flex-col gap-6 ">
                <h3 className="text-lg font-black text-slate-900">Top Performing Zones</h3>
                <div className="space-y-6">
                   {zonePerformance.map((item, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-end">
                            <div>
                               <p className="text-sm font-black text-slate-800 tracking-tight">{item.zone}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.bookings} Bookings</p>
                            </div>
                            <p className="text-sm font-black text-primary">RM {item.gmv}</p>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(item.gmv/2175)*100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full rounded-full" style={{ backgroundColor: item.color }} />
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-auto pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                       <AlertCircle size={14} className="text-amber-500" /> High Demand Prediction (8AM-10AM)
                    </p>
                </div>
             </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 space-y-6">
                <SectionHeader title="System Alerts" actionLabel="History"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { title: 'Plate Mismatch', zone: 'Bangsar', time: '14:22', severity: 'HIGH', desc: 'WXY 4921 entered for booking PL-829', icon: AlertCircle, color: 'rose' },
                     { title: 'Verification Pending', zone: 'SS15', time: '12:30', severity: 'MEDIUM', desc: 'Host Ahmad R. submitted IC docs', icon: ShieldCheck, color: 'amber' },
                     { title: 'Commercial Inquiry', zone: 'Corporate', time: '10:15', severity: 'INFO', desc: 'Sunway Property Group collaboration', icon: Star, color: 'blue' },
                     { title: 'Dispute Case', zone: 'Subang', time: '09:00', severity: 'MEDIUM', desc: 'Bay A blocked by clutter - ID: 4122', icon: MessageSquare, color: 'amber' },
                   ].map((alert, i) => (
                      <Card key={i} className={`p-5 group hover:shadow-md transition-all cursor-default`}>
                         <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                               <div className={`p-2 rounded-xl bg-${alert.color}-50 text-${alert.color}-500`}>
                                 <alert.icon size={16} />
                               </div>
                               <h4 className="text-sm font-black text-slate-800 tracking-tight">{alert.title}</h4>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{alert.time}</span>
                         </div>
                         <p className="text-xs font-medium text-slate-500 mb-4 leading-relaxed">{alert.desc}</p>
                         <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                            <Badge variant={alert.severity === 'HIGH' ? 'error' : alert.severity === 'MEDIUM' ? 'slate' : 'blue'} className="text-[8px] font-black">{alert.severity}</Badge>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-[10px] font-black uppercase text-primary hover:bg-primary/5">Take Action</Button>
                         </div>
                      </Card>
                   ))}
                </div>
             </div>

             <Card className="p-6 flex flex-col gap-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">User Activity</h3>
                <div className="space-y-6">
                   {conversionFunnel.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl font-black text-[10px]">{i+1}</div>
                         <div className="flex-1">
                            <div className="flex justify-between mb-1.5">
                               <span className="text-[11px] font-black text-slate-800 tracking-tight uppercase">{item.stage}</span>
                               <span className="text-[11px] font-bold text-slate-400">{item.count}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                               <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count/12400)*100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-primary" />
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-auto p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-2">
                       <Zap size={14} className="fill-emerald-800" />
                       “Network efficiency up 14% since implementation of LPR check-ins in Subang Jaya.”
                    </p>
                </div>
             </Card>
          </div>
        </>
      ) : activeTab === 'logs' ? (
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <SectionHeader title="Scanner Activity" subtitle="Current scanner activity" />
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 LIVE FEED
              </div>
           </div>
           <Card noPadding className="overflow-hidden border-slate-200 shadow-sm rounded-[2.5rem]">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-100">
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">License Plate</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Zone</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Action</th>
                   <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Time</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {scanLogs.map((log) => (
                   <tr key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                     <td className="px-6 py-4">
                       <code className="text-[11px] font-black bg-slate-900 text-white px-2 py-1 rounded-md tracking-tighter shadow-sm">{log.plateNumber}</code>
                     </td>
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <MapPin size={12} className="text-slate-300" />
                           <span className="text-[11px] font-bold text-slate-700">Bangsar South Cluster</span>
                        </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${log.confidence > 0.9 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${log.confidence * 100}%` }} />
                         </div>
                         <span className={`text-[10px] font-black ${log.confidence > 0.9 ? 'text-emerald-500' : 'text-amber-500'}`}>{(log.confidence * 100).toFixed(0)}%</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <Badge variant={log.action === "REJECTED" ? "error" : log.action === "ENTRY" ? "success" : "slate"} className="text-[9px] font-black tracking-widest">
                         {log.action}
                       </Badge>
                     </td>
                     <td className="px-6 py-4 text-right">
                       <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                         {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </Card>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <SectionHeader title="Real-time Node Monitoring" subtitle="Managing verified infrastructure and host assets" />
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-600">382 NODES ONLINE</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-[10px] font-black text-slate-600">84% CAPACITY</span>
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Cluster Map Placeholder / Visualization */}
              <Card className="lg:col-span-3 p-0 min-h-[400px] bg-slate-900 overflow-hidden relative group rounded-[3.5rem] border-none shadow-2xl">
                 <div className="absolute inset-0 z-0">
                    <img 
                       src="https://images.unsplash.com/photo-1548345666-a571648d9e3d?auto=format&fit=crop&q=80&w=1000" 
                       className="w-full h-full object-cover opacity-20 grayscale" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                 </div>
                 
                 {/* Simulated Nodes on Map */}
                 <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    {[
                       { top: '30%', left: '40%', status: 'active' },
                       { top: '45%', left: '35%', status: 'busy' },
                       { top: '60%', left: '55%', status: 'active' },
                       { top: '25%', left: '60%', status: 'offline' },
                       { top: '70%', left: '30%', status: 'active' },
                       { top: '15%', left: '45%', status: 'active' },
                       { top: '50%', left: '20%', status: 'busy' },
                    ].map((node, idx) => (
                       <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          style={{ top: node.top, left: node.left }}
                          className="absolute pointer-events-auto"
                       >
                          <div className={`w-3 h-3 rounded-full ${node.status === 'active' ? 'bg-emerald-400' : node.status === 'busy' ? 'bg-amber-400' : 'bg-slate-500'} shadow-[0_0_15px_rgba(52,211,153,0.5)] relative`}>
                             {node.status === 'active' && <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75" />}
                          </div>
                       </motion.div>
                    ))}
                 </div>

                 <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col md:flex-row items-end justify-between gap-6">
                    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 flex flex-col gap-4 shadow-2xl">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                             <Activity size={20} className="text-primary" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Spot Usage</p>
                             <h4 className="text-xl font-black text-white tracking-tighter italic">Kuala Lumpur Center</h4>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Total spots</span>
                             <span className="text-lg font-black text-white leading-none">284</span>
                          </div>
                          <div className="w-px h-8 bg-white/10" />
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Efficiency</span>
                             <span className="text-lg font-black text-emerald-400 leading-none">98.2%</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex gap-3">
                       <Button variant="secondary" className="bg-white/5 border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest px-6 h-12 backdrop-blur-md">Relayer Stats</Button>
                       <Button className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-6 h-12">Expand Mesh</Button>
                    </div>
                 </div>
              </Card>

              {/* Node Sidebar / Quick List */}
              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Top Earning Spots</h4>
                 <div className="space-y-3 h-[350px] overflow-y-auto no-scrollbar scroll-smooth pr-1">
                    {hosts.slice(0, 10).map((host, i) => (
                       <Card key={host.id} className="p-4 flex items-center gap-4 border-slate-100 hover:border-primary/20 transition-all cursor-pointer group shadow-sm bg-white">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl overflow-hidden shrink-0 relative">
                             <img 
                               src={`https://i.pravatar.cc/150?u=host${i+5}`} 
                               className="w-full h-full object-cover" 
                               referrerPolicy="no-referrer"
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=Host&background=random`;
                               }}
                             />
                             <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${i % 3 === 0 ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h5 className="text-[11px] font-black text-slate-800 tracking-tight truncate uppercase leading-none mb-1.5">{host.name.split(' ')[0]}'s Spot</h5>
                             <div className="flex items-center gap-2">
                                <Badge variant="slate" className="text-[8px] font-black px-1.5 py-0 shadow-none border-slate-100 h-4">
                                   {i % 4 === 0 ? 'RESIDENTIAL' : 'BUSINESS'}
                                </Badge>
                                <span className="text-[9px] font-black text-emerald-500 tracking-tight leading-none italic">RM {Math.floor(Math.random() * 500) + 800} earned</span>
                             </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors" />
                       </Card>
                    ))}
                 </div>
                 <Button variant="ghost" className="w-full h-12 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:bg-primary/5">View All Spots</Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
