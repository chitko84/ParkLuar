import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Users, 
  MapPin, 
  Clock, 
  Leaf, 
  Zap, 
  ShieldCheck, 
  Star, 
  ChevronRight, 
  Plus, 
  Search, 
  Navigation, 
  UserPlus, 
  Share2, 
  Trophy, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  ArrowRight,
  Route,
  Coins
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, useToastStore } from './ui';
import { CarpoolTrip, RideRequest } from '../types';

export const CarpoolSystem = () => {
  const { 
    carpoolTrips, 
    rideRequests, 
    sustainabilityStats, 
    offerRide, 
    requestRide, 
    joinCarpool, 
    acceptPassenger,
    updateTripStatus,
    vehicles,
    walletBalance
  } = useData();

  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'discover' | 'my-trips' | 'impact'>('discover');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<CarpoolTrip | null>(null);

  // Stats for the impact dashboard
  const impactStats = [
    { label: 'Fuel Saved', value: `RM ${sustainabilityStats.totalFuelSaved.toFixed(1)}`, icon: Zap, color: 'text-amber-500' },
    { label: 'CO₂ Avoided', value: `${sustainabilityStats.totalCO2Avoided.toFixed(1)}kg`, icon: Leaf, color: 'text-emerald-500' },
    { label: 'Cars Reduced', value: sustainabilityStats.totalCarsReduced, icon: Navigation, color: 'text-indigo-500' },
    { label: 'Impact Score', value: sustainabilityStats.participationScore, icon: Trophy, color: 'text-primary' }
  ];

  const handleJoinRide = (trip: CarpoolTrip) => {
    joinCarpool(trip.id, trip.pickupPoints[0]);
    addToast('Request Sent: The driver will review your join request.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Dynamic Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-slate-100">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Mobility Ecosystem</p>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Shared Mobility</h1>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-3">
             <Leaf size={18} className="text-emerald-500" />
             <div>
                <p className="text-[8px] font-black uppercase text-emerald-600/60 leading-none">Eco Rating</p>
                <p className="text-sm font-black italic text-emerald-700">Top 5% Local</p>
             </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
          {[
            { id: 'discover', label: 'Explore', icon: Search },
            { id: 'my-trips', label: 'My Trips', icon: Route },
            { id: 'impact', label: 'Impact', icon: Leaf }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => setShowOfferModal(true)}
                  className="h-24 bg-slate-900 text-white rounded-3xl flex flex-col items-center justify-center gap-2 border-none shadow-xl shadow-slate-900/10 hover:bg-primary transition-all group"
                >
                  <Plus size={24} className="group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic font-sans">Offer Ride</span>
                </Button>
                <Button 
                  onClick={() => setShowRequestModal(true)}
                  variant="outline"
                  className="h-24 bg-white border-2 border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-900 hover:border-primary transition-all group"
                >
                  <UserPlus size={24} className="group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-widest italic font-sans">Request Ride</span>
                </Button>
              </div>

              {/* Matching Intelligence Suggestion */}
              <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white rounded-[2.5rem] shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 blur-sm">
                   <Users size={120} />
                </div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                         <Star size={16} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Mobility IQ Suggestion</span>
                   </div>
                   <p className="text-lg font-black italic tracking-tight mb-4 leading-tight lowercase">
                      3 users heading toward Mid Valley can reduce parking cost by 68%. Coordination recommended.
                   </p>
                   <Button size="sm" className="bg-white text-indigo-900 rounded-xl text-[9px] font-black uppercase tracking-widest px-4">
                      Match Me Now
                   </Button>
                </div>
              </Card>

              {/* Active Carpools List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Active Protocols</h3>
                   <span className="text-[10px] font-bold text-slate-400">{carpoolTrips.length} active trips</span>
                </div>

                {carpoolTrips.filter(t => t.status === 'OPEN').map(trip => (
                  <Card key={trip.id} className="p-6 border-slate-200 shadow-lg shadow-slate-200/50 rounded-[2rem] bg-white group hover:border-primary transition-all">
                     <div className="flex items-start gap-4 mb-6">
                        <div className="relative">
                           <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                              <img src={trip.driverImage} alt={trip.driverName} className="w-full h-full object-cover" />
                           </div>
                           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center border-2 border-white">
                              <ShieldCheck size={12} />
                           </div>
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className="text-lg font-black text-slate-900 italic tracking-tight leading-none group-hover:text-primary transition-colors">{trip.driverName}</h4>
                              <p className="text-sm font-black text-slate-900 italic leading-none">RM {trip.contributionPerPerson}</p>
                           </div>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verified Shared Driver</p>
                           <div className="flex gap-2">
                              <Badge className="bg-slate-50 text-slate-400 border-none text-[8px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                                 <Users size={8} /> {trip.availableSeats}/{trip.totalSeats} seats
                              </Badge>
                              <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black px-1.5 py-0.5 rounded-lg flex items-center gap-1">
                                 <Zap size={8} /> Save RM {trip.estimatedFuelSavings}
                              </Badge>
                           </div>
                        </div>
                     </div>

                     <div className="p-4 bg-slate-50 rounded-2xl space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-slate-300" />
                           <p className="text-[10px] font-bold text-slate-600 truncate italic">{trip.origin}</p>
                        </div>
                        <div className="w-0.5 h-4 bg-slate-200 ml-0.75" />
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-primary" />
                           <p className="text-sm font-black text-slate-900 truncate italic leading-none uppercase tracking-tight">{trip.destination}</p>
                        </div>
                        <div className="pt-2 flex items-center gap-4 border-t border-slate-100">
                           <div className="flex items-center gap-2">
                              <Clock size={12} className="text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 tracking-tight">{new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <MapPin size={12} className="text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 tracking-tight">{trip.pickupPoints.length} Pickup Points</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex gap-3">
                        <Button 
                           onClick={() => setSelectedTrip(trip)}
                           variant="outline" 
                           className="flex-1 h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest border-slate-100 hover:border-slate-900"
                        >
                           Details
                        </Button>
                        <Button 
                           onClick={() => handleJoinRide(trip)}
                           className="flex-1 h-12 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10"
                        >
                           Join Ride
                        </Button>
                     </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'my-trips' && (
            <motion.div
              key="my-trips"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
               {carpoolTrips.filter(t => t.driverId === 'driver-1' || t.passengers.some(p => p.userId === 'driver-1')).map(trip => (
                  <Card key={trip.id} className="p-6 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm">
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <Badge className={`border-none text-[8px] font-black px-2 py-0.5 rounded-lg mb-2 uppercase ${
                              trip.status === 'OPEN' ? 'bg-indigo-50 text-indigo-600' :
                              trip.status === 'IN_PROGRESS' ? 'bg-emerald-50 text-emerald-600 animate-pulse' :
                              'bg-slate-100 text-slate-400'
                           }`}>
                              {trip.status.replace('_', ' ')}
                           </Badge>
                           <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{trip.destination}</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Departure</p>
                           <p className="text-lg font-black text-slate-900 italic">{new Date(trip.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </div>

                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Co-Mobility Crew</span>
                           <span className="text-[10px] font-black text-primary">{trip.passengers.length} Active</span>
                        </div>
                        {trip.passengers.map(p => (
                           <div key={p.userId} className="p-3 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                 <img src={p.userImage} alt={p.userName} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <p className="text-sm font-black text-slate-900 italic leading-none">{p.userName}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pickup: {p.pickupPoint}</p>
                              </div>
                              <Badge className="bg-white border-slate-100 text-slate-400 text-[8px] font-black h-6 px-2">
                                 {p.status}
                              </Badge>
                           </div>
                        ))}
                        {trip.passengers.length === 0 && (
                           <div className="py-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                              <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest">Waiting for crew matching...</p>
                           </div>
                        )}
                     </div>

                     {trip.status === 'OPEN' && trip.driverId === 'driver-1' && (
                        <Button 
                           onClick={() => updateTripStatus(trip.id, 'IN_PROGRESS')}
                           className="w-full h-14 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 italic"
                        >
                           Initiate Urban Protocol
                        </Button>
                     )}
                     
                     {trip.status === 'IN_PROGRESS' && (
                        <div className="grid grid-cols-2 gap-3">
                           <Button className="h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
                              <Navigation size={14} className="mr-2" /> Live Route
                           </Button>
                           <Button 
                              onClick={() => updateTripStatus(trip.id, 'COMPLETED')}
                              className="h-12 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                           >
                              Complete
                           </Button>
                        </div>
                     )}
                  </Card>
               ))}
               
               {carpoolTrips.filter(t => t.driverId === 'driver-1' || t.passengers.some(p => p.userId === 'driver-1')).length === 0 && (
                  <div className="text-center py-20 opacity-20 grayscale saturate-0">
                     <Route size={80} className="mx-auto mb-6 text-slate-400" />
                     <p className="text-xs font-black uppercase tracking-[0.3em] italic">No active shared protocols</p>
                  </div>
               )}
            </motion.div>
          )}

          {activeTab === 'impact' && (
            <motion.div
              key="impact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {impactStats.map((stat, i) => (
                  <Card key={stat.label} className="p-6 bg-white border-slate-100 shadow-sm rounded-3xl transform hover:-translate-y-1 transition-all">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-2xl font-black text-slate-900 italic tracking-tight leading-none mb-1">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </Card>
                ))}
              </div>

              {/* Leaderboard Excerpt */}
              <Card className="p-8 border-slate-100 rounded-[2.5rem] bg-white shadow-lg shadow-slate-200/50">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-sm font-black uppercase tracking-widest italic text-slate-900 flex items-center gap-2">
                      <Trophy size={18} className="text-amber-500" /> Mobility Leaderboard
                   </h3>
                   <span className="text-[10px] font-black text-primary uppercase italic">Full Rankings <ChevronRight size={12} className="inline ml-1" /></span>
                </div>
                
                <div className="space-y-6">
                   {[
                      { name: 'Wei Leong', score: 2450, rank: 1, image: 'https://i.pravatar.cc/150?u=1' },
                      { name: 'Sarah Tan', score: 1890, rank: 2, image: 'https://i.pravatar.cc/150?u=2' },
                      { name: 'You', score: sustainabilityStats.participationScore, rank: 12, image: 'https://i.pravatar.cc/150?u=you' }
                   ].map(user => (
                      <div key={user.name} className="flex items-center gap-4">
                         <div className="w-4 text-xs font-black italic text-slate-400">#{user.rank}</div>
                         <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-slate-100">
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 italic leading-none">{user.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.score} points</p>
                         </div>
                         <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(user.score / 2500) * 100}%` }} />
                         </div>
                      </div>
                   ))}
                </div>
              </Card>

              {/* Sustainability Badge Area */}
              <div className="p-8 bg-emerald-500 rounded-[3rem] text-white overflow-hidden relative shadow-xl shadow-emerald-500/30">
                 <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
                    <Leaf size={240} />
                 </div>
                 <div className="relative z-10 flex items-center gap-6">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center p-4 border border-white/30 rotate-12">
                       <Zap size={48} className="text-white drop-shadow-md" />
                    </div>
                    <div>
                       <h4 className="text-xl font-black italic uppercase italic tracking-tight mb-2">Urban Optimizer</h4>
                       <p className="text-xs font-bold text-white/70 leading-relaxed italic">
                          You helped reduce 145kg of carbon emissions this month. Nature thanks your efficiency.
                       </p>
                    </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-slate-900 text-white rounded-3xl">
                 <ShieldCheck size={18} className="text-primary flex-none" />
                 <p className="text-[10px] font-black uppercase tracking-widest leading-tight">
                    Verified Sustainability Metrics audited by GreenSmart City Alliance.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Offer Ride Modal */}
      <Modal isOpen={showOfferModal} onClose={() => setShowOfferModal(false)} title="Offer Shared Protocol">
         <div className="space-y-6 pt-4">
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Hardware Selection</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-12 px-4 text-xs font-black italic">
                     {vehicles.map(v => (
                        <option key={v.id}>{v.brand} {v.model} ({v.plateNumber})</option>
                     ))}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <Input label="Departure Hub" placeholder="Your location" containerClassName="italic h-14" />
                  <Input label="Destination Core" placeholder="Where to?" containerClassName="italic h-14" />
               </div>
               <div className="grid grid-cols-3 gap-4">
                  <Input label="Seats" type="number" placeholder="Avail" containerClassName="italic h-14" />
                  <Input label="Contribution (RM)" type="number" placeholder="RM" containerClassName="italic h-14" />
                  <Input label="Time" type="time" containerClassName="italic h-14" />
               </div>
            </div>

            <Card className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Coins size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none mb-1">Optimized Revenue</p>
                  <p className="text-[9px] font-bold text-indigo-600/60 lowercase italic">Estimated offset of RM 34.50 for current trip.</p>
               </div>
            </Card>

            <Button 
               onClick={() => {
                  offerRide({
                     vehicleId: vehicles[0]?.id,
                     vehicleModel: `${vehicles[0]?.brand} ${vehicles[0]?.model}`,
                     origin: 'Current Hub',
                     destination: 'Urban Center',
                     destinationLat: 3.1478,
                     destinationLng: 101.7100,
                     departureTime: new Date().toISOString(),
                     totalSeats: 4,
                     availableSeats: 4,
                     contributionPerPerson: 10,
                     pickupPoints: ['Central Point A'],
                     estimatedCO2Savings: 5.0,
                     estimatedFuelSavings: 12.0
                  });
                  addToast('Protocol Active: Your ride offer is now live in the network.', 'success');
                  setShowOfferModal(false);
               } }
               className="w-full h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 italic"
            >
               Deploy Shared Strategy
            </Button>
         </div>
      </Modal>

      {/* Request Modal */}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Mobility Protocol">
         <div className="space-y-6 pt-4">
            <div className="space-y-4">
               <Input label="Destination Target" placeholder="Where do you need to go?" containerClassName="italic h-14" />
               <div className="grid grid-cols-2 gap-4">
                  <Input label="Seats Required" type="number" placeholder="1" containerClassName="italic h-14" />
                  <Input label="Departure Window" type="time" containerClassName="italic h-14" />
               </div>
            </div>
            
            <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Active Matching Loop</span>
               </div>
               <p className="text-xs font-medium text-slate-400 italic leading-relaxed">
                  The AI matches your request against 450+ live trips in current vicinity. Matching probability 89%.
               </p>
            </div>

            <Button 
               onClick={() => {
                  addToast('Network Scanned: Matching protocols initialized globally.', 'info');
                  setShowRequestModal(false);
               }}
               className="w-full h-14 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 italic"
            >
               Broadcast Signal
            </Button>
         </div>
      </Modal>
    </div>
  );
};
