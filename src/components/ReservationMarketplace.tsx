import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Gavel, 
  Calendar, 
  Timer, 
  ArrowRightLeft, 
  Zap, 
  TrendingUp, 
  Award, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  Search,
  Brain,
  Bell,
  CheckCircle2,
  AlertCircle,
  Users,
  Activity,
  History,
  Info
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal, useToastStore } from './ui';
import { ParkingAuction, ParkingReservation, WaitlistEntry, MarketplaceActivity } from '../types';

export const ReservationMarketplace = () => {
  const { 
    auctions, 
    reservations, 
    waitlist, 
    marketplaceActivities,
    placeBid,
    reserveSpot,
    joinWaitlist,
    transferReservation,
    buyReservation,
    cancelReservation,
    walletBalance,
    listings
  } = useData();

  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'auctions' | 'reservations' | 'waitlist' | 'activity'>('auctions');
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const myReservations = reservations.filter(r => r.userId === 'driver-1' && r.status !== 'CANCELLED');
  const otherReservations = reservations.filter(r => r.userId !== 'driver-1' && r.status === 'FOR_SALE');

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-slate-100">
         <div className="flex justify-between items-start mb-8">
            <div>
               <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Commercial Exchange</p>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Marketplace</h1>
            </div>
            <div className="flex flex-col items-end">
               <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl shadow-slate-900/20">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                     <Zap size={16} className="text-primary" />
                  </div>
                  <div>
                     <p className="text-[8px] font-black uppercase text-white/40 leading-none">Wallet Balance</p>
                     <p className="text-sm font-black italic tracking-tight">RM {walletBalance.toFixed(2)}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
            {[
               { id: 'auctions', label: 'Auctions', icon: Gavel },
               { id: 'reservations', label: 'Exchange', icon: ArrowRightLeft },
               { id: 'waitlist', label: 'Waitlists', icon: Timer },
               { id: 'activity', label: 'Protocol', icon: Activity }
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  <tab.icon size={14} />
                  {tab.label}
               </button>
            ))}
         </div>
      </div>

      <main className="px-6 py-8">
         {/* AI Surge Intelligence Feed */}
         <div className="mb-8 flex gap-4 overflow-x-auto no-scrollbar pb-2">
            <div className="flex-none w-72 bg-gradient-to-br from-primary to-indigo-600 rounded-[2rem] p-5 text-white shadow-lg shadow-primary/20">
               <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} className="text-white/80" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">AI Demand Prediction</span>
               </div>
               <p className="text-sm font-black italic mb-4 leading-tight">High congestion predicted near KLCC. Reserve early to lock current rates.</p>
               <Badge className="bg-white/10 text-[8px] font-black border-none px-2 py-0.5 uppercase">89% Confidence</Badge>
            </div>
            <div className="flex-none w-72 bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
               <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Market Opportunity</span>
               </div>
               <p className="text-sm font-black italic mb-4 leading-tight text-slate-900">Alternative premium spot at Pavilion B1 available at 15% discount.</p>
               <Button size="sm" className="h-8 rounded-lg bg-slate-900 text-white text-[8px] font-black uppercase">View Spot</Button>
            </div>
         </div>

         <AnimatePresence mode="wait">
            {activeTab === 'auctions' && (
               <motion.div
                  key="auctions"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <SectionHeader 
                    title="Live Auctions" 
                    subtitle="Bid for premium executive zones during peak demand" 
                    icon={Gavel} 
                  />

                  {auctions.map(auction => (
                    <AuctionCard key={auction.id} auction={auction} onBid={(amount) => {
                       placeBid(auction.id, amount);
                       addToast(`Bid Placed! New high bid: RM${amount}`, 'success');
                    }} />
                  ))}

                  {auctions.length === 0 && (
                    <EmptyState 
                       title="No Active Auctions" 
                       subtitle="Check back during peak hours for premium spot access."
                       icon={Gavel}
                    />
                  )}
               </motion.div>
            )}

            {activeTab === 'reservations' && (
               <motion.div
                  key="reservations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
               >
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <SectionHeader 
                          title="My Reservations" 
                          subtitle="Manage your future parking slots" 
                          icon={Calendar} 
                        />
                        <Button 
                           size="sm" 
                           onClick={() => setShowReserveModal(true)}
                           className="bg-primary text-white h-10 px-4 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                        >
                           <Plus size={16} />
                           Reserve
                        </Button>
                     </div>

                     {myReservations.map(res => (
                        <ReservationCard 
                          key={res.id} 
                          reservation={res} 
                          onTransfer={(price) => {
                             transferReservation(res.id, price);
                             addToast(`Listed for Transfer: Reservation available for RM${price}`, 'info');
                          }}
                          onCancel={() => cancelReservation(res.id)}
                        />
                     ))}

                     {myReservations.length === 0 && (
                       <Card className="p-8 border-dashed border-2 border-slate-200 bg-white/50 rounded-[2.5rem] text-center">
                          <Calendar size={32} className="mx-auto mb-4 text-slate-300" />
                          <p className="text-sm font-black text-slate-400 italic">No future reservations found.</p>
                       </Card>
                     )}
                  </div>

                  <div className="space-y-6">
                     <SectionHeader 
                       title="Available Transfers" 
                       subtitle="Trade unused slots from the community" 
                       icon={ArrowRightLeft} 
                     />

                     {otherReservations.map(res => (
                        <TransferMarketCard 
                           key={res.id} 
                           reservation={res} 
                           onBuy={() => {
                              buyReservation(res.id);
                              addToast('Reservation Acquired: The spot is now yours!', 'success');
                           }} 
                        />
                     ))}

                     {otherReservations.length === 0 && (
                       <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-8">
                          No reservations available for transfer at this moment.
                       </p>
                     )}
                  </div>
               </motion.div>
            )}

            {activeTab === 'waitlist' && (
               <motion.div
                  key="waitlist"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <SectionHeader 
                    title="Active Waitlists" 
                    subtitle="Monitor your position in high-demand zones" 
                    icon={Timer} 
                  />

                  {waitlist.map(entry => (
                    <WaitlistCard key={entry.id} entry={entry} />
                  ))}

                  <Card className="p-8 bg-slate-900 text-white rounded-[2.5rem] overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-10 -mr-10 -mt-10">
                        <TrendingUp size={160} />
                     </div>
                     <div className="relative z-10">
                        <h3 className="text-xl font-black italic uppercase tracking-tight mb-2">Smart Queue Protocol</h3>
                        <p className="text-xs font-bold text-white/60 mb-6 italic leading-relaxed">
                           Our AI re-prioritizes entry based on arrival probability, subscription tier, and current urban flow.
                        </p>
                        <div className="flex gap-4">
                           <div className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Queue Success</p>
                              <p className="text-lg font-black italic">94.2%</p>
                           </div>
                           <div className="flex-1 bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Avg Wait</p>
                              <p className="text-lg font-black italic">8.5m</p>
                           </div>
                        </div>
                     </div>
                  </Card>
               </motion.div>
            )}

            {activeTab === 'activity' && (
               <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
               >
                  <SectionHeader 
                    title="Live Protocol" 
                    subtitle="Real-time transparency of marketplace operations" 
                    icon={Activity} 
                  />

                  <div className="space-y-4">
                     {marketplaceActivities.map(activity => (
                        <Card key={activity.id} className="p-4 border-slate-200 shadow-sm rounded-3xl flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                             activity.type === 'BID' ? 'bg-amber-50 text-amber-600' :
                             activity.type === 'RESERVATION' ? 'bg-primary/10 text-primary' :
                             activity.type === 'TRANSFER' ? 'bg-emerald-50 text-emerald-600' :
                             'bg-slate-100 text-slate-600'
                           }`}>
                              {activity.type === 'BID' ? <Gavel size={18} /> :
                               activity.type === 'RESERVATION' ? <Calendar size={18} /> :
                               activity.type === 'TRANSFER' ? <ArrowRightLeft size={18} /> :
                               <Timer size={18} />}
                           </div>
                           <div className="flex-1">
                              <p className="text-xs font-black text-slate-800 italic leading-tight">{activity.message}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                 {new Date(activity.timestamp).toLocaleTimeString()} • User {activity.userId}
                              </p>
                           </div>
                           <Badge className="bg-slate-50 text-slate-400 border-none text-[8px] font-black px-2 py-0.5 uppercase">
                              Verified
                           </Badge>
                        </Card>
                     ))}
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Reservation Modal */}
      <Modal isOpen={showReserveModal} onClose={() => setShowReserveModal(false)} title="New Reservation">
         <div className="space-y-6 pt-4">
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
               <select 
                 className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-4 font-bold text-sm outline-none focus:border-primary transition-all"
                 onChange={(e) => setSelectedListing(e.target.value)}
                 value={selectedListing || ''}
               >
                  <option value="">Select a location...</option>
                  {listings.map(l => (
                     <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
               </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                  <Input type="time" className="h-14 rounded-2xl" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration (Hours)</label>
                  <select className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl px-4 font-bold text-sm outline-none focus:border-primary transition-all">
                     <option value="1">1 Hour</option>
                     <option value="2">2 Hours</option>
                     <option value="4">4 Hours</option>
                     <option value="8">8 Hours</option>
                  </select>
               </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-primary leading-none mb-1">Protection Active</p>
                  <p className="text-[9px] font-bold text-slate-500 italic">Spot held for 15 mins after reservation start.</p>
               </div>
            </div>

            <Button 
               className="w-full h-16 bg-primary text-white font-black italic text-lg uppercase tracking-tight rounded-2xl shadow-xl shadow-primary/20"
               onClick={() => {
                  if (selectedListing) {
                     reserveSpot(selectedListing, new Date().toISOString(), 2);
                     setShowReserveModal(false);
                     addToast('Success! Spot reserved successfully', 'success');
                  }
               }}
            >
               Confirm Reservation
            </Button>
         </div>
      </Modal>
    </div>
  );
};

const AuctionCard = ({ auction, onBid }: { auction: ParkingAuction, onBid: (amount: number) => void, key?: any }) => {
  const [bidAmount, setBidAmount] = useState(auction.currentBid + 1);

  return (
    <Card className="p-6 border-slate-200 shadow-sm rounded-[2.5rem] relative overflow-hidden group">
       <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Gavel size={160} className="text-amber-500" />
       </div>

       <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
             <div>
                <h4 className="text-xl font-black text-slate-900 italic tracking-tight uppercase leading-none mb-1">{auction.listingName}</h4>
                <div className="flex items-center gap-2">
                   <Clock size={12} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ending in 14m 22s</span>
                </div>
             </div>
             <Badge className={`border-none text-[8px] font-black px-2 py-1 uppercase animate-pulse ${
               auction.demandLevel === 'EXTREME' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
             }`}>
                {auction.demandLevel} Demand
             </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Highest Bid</p>
                <p className="text-2xl font-black italic text-slate-900 leading-none">RM {auction.currentBid.toFixed(2)}</p>
             </div>
             <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Bids</p>
                <div className="flex items-center gap-2">
                   <Users size={16} className="text-slate-400" />
                   <p className="text-2xl font-black italic text-slate-900 leading-none">{auction.bidsCount}</p>
                </div>
             </div>
          </div>

          <div className="flex gap-3">
             <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">RM</div>
                <input 
                  type="number" 
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                  className="w-full h-14 bg-slate-50 border-slate-200 rounded-2xl pl-12 pr-4 font-black text-lg text-slate-900 outline-none focus:border-amber-500 transition-all" 
                />
             </div>
             <Button 
               onClick={() => onBid(bidAmount)}
               className="h-14 px-8 bg-slate-900 text-white font-black italic uppercase tracking-tight rounded-2xl shadow-xl hover:bg-amber-500 transition-colors"
             >
                Bid
             </Button>
          </div>
       </div>
    </Card>
  );
};

const ReservationCard = ({ reservation, onTransfer, onCancel }: { reservation: ParkingReservation, onTransfer: (price: number) => void, onCancel: () => void, key?: any }) => {
  const isPending = reservation.status === 'PENDING';
  const isForSale = reservation.status === 'FOR_SALE';

  return (
    <Card className="p-6 border-slate-200 shadow-sm rounded-[2.5rem] bg-white group">
       <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
               isForSale ? 'bg-amber-50 text-amber-600' : 'bg-primary/10 text-primary'
             }`}>
                {isForSale ? <ArrowRightLeft size={24} /> : <Calendar size={24} />}
             </div>
             <div>
                <h4 className="text-lg font-black text-slate-900 italic tracking-tight leading-none mb-1">{reservation.listingName}</h4>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                   {new Date(reservation.startTime).toLocaleDateString()} • {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
             </div>
          </div>
          <Badge className={`border-none text-[8px] font-black px-2 py-1 uppercase ${
             isForSale ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
             {reservation.status}
          </Badge>
       </div>

       <div className="flex items-center gap-6 mb-8 py-4 border-y border-slate-50">
          <div>
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Value</p>
             <p className="text-lg font-black italic text-slate-900 leading-none">RM {reservation.price.toFixed(2)}</p>
          </div>
          <div className="w-px h-8 bg-slate-100" />
          <div className="flex-1">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Protection</p>
             <div className="flex items-center gap-1.5 text-emerald-600">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-black uppercase">Secured</span>
             </div>
          </div>
       </div>

       <div className="flex gap-2">
          {!isForSale && (
             <Button 
               variant="ghost" 
               onClick={() => onTransfer(reservation.price * 0.9)}
               className="flex-1 h-12 bg-slate-50 hover:bg-amber-50 hover:text-amber-600 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest"
             >
                Transfer
             </Button>
          )}
          <Button 
            variant="ghost" 
            onClick={onCancel}
            className="h-12 w-12 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 text-slate-300 rounded-xl transition-all"
          >
             <AlertCircle size={20} />
          </Button>
          <Button className="flex-1 h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
             View Details
          </Button>
       </div>
    </Card>
  );
};

const TransferMarketCard = ({ reservation, onBuy }: { reservation: ParkingReservation, onBuy: () => void, key?: any }) => {
   return (
      <Card className="p-5 border-slate-100 shadow-sm rounded-3xl bg-white border-l-4 border-l-amber-500 hover:shadow-md transition-all">
         <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <ArrowRightLeft size={16} />
               </div>
               <div>
                  <h5 className="text-sm font-black text-slate-900 italic leading-none mb-1">{reservation.listingName}</h5>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Starts at {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-rose-500 italic line-through opacity-50">RM {reservation.price.toFixed(2)}</p>
               <p className="text-md font-black italic text-slate-900 leading-none">RM {reservation.transferPrice?.toFixed(2)}</p>
            </div>
         </div>
         <Button 
            size="sm" 
            onClick={onBuy}
            className="w-full h-10 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic"
         >
            Acquire Spot - 20% Discount
         </Button>
      </Card>
   );
};

const WaitlistCard = ({ entry }: { entry: WaitlistEntry, key?: any }) => {
   return (
      <Card className="p-6 border-slate-200 shadow-sm rounded-[2.5rem] bg-white">
         <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Timer size={24} className="animate-pulse" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-slate-900 italic tracking-tight leading-none mb-1">Queue Active</h4>
                  <div className="flex items-center gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Live Verification</p>
                  </div>
               </div>
            </div>
            <Badge className="bg-indigo-600 text-white border-none text-xl font-black px-4 py-1 italic rounded-2xl shadow-lg shadow-indigo-600/20">
               #{entry.position}
            </Badge>
         </div>

         <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Estimated Arrival</p>
               <p className="text-2xl font-black italic text-slate-900 leading-none text-center">{entry.estimatedWait}m</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">AI Success Probability</p>
               <p className="text-2xl font-black italic text-emerald-600 leading-none text-center">{entry.probability}%</p>
            </div>
         </div>

         <Button variant="ghost" className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest">
            Leave Queue
         </Button>
      </Card>
   );
};

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center gap-4 mb-2">
     <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
        <Icon size={24} />
     </div>
     <div>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none mb-1 italic">{title}</h3>
        <p className="text-[10px] font-bold text-slate-400 italic">{subtitle}</p>
     </div>
  </div>
);

const EmptyState = ({ title, subtitle, icon: Icon }: any) => (
  <Card className="p-12 border-dashed border-2 border-slate-200 bg-white/50 rounded-[3rem] text-center">
     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
        <Icon size={32} />
     </div>
     <h4 className="text-xl font-black text-slate-900 italic tracking-tight uppercase mb-2">{title}</h4>
     <p className="text-sm font-bold text-slate-400 italic max-w-[240px] mx-auto">{subtitle}</p>
  </Card>
);
