import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Car, 
  MapPin, 
  Clock, 
  Zap, 
  Shield, 
  Star, 
  ChevronRight, 
  ArrowRight,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Navigation,
  Calendar,
  Settings,
  Sparkles,
  Award,
  Smartphone,
  PhoneCall,
  User as UserIcon,
  Timer
} from 'lucide-react';
import { Card, Badge, Button, Input, Modal } from './ui';
import { ValetServiceType } from '../types';

const SERVICES: { id: ValetServiceType, label: string, price: number, description: string, icon: any, color: string }[] = [
  { 
    id: 'SMART_VALET', 
    label: 'Smart Valet Parking', 
    price: 12, 
    description: 'A professional valet meets you at the entrance and parks your vehicle securely.', 
    icon: Car,
    color: 'bg-blue-500'
  },
  { 
    id: 'PARKING_FINDER', 
    label: 'Parking Finder Assist', 
    price: 5, 
    description: 'An assistant secures a premium nearby slot and stays there until you arrive.', 
    icon: MapPin,
    color: 'bg-amber-500'
  },
  { 
    id: 'RETRIEVAL', 
    label: 'Car Retrieval Service', 
    price: 8, 
    description: 'Request vehicle pickup from parking to your current pickup point.', 
    icon: Timer,
    color: 'bg-primary'
  },
  { 
    id: 'EVENT', 
    label: 'Premium Event Valet', 
    price: 25, 
    description: 'Dedicated priority valet for high-demand concerts or stadium events.', 
    icon: Award,
    color: 'bg-indigo-600'
  }
];

export const ValetMarketplace = () => {
  const { valetBookings, requestValet, cancelValet, retrieveVehicle, valetAssistants } = useData();
  const [selectedService, setSelectedService] = useState<ValetServiceType | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [destination, setDestination] = useState('Pavilion KL Entrance');

  const activeBooking = valetBookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const handleBook = () => {
    if (!selectedService) return;
    
    const service = SERVICES.find(s => s.id === selectedService);
    if (!service) return;

    requestValet({
      userId: 'driver-1',
      type: selectedService,
      destination: {
        name: destination,
        lat: 3.1488,
        lng: 101.7135
      },
      pickupTime: new Date().toISOString(),
      vehicleId: 'v1',
      baseFee: service.price,
      peakSurcharge: 2,
      totalPrice: service.price + 2
    });

    setShowBookingModal(false);
    setSelectedService(null);
    setBookingStep(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-slate-100">
         <div className="flex justify-between items-start mb-6">
            <div>
               <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Premium Mobility</p>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Assist Market</h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
               <Settings size={20} />
            </div>
         </div>
         
         <Card className="p-4 bg-slate-900 border-none shadow-2xl rounded-[2rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 p-4 opacity-10 rotate-12 -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
               <Shield size={120} />
            </div>
            <div className="relative z-10 flex items-center gap-4">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary border border-white/10">
                  <Shield size={24} />
               </div>
               <div>
                  <p className="text-xs font-black text-white italic">ParkLuar Guardian Protocol</p>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Enterprise-grade security on every handoff</p>
               </div>
            </div>
         </Card>
      </div>

      <main className="px-6 py-8 space-y-8">
        {/* Active Service Status */}
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
             <ValetLiveTracking booking={activeBooking} onCancel={() => cancelValet(activeBooking.id)} onRetrieve={() => retrieveVehicle(activeBooking.id)} />
          </motion.div>
        )}

        {/* AI Recommendations */}
        {!activeBooking && (
           <Card className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shrink-0">
                 <Zap size={24} className="fill-primary" />
              </div>
              <div className="flex-1">
                 <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Smart Suggestion</p>
                 <p className="text-xs font-bold text-slate-700 italic leading-relaxed">
                    "Heavy congestion detected near Pavilion KL. We recommend Smart Valet for a 12-minute time saving."
                 </p>
              </div>
              <Button size="sm" className="bg-primary text-white h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic shrink-0">
                 Apply
              </Button>
           </Card>
        )}

        {/* Service Grid */}
        <div className="grid grid-cols-1 gap-6">
           <SectionHeader title="Available Services" subtitle="Choose your assistance tier" icon={Smartphone} />
           {SERVICES.map(service => (
             <motion.div 
               key={service.id}
               whileTap={{ scale: 0.98 }}
               onClick={() => {
                 setSelectedService(service.id);
                 setShowBookingModal(true);
               }}
             >
               <Card className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-all rounded-[2.5rem] group cursor-pointer">
                  <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 ${service.color} rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                        <service.icon size={28} />
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Fee</p>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tight">RM {service.price}</p>
                     </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 italic mb-2 tracking-tight group-hover:text-primary transition-colors">{service.label}</h3>
                  <p className="text-xs font-bold text-slate-500 leading-relaxed mb-6 italic">{service.description}</p>
                  <div className="flex items-center gap-2">
                     <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-1 flex items-center gap-1">
                        <Zap size={10} className="fill-slate-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Instant Assign</span>
                     </Badge>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none px-2 py-1 flex items-center gap-1">
                        <Shield size={10} className="fill-emerald-600" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Insured</span>
                     </Badge>
                  </div>
               </Card>
             </motion.div>
           ))}
        </div>

        {/* Valet Leaderboard / Features */}
        <div className="space-y-6 pt-4">
           <SectionHeader title="Elite Assistant Network" subtitle="Global network of professional helpers" icon={Award} />
           <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
              {valetAssistants.map(va => (
                <Card key={va.id} className="min-w-[160px] p-4 border-slate-200 shadow-sm rounded-3xl text-center">
                   <div className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-primary/20 p-1">
                      <img src={va.image} className="w-full h-full object-cover rounded-full" />
                   </div>
                   <h4 className="text-[11px] font-black text-slate-800 italic truncate">{va.name}</h4>
                   <div className="flex items-center justify-center gap-1 mt-1">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-slate-600">{va.rating}</span>
                   </div>
                   <p className="text-[8px] font-bold text-slate-400 uppercase mt-2 tracking-widest italic">{va.completedJobs} Jobs Done</p>
                </Card>
              ))}
           </div>
        </div>
      </main>

      {/* Booking Modal */}
      <Modal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title={SERVICES.find(s => s.id === selectedService)?.label || 'Request Assistance'}
      >
        <div className="space-y-6">
           <div className="flex items-center justify-between mb-8">
              {[1, 2, 3].map(step => (
                 <div key={step} className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${bookingStep >= step ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
                       {step}
                    </div>
                    {step < 3 && <div className={`w-12 h-0.5 rounded-full ${bookingStep > step ? 'bg-primary' : 'bg-slate-100'}`} />}
                 </div>
              ))}
           </div>

           {bookingStep === 1 && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-4"
             >
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Point</label>
                   <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <Input 
                        value={destination} 
                        onChange={(e) => setDestination(e.target.value)}
                        className="h-14 pl-12 bg-slate-50 border-slate-200 font-bold rounded-2xl" 
                      />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Arrival Time</label>
                   <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <Input defaultValue="Now (Approx 5 mins away)" className="h-14 pl-12 bg-slate-50 border-slate-200 font-bold rounded-2xl" disabled />
                   </div>
                </div>
                <Button 
                  onClick={() => setBookingStep(2)}
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-md italic mt-8 flex items-center justify-center gap-3"
                >
                   Next: Preferences
                   <ArrowRight size={20} />
                </Button>
             </motion.div>
           )}

           {bookingStep === 2 && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-4"
             >
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vehicle Selection</label>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary/5 border-2 border-primary rounded-2xl">
                         <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-2">
                            <Car size={20} />
                         </div>
                         <p className="text-xs font-black text-slate-900">Mercedes C300</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">V-9022-KL</p>
                      </div>
                      <div className="p-4 bg-slate-50 border-2 border-transparent rounded-2xl opacity-50">
                         <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 mb-2">
                            <Car size={20} />
                         </div>
                         <p className="text-xs font-black text-slate-900">BMW iX</p>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic">EV-001</p>
                      </div>
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Special Instructions</label>
                   <textarea className="w-full h-24 bg-slate-50 border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-primary transition-all resize-none" placeholder="e.g. Leave car wash kit in trunk" />
                </div>
                <Button 
                   onClick={() => setBookingStep(3)}
                   className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-md italic mt-8 flex items-center justify-center gap-3"
                >
                   Next: Payment
                   <ArrowRight size={20} />
                </Button>
             </motion.div>
           )}

           {bookingStep === 3 && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="space-y-6"
             >
                <div className="p-6 bg-slate-900 text-white rounded-[2rem] space-y-4">
                   <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-widest">
                      <span>Service Fee</span>
                      <span>RM {SERVICES.find(s => s.id === selectedService)?.price}.00</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-black text-white/40 uppercase tracking-widest">
                      <span>Peak Surcharge</span>
                      <span>RM 2.00</span>
                   </div>
                   <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                      <div>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest">Total Price</p>
                         <p className="text-3xl font-black italic">RM {(SERVICES.find(s => s.id === selectedService)?.price || 0) + 2}.00</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                         <CreditCard size={14} className="text-primary" />
                         <span className="text-[10px] font-black italic">•••• 4242</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                   <AlertCircle className="text-amber-500 shrink-0" size={18} />
                   <p className="text-[10px] font-bold text-amber-700 leading-relaxed italic">
                      By proceeding, you authorize ParkLuar professionals to handle your vehicle under the Guardian Protection Protocol.
                   </p>
                </div>

                <Button 
                   onClick={handleBook}
                   className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl italic mt-6 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
                >
                   Confirm Assistance
                   <Sparkles size={24} />
                </Button>
             </motion.div>
           )}
        </div>
      </Modal>
    </div>
  );
};

export const ValetLiveTracking = ({ booking, onCancel, onRetrieve }: { booking: any, onCancel: () => void, onRetrieve: () => void }) => {
   const { valetAssistants } = useData();
   const assistant = valetAssistants.find(a => a.id === booking.assistantId);

   const statusConfig: Record<string, { label: string, color: string, icon: any }> = {
      'SEARCHING': { label: 'Finding Best Assistant', color: 'bg-primary text-white', icon: Search },
      'ASSIGNED': { label: 'Assistant Assigned', color: 'bg-blue-600 text-white', icon: UserIcon },
      'EN_ROUTE': { label: 'Assistant is En Route', color: 'bg-indigo-600 text-white', icon: MapPin },
      'VEHICLE_SECURED': { label: 'Vehicle Secured', color: 'bg-emerald-600 text-white', icon: Shield },
      'PARKING_COMPLETED': { label: 'Parking Secured', color: 'bg-emerald-600 text-white', icon: CheckCircle2 },
      'RETRIEVAL_ACTIVE': { label: 'Retrieval Program Active', color: 'bg-primary text-white', icon: Zap }
   };

   const current = statusConfig[booking.status] || { label: booking.status, color: 'bg-slate-500 text-white', icon: Timer };

   return (
     <Card className="p-0 border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden bg-white relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 -mr-10 -mt-10 pointer-events-none">
           <Zap size={200} className="text-primary" />
        </div>
        
        <div className={`p-6 ${current.color} flex items-center justify-between relative z-10`}>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md">
                 <current.icon size={24} className="animate-pulse" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-0.5">Mission Active</p>
                 <h3 className="text-xl font-black italic tracking-tight uppercase leading-none">{current.label}</h3>
              </div>
           </div>
           {booking.status === 'SEARCHING' && (
              <Button 
                variant="ghost" 
                onClick={onCancel}
                className="text-white bg-white/10 hover:bg-white/20 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-white/20"
              >
                 Abort
              </Button>
           )}
        </div>

        <div className="p-8 space-y-10 relative z-10">
           {/* Assistant Profile */}
           {assistant && (
              <div className="flex items-center justify-between bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                 <div className="flex items-center gap-5">
                    <div className="relative">
                       <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                          <img src={assistant.image} className="w-full h-full object-cover" />
                       </div>
                       <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                          <CheckCircle2 size={14} />
                       </div>
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-xl font-black text-slate-900 italic leading-tight tracking-tight">{assistant.name}</h4>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100">
                             <Star size={12} className="fill-amber-400 text-amber-400" />
                             <span className="text-[11px] font-black text-slate-700">{assistant.rating}</span>
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Experience</span>
                             <span className="text-[11px] font-black text-slate-900 italic">{assistant.completedJobs} Deliveries</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="flex gap-3">
                    <button className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm hover:scale-110 active:scale-95 transition-all">
                       <PhoneCall size={24} />
                    </button>
                    <button className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                       <Smartphone size={24} />
                    </button>
                 </div>
              </div>
           )}

           {!assistant && booking.status === 'SEARCHING' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                 <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <Search size={28} className="text-primary animate-bounce" />
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Analyzing network for priority assistant...</p>
              </div>
           )}

           {/* Timeline Progress */}
           <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Active Timeline</p>
              <div className="space-y-4">
                 {booking.timeline.slice().reverse().map((t: any, i: number) => (
                    <div key={i} className={`flex gap-4 ${i === 0 ? 'opacity-100' : 'opacity-40'}`}>
                       <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : 'bg-slate-300'} relative z-10`} />
                          {i < booking.timeline.length - 1 && <div className="w-0.5 h-10 bg-slate-100 -mt-0.5" />}
                       </div>
                       <div className="-mt-1">
                          <p className="text-[11px] font-black text-slate-800 italic">{t.label}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           {/* Action for Return */}
           {booking.status === 'PARKING_COMPLETED' && (
              <Button 
                onClick={onRetrieve}
                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-md italic mt-4 shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 group"
              >
                 Request Vehicle Retrieval
                 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
           )}

           {booking.status === 'RETRIEVAL_ACTIVE' && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
                       <Navigation size={20} className="animate-bounce" />
                    </div>
                    <div>
                       <p className="text-[9px] font-black text-primary uppercase tracking-widest">Retrieval ETA</p>
                       <p className="text-xs font-black text-slate-900 italic">Arriving in 4 minutes</p>
                    </div>
                 </div>
                 <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                       className="bg-primary h-full" 
                       initial={{ width: 0 }}
                       animate={{ width: '65%' }}
                       transition={{ duration: 2, repeat: Infinity }}
                    />
                 </div>
              </div>
           )}
        </div>
     </Card>
   );
};

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-3">
       <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
          <Icon size={20} />
       </div>
       <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 leading-none mb-1 italic">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 italic">{subtitle}</p>
       </div>
    </div>
  </div>
);
