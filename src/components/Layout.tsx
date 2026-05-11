import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  User, 
  Users,
  LayoutDashboard, 
  Car, 
  Calendar, 
  CreditCard, 
  Settings, 
  Bell, 
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Zap,
  Globe,
  Cpu,
  Monitor,
  Activity,
  DollarSign,
  Crown,
  ArrowRightLeft,
  Gavel,
  Share2
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import { UserRole } from '../types';
import { Badge, Button } from './ui';

export const Navbar = ({ onOpenNotifications }: { onOpenNotifications?: () => void }) => {
  const { role, setRole } = useRole();

  return (
    <nav className="h-16 md:h-20 sticky top-0 z-[100] bg-white/70 backdrop-blur-3xl border-b border-slate-100/50 px-6 flex items-center justify-between shrink-0 shadow-sm shadow-slate-900/5">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:hidden">
            <div className="w-10 h-10 bg-primary rounded-[1.2rem] flex items-center justify-center font-black text-white italic shadow-lg shadow-primary/20 scale-90">P</div>
            <span className="font-black text-xl tracking-tighter text-slate-950 italic">ParkLuar</span>
        </div>
        
        <div className="hidden md:flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          {[
            { id: UserRole.DRIVER, label: 'DRIVE' },
            { id: UserRole.HOST, label: 'HOST & EARN' },
            { id: UserRole.PARTNER, label: 'PARTNER' },
            { id: UserRole.ADMIN, label: 'ADMIN' }
          ].map((r) => (
            <button 
              key={r.id}
              onClick={() => setRole(r.id)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.1em] transition-all duration-300 ${role === r.id ? 'bg-white shadow-premium text-blue-700' : 'text-blue-900/40 hover:text-blue-700'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5">
         <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-blue-800 uppercase tracking-widest leading-none mb-1">Location</span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-xs font-bold text-blue-950 tracking-tight">Kuala Lumpur Center</span>
            </div>
         </div>
         <div className="h-10 w-[1px] bg-slate-100 hidden sm:block" />
         <Badge className="bg-primary/5 text-primary border-primary/20 text-[9px] px-3 py-1.5 hidden sm:flex items-center gap-2 font-black rounded-full">
            <Globe size={12} className="animate-spin-slow" /> SYSTEM ACTIVE
         </Badge>
         <button 
           onClick={onOpenNotifications}
           className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-50 relative group transition-all"
         >
            <Bell size={20} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white ring-4 ring-rose-500/10" />
         </button>
      </div>
    </nav>
  );
};

export const BottomNav = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { role } = useRole();

  const driverTabs = [
    { id: 'explore', label: 'Explore', icon: Search },
    { id: 'network', label: 'Community', icon: Users },
    { id: 'market', label: 'Market', icon: ArrowRightLeft },
    { id: 'garage', label: 'Garage', icon: Car },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'carpool', label: 'Rides', icon: Share2 },
    { id: 'valet', label: 'Assistance', icon: ShieldCheck },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'wallet', label: 'Wallet', icon: CreditCard },
  ];

  const hostTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'listings', label: 'My Spots', icon: MapPin },
    { id: 'bookings', label: 'Activity', icon: Clock },
    { id: 'wallet', label: 'Earnings', icon: CreditCard },
  ];

  const adminTabs = [
    { id: 'stats', label: 'Statistics', icon: Monitor },
    { id: 'logs', label: 'Activity Logs', icon: Cpu },
  ];

  const partnerTabs = [
    { id: 'partner-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Promotion', icon: Zap },
    { id: 'analytics', label: 'Insights', icon: Activity },
  ];

  const tabs = role === UserRole.DRIVER ? driverTabs : role === UserRole.HOST ? hostTabs : role === UserRole.PARTNER ? partnerTabs : adminTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
       <div className="bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 py-4 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1.5 min-w-[64px]"
            >
              <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110' : 'text-blue-900/40 opacity-60'}`}>
                <Icon size={20} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-700' : 'text-blue-900/40'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) => {
  const { role } = useRole();

  const tabs = role === UserRole.DRIVER ? [
    { id: 'explore', label: 'Find Parking', icon: Globe },
    { id: 'network', label: 'Community', icon: Users },
    { id: 'market', label: 'Marketplace', icon: ArrowRightLeft },
    { id: 'carpool', label: 'Shared Rides', icon: Share2 },
    { id: 'garage', label: 'Car Services', icon: Car },
    { id: 'security', label: 'Security Center', icon: ShieldCheck },
    { id: 'valet', label: 'Parking Assistant', icon: ShieldCheck },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'wallet', label: 'My Wallet', icon: CreditCard },
    { id: 'membership', label: 'Premium', icon: Crown },
  ] : role === UserRole.HOST ? [
    { id: 'dashboard', label: 'Host Dashboard', icon: LayoutDashboard },
    { id: 'listings', label: 'Manage Spots', icon: MapPin },
    { id: 'bookings', label: 'Recent Activity', icon: Clock },
    { id: 'wallet', label: 'Earnings', icon: DollarSign },
  ] : role === UserRole.PARTNER ? [
    { id: 'partner-dashboard', label: 'Partner Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Active Promotions', icon: Zap },
    { id: 'analytics', label: 'Business Insights', icon: Activity },
    { id: 'partner-settings', label: 'Brand Settings', icon: Settings },
  ] : [
    { id: 'stats', label: 'System Overview', icon: Monitor },
    { id: 'logs', label: 'Parking Logs', icon: Cpu },
    { id: 'verifications', label: 'Spot Verification', icon: ShieldCheck },
  ];

  return (
    <div className="hidden md:flex flex-col w-72 h-screen sticky top-0 bg-white border-r border-slate-100">
      <div className="p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-950 rounded-[1.8rem] flex items-center justify-center shadow-premium relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light opacity-50 group-hover:opacity-80 transition-opacity" />
             <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)]" />
             <Zap size={28} className="text-white relative z-10 fill-white" />
          </div>
          <div>
             <h1 className="text-2xl font-black tracking-tighter text-blue-950 italic leading-none uppercase">ParkLuar <span className="text-blue-600 tracking-[-0.1em]">HOME</span></h1>
             <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black text-blue-800 uppercase tracking-[0.2em] font-mono leading-none">SYSTEM ACTIVE</p>
             </div>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-5 space-y-2.5 mt-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4.5 rounded-[2rem] text-xs font-black transition-all duration-300 ${
                isActive ? 'bg-blue-600 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)] scale-[1.03] border-none' : 'text-blue-900/60 hover:bg-blue-50 hover:text-blue-950 border border-transparent'
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${isActive ? 'bg-white/20' : 'bg-blue-50 text-blue-900/40'}`}>
                <Icon size={18} className={isActive ? 'text-white' : ''} />
              </div>
              <span className="tracking-tight uppercase">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Demo Mission Control */}
      <div className="p-6 mt-auto">
         <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-[0_30px_60px_rgba(15,23,42,0.4)] border border-white/5 group">
           <div className="absolute -right-12 -bottom-12 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
              <Activity size={200} className="text-white" />
           </div>
           <div className="relative z-10 flex flex-col gap-6">
               <div className="flex items-center justify-between">
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                   SYSTEM SECURE
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <div className="space-y-5">
                 {[
                   { label: 'Active Spots', value: '1,240', icon: Globe },
                   { label: 'Daily Scans', value: '8.4k', icon: Cpu },
                 ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                       <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 font-mono">
                          <stat.icon size={10} className="text-primary" />
                          {stat.label}
                       </p>
                       <p className="text-3xl font-black tracking-tighter italic">{stat.value}</p>
                    </div>
                 ))}
              </div>
              <Button size="sm" className="w-full bg-white text-slate-950 h-12 rounded-[1.2rem] text-[9px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-200">
                 View Stats
              </Button>
           </div>
         </div>
      </div>
    </div>
  );
};
