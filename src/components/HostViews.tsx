/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CommandTimeline } from './CommandTimeline';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Plus,
  ArrowUpRight,
  Clock,
  Car,
  Settings,
  Shield,
  Zap,
  Activity,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  ArrowDownLeft,
  LayoutDashboard,
  Search,
  Bell,
  Star,
  Eye,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  EyeOff,
  User,
  QrCode,
  Image as ImageIcon,
  Building,
  Check,
  Brain,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { Card, StatsCard, SectionHeader, Button, Badge, Modal, Drawer, Input, Select, useToastStore } from './ui';
import { useData } from '../context/DataContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { ParkingListing } from '../types';

// Mock data for charts remains same for visual polish
const weeklyEarningsData = [
  { day: 'Mon', amount: 45 },
  { day: 'Tue', amount: 32 },
  { day: 'Wed', amount: 58 },
  { day: 'Thu', amount: 48 },
  { day: 'Fri', amount: 72 },
  { day: 'Sat', amount: 95 },
  { day: 'Sun', amount: 88 },
];

const monthlyRevenueData = [
  { month: 'Jan', amount: 850 },
  { month: 'Feb', amount: 920 },
  { month: 'Mar', amount: 1100 },
  { month: 'Apr', amount: 1450 },
  { month: 'May', amount: 1800 },
];

const occupancyData = [
  { name: 'Occupied', value: 78, color: '#005CAF' },
  { name: 'Vacant', value: 22, color: '#F8FAFC' },
];

const marketBenchmarkData = [
  { category: 'Occupancy', user: 78, market: 62 },
  { category: 'Rev/Hour', user: 5.5, market: 4.2 },
  { category: 'Rating', user: 4.8, market: 4.3 },
  { category: 'Conversion', user: 68, market: 45 },
];

const projectedRevenueData = [
  { name: 'Mon', revenue: 140, projected: 160 },
  { name: 'Tue', revenue: 125, projected: 145 },
  { name: 'Wed', revenue: 180, projected: 210 },
  { name: 'Thu', revenue: 160, projected: 190 },
  { name: 'Fri', revenue: 240, projected: 310 },
  { name: 'Sat', revenue: 310, projected: 380 },
  { name: 'Sun', revenue: 280, projected: 340 },
];

const activityLogs = [
  { id: 1, type: 'ARRIVAL', guest: 'L. Wei Keat', plate: 'VCC 8122', time: '14:22', status: 'SUCCESS' },
  { id: 2, type: 'PAYMENT', guest: 'Amirul H.', amount: 12.00, time: '13:45', status: 'RECEIVED' },
  { id: 3, type: 'SUSPICIOUS', guest: 'Unknown', plate: 'BQA 7701', time: '12:10', status: 'REJECTED' },
  { id: 4, type: 'SCAN', guest: 'Jane Lau', plate: 'WXY 4921', time: '10:30', status: 'VERIFIED' },
];

export const HostDashboard = ({ activeSection = 'overview' }: { activeSection?: 'overview' | 'listings' | 'activity' | 'payouts' }) => {
  const { hostListings = [] } = useData();
  const [internalTab, setInternalTab] = useState<'overview' | 'listings' | 'activity' | 'payouts'>(activeSection);

  // Sync internal state with prop if it changes
  React.useEffect(() => {
    setInternalTab(activeSection);
  }, [activeSection]);

  const renderTabContent = () => {
    switch (internalTab) {
      case 'overview': return <OverviewTab />;
      case 'listings': return <ListingsTab />;
      case 'activity': return <ActivityTab />;
      case 'payouts': return <PayoutsTab />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Header with Sub-navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Integrated Yield Management</span>
           </div>
           <h1 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase">Host Dashboard</h1>
           <p className="text-xs font-bold text-slate-500 mt-2 flex items-center gap-1.5">
             <Shield size={12} className="text-emerald-500" />
             Parking Spots Managed: {hostListings?.length || 0} | Status: System Active
           </p>
        </div>
        <div className="flex bg-slate-950/5 p-1.5 rounded-[1.8rem] border border-slate-100 md:w-fit w-full overflow-x-auto no-scrollbar">
           {[
             { id: 'overview', label: 'Portfolio', icon: LayoutDashboard },
             { id: 'listings', label: 'Nodes', icon: MapPin },
             { id: 'activity', label: 'Pulse', icon: Activity },
             { id: 'payouts', label: 'Liquidity', icon: Wallet },
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setInternalTab(tab.id as any)}
               className={`flex items-center gap-3 px-6 py-3 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 internalTab === tab.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-slate-500 hover:text-slate-800'
               }`}
             >
               <tab.icon size={14} className={internalTab === tab.id ? 'text-white' : ''} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      {renderTabContent()}
    </div>
  );
};

const bookingSourceData = [
  { name: 'Direct', value: 45, color: '#005CAF' },
  { name: 'Marketplace', value: 30, color: '#60A5FA' },
  { name: 'Repeat', value: 25, color: '#34D399' },
];

const revenueOptimizationData = [
  { time: '08:00', static: 400, dynamic: 400 },
  { time: '10:00', static: 400, dynamic: 480 },
  { time: '12:00', static: 400, dynamic: 550 },
  { time: '14:00', static: 400, dynamic: 420 },
  { time: '16:00', static: 400, dynamic: 610 },
  { time: '18:00', static: 400, dynamic: 750 },
  { time: '20:00', static: 400, dynamic: 580 },
];

const PortfolioLeaderboard = () => {
  const { hostListings = [] } = useData();
  
  const sortedListings = useMemo(() => {
    return [...hostListings].sort((a, b) => (b.hostEarningsThisMonth || 0) - (a.hostEarningsThisMonth || 0));
  }, [hostListings]);

  return (
    <Card className="p-8 border-slate-100 bg-white rounded-[3rem] shadow-sm flex flex-col gap-6">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                <Building size={20} />
             </div>
             <div>
               <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Asset Performance Leaderboard</h4>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue-based Ranking</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Updated Live</Badge>
          </div>
       </div>

       <div className="overflow-x-auto no-scrollbar">
          <table className="w-full">
             <thead>
                <tr className="border-b border-slate-50">
                   <th className="text-left py-4 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Node</th>
                   <th className="text-left py-4 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency</th>
                   <th className="text-left py-4 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Rating</th>
                   <th className="text-left py-4 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Revenue (MTD)</th>
                   <th className="text-right py-4 px-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
             </thead>
             <tbody>
                {sortedListings.map((l, i) => (
                   <tr key={l.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2">
                         <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-slate-200 group-hover:text-primary transition-colors">#{i+1}</span>
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100">
                               <img src={l.images?.[0]} className="w-full h-full object-cover" alt="asset" />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 leading-none mb-1 truncate w-40">{l.title}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase">{l.neighborhood}</p>
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-2">
                         <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center w-24">
                               <span className="text-[10px] font-black text-slate-900">{i === 0 ? '94%' : i === 1 ? '72%' : '48%'}</span>
                            </div>
                            <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                               <div 
                                 className={`h-full ${i === 0 ? 'bg-emerald-500' : 'bg-primary'} rounded-full`}
                                 style={{ width: i === 0 ? '94%' : i === 1 ? '72%' : '48%' }}
                               />
                            </div>
                         </div>
                      </td>
                      <td className="py-4 px-2">
                         <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-black text-slate-900">{l.rating}</span>
                         </div>
                      </td>
                      <td className="py-4 px-2 font-mono">
                         <span className="text-sm font-black text-slate-800">RM {l.hostEarningsThisMonth?.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-2 text-right">
                         {i === 0 ? (
                           <Badge className="bg-emerald-100 text-emerald-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">Champion</Badge>
                         ) : i === sortedListings.length - 1 && sortedListings.length > 1 ? (
                           <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">Optimization Req</Badge>
                         ) : (
                           <Badge className="bg-blue-100 text-blue-700 border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md">Scaling</Badge>
                         )}
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       <div className="bg-slate-900 p-6 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 group">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400">
                <Brain size={24} />
             </div>
             <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Portfolio Strategy Optimizer</p>
                <h5 className="text-sm font-black text-white leading-tight">Focus on Node #3: Underperforming on conversion vs nearby assets.</h5>
             </div>
          </div>
          <Button className="bg-white text-slate-900 rounded-xl h-11 px-6 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 border-none group-hover:scale-105 transition-transform">
             Initiate Growth Audit
          </Button>
       </div>
    </Card>
  );
};

const RevenueOptimizationEngine = () => {
  const { hostListings = [] } = useData();
  
  return (
    <Card className="p-8 border-none bg-slate-50 rounded-[3rem] shadow-sm flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-[1.5rem] flex items-center justify-center text-primary shadow-inner">
             <Brain size={28} />
          </div>
          <div>
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Smart Pricing</h3>
             <p className="text-xs font-bold text-slate-600">Earn more with automated pricing.</p>
          </div>
        </div>
        <div className="flex gap-4">
           <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Estimated boost</span>
              <span className="text-xl font-black text-emerald-600">+22.4%</span>
           </div>
           <Badge variant="blue" className="h-fit py-1.5 px-4 rounded-full bg-primary text-white border-none font-black text-[10px] uppercase tracking-widest">Smart Pricing Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Earnings Comparison</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[9px] font-black text-slate-600 uppercase">Standard Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-[9px] font-black text-slate-600 uppercase">Smart Price</span>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueOptimizationData}>
                <defs>
                  <linearGradient id="colorDynamic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005CAF" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#005CAF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const dynamic = payload[1]?.value as number;
                      const stat = payload[0]?.value as number;
                      const diff = ((dynamic - stat) / stat * 100).toFixed(1);
                      return (
                        <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-white/10">
                          <p className="text-[10px] font-black text-white/40 uppercase mb-2">Revenue Comparison</p>
                          <div className="flex flex-col gap-1">
                             <div className="flex justify-between gap-8">
                                <span className="text-xs font-bold">Dynamic:</span>
                                <span className="text-xs font-black text-emerald-400">RM {dynamic}</span>
                             </div>
                             <div className="flex justify-between gap-8">
                                <span className="text-xs font-bold">Static:</span>
                                <span className="text-xs font-black text-white/60">RM {stat}</span>
                             </div>
                             <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                                 <span className="text-[10px] font-black text-primary uppercase">Extra Earnings:</span>
                                 <span className="text-[10px] font-black text-emerald-400">+{diff}%</span>
                              </div>
                           </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area type="monotone" dataKey="static" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="dynamic" stroke="#005CAF" strokeWidth={4} fillOpacity={1} fill="url(#colorDynamic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                   <Zap size={20} className="fill-amber-600" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-slate-800">Busy times expected soon</h5>
                   <p className="text-xs font-bold text-slate-500">6PM – 9PM (Friday) | Nearby Concert Event Impact</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Recommended Price boost</p>
                <p className="text-lg font-black text-amber-600">+45% Rate Lift</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
           <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Pricing Tips</h4>
           
           <div className="flex flex-col gap-3">
              {hostListings.slice(0, 3).map((listing, i) => (
                <div key={listing.id} className="bg-white p-5 rounded-[1.8rem] border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-primary/30 transition-all cursor-pointer group">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                            <img src={listing.images?.[0]} className="w-full h-full object-cover" alt="spot" />
                         </div>
                         <div>
                            <h5 className="text-xs font-black text-slate-800 truncate w-32">{listing.title}</h5>
                            <div className="flex items-center gap-1">
                               <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Current: RM {listing.dynamicPricing?.currentPrice}/hr</p>
                            </div>
                         </div>
                      </div>
                      {(listing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? (
                        <div className="text-emerald-500 bg-emerald-50 p-1.5 rounded-lg">
                           <ArrowUpRight size={14} />
                        </div>
                      ) : (
                        <div className="text-blue-500 bg-blue-50 p-1.5 rounded-lg">
                           <Info size={14} />
                        </div>
                      )}
                   </div>
                   
                   <div className="bg-slate-50 p-3 rounded-xl">
                      <p className="text-[9px] font-bold text-slate-600 leading-tight italic">
                         "Increase to RM {(listing.dynamicPricing?.currentPrice || 0) + 2}/hr during next 2 hours. Demand is rising."
                      </p>
                   </div>
                   
                   <div className="flex items-center justify-between pt-1">
                      <span className="text-[9px] font-black text-primary uppercase">Potential +{listing.dynamicPricing?.yieldOpportunity}% boost</span>
                      <Button variant="outline" className="h-7 text-[8px] font-black px-3 rounded-lg border-primary/20 text-primary hover:bg-primary/5 uppercase">Apply Change</Button>
                   </div>
                </div>
              ))}
           </div>
           
           <div className="mt-2 p-5 bg-primary/10 rounded-[2rem] border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                 <TrendingUp size={14} className="text-primary" />
                 <span className="text-[9px] font-black text-primary uppercase tracking-widest">Spot Performance</span>
              </div>
              <p className="text-xs font-black text-slate-800 leading-tight">
                 Your spot in SS15 is earning more than 92% of others nearby. 
              </p>
           </div>
        </div>
      </div>
    </Card>
  );
};

const OverviewTab = () => {
  const { walletBalance, hostListings = [] } = useData();
  
  const totalBookings = hostListings.reduce((acc, curr) => acc + (curr.totalBookingsCount || 0), 0);
  const avgMonthly = hostListings.reduce((acc, curr) => acc + (curr.hostEarningsThisMonth || 0), 0);
  
  // Intelligence Metrics Calculation (Simulated)
  const avgDuration = 3.4; // hours
  const conversionRate = 68; // %
  const topListing = hostListings.length > 0 
    ? [...hostListings].sort((a, b) => (b.totalBookingsCount || 0) - (a.totalBookingsCount || 0))[0]
    : null;

  return (
    <div className="space-y-10">
      {/* Prime Intelligence Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-black text-white p-8 relative overflow-hidden group border-none shadow-[0_30px_60px_rgba(15,23,42,0.3)] rounded-[3rem] lg:col-span-1">
           <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10 group-hover:opacity-25 transition-all duration-1000 rotate-12 scale-150">
              <DollarSign size={180} className="text-white" />
           </div>
           
           <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary via-primary/20 to-emerald-500/20" />
           <div className="absolute -top-24 -left-24 w-60 h-60 bg-primary/20 blur-[100px] rounded-full" />

           <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                       <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] font-mono">Financial Hub</p>
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20 font-black text-[9px] uppercase px-3 py-1 rounded-full">Elite Tier</Badge>
                 </div>
                 <div>
                    <span className="text-xs font-bold text-white/50 block mb-2 font-mono uppercase tracking-widest">Available Liquidity</span>
                    <h2 className="text-6xl font-black mb-1 tracking-tighter leading-none flex items-baseline gap-2">
                       <span className="text-sm font-bold text-emerald-400">RM</span>
                       {walletBalance.toFixed(2)}
                    </h2>
                 </div>
              </div>
              <div className="mt-12 flex gap-3">
                 <Button className="flex-1 bg-white text-slate-950 rounded-2xl h-14 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all shadow-xl active:scale-95 border-none">
                    Settle Portfolio
                 </Button>
              </div>
           </div>
        </Card>
        
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
           <StatsCard 
             label="Net Revenue" 
             value={`RM ${avgMonthly.toLocaleString()}`} 
             icon={DollarSign} 
             trend={{ value: "22.4%", positive: true }} 
             className="bg-white border-slate-100 shadow-sm rounded-[2.5rem] p-6 h-full font-mono"
             subValue="Predicted Lift: +RM 240"
           />
           <Card className="bg-emerald-50 border-emerald-100 shadow-sm rounded-[2.5rem] p-6 h-full flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform">
                <TrendingUp size={120} className="text-emerald-900" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                       <Zap size={20} />
                    </div>
                    <Badge className="bg-emerald-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-2 py-1 rounded-md">Top 8%</Badge>
                 </div>
                 <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-1">Market Position</p>
                 <h3 className="text-2xl font-black text-blue-900 tracking-tighter">Outperforming Area</h3>
                 <p className="text-[11px] font-bold text-blue-800 mt-2">You outperform 92% of hosts in Subang Jaya for yield-per-sqft.</p>
              </div>
           </Card>
           <StatsCard 
             label="Engagement Rate" 
             value={`${conversionRate}%`} 
             icon={TrendingUp} 
             trend={{ value: "5.2%", positive: true }}
             className="bg-white border-slate-100 shadow-sm rounded-[2.5rem] p-6 h-full font-mono"
             subValue="View-to-Booking sync"
           />
           <StatsCard 
             label="Avg Session" 
             value={`${avgDuration} hrs`} 
             icon={Clock} 
             trend={{ value: "0.8h", positive: true }}
             className="bg-white border-slate-100 shadow-sm rounded-[2.5rem] p-6 h-full font-mono"
             subValue="Optimal for Long Stay"
           />
        </div>
      </div>

      <RevenueOptimizationEngine />

      {/* Portfolio Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Yield Forecast */}
         <Card className="p-8 border-none bg-slate-50 rounded-[3rem] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                     <Calendar size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Revenue Forecast</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next 7 Days (Predictive Analysis)</p>
                  </div>
               </div>
               <div className="text-right">
                  <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-md">+18.5% Growth Expected</span>
               </div>
            </div>

            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={projectedRevenueData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                     <YAxis hide />
                     <Tooltip 
                       cursor={{fill: 'rgba(255, 255, 255, 0.4)'}}
                       content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             return (
                                <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-white/10">
                                   <p className="text-[10px] font-black opacity-50 uppercase mb-2">{payload[0].payload.name}</p>
                                   <div className="space-y-1">
                                      <div className="flex justify-between gap-4">
                                         <span className="text-xs font-bold">Standard:</span>
                                         <span className="text-xs font-black">RM {payload[0].value}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                         <span className="text-xs font-bold text-emerald-400">Projected:</span>
                                         <span className="text-xs font-black text-emerald-400">RM {payload[1].value}</span>
                                      </div>
                                   </div>
                                </div>
                             )
                          }
                          return null;
                       }}
                     />
                     <Bar dataKey="revenue" fill="#94A3B8" radius={[6, 6, 0, 0]} barSize={20} />
                     <Bar dataKey="projected" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Market Benchmarking */}
         <Card className="p-8 border-none bg-white rounded-[3rem] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                     <TrendingUp size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Network Benchmarking</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Comparison vs Local Market Avg</p>
                  </div>
               </div>
            </div>

            <div className="space-y-6">
               {marketBenchmarkData.map((item, idx) => (
                  <div key={idx} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{item.category}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-bold text-slate-500 uppercase">You: <span className="text-slate-900">{item.user}</span></span>
                           <span className="text-[10px] font-bold text-slate-500 uppercase">Avg: <span className="text-slate-600">{item.market}</span></span>
                        </div>
                     </div>
                     <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.market / Math.max(item.user, item.market)) * 100}%` }}
                          className="absolute inset-y-0 left-0 bg-slate-200 z-0"
                        />
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.user / Math.max(item.user, item.market)) * 100}%` }}
                          className="absolute inset-y-0 left-0 bg-primary z-10 rounded-full"
                        />
                     </div>
                  </div>
               ))}
            </div>

            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <Zap size={14} />
               </div>
               <p className="text-[10px] font-bold text-indigo-900 leading-tight">
                  <span className="font-black uppercase mr-1">Opportunity:</span> 
                  Your conversion rate is 51% higher than market average. Consider a 5% baseline price increase.
               </p>
            </div>
         </Card>
      </div>

      {/* Achievement & Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="p-6 bg-white border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col gap-4">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Network Achievements</h4>
            <div className="grid grid-cols-2 gap-3">
               {[
                 { label: 'Trusted Host', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                 { label: 'Yield Master', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                 { label: 'Fast Proxy', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
                 { label: 'High Occupancy', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
               ].map((badge, idx) => (
                 <div key={idx} className={`${badge.bg} p-4 rounded-3xl flex flex-col items-center justify-center gap-2 text-center group hover:scale-105 transition-transform`}>
                    <badge.icon size={20} className={badge.color} />
                    <span className="text-[8px] font-black uppercase tracking-tight text-slate-600 leading-none">{badge.label}</span>
                 </div>
               ))}
            </div>
         </Card>

         <Card className="md:col-span-2 p-6 bg-black text-white rounded-[2.5rem] shadow-xl overflow-hidden relative group">
            <div className="absolute right-0 top-0 p-8 transform translate-x-1/3 -translate-y-1/3 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
               <Brain size={140} />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Smart Insight</span>
                     </div>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight mb-2 uppercase">Demand Pattern: High Demand</h3>
                  <p className="text-sm font-bold text-white max-w-md">Our data shows that <span className="text-blue-400 font-black">Covered Parking</span> in your area (Subang Jaya) are earning <span className="text-emerald-400 font-black">22% more</span> than open spots.</p>
               </div>
               <div className="mt-6 flex gap-4">
                  <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Recommended Action</p>
                     <p className="text-xs font-black text-blue-300">Add a roof or canopy to Spot #2</p>
                  </div>
                  <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Projected ROI</p>
                     <p className="text-xs font-black text-emerald-400">Recoup in 4.2 Weeks</p>
                  </div>
               </div>
            </div>
         </Card>
      </div>

      <PortfolioLeaderboard />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* Top Performing Asset */}
         <Card className="lg:col-span-2 p-8 border-none bg-slate-900 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-10 group-hover:scale-125 transition-transform duration-1000">
               <Star size={180} className="text-white" />
            </div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div className="flex items-center gap-2 mb-6">
                     <Badge className="bg-blue-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Top Spot</Badge>
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Performance Stats</span>
                  </div>
                  
                  {topListing ? (
                    <div className="flex items-center gap-6">
                       <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/10 group-hover:scale-110 transition-transform">
                          <img src={topListing.images?.[0]} className="w-full h-full object-cover" alt="top" />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{topListing.title}</h4>
                          <p className="text-sm font-bold text-white/50 mb-3">{topListing.neighborhood}</p>
                          <div className="flex gap-4">
                             <div className="flex flex-col">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Earnings</span>
                                <span className="text-lg font-black text-white">RM {topListing.hostEarningsThisMonth?.toLocaleString()}</span>
                             </div>
                             <div className="flex flex-col border-l border-white/10 pl-4">
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Growth</span>
                                <span className="text-lg font-black text-emerald-400">+14.2%</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  ) : (
                    <p className="text-white/60 text-sm font-bold italic">No performance data available.</p>
                  )}
               </div>
               
               <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Peak Occupancy</p>
                     <p className="text-sm font-black text-white">Friday, 18:00 – 21:00</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Market Position</p>
                     <p className="text-sm font-black text-emerald-400">Top 5% Nearby</p>
                  </div>
               </div>
            </div>
         </Card>

         {/* Efficiency & Conversion Chart */}
         <Card className="lg:col-span-2 p-8 border-slate-100 bg-white rounded-[3rem] shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                     <Activity size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight leading-none mb-1">Booking Conversion</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Engagement vs Final Reserve</p>
                  </div>
               </div>
               <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full">Real-time Pulse</Badge>
            </div>
            
            <div className="flex-1 flex items-center gap-8 px-2">
               <div className="w-32 h-32 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={[
                              { name: 'Converted', value: 68, color: '#005CAF' },
                              { name: 'Dropped', value: 32, color: '#F8FAFC' },
                           ]}
                           innerRadius={35}
                           outerRadius={55}
                           paddingAngle={4}
                           dataKey="value"
                        >
                           <Cell fill="#005CAF" />
                           <Cell fill="#F1F5F9" />
                        </Pie>
                     </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-xl font-black text-slate-900">68%</span>
                  </div>
               </div>
               
               <div className="flex flex-col gap-4 flex-1">
                  <div className="space-y-4">
                      <div className="w-full">
                         <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest text-slate-500">
                             <span>Search Velocity</span>
                             <span className="text-slate-900">High</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} className="h-full bg-blue-500 rounded-full" />
                         </div>
                      </div>
                      <div className="w-full">
                         <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest text-slate-400">
                             <span>Detail View Intent</span>
                             <span className="text-slate-900">42% Dropoff</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "58%" }} className="h-full bg-amber-500 rounded-full" />
                         </div>
                      </div>
                      <div className="w-full">
                         <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-widest text-slate-400">
                             <span>Checkout Efficiency</span>
                             <span className="text-slate-900">92%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} className="h-full bg-emerald-500 rounded-full" />
                         </div>
                      </div>
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-slate-900 rounded-2xl flex items-center justify-between group">
               <div className="flex items-center gap-3">
                  <Zap size={14} className="text-amber-400 hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">Optimized Protocol Suggested</p>
               </div>
               <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">Engage Auto-Sync</button>
            </div>
         </Card>
      </div>

      <RevenueOptimizationEngine />

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-lg font-black text-slate-900">Revenue Analysis</h3>
                 <p className="text-xs font-bold text-slate-500">Weekly tracking of passive parking income.</p>
              </div>
              <Badge variant="blue">LAST 7 DAYS</Badge>
           </div>
           
           <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={weeklyEarningsData}>
                    <defs>
                       <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#005CAF" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#005CAF" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '12px', padding: '12px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#64748B', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#005CAF" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
           
           <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <p className="text-xs font-bold text-emerald-800 flex items-center gap-2">
                 <Zap size={14} className="fill-emerald-800" />
                 “You earned RM48 while away at work today. Your SS15 spot was fully booked.”
              </p>
           </div>
        </Card>

        <Card className="p-6 flex flex-col gap-6">
           <h3 className="text-lg font-black text-slate-900">Occupancy</h3>
           <div className="h-48 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={occupancyData}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {occupancyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-black text-slate-900">78%</span>
                 <span className="text-[10px] font-bold text-slate-400">ACTIVE</span>
              </div>
           </div>
           
           <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-xs font-bold text-slate-600">Total Bookings</span>
                 </div>
                 <span className="text-sm font-black text-slate-900">142</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                    <span className="text-xs font-bold text-slate-600">Repeat Guests</span>
                 </div>
                 <span className="text-sm font-black text-slate-900">32%</span>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    <span className="text-xs font-bold text-slate-600">Trust Score</span>
                 </div>
                 <span className="text-sm font-black text-slate-900">9.8</span>
              </div>
           </div>

           <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Booking Source</h4>
              <div className="h-32">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingSourceData} layout="vertical">
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 10, fontWeight: 700}} width={70} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{display: 'none'}} />
                       <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                          {bookingSourceData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </Card>
      </div>

      {/* Arrival Predictions */}
      <div>
         <SectionHeader title="Expected Arrivals Today" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {[
              { guest: 'Tan Boon H.', time: '15:30', plate: 'BQA 7701', vehicle: 'Proton X50', spot: 'Bay A' },
              { guest: 'Nurul I.', time: '17:00', plate: 'WXY 4921', vehicle: 'Perodua Myvi', spot: 'Driveway' },
              { guest: 'Khairy J.', time: '19:45', plate: 'JTK 3058', vehicle: 'Toyota Vios', spot: 'Bay A' },
            ].map((arrival, i) => (
              <Card key={i} className="p-4 border-slate-200 border-l-4 border-l-primary">
                 <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                          <User size={20} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-800">{arrival.guest}</h4>
                          <Badge variant="blue" className="text-[9px] mt-1">{arrival.plate}</Badge>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-primary">{arrival.time}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase">EXPECTED</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{arrival.vehicle}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{arrival.spot}</span>
                 </div>
              </Card>
            ))}
         </div>
      </div>
    </div>
  );
};

const ListingsTab = () => {
  const { hostListings = [], addListing, updateListing, deleteListing } = useData();
  const { addToast } = useToastStore();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentListing, setCurrentListing] = useState<ParkingListing | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ParkingListing>>({
    title: "",
    address: "",
    neighborhood: "Subang Jaya",
    pricePerHour: 5,
    propertyType: "Terrace Driveway",
    features: ["CCTV", "Gated"],
    heightRestriction: "No Limit",
    description: "",
    images: ["https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800"]
  });

  const handleSaveListing = () => {
    if (!formData.title || !formData.address) {
      addToast("Required fields missing", "error");
      return;
    }

    if (showAddModal) {
      const newListing: ParkingListing = {
        ...formData,
        id: `listing-${Date.now()}`,
        hostId: 'host-1',
        rating: 5.0,
        reviewCount: 0,
        isAvailable: true,
        lprEnabled: true,
        tngAccepted: true,
        features: formData.features || [],
        suitability: formData.suitability || ["Compact", "Sedan", "SUV"],
        images: formData.images || [],
        lat: 3.1390 + (Math.random() - 0.5) * 0.01,
        lng: 101.6869 + (Math.random() - 0.5) * 0.01,
        latitude: 3.1390 + (Math.random() - 0.5) * 0.01,
        longitude: 101.6869 + (Math.random() - 0.5) * 0.01,
        confidenceScore: 9.0,
        confidenceBreakdown: {
          hostReliability: 9.5,
          arrivalEase: 8.5,
          navigationClarity: 9.0,
          safetyTrust: 9.0,
        },
        arrivalProtocols: {
          previewImages: {
            entrance: formData.images?.[0] || "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800",
            bay: formData.images?.[0] || "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800",
            landmark: formData.images?.[0] || "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800",
          },
          landmarkGuidance: "Main road entrance",
          accessType: "Open Driveway",
          easeRating: "Easy",
          specificInstructions: ["Park in the designated area"],
        },
        demandState: {
          level: "Medium",
          trend: "Stable",
          occupancyForecast: 0.5,
          peakPricingActive: false,
        }
      } as ParkingListing;
      
      addListing(newListing);
      addToast("Bay successfully registered in network", "success");
    } else if (showEditModal && currentListing) {
      updateListing(currentListing.id, formData);
      addToast("Listing intelligence updated", "success");
    }

    setShowAddModal(false);
    setShowEditModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      neighborhood: "Subang Jaya",
      pricePerHour: 5,
      propertyType: "Terrace Driveway",
      features: ["CCTV", "Gated"],
      heightRestriction: "No Limit",
      description: "",
      images: ["https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800"]
    });
  };

  const openEdit = (listing: ParkingListing) => {
    setCurrentListing(listing);
    setFormData(listing);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently remove this bay from the network? All active bookings will be notified.")) {
      deleteListing(id);
      addToast("Bay decommissioned", "info");
    }
  };

  const toggleFeature = (feature: string) => {
    const current = formData.features || [];
    if (current.includes(feature)) {
      setFormData({ ...formData, features: current.filter(f => f !== feature) });
    } else {
      setFormData({ ...formData, features: [...current, feature] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-xl font-black text-slate-900 tracking-tight">Listing Management</h2>
         <Button onClick={() => setShowAddModal(true)} className="rounded-2xl gap-2 font-black shadow-lg h-12 px-6">
            <Plus size={18} /> Add New Spot
         </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {hostListings.map(listing => (
           <Card key={listing.id} noPadding className="overflow-hidden border-slate-200 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
              <div className="relative h-48 overflow-hidden">
                 <img src={listing.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="spot" />
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                       onClick={() => {
                          updateListing(listing.id, { isAvailable: !listing.isAvailable });
                          addToast(`Bay is now ${!listing.isAvailable ? 'receiving traffic' : 'offline'}`, "info");
                       }}
                       className={`${listing.isAvailable ? 'bg-emerald-500' : 'bg-slate-400'} text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg transition-colors`}
                    >
                       <Eye size={10} /> {listing.isAvailable ? 'Active' : 'Hidden'}
                    </button>
                    <div className="bg-slate-900/40 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1 shadow-lg">
                       <Zap size={10} /> AI SCAN PRO
                    </div>
                 </div>
              </div>
              <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{listing.propertyType}</p>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1">{listing.title}</h3>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1">
                           <MapPin size={12} className="text-primary" /> {listing.neighborhood}
                        </p>
                    </div>
                    <div className="text-right bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100 shadow-sm">
                       <p className="text-lg font-black text-primary leading-none">RM {listing.pricePerHour.toFixed(2)}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">per hour</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center italic border border-slate-100">
                       <div className="text-amber-500 mb-1"><Star size={16} className="fill-amber-500" /></div>
                       <p className="text-sm font-black text-slate-800">{listing.rating}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Rating</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center italic border border-slate-100">
                       <div className="text-blue-500 mb-1"><Clock size={16} /></div>
                       <p className="text-sm font-black text-slate-800">86%</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Occupancy</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center italic border border-slate-100">
                       <div className="text-emerald-500 mb-1"><DollarSign size={16} /></div>
                       <p className="text-sm font-black text-slate-800">RM {listing.hostEarningsThisMonth?.toLocaleString() || 0}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Monthly</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center text-center italic border border-slate-100">
                       <div className="text-primary mb-1"><Activity size={16} /></div>
                       <p className="text-sm font-black text-slate-800">{listing.totalBookingsCount || 12}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Bookings</p>
                    </div>
                 </div>

                 <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-sm font-black text-slate-800">Instant Booking</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Allow drivers to book without approval</p>
                       </div>
                       <button 
                         onClick={() => {
                            updateListing(listing.id, { tngAccepted: !listing.tngAccepted });
                            addToast(`Instant booking ${!listing.tngAccepted ? 'enabled' : 'disabled'}`, "info");
                         }}
                         className={`w-10 h-6 ${listing.tngAccepted ? 'bg-primary' : 'bg-slate-200'} rounded-full relative transition-colors`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${listing.tngAccepted ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                       <div>
                          <p className="text-sm font-black text-slate-800">AI Check-In (Scanner)</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Automate gate check-in via plate recognition</p>
                       </div>
                       <button 
                         onClick={() => {
                            updateListing(listing.id, { lprEnabled: !listing.lprEnabled });
                            addToast(`AI Scanning ${!listing.lprEnabled ? 'engaged' : 'paused'}`, "info");
                         }}
                         className={`w-10 h-6 ${listing.lprEnabled ? 'bg-primary' : 'bg-slate-200'} rounded-full relative transition-colors`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${listing.lprEnabled ? 'right-1' : 'left-1'}`} />
                        </button>
                    </div>
                 </div>

                 <div className="flex gap-2 mt-8">
                    <Button onClick={() => openEdit(listing)} variant="secondary" className="flex-1 rounded-2xl h-12 border-slate-200 font-black flex gap-2">
                       <Edit2 size={16} /> Edit Details
                    </Button>
                    <Button 
                      onClick={() => handleDelete(listing.id)}
                      variant="secondary" 
                      className="rounded-2xl h-12 border-slate-200 font-black aspect-square p-0 flex items-center justify-center text-rose-500 hover:bg-rose-50"
                    >
                       <Trash2 size={18} />
                    </Button>
                 </div>
              </div>
           </Card>
         ))}
      </div>

      {/* Add/Edit Modal */}
      <Modal 
        isOpen={showAddModal || showEditModal} 
        onClose={() => {setShowAddModal(false); setShowEditModal(false);}} 
        title={showAddModal ? "Register New Spot" : "Configure Intelligence"}
      >
        <div className="space-y-6">
           <Input 
             label="Spot Title" 
             placeholder="e.g. Subang Jaya Terrace Bay" 
             value={formData.title}
             onChange={(e) => setFormData({...formData, title: e.target.value})}
           />
           <Input 
             label="Full Address" 
             placeholder="Include street name and unit number" 
             value={formData.address}
             onChange={(e) => setFormData({...formData, address: e.target.value})}
           />
           
           <div className="grid grid-cols-2 gap-4">
              <Select 
                label="Property Type"
                options={["Terrace Driveway", "Gated Community Lot", "Underground Basement", "Private Yard"]}
                value={formData.propertyType || ""}
                onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
              />
              <Input 
                label="Price (RM/hr)" 
                type="number"
                value={formData.pricePerHour?.toString()}
                onChange={(e) => setFormData({...formData, pricePerHour: parseFloat(e.target.value)})}
              />
           </div>

           <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Amenities & Features</label>
              <div className="flex flex-wrap gap-2">
                 {["CCTV", "Gated", "EV Charging", "Covered", "24/7 Access", "Host Present"].map(f => (
                    <button
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        formData.features?.includes(f) ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                       {f}
                    </button>
                 ))}
              </div>
           </div>

           <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Instructions for Drivers</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-5 py-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] resize-none italic"
                  placeholder="Tell drivers how to open the gate or where specifically to park..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
            </div>

            <Button onClick={handleSaveListing} className="w-full h-14 rounded-2xl font-black">
               {showAddModal ? "Register Bay" : "Save Changes"}
            </Button>
        </div>
      </Modal>
    </div>
  );
};

const ActivityTab = () => {
  const { scanLogs = [], bookings = [] } = useData();

  // Combine and format logs for display
  const combinedLogs = useMemo(() => {
    // Start with mock logs for base data, but prepend real scan logs
    const mockMapped = activityLogs.map(l => ({ ...l, id: `mock-${l.id}` }));
    
    const realMapped = scanLogs.map(log => {
      return {
        id: log.id,
        type: log.action === 'ENTRY' ? 'ARRIVAL' : 'SCAN',
        guest: log.plateNumber === 'VCC 8122' ? 'Lim Wei Keat' : 'Guest Driver',
        plate: log.plateNumber,
        time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: log.action === 'REJECTED' ? 'REJECTED' : 'SUCCESS'
      };
    });

    return [...realMapped, ...mockMapped].slice(0, 10);
  }, [scanLogs, bookings]);

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
             <div className="flex items-center gap-4 p-6 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group h-full">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Activity size={120} />
                </div>
                <div className="relative z-10">
                   <h2 className="text-xl font-black uppercase tracking-tighter">Live Monitor</h2>
                   <p className="text-xs font-bold text-slate-500">Real-time status of your parking spots.</p>
                   <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1.5 flex gap-1.5 items-center">
                         <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                         AI SCANNER: ACTIVE
                      </Badge>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Sessions</span>
                         <span className="text-xs font-black text-white">{scanLogs.filter(l => l.action === 'ENTRY').length}</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-2">
             <Card className="bg-white p-6 border-slate-100 rounded-[2.5rem] shadow-sm flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4">
                   <SectionHeader title="Network Intelligence Feed" />
                   <Badge variant="blue" className="animate-pulse">LIVE ACTIVITY</Badge>
                </div>
                <div className="flex-1 overflow-hidden">
                   <CommandTimeline variant="minimal" maxEvents={12} className="h-full px-0 border-none bg-transparent shadow-none" />
                </div>
             </Card>
          </div>
       </div>

       <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-base font-black text-slate-800">Security Insights</h3>
             <Badge variant="blue">LPR PRO</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                   <span className="text-slate-500">AI Logic Accuracy</span>
                   <span className="text-emerald-500">99.2%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[99%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">“AI check-in reduced manual resident verification by 86% this month.”</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                   <p className="text-xl font-black text-slate-800">342</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase">Correct Scans</p>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
                   <p className="text-xl font-black text-red-500">2</p>
                   <p className="text-[8px] font-bold text-slate-400 uppercase">Flagged Attempts</p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const PayoutsTab = () => {
  const { walletBalance, transactions, withdrawWallet } = useData();
  const { addToast } = useToastStore();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [bank, setBank] = useState("Maybank");
  const [amount, setAmount] = useState("");

  const handleWithdraw = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      addToast("Enter valid amount", "error");
      return;
    }
    if (val > walletBalance) {
      addToast("Insufficient network earnings", "error");
      return;
    }

    withdrawWallet(val, bank, "MY8899221100");
    addToast("Withdrawal protocol initiated", "success");
    setShowWithdraw(false);
    setAmount("");
  };

  const payoutHistory = transactions.filter(t => t.type === 'WITHDRAWAL');

  return (
    <div className="space-y-8">
       {/* Payout Card */}
       <Card className="bg-black text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group border-none">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all duration-700">
             <Wallet size={180} />
          </div>
          <div className="relative z-10">
             <div className="flex justify-between items-start mb-10">
                <div>
                   <p className="text-white text-[10px] font-black uppercase tracking-widest mb-1">Secure Malaysian Network Wallet</p>
                   <h2 className="text-5xl font-black tracking-tighter">RM {walletBalance.toFixed(2)}</h2>
                </div>
                <Badge className="bg-emerald-500 text-white border-none py-1.5 px-3 uppercase text-[10px] font-black">READY</Badge>
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowWithdraw(true)}
                  className="font-black h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 min-w-[200px]"
                >
                  Withdraw to Bank
                </Button>
                <div className="flex flex-col justify-center">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">Network Security</p>
                   <p className="text-sm font-bold text-white/80 italic">Verified Malaysian Account</p>
                </div>
             </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 overflow-hidden">
             <motion.div 
                animate={{ left: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 w-1/3 h-full bg-primary/40 blur-sm" 
             />
          </div>
       </Card>

       {/* Payout History */}
       <div className="space-y-4">
          <SectionHeader title="Payout History" />
          <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
             {payoutHistory.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                        <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     {payoutHistory.map((payout, i) => (
                        <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-5">
                              <span className="text-sm font-black text-slate-800">{payout.id.toUpperCase().replace('TRANS-', 'WD-')}</span>
                           </td>
                           <td className="px-6 py-5">
                              <span className="text-[11px] font-bold text-slate-500">{new Date(payout.date).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    <Building size={12} />
                                 </div>
                                 <span className="text-xs font-bold text-slate-600">{payout.description}</span>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right">
                              <div className="flex flex-col items-end">
                                 <span className="text-sm font-black text-slate-900">RM {payout?.amount?.toFixed(2)}</span>
                                 <Badge variant={payout?.status === 'COMPLETED' ? 'success' : 'slate'} className="text-[8px] uppercase">{payout?.status}</Badge>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             ) : (
                <div className="p-12 text-center flex flex-col items-center gap-4">
                   <div className="w-16 h-16 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-300">
                      <Wallet size={32} />
                   </div>
                   <p className="text-sm font-bold text-slate-400 italic">No withdrawal history found.</p>
                </div>
             )}
          </div>
       </div>

       {/* Monthly Trends */}
       <div>
          <SectionHeader title="Network Growth Trend" />
          <Card className="h-64 mt-4 p-6 bg-white border-slate-100 shadow-sm rounded-[2.5rem]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                   <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} dy={10} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 700}} />
                   <Tooltip 
                      cursor={{fill: '#F8FAFC'}}
                      contentStyle={{ backgroundColor: '#0F172A', border: 'none', borderRadius: '16px', padding: '16px' }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                      labelStyle={{ color: '#64748B', fontSize: '10px', marginBottom: '4px', fontWeight: 'bold' }}
                    />
                   <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
                      {monthlyRevenueData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index === monthlyRevenueData.length - 1 ? '#005CAF' : '#E2E8F0'} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </Card>
       </div>

       {/* Withdraw Modal */}
       <Modal isOpen={showWithdraw} onClose={() => setShowWithdraw(false)} title="Withdraw Earnings">
          <div className="space-y-6">
             <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Available for Payout</p>
                <p className="text-3xl font-black tracking-tighter">RM {walletBalance.toFixed(2)}</p>
             </div>

             <Select 
               label="Recipient Bank"
               options={["Maybank", "CIMB Bank", "Public Bank", "RHB Bank", "Hong Leong Bank", "AmBank", "UOB Bank"]}
               value={bank}
               onChange={(e) => setBank(e.target.value)}
             />

             <Input 
               label="Amount (RM)" 
               type="number"
               placeholder="0.00"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
             />

             <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                <Shield size={20} className="text-primary" />
                <p className="text-[10px] font-bold text-slate-600 italic">
                   Withdrawals to verified Malaysian banks typically take 1-2 business days.
                </p>
             </div>

             <Button onClick={handleWithdraw} className="w-full h-14 rounded-2xl font-black">
                Execute Withdrawal
             </Button>
          </div>
       </Modal>
    </div>
  );
};

