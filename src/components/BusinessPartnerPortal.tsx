import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Plus, 
  Pause, 
  Play, 
  Trash2, 
  Edit3, 
  Settings, 
  ArrowUpRight,
  Eye,
  MousePointer2,
  CheckCircle2,
  Calendar,
  DollarSign,
  Briefcase,
  LayoutDashboard,
  Megaphone,
  PieChart,
  PlusCircle,
  X,
  CreditCard,
  MapPin,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { Card, Badge, Button, Input } from './ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const BusinessPartnerPortal = () => {
  const { partners, campaigns, addCampaign, updateCampaign, deleteCampaign } = useData();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'campaigns' | 'analytics' | 'settings'>('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // For demo purposes, we assume we are managing "Pavilion Coffee Lounge" (p1)
  const myBusiness = partners.find(p => p.id === 'p1') || partners[0];
  const myCampaigns = campaigns.filter(c => c.businessId === myBusiness?.id);

  const stats = useMemo(() => {
    const totalViews = myCampaigns.reduce((acc, c) => acc + c.analytics.views, 0);
    const totalClicks = myCampaigns.reduce((acc, c) => acc + c.analytics.clicks, 0);
    const totalConversions = myCampaigns.reduce((acc, c) => acc + c.analytics.conversions, 0);
    const ctr = totalViews > 0 ? (totalClicks / totalViews * 100).toFixed(1) : 0;
    
    return [
      { label: 'Total Reach', value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500', trend: '+12%' },
      { label: 'Engagements', value: totalClicks.toLocaleString(), icon: MousePointer2, color: 'text-emerald-500', trend: '+8%' },
      { label: 'Conversions', value: totalConversions.toLocaleString(), icon: CheckCircle2, color: 'text-primary', trend: '+15%' },
      { label: 'Avg CTR', value: `${ctr}%`, icon: Target, color: 'text-amber-500', trend: '+0.4%' },
    ];
  }, [myCampaigns]);

  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    type: 'BANNER' as const,
    discountValue: '',
    budget: 1000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    targetRadius: 1
  });

  const handleCreateCampaign = () => {
    addCampaign({
      businessId: myBusiness.id,
      ...newCampaign,
      status: 'ACTIVE',
      startDate: new Date(newCampaign.startDate).toISOString(),
      endDate: new Date(newCampaign.endDate).toISOString(),
    });
    setShowCreateModal(false);
    setNewCampaign({
       title: '',
       description: '',
       type: 'BANNER',
       discountValue: '',
       budget: 1000,
       startDate: new Date().toISOString().split('T')[0],
       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
       targetRadius: 1
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white overflow-hidden border border-slate-800">
                <img src={myBusiness?.logo} className="w-full h-full object-cover" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 leading-tight tracking-tight italic uppercase">Partner Portal</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{myBusiness?.name}</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="ghost" className="rounded-full w-10 h-10 p-0 text-slate-400">
                <Settings size={20} />
             </Button>
             <div className="h-8 w-px bg-slate-200 mx-2" />
             <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Live Campaign Feed</span>
             </div>
          </div>
        </div>
        
        {/* Nav Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-12">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
            { id: 'analytics', label: 'Insights', icon: BarChart3 },
            { id: 'settings', label: 'Partnership', icon: Briefcase },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 h-full border-b-2 transition-all px-1 ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {StatsGrid(stats)}
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Main Chart */}
                 <Card className="lg:col-span-2 p-8 border-slate-200 shadow-sm rounded-[2rem]">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                          <h3 className="text-lg font-black text-slate-800 tracking-tight italic">Ecosystem Engagement</h3>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global conversion telemetry (Last 30 days)</p>
                       </div>
                       <div className="flex items-center gap-2">
                          <Badge variant="outline" className="rounded-full px-3 py-1 bg-emerald-50 text-emerald-600 border-emerald-100 font-black italic text-[10px]">
                             +18.5% Performance
                          </Badge>
                       </div>
                    </div>
                    <div className="h-80 w-full mb-6">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                             <defs>
                                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                             <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                             <RechartsTooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                             />
                             <Area type="monotone" dataKey="engagement" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorEngagement)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                             <TrendingUp size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-800 italic">AI Recommendation Engine</p>
                             <p className="text-[10px] font-bold text-slate-500">Peak performance detected during Bukit Bintang congestion periods.</p>
                          </div>
                       </div>
                       <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary italic">Detail View</Button>
                    </div>
                 </Card>

                 {/* Sidebar Widgets */}
                 <div className="space-y-6">
                    <Card className="p-6 border-slate-200 shadow-sm rounded-[2rem] bg-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                           <Target size={160} />
                        </div>
                        <div className="relative z-10 space-y-4">
                           <div className="flex items-center gap-2 text-primary">
                              <Zap size={16} className="fill-primary" />
                              <h4 className="text-[10px] font-black uppercase tracking-widest leading-none">AI Strategic Insight</h4>
                           </div>
                           <p className="text-sm font-black tracking-tight italic">ParkLuar AI predicts a 24% increase in user traffic near Pavilion KL this weekend.</p>
                           <p className="text-[10px] font-medium text-white/50 leading-relaxed italic">
                              "Recommendation: Increase banner frequency by 1.5x on Saturday between 2PM - 6PM to capture surging demand."
                           </p>
                           <Button size="sm" className="w-full bg-primary text-white h-10 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl border-none">
                              Apply Auto-Optimization
                           </Button>
                        </div>
                    </Card>

                    <Card className="p-6 border-slate-200 shadow-sm rounded-[2rem]">
                       <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest italic mb-6">Active Campaigns</h4>
                       <div className="space-y-4">
                          {myCampaigns.map(c => (
                            <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
                               <div className="flex justify-between items-start mb-3">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.type === 'COUPON' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {c.type === 'COUPON' ? <CreditCard size={16} /> : <ImageIcon size={16} />}
                                     </div>
                                     <h5 className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">{c.title}</h5>
                                  </div>
                                  <Badge variant={c.status === 'ACTIVE' ? 'primary' : 'slate'} className="text-[8px] px-1.5 py-0">
                                     {c.status}
                                  </Badge>
                               </div>
                               <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
                                  <motion.div 
                                    className="bg-primary h-full rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(c.spent / c.budget) * 100}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                  />
                               </div>
                               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                                  <span>Budget Usage</span>
                                  <span className="text-slate-600">RM {c.spent} / RM {c.budget}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                       <Button 
                         onClick={() => setActiveTab('campaigns')}
                         className="w-full mt-6 h-12 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest italic"
                       >
                          Manage Campaigns
                       </Button>
                    </Card>

                    <Card className="p-6 bg-slate-900 border-slate-800 shadow-xl rounded-[2rem]">
                       <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                             <DollarSign size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Revenue Impact</p>
                             <p className="text-lg font-black text-white italic">RM 24,150.00</p>
                          </div>
                       </div>
                       <p className="text-[10px] font-bold text-white/60 leading-relaxed mb-6 italic">
                          Calculated direct revenue generated through coupons and deals via the ParkLuar ecosystem.
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">CPA</p>
                             <p className="text-xs font-black text-white italic">RM 0.85</p>
                          </div>
                          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                             <p className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">ROAS</p>
                             <p className="text-xs font-black text-white italic">12.4x</p>
                          </div>
                       </div>
                    </Card>
                 </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'campaigns' && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="flex justify-between items-end mb-4">
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Campaign Manager</h2>
                     <p className="text-sm font-bold text-slate-500 italic">Deploy high-impact location-based advertisements.</p>
                  </div>
                  <Button 
                    onClick={() => setShowCreateModal(true)}
                    className="h-14 bg-primary text-white hover:bg-primary/90 px-8 rounded-full font-black text-sm italic shadow-xl shadow-primary/20 flex items-center gap-3"
                  >
                     <PlusCircle size={20} />
                     Create New Campaign
                  </Button>
               </div>

               <div className="grid grid-cols-1 gap-6">
                  {myCampaigns.map(c => (
                    <Card key={c.id} className="p-0 border-slate-200 shadow-sm rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[220px]">
                       <div className="md:w-64 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10 pointer-events-none">
                             <div className="w-full h-full" style={{ backgroundImage: `url(${myBusiness?.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                          </div>
                          <div className="relative z-10 text-center">
                             <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl ${c.type === 'COUPON' ? 'bg-amber-500 text-white' : 'bg-blue-600 text-white'}`}>
                                {c.type === 'COUPON' ? <CreditCard size={32} /> : <ImageIcon size={32} />}
                             </div>
                             <Badge className="rounded-full px-3 py-1 font-black italic">{c.type}</Badge>
                          </div>
                       </div>
                       
                       <div className="flex-1 p-8 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xl font-black text-slate-900 italic mb-2">{c.title}</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed max-w-lg italic">{c.description}</p>
                             </div>
                             <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-10 h-10 p-0 rounded-full text-slate-400 hover:text-slate-800"
                                  onClick={() => updateCampaign(c.id, { status: c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE' })}
                                >
                                   {c.status === 'ACTIVE' ? <Pause size={18} /> : <Play size={18} />}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="w-10 h-10 p-0 rounded-full text-slate-400 hover:text-red-500"
                                  onClick={() => deleteCampaign(c.id)}
                                >
                                   <Trash2 size={18} />
                                </Button>
                                <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full text-slate-400 hover:text-primary">
                                   <ArrowUpRight size={18} />
                                </Button>
                             </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-100">
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget Efficiency</p>
                                <div className="flex items-baseline gap-1">
                                   <span className="text-lg font-black text-slate-800 italic">{((c.spent / c.budget) * 100).toFixed(1)}%</span>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Radius</p>
                                <div className="flex items-baseline gap-1">
                                   <span className="text-lg font-black text-slate-800 italic">{c.targetRadius}km</span>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clicks</p>
                                <div className="flex items-baseline gap-1">
                                   <span className="text-lg font-black text-slate-800 italic">{c.analytics.clicks}</span>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversions</p>
                                <div className="flex items-baseline gap-1">
                                   <span className="text-lg font-black text-primary italic">{c.analytics.conversions}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </Card>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
               <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem]">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <PieChart size={24} />
                     </div>
                     <div>
                        <h2 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">Market Conversion Heatmap</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cross-segment user interaction analysis</p>
                     </div>
                  </div>
                  
                  <div className="h-96 w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                           <RechartsTooltip cursor={{ fill: '#f8fafc' }} />
                           <Bar dataKey="conversions" fill="#3b82f6" radius={[8, 8, 0, 0]} barSize={40} />
                           <Bar dataKey="claims" fill="#e2e8f0" radius={[8, 8, 0, 0]} barSize={40} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </Card>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem]">
                     <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest italic mb-6">User Demographics</h3>
                     <div className="space-y-6">
                        {[
                          { label: 'PRO Members', value: 65, color: 'bg-primary' },
                          { label: 'Weekly Commuters', value: 25, color: 'bg-blue-300' },
                          { label: 'Tourists', value: 10, color: 'bg-slate-200' },
                        ].map(item => (
                          <div key={item.label}>
                             <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                                <span className="text-slate-600">{item.label}</span>
                                <span className="text-slate-900">{item.value}%</span>
                             </div>
                             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                             </div>
                          </div>
                        ))}
                     </div>
                  </Card>
                  
                  <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-800 shadow-xl rounded-[2.5rem]">
                     <h3 className="text-sm font-black text-white/80 uppercase tracking-widest italic mb-6">Partner Intelligence</h3>
                     <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                           <div className="flex items-center gap-3 mb-2">
                              <BrainCircuit size={18} className="text-primary" />
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Strategy Insight</span>
                           </div>
                           <p className="text-xs font-bold text-white leading-relaxed italic">
                              "Increasing campaign radius to 2.5km during weekend peak hours could boost engagement by 42% based on historical traffic patterns."
                           </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                           <div className="flex items-center gap-3 mb-2">
                              <Target size={18} className="text-emerald-400" />
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">High Impact Zone</span>
                           </div>
                           <p className="text-xs font-bold text-white leading-relaxed italic">
                              "User cluster detected near Pavilion KL Zone B. Recommendation: Deploy flash coupon for next 120 mins."
                           </p>
                        </div>
                     </div>
                  </Card>
               </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
             <motion.div
               key="settings"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="max-w-3xl mx-auto space-y-8"
             >
                <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem]">
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic mb-8">Business Profile</h3>
                   <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8">
                         <div className="flex flex-col items-center gap-4">
                            <div className="w-32 h-32 bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-300 flex items-center justify-center relative group">
                               <img src={myBusiness?.logo} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                                  <ImageIcon size={24} />
                               </div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-slate-400">Business Logo</span>
                         </div>
                         <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                                  <Input defaultValue={myBusiness?.name} className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                               </div>
                               <div className="space-y-1.5">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                  <Input defaultValue={myBusiness?.category} className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                               </div>
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                               <Input defaultValue={myBusiness?.address} className="h-12 rounded-xl bg-slate-50 border-slate-200 font-bold" />
                            </div>
                         </div>
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Description</label>
                         <textarea 
                           className="w-full h-32 rounded-2xl bg-slate-50 border-slate-200 p-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                           defaultValue={myBusiness?.description}
                         />
                      </div>
                      <div className="pt-4 flex gap-4">
                         <Button className="flex-1 bg-primary text-white h-14 rounded-2xl font-black italic shadow-xl shadow-primary/20">Save Profile</Button>
                         <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black italic border-slate-200 text-slate-600">Cancel</Button>
                      </div>
                   </div>
                </Card>

                <Card className="p-8 border-slate-200 shadow-sm rounded-[2.5rem]">
                   <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic mb-8">Partnership Tier</h3>
                   <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
                            <Briefcase size={32} />
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-slate-900 italic">Enterprise Partner</h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active since Jan 2024 • ID: PL-ENT-902</p>
                         </div>
                      </div>
                      <Badge className="bg-primary text-white px-4 py-2 rounded-full font-black italic text-xs">ELITE STATUS</Badge>
                   </div>
                </Card>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-3xl overflow-hidden"
            >
               <div className="bg-slate-900 p-8 flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-white italic tracking-tight uppercase">New Campaign</h3>
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Define your promotion parameters</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20">
                     <X size={20} />
                  </button>
               </div>
               
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Title</label>
                     <Input 
                        placeholder="e.g. Weekend Coffee Rush" 
                        value={newCampaign.title}
                        onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                        className="h-12 rounded-xl" 
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select 
                          className="w-full h-12 rounded-xl bg-slate-50 border-slate-200 px-4 font-bold text-sm appearance-none outline-none focus:ring-2 focus:ring-primary/20"
                          value={newCampaign.type}
                          onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as any })}
                        >
                           <option value="BANNER">Smart Banner</option>
                           <option value="COUPON">Digital Coupon</option>
                           <option value="DEAL">Flash Deal</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                        <Input 
                          placeholder="e.g. 15% OFF" 
                          value={newCampaign.discountValue}
                          onChange={(e) => setNewCampaign({ ...newCampaign, discountValue: e.target.value })}
                        />
                     </div>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                     <textarea 
                        className="w-full h-24 rounded-2xl bg-slate-50 border-slate-200 p-4 font-bold text-sm focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                        placeholder="Describe your offer..."
                        value={newCampaign.description}
                        onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget (RM)</label>
                        <Input 
                          type="number" 
                          value={newCampaign.budget}
                          onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseInt(e.target.value) })}
                        />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Radius (km)</label>
                        <Input 
                          type="number" 
                          value={newCampaign.targetRadius}
                          onChange={(e) => setNewCampaign({ ...newCampaign, targetRadius: parseFloat(e.target.value) })}
                        />
                     </div>
                  </div>
                  
                  <div className="pt-4">
                     <Button 
                       onClick={handleCreateCampaign}
                       disabled={!newCampaign.title}
                       className="w-full h-16 bg-primary text-white hover:bg-primary/90 rounded-2xl font-black text-lg italic shadow-2xl shadow-primary/20"
                     >
                        Launch Campaign
                     </Button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatsGrid = (stats: any[]) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {stats.map((stat, idx) => (
      <Card key={idx} className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow rounded-[2rem]">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-12 h-12 rounded-2xl ${stat.bg || 'bg-slate-50'} flex items-center justify-center ${stat.color}`}>
             <stat.icon size={24} />
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold italic text-[9px] px-2 py-0.5">
             {stat.trend}
          </Badge>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
        <h3 className="text-2xl font-black text-slate-900 italic tracking-tight">{stat.value}</h3>
      </Card>
    ))}
  </div>
);

const chartData = [
  { name: 'Week 1', engagement: 2400 },
  { name: 'Week 2', engagement: 1398 },
  { name: 'Week 3', engagement: 9800 },
  { name: 'Week 4', engagement: 3908 },
  { name: 'Week 5', engagement: 4800 },
  { name: 'Week 6', engagement: 3800 },
  { name: 'Week 7', engagement: 4300 },
];

const barChartData = [
  { name: 'Bukit Bintang', claims: 450, conversions: 320 },
  { name: 'KLCC Area', claims: 890, conversions: 540 },
  { name: 'Bangsar', claims: 120, conversions: 80 },
  { name: 'Mid Valley', claims: 340, conversions: 210 },
  { name: 'Mont Kiara', claims: 210, conversions: 150 },
];

const BrainCircuit = ({ size, className }: { size?: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 5V3a2 2 0 0 1 2-2h1.1a2 2 0 0 1 1.4.6l1.9 1.9a2 2 0 0 1 .6 1.4V6a2 2 0 0 1-2 2h-1.1a2 2 0 0 1-1.4-.6L12.6 5.5A2 2 0 0 0 12 5z" />
    <path d="M12 11h2c1.1 0 2 .9 2 2v1.1c0 .5-.2 1-.6 1.4l-1.9 1.9c-.4.4-.9.6-1.4.6H11c-1.1 0-2-.9-2-2V13c0-1.1.9-2 2-2z" />
    <path d="M9 11v1.1c0 .5-.2 1-.6 1.4l-1.9 1.9C6.1 15.8 5.6 16 5.1 16H4c-1.1 0-2-.9-2-2v-1.1c0-1.1.9-2 2-2h1.1c.5 0 1 .2 1.4.6l1.9 1.9c.4.4.6.9.6 1.4z" />
    <path d="M12 5v14" />
    <path d="M8 11h8" />
  </svg>
);
