import React, { useState, useEffect } from 'react';
import { RoleProvider, useRole } from './context/RoleContext';
import { DataProvider, useData } from './context/DataContext';
import { Navbar, BottomNav, Sidebar } from './components/Layout';
import { ExploreView, BookingsView, ProfileView } from './components/DriverViews';
import { HostDashboard } from './components/HostViews';
import { AdminStats } from './components/AdminViews';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { ParkingSessionAssistant } from './components/ParkingSessionAssistant';
import { CarFinderPanel } from './components/CarFinderPanel';
import { CommandTimeline } from './components/CommandTimeline';
import { IntroScreen } from './components/IntroScreen';
import { BusinessPartnerPortal } from './components/BusinessPartnerPortal';
import { ValetMarketplace } from './components/ValetMarketplace';
import { CommunityNetwork } from './components/CommunityNetwork';
import { ReservationMarketplace } from './components/ReservationMarketplace';
import { VehicleCareHub } from './components/VehicleCareHub';
import { CarpoolSystem } from './components/CarpoolSystem';
import { SecurityCenter } from './components/SecurityCenter';
import { UserRole } from './types';
import { Card, SectionHeader, EmptyState, Badge, Button, Modal, Input, Select, useToastStore, ToastContainer } from './components/ui';
import { Plus, CreditCard, Search, Bell, X, Info, Zap, Landmark, ArrowUpRight, ArrowDownLeft, ReceiptText, ChevronRight, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AppContent = () => {
  const { role } = useRole();
  const { walletBalance, hostEarnings, transactions, topUpWallet, withdrawWallet, activeSession, userSubscription } = useData();
  const { addToast } = useToastStore();
  
  const [activeTab, setActiveTab] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Wallet Interaction State
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("50");
  const [topUpMethod, setTopUpMethod] = useState("Touch 'n Go eWallet");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawBank, setWithdrawBank] = useState("Maybank");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxn, setSuccessTxn] = useState<any>(null);

  // Transaction Detail State
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [txnFilter, setTxnFilter] = useState("All");

  // Set default tab when role changes
  useEffect(() => {
    if (role === UserRole.DRIVER) setActiveTab("explore");
    else if (role === UserRole.HOST) setActiveTab("dashboard");
    else if (role === UserRole.PARTNER) setActiveTab("partner-dashboard");
    else if (role === UserRole.ADMIN) setActiveTab("stats");
  }, [role]);

  const notifications = [
    { id: 1, title: 'Plate Verified', body: 'AI Scanner confirmed VCC 8122 entry at SS15 Subang.', time: '2m ago', type: 'success' },
    { id: 2, title: 'Payout Processed', body: 'RM 850.00 withdrawn to Maybank-XXXX account.', time: '1h ago', type: 'info' },
    { id: 3, title: 'High Demand Alert', body: 'Bangsar South demand is 40% higher than average today.', time: '3h ago', type: 'warning' },
  ];

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast("Please enter a valid amount", "error");
      return;
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      topUpWallet(amount, topUpMethod);
      setIsProcessing(false);
      setSuccessTxn({
        type: 'TOPUP',
        amount,
        method: topUpMethod,
        date: new Date().toLocaleString(),
        id: `TXN-${Math.floor(Math.random() * 1000000)}`
      });
      addToast(`RM ${amount.toFixed(2)} topped up successfully!`, "success");
    }, 2000);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const balance = role === UserRole.HOST ? hostEarnings : walletBalance;
    
    if (isNaN(amount) || amount < 10) {
      addToast("Minimum withdrawal is RM 10.00", "error");
      return;
    }
    if (amount > balance) {
      addToast("Insufficient balance", "error");
      return;
    }
    if (!withdrawAccount) {
      addToast("Please enter account number", "error");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      withdrawWallet(amount, withdrawBank, withdrawAccount);
      setIsProcessing(false);
      setSuccessTxn({
        type: 'WITHDRAW',
        amount,
        bank: withdrawBank,
        account: withdrawAccount,
        date: new Date().toLocaleString(),
        id: `TXN-${Math.floor(Math.random() * 1000000)}`
      });
      addToast(`RM ${amount.toFixed(2)} withdrawal requested`, "success");
    }, 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "explore": return <ExploreView />;
      case "bookings": 
        if (role === UserRole.HOST) return <HostDashboard activeSection="activity" />;
        return <BookingsView />;
      case "dashboard": return <HostDashboard activeSection="overview" />;
      case "valet": return <ValetMarketplace />;
      case "network": return <CommunityNetwork />;
      case "market": return <ReservationMarketplace />;
      case "garage": return <VehicleCareHub />;
      case "carpool": return <CarpoolSystem />;
      case "security": return <SecurityCenter />;
      case "partner-dashboard": return <BusinessPartnerPortal activeSection="dashboard" />;
      case "campaigns": return <BusinessPartnerPortal activeSection="campaigns" />;
      case "analytics": return <BusinessPartnerPortal activeSection="analytics" />;
      case "partner-settings": return <BusinessPartnerPortal activeSection="settings" />;
      case "stats": return <AdminStats />;
      case "logs": return <AdminStats />;
      case "membership": return <SubscriptionPlans />;
      case "profile": return <ProfileView />;
      case "listings": 
        if (role === UserRole.HOST) return <HostDashboard activeSection="listings" />;
        return (
          <div className="flex flex-col gap-6">
            <SectionHeader title="My Parking Listings" actionLabel="Add New" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[1, 2].map(i => (
                 <Card key={i} noPadding className="flex flex-col border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
                   <img src={`https://picsum.photos/seed/list${i}/600/400`} className="h-44 object-cover" />
                   <div className="p-5">
                      <h3 className="font-black text-slate-800 text-lg">SS2 Terrace Driveway</h3>
                      <p className="text-xs font-bold text-slate-500 mb-6 uppercase tracking-widest mt-1">Petaling Jaya, Selangor</p>
                      <div className="flex justify-between items-center">
                        <Badge variant="success">ACTIVE</Badge>
                        <Button size="sm" variant="ghost" className="font-black uppercase text-[10px]">Edit Details</Button>
                      </div>
                   </div>
                 </Card>
               ))}
            </div>
          </div>
        );
      case "wallet": 
        if (role === UserRole.HOST) return <HostDashboard activeSection="payouts" />;
        const currentBalance = role === UserRole.HOST ? hostEarnings : walletBalance;
        const filteredTxns = transactions.filter(t => {
           if (txnFilter === "All") return true;
           if (txnFilter === "Top Up") return t.type === "TOPUP";
           if (txnFilter === "Withdrawal") return t.type === "PAYOUT" && t.amount < 0;
           if (txnFilter === "Booking Payment") return t.type === "PAYMENT";
           return true;
        });

        return (
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-end">
               <SectionHeader title={role === UserRole.HOST ? "Financial Intelligence" : "Financial Hub"} subtitle="Secure Malaysian Network Wallet" />
               <Badge variant="blue" className="mb-2">ENCRYPTED NODE</Badge>
            </div>
            
            {/* Premium Wallet Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-black text-white p-12 rounded-[4.2rem] relative overflow-hidden shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border-none group">
                 <div className="absolute top-0 right-0 p-12 transform translate-x-1/4 -translate-y-1/4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000 rotate-12">
                    <CreditCard size={480} className="text-white" strokeWidth={1} />
                 </div>
                 
                 <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary blur-[120px] rounded-full animate-pulse" />
                 </div>

                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
                    <div className="space-y-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                             <Zap size={20} className="text-primary" />
                          </div>
                          <div>
                             <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Network Liquidity</p>
                             <p className="text-white font-black text-xs">Standard Tier Verified</p>
                          </div>
                       </div>
                       
                       <div className="space-y-1">
                          <h2 className="text-[64px] font-black tracking-tighter text-white leading-none flex items-baseline">
                             <span className="text-xl font-bold text-white/40 mr-4">RM</span>
                             {currentBalance.toFixed(2)}
                          </h2>
                          <div className="flex items-center gap-2 text-emerald-400">
                             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Linked to TNG eWallet & DuitNow</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        onClick={() => setIsTopUpOpen(true)}
                        className="bg-white text-slate-950 hover:bg-slate-100 rounded-[2rem] h-20 px-10 font-black shadow-2xl shrink-0"
                      >
                        Top Up
                      </Button>
                      <Button 
                        onClick={() => {
                          setWithdrawAmount("");
                          setIsWithdrawOpen(true);
                        }}
                        variant="secondary"
                        className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-[2rem] h-20 px-10 font-black backdrop-blur-xl shrink-0"
                      >
                         Withdraw
                      </Button>
                    </div>
                 </div>
              </Card>

              <Card className="bg-white p-8 rounded-[4.5rem] border-slate-100 relative shadow-sm flex flex-col overflow-hidden">
                 <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                       <h3 className="text-xl font-black text-slate-900 tracking-tighter mb-1 italic">Market Insights</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Real-time network yields</p>
                    </div>
                    
                    <div className="flex-1 overflow-hidden min-h-[140px] mb-6">
                       <CommandTimeline variant="minimal" maxEvents={3} className="px-0 border-none bg-transparent shadow-none" />
                    </div>

                    <div className="space-y-2 mt-auto pt-6 border-t border-slate-50">
                       <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <span>Security Status</span>
                          <span className="text-emerald-500">ENCRYPTED</span>
                       </div>
                       <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 w-full px-3 py-2 rounded-2xl border border-emerald-100">
                          <CheckCircle2 size={12} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Malaysian Bank-Grade 256-bit</span>
                       </div>
                    </div>
                 </div>
              </Card>
            </div>

            {/* Activity Hub */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <SectionHeader title="Network Activity" subtitle="Real-time analytics of your node throughput" />
                 <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar">
                    {["All", "Top Up", "Withdrawal"].map(filter => (
                       <button 
                         key={filter}
                         onClick={() => setTxnFilter(filter)}
                         className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${txnFilter === filter ? 'bg-white shadow-md text-primary' : 'text-slate-500 hover:text-slate-800'}`}
                       >
                         {filter}
                       </button>
                    ))}
                 </div>
              </div>
            <div className="flex flex-col gap-4">
               {filteredTxns.length > 0 ? filteredTxns.slice(0, 10).map((txn, i) => (
                 <div 
                   key={txn.id} 
                   onClick={() => setSelectedTxn(txn)}
                   className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
                 >
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${txn.amount > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-blue-50 border-blue-100 text-blue-500'}`}>
                         {txn.type === 'TOPUP' ? <ArrowDownLeft size={24} /> : txn.type === 'PAYMENT' ? <CreditCard size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{txn.type.replace('_', ' ')}</p>
                        <p className="text-base font-black text-slate-800 tracking-tight">{txn.description}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1">{new Date(txn.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <p className={`text-lg font-black ${txn.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                         {txn.amount > 0 ? '+' : ''}RM {Math.abs(txn.amount).toFixed(2)}
                       </p>
                       <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                 </div>
               )) : (
                 <EmptyState 
                   title="No Transaction records" 
                   description="No network activity found for the selected filter." 
                   icon={CreditCard}
                 />
               )}
            </div>
          </div>
        </div>
      );
      default: return (
        <EmptyState 
          title="Under Construction" 
          description="Developing the full network experience for the national competition demo." 
          icon={Search}
          action={<Button onClick={() => setActiveTab(role === UserRole.DRIVER ? "explore" : role === UserRole.HOST ? "dashboard" : "stats")}>Return Home</Button>}
        />
      );
    }
  };

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20 md:pb-0 font-sans">
      <div className="flex flex-1 overflow-hidden h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar onOpenNotifications={() => setShowNotifications(true)} />
          <main className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8">
            <div className="max-w-7xl mx-auto h-full w-full flex flex-col">
               <motion.div
                 key={activeTab + role}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ duration: 0.3 }}
                 className="flex-1 flex flex-col h-full"
               >
                 {renderContent()}
               </motion.div>
            </div>
          </main>
        </div>
      </div>
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <CarFinderPanel />

      {activeSession && activeTab !== 'membership' && <ParkingSessionAssistant />}

      {/* Modals & Layers */}
      <ToastContainer />

      {/* Top Up Modal */}
      <Modal 
        isOpen={isTopUpOpen} 
        onClose={() => {
          setIsTopUpOpen(false);
          setSuccessTxn(null);
        }} 
        title="Network Top Up"
      >
        {successTxn ? (
           <div className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/10">
                 <Zap size={40} className="fill-emerald-500" />
              </div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Success!</h4>
              <p className="text-slate-500 text-sm font-medium mb-8">Funds added to your ParkLuar network wallet.</p>
              
              <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left border border-slate-100 italic">
                 <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-xs font-black text-slate-800">{successTxn.id}</span>
                 </div>
                 <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source</span>
                    <span className="text-xs font-black text-slate-800">{successTxn.method}</span>
                 </div>
                 <div className="flex justify-between pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                    <span className="text-lg font-black text-emerald-500">RM {successTxn.amount.toFixed(2)}</span>
                 </div>
              </div>
              
              <Button onClick={() => setIsTopUpOpen(false)} className="w-full h-14 rounded-2xl font-black">
                 Return to Hub
              </Button>
           </div>
        ) : (
           <div className="space-y-8">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
                 <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Available Funds</p>
                 <p className="text-4xl font-black tracking-tighter">RM {walletBalance.toFixed(2)}</p>
              </div>

              <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Select Amount</label>
                 <div className="grid grid-cols-2 gap-3">
                    {["10", "20", "50", "100"].map(amt => (
                       <button 
                          key={amt}
                          onClick={() => setTopUpAmount(amt)}
                          className={`py-4 rounded-2xl font-black text-lg transition-all border ${topUpAmount === amt ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-slate-50 border-slate-100 text-slate-800 hover:border-primary/30'}`}
                       >
                          RM {amt}
                       </button>
                    ))}
                    <div className="col-span-2">
                       <Input 
                          placeholder="Enter custom amount (RM)" 
                          value={topUpAmount}
                          onChange={(e) => setTopUpAmount(e.target.value)}
                       />
                    </div>
                 </div>
              </div>

              <Select 
                 label="Payment Source" 
                 value={topUpMethod}
                 onChange={(e) => setTopUpMethod(e.target.value)}
                 options={[
                    { label: "Touch 'n Go eWallet", value: "Touch 'n Go eWallet" },
                    { label: "FPX Online Banking", value: "FPX Online Banking" },
                    { label: "GrabPay", value: "GrabPay" },
                    { label: "Visa / Mastercard", value: "Card" }
                 ]}
              />

              <Button 
                 onClick={handleTopUp} 
                 isLoading={isProcessing}
                 className="w-full h-16 rounded-2xl font-black text-base shadow-xl shadow-primary/20"
              >
                 Authorize Payment
              </Button>
           </div>
        )}
      </Modal>

      {/* Withdrawal Modal */}
      <Modal 
         isOpen={isWithdrawOpen} 
         onClose={() => {
            setIsWithdrawOpen(false);
            setSuccessTxn(null);
         }} 
         title="Secure Withdrawal"
      >
         {successTxn ? (
            <div className="text-center py-6">
               <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/10">
                  <Landmark size={40} />
               </div>
               <h4 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Request Shared</h4>
               <p className="text-slate-500 text-sm font-medium mb-8">Funds are being transferred to your bank.</p>
               
               <div className="bg-slate-50 rounded-3xl p-6 mb-8 text-left border border-slate-100">
                  <div className="flex justify-between mb-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank</span>
                     <span className="text-xs font-black text-slate-800">{successTxn.bank}</span>
                  </div>
                  <div className="flex justify-between mb-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account</span>
                     <span className="text-xs font-black text-slate-800">{successTxn.account.replace(/.(?=.{4})/g, '*')}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                     <span className="text-lg font-black text-slate-900">RM {successTxn.amount.toFixed(2)}</span>
                  </div>
               </div>
               
               <Button onClick={() => setIsWithdrawOpen(false)} className="w-full h-14 rounded-2xl font-black">
                  Return to Hub
               </Button>
            </div>
         ) : (
            <div className="space-y-6">
               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Available for Withdrawal</p>
                  <p className="text-3xl font-black tracking-tighter text-slate-900">RM {(role === UserRole.HOST ? hostEarnings : walletBalance).toFixed(2)}</p>
               </div>

               <Input 
                  label="Withdrawal Amount (Min RM 10)" 
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  type="number"
               />

               <Select 
                  label="Destination Bank" 
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  options={[
                     { label: "Maybank", value: "Maybank" },
                     { label: "CIMB Bank", value: "CIMB" },
                     { label: "Public Bank", value: "Public Bank" },
                     { label: "RHB Bank", value: "RHB" },
                     { label: "Bank Islam", value: "Bank Islam" }
                  ]}
               />

               <Input 
                  label="Account Number" 
                  placeholder="e.g. 1512 8888 9999"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
               />

               <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4">
                  <Info className="text-blue-500 shrink-0" size={18} />
                  <p className="text-[11px] font-medium text-blue-600 leading-relaxed italic">
                     Payouts are typically processed within 24-48 hours via DuitNow Instant Transfer.
                  </p>
               </div>

               <Button 
                  onClick={handleWithdraw} 
                  isLoading={isProcessing}
                  className="w-full h-16 rounded-2xl font-black text-base"
               >
                  Authorize Withdrawal
               </Button>
            </div>
         )}
      </Modal>

      {/* Transaction Detail Receipt Modal */}
      <Modal
        isOpen={!!selectedTxn}
        onClose={() => setSelectedTxn(null)}
        title="Network Receipt"
      >
        {selectedTxn && (
           <div className="space-y-8">
              <div className="text-center">
                 <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-4 border-2 ${selectedTxn.amount > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-500' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                    <ReceiptText size={40} />
                 </div>
                 <h4 className="text-4xl font-black text-slate-900 tracking-tighter">RM {Math.abs(selectedTxn.amount).toFixed(2)}</h4>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Transaction Value</p>
              </div>

              <div className="bg-slate-50 rounded-[2rem] p-8 space-y-4 border border-slate-100 font-mono italic">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</span>
                    <span className="text-xs font-black text-slate-800">{selectedTxn.id}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Type</span>
                    <Badge variant={selectedTxn.amount > 0 ? 'success' : 'slate'}>{selectedTxn.type}</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</span>
                    <Badge variant="success">AUTHORIZED</Badge>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date/Time</span>
                    <span className="text-xs font-black text-slate-800">{new Date(selectedTxn.createdAt).toLocaleString()}</span>
                 </div>
                 <div className="pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Description</p>
                    <p className="text-xs font-black text-slate-800 leading-relaxed uppercase">{selectedTxn.description}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <Button variant="secondary" className="rounded-2xl h-14 font-black">Download PDF</Button>
                 <Button className="rounded-2xl h-14 font-black">Share Link</Button>
              </div>
           </div>
        )}
      </Modal>

      {/* Modern Notifications Panel */}
      <AnimatePresence>
         {showNotifications && (
            <>
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowNotifications(false)}
                 className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
               />
               <motion.div 
                 initial={{ x: '100%' }}
                 animate={{ x: 0 }}
                 exit={{ x: '100%' }}
                 transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                 className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-2xl z-[210] p-8 flex flex-col"
               >
                  <div className="flex justify-between items-center mb-10">
                     <div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">Intelligence</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Network Activity Feed</p>
                     </div>
                     <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-slate-100 rounded-2xl transition-colors text-slate-400"><X size={24} /></button>
                  </div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar pb-10">
                     {notifications.map(n => (
                        <div key={n.id} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-primary/20 transition-all cursor-default group">
                           <div className="flex justify-between items-start mb-2">
                              <h4 className="text-sm font-black text-slate-800 tracking-tight">{n.title}</h4>
                              <span className="text-[9px] font-black text-slate-400 bg-white px-1.5 py-0.5 rounded-lg border border-slate-100">{n.time}</span>
                           </div>
                           <p className="text-[11px] font-medium text-slate-500 leading-relaxed">{n.body}</p>
                           <div className="flex items-center gap-1.5 mt-4">
                             <div className={`w-1.5 h-1.5 rounded-full ${n.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : n.type === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'}`} />
                             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{n.type}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <RoleProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </RoleProvider>
  );
}
