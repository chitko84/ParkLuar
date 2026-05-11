import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Car, 
  Wrench, 
  ShieldAlert, 
  MapPin, 
  Battery, 
  Droplets, 
  History, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Plus, 
  Settings, 
  Navigation,
  Clock,
  Phone,
  Zap,
  Star,
  ShoppingBag,
  Bell,
  Activity,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { Card, Badge, Button, Modal, useToastStore, Input } from './ui';
import { Vehicle, CarServiceProvider, ServiceType, MaintenanceReminder, ServiceBooking } from '../types';

export const VehicleCareHub = () => {
  const { 
    vehicles, 
    serviceProviders, 
    serviceBookings, 
    maintenanceReminders, 
    activeEmergencyRequest,
    bookService,
    requestEmergency,
    cancelEmergency,
    dismissReminder,
    walletBalance
  } = useData();

  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'garage' | 'services' | 'emergency' | 'history'>('garage');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CarServiceProvider | null>(null);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleBookService = (provider: CarServiceProvider, service: any) => {
     bookService(provider.id, service.name, new Date().toISOString(), service.price, provider.type[0]);
     addToast(`Service Booked! Appointment scheduled with ${provider.name}`, 'success');
     setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <div className="bg-white px-6 pt-16 pb-8 border-b border-slate-100">
         <div className="flex justify-between items-start mb-8">
            <div>
               <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-1">Fleet Intelligence</p>
               <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Garage</h1>
            </div>
            <div className="flex flex-col items-end">
               <div className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-primary">
                     <Car size={16} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black uppercase text-white/40 leading-none">Vehicle Status</p>
                     <p className="text-sm font-black italic tracking-tight uppercase">{selectedVehicle?.status}</p>
                  </div>
               </div>
            </div>
         </div>

         {/* Navigation Tabs */}
         <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
            {[
               { id: 'garage', label: 'Garage', icon: Car },
               { id: 'services', label: 'Services', icon: Wrench },
               { id: 'emergency', label: 'Rescue', icon: ShieldAlert },
               { id: 'history', label: 'Logs', icon: History }
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
         <AnimatePresence mode="wait">
            {activeTab === 'garage' && (
               <motion.div
                  key="garage"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
               >
                  {/* Vehicle Selector */}
                  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                     {vehicles.map(v => (
                        <button 
                           key={v.id}
                           onClick={() => setSelectedVehicleId(v.id)}
                           className={`flex-none w-48 p-4 rounded-3xl border transition-all ${selectedVehicleId === v.id ? 'bg-slate-900 border-slate-900 shadow-xl' : 'bg-white border-slate-200'}`}
                        >
                           <div className="flex justify-between items-start mb-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedVehicleId === v.id ? 'bg-white/10 text-primary' : 'bg-slate-50 text-slate-400'}`}>
                                 <Car size={20} />
                              </div>
                              <Badge className={`border-none text-[8px] font-black px-2 py-0.5 rounded-lg ${selectedVehicleId === v.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                 {v.plateNumber}
                              </Badge>
                           </div>
                           <p className={`text-sm font-black italic tracking-tight text-left ${selectedVehicleId === v.id ? 'text-white' : 'text-slate-900'}`}>{v.brand} {v.model}</p>
                           <p className={`text-[9px] font-black uppercase tracking-widest text-left ${selectedVehicleId === v.id ? 'text-white/40' : 'text-slate-400'}`}>{v.fuelType}</p>
                        </button>
                     ))}
                     <button className="flex-none w-48 p-4 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                        <Plus size={24} className="text-slate-300" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Add Vehicle</span>
                     </button>
                  </div>

                  {selectedVehicle && (
                     <div className="space-y-6">
                        {/* Vital Stats Card */}
                        <Card className="p-8 border-slate-200 shadow-lg shadow-slate-200/50 rounded-[2.5rem] bg-white relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-5 -mr-12 -mt-12 pointer-events-none grayscale">
                               <img src={selectedVehicle.image} alt="vehicle" className="w-80 h-80 object-cover rotate-12" />
                           </div>
                           
                           <div className="relative z-10">
                              <div className="flex justify-between items-center mb-10">
                                 <div>
                                    <h2 className="text-3xl font-black text-slate-900 italic uppercase leading-tight tracking-tight">{selectedVehicle.brand} {selectedVehicle.model}</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hardware ID: {selectedVehicle.id}</p>
                                 </div>
                                 <div className="text-right">
                                    <div className="inline-flex flex-col items-center justify-center w-16 h-16 rounded-full border-4 border-emerald-500/20 bg-emerald-50">
                                       <p className="text-lg font-black text-emerald-600 italic leading-none">{selectedVehicle.healthScore}</p>
                                       <p className="text-[8px] font-black uppercase text-emerald-500">Score</p>
                                    </div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                       {selectedVehicle.isEv ? <Zap size={14} className="text-amber-500" /> : <Droplets size={14} className="text-primary" />}
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedVehicle.isEv ? 'Battery' : 'Fuel'}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                       <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${selectedVehicle.fuelLevel}%` }}
                                          className={`h-full rounded-full ${selectedVehicle.fuelLevel < 20 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                                       />
                                    </div>
                                    <p className="text-lg font-black text-slate-900 italic">{selectedVehicle.fuelLevel}% <span className="text-xs font-bold text-slate-400 normal-case ml-2">~{selectedVehicle.range}km left</span></p>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex items-center gap-2 mb-2">
                                       <Activity size={14} className="text-indigo-500" />
                                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Odometer</span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 italic leading-none">{selectedVehicle.mileage.toLocaleString()} <span className="text-[10px] font-black text-slate-400 uppercase ml-1">KM</span></p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Next Service: {selectedVehicle.nextServiceMileage.toLocaleString()} km</p>
                                 </div>
                              </div>
                           </div>
                        </Card>

                        {/* Reminders section */}
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Maintenance Intel</h3>
                              <Badge className="bg-slate-100 text-slate-400 border-none text-[8px] font-black px-2 py-0.5 uppercase">AI Monitored</Badge>
                           </div>
                           
                           {maintenanceReminders.filter(r => r.vehicleId === selectedVehicleId).map(reminder => (
                              <Card key={reminder.id} className={`p-4 border-none shadow-sm rounded-3xl flex items-center gap-4 ${
                                reminder.urgency === 'HIGH' ? 'bg-rose-50 text-rose-900' : 'bg-white border-slate-100'
                              }`}>
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                    reminder.urgency === 'HIGH' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                    {reminder.urgency === 'HIGH' ? <AlertTriangle size={18} /> : <Wrench size={18} />}
                                 </div>
                                 <div className="flex-1">
                                    <p className="text-xs font-black italic mb-0.5">{reminder.title}</p>
                                    <p className="text-[10px] font-bold opacity-60 leading-tight">{reminder.description}</p>
                                 </div>
                                 <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    onClick={() => dismissReminder(reminder.id)}
                                    className="p-2 hover:bg-black/5 rounded-lg"
                                 >
                                    <CheckCircle2 size={18} />
                                 </Button>
                              </Card>
                           ))}
                        </div>

                        {/* Smart Recommendations */}
                        <Card className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-900 text-white rounded-[2.5rem] shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-8 opacity-10">
                              <Zap size={120} />
                           </div>
                           <div className="relative z-10">
                              <div className="flex items-center gap-2 mb-4">
                                 <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-primary">
                                    <Star size={16} />
                                 </div>
                                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Optimization Tip</span>
                              </div>
                              <p className="text-lg font-black italic tracking-tight mb-4 leading-tight lowercase">
                                 Your battery performance is peaking. Recommended long-distance trip before next heatwave.
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                                 <CheckCircle2 size={12} className="text-primary" />
                                 AI Confidence 92%
                              </div>
                           </div>
                        </Card>
                     </div>
                  )}
               </motion.div>
            )}

            {activeTab === 'services' && (
               <motion.div
                  key="services"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
               >
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Nearby Specialists</h3>
                     <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1">
                        View Map <Navigation size={12} />
                     </Button>
                  </div>

                  <div className="space-y-6">
                     {serviceProviders.map(provider => (
                        <Card key={provider.id} className="p-5 border-slate-200 shadow-sm rounded-3xl bg-white hover:shadow-md transition-all group">
                           <div className="flex items-start gap-4 mb-6">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 flex-none shadow-sm">
                                 <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1">
                                 <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-lg font-black text-slate-900 italic tracking-tight leading-none group-hover:text-primary transition-colors">{provider.name}</h4>
                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-lg">
                                       <Star size={10} fill="currentColor" />
                                       <span className="text-[9px] font-black">{provider.rating}</span>
                                    </div>
                                 </div>
                                 <div className="flex flex-wrap gap-1.5 mb-2">
                                    {provider.type.map(t => (
                                       <Badge key={t} className="bg-slate-50 text-slate-400 border-none text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter">
                                          {t.replace('_', ' ')}
                                       </Badge>
                                    ))}
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-400 italic flex items-center gap-1">
                                    <MapPin size={10} /> {provider.distance}km away • {provider.priceRange}
                                 </p>
                              </div>
                           </div>
                           
                           <div className="space-y-2 mb-6">
                              {provider.services.map(s => (
                                 <div key={s.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <div>
                                       <p className="text-xs font-black text-slate-800 italic leading-none mb-1">{s.name}</p>
                                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.duration} mins duration</p>
                                    </div>
                                    <p className="text-sm font-black italic text-slate-900">RM {s.price}</p>
                                 </div>
                              ))}
                           </div>

                           <Button 
                              className="w-full h-12 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-primary transition-all overflow-hidden relative"
                              onClick={() => {
                                 setSelectedProvider(provider);
                                 setShowBookingModal(true);
                              }}
                           >
                              <div className="relative z-10 flex items-center justify-center gap-2 italic">
                                 Configure Booking <ChevronRight size={14} />
                              </div>
                           </Button>
                        </Card>
                     ))}
                  </div>
               </motion.div>
            )}

            {activeTab === 'emergency' && (
               <motion.div
                  key="emergency"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
               >
                  <Card className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[3rem] text-center overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-5 -mr-16 -mt-16 text-rose-500">
                        <ShieldAlert size={200} />
                     </div>
                     <div className="relative z-10">
                        <div className="w-20 h-20 bg-rose-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/30 animate-pulse">
                           <ShieldAlert size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-rose-900 italic uppercase tracking-tight mb-2">Emergency Hub</h2>
                        <p className="text-xs font-bold text-rose-700/60 mb-8 max-w-[240px] mx-auto italic">
                           Instant roadside assistance dispatch. 24/7 urban rescue protocol.
                        </p>

                        {!activeEmergencyRequest ? (
                           <div className="grid grid-cols-2 gap-4">
                              {[
                                 { id: 'BATTERY', label: 'Jumpstart', icon: Zap },
                                 { id: 'TIRE', label: 'Flat Tire', icon: Settings },
                                 { id: 'TOW', label: 'Towing', icon: ShoppingBag },
                                 { id: 'EV_RESCUE', label: 'EV Rescue', icon: Battery }
                              ].map(help => (
                                 <button
                                    key={help.id}
                                    onClick={() => {
                                       requestEmergency(help.id as any, 3.1478, 101.7100);
                                       addToast('Dispatching... Requesting nearest technician', 'info');
                                    }}
                                    className="p-6 bg-white border border-rose-100 rounded-3xl flex flex-col items-center gap-3 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                 >
                                    <help.icon size={24} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{help.label}</span>
                                 </button>
                              ))}
                           </div>
                        ) : (
                           <div className="space-y-6">
                              <Card className="p-6 bg-white border-rose-200 rounded-3xl text-left">
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                       <Activity size={24} className="animate-pulse" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{activeEmergencyRequest.status}</p>
                                       <h4 className="text-lg font-black text-slate-900 italic">{activeEmergencyRequest.type.replace('_', ' ')} Dispatched</h4>
                                    </div>
                                 </div>
                                 
                                 {activeEmergencyRequest.status === 'ASSIGNED' && (
                                    <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                                       <div className="flex items-center justify-between mb-4">
                                          <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                                <img src="https://i.pravatar.cc/100?u=rescue" alt="rescue" className="w-full h-full object-cover" />
                                             </div>
                                             <div>
                                                <p className="text-sm font-black italic">Ahmad Fauzi</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Technician ID: #552</p>
                                             </div>
                                          </div>
                                          <Button size="sm" className="bg-emerald-500 text-white p-2 h-10 w-10 rounded-xl">
                                             <Phone size={18} />
                                          </Button>
                                       </div>
                                       <div className="flex items-center gap-3 text-emerald-600">
                                          <Clock size={16} />
                                          <span className="text-sm font-black italic">Arrival in {activeEmergencyRequest.eta} mins</span>
                                       </div>
                                    </div>
                                 )}

                                 <Button 
                                    onClick={cancelEmergency}
                                    className="w-full h-12 border-2 border-rose-100 text-rose-500 font-black uppercase text-[10px] tracking-widest rounded-2xl"
                                 >
                                    Cancel Request
                                 </Button>
                              </Card>
                           </div>
                        )}
                     </div>
                  </Card>
               </motion.div>
            )}

            {activeTab === 'history' && (
               <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
               >
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 italic">Service Protocol</h3>
                  </div>

                  {serviceBookings.map(booking => (
                     <Card key={booking.id} className="p-4 border-slate-100 shadow-sm rounded-3xl bg-white flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                           booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'
                        }`}>
                           {booking.type === 'CAR_WASH' ? <Droplets size={24} /> : <Wrench size={24} />}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{booking.status}</p>
                              <p className="text-xs font-black text-slate-900 italic">RM {booking.price}</p>
                           </div>
                           <h4 className="text-sm font-black text-slate-900 italic leading-none mb-1">{booking.serviceName}</h4>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{booking.providerName}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">{new Date(booking.dateTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(booking.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </Card>
                  ))}

                  {serviceBookings.length === 0 && (
                     <div className="text-center py-20 opacity-30 grayscale saturate-0 pointer-events-none">
                        <img src="https://images.unsplash.com/photo-1549194388-f61be84a6e9e?auto=format&fit=crop&q=80&w=200" alt="empty" className="w-24 h-24 object-cover mx-auto rounded-full mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No service record identified</p>
                     </div>
                  )}
               </motion.div>
            )}
         </AnimatePresence>
      </main>

      {/* Booking Modal */}
      <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)} title="Confgure Service">
         {selectedProvider && (
            <div className="space-y-6 pt-4">
               <div>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Select Protocol</h4>
                  <div className="space-y-2">
                     {selectedProvider.services.map(s => (
                        <button
                           key={s.name}
                           onClick={() => handleBookService(selectedProvider, s)}
                           className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-primary transition-all group"
                        >
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-sm font-black text-slate-900 italic uppercase leading-none mb-1 group-hover:text-primary">{s.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.duration} mins duration</p>
                              </div>
                              <p className="text-lg font-black italic text-slate-900">RM {s.price}</p>
                           </div>
                        </button>
                     ))}
                  </div>
               </div>

               <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                     <Calendar size={20} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none mb-1">Slot Identification</p>
                     <p className="text-[9px] font-bold text-indigo-600/60 lowercase italic">Instant confirmation protocol active.</p>
                  </div>
               </div>
            </div>
         )}
      </Modal>
    </div>
  );
};
