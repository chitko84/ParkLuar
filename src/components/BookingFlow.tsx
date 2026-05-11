import React, { useState, useMemo } from 'react';
import { 
  Car, Clock, Calendar, CheckCircle2, 
  CreditCard, ChevronRight, X, Shield, 
  Zap, ArrowLeft, Smartphone, Receipt, 
  User, MapPin, QrCode, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Badge } from './ui';
import { ParkingListing, Vehicle, Booking } from '../types';
import { vehicles } from '../data/mockData';

interface BookingFlowProps {
  listing: ParkingListing;
  onClose: () => void;
  onSuccess: (booking: Booking) => void;
}

type Step = 'vehicle' | 'time' | 'review' | 'payment' | 'success';

export const BookingFlow: React.FC<BookingFlowProps> = ({ listing, onClose, onSuccess }) => {
  const [step, setStep] = useState<Step>('vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [duration, setDuration] = useState(2); // hours
  const [startTime, setStartTime] = useState("14:00");
  
  // Specific user vehicles as requested
  const userVehicles: Vehicle[] = [
    { 
      id: 'v-1', 
      userId: 'driver-1', 
      brand: 'Perodua', 
      model: 'Myvi', 
      plateNumber: 'VCC 8122', 
      color: 'Electric Blue',
      fuelType: 'PETROL',
      fuelLevel: 65,
      mileage: 24500,
      healthScore: 92,
      lastServiceDate: '2024-03-15T10:00:00Z',
      nextServiceMileage: 30000,
      isEv: false,
      range: 450,
      status: 'SECURE',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400',
    },
    { 
      id: 'v-2', 
      userId: 'driver-1', 
      brand: 'Proton', 
      model: 'X50', 
      plateNumber: 'WXY 4921', 
      color: 'Snow White',
      fuelType: 'PETROL',
      fuelLevel: 42,
      mileage: 12800,
      healthScore: 95,
      lastServiceDate: '2024-02-20T10:00:00Z',
      nextServiceMileage: 20000,
      isEv: false,
      range: 520,
      status: 'SECURE',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400',
    },
    { 
      id: 'v-3', 
      userId: 'driver-1', 
      brand: 'Honda', 
      model: 'City', 
      plateNumber: 'BQA 7701', 
      color: 'Modern Steel',
      fuelType: 'PETROL',
      fuelLevel: 88,
      mileage: 35000,
      healthScore: 88,
      lastServiceDate: '2023-11-10T10:00:00Z',
      nextServiceMileage: 40000,
      isEv: false,
      range: 580,
      status: 'SECURE',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400',
    },
  ];

  const pricing = useMemo(() => {
    const baseUnit = listing.dynamicPricing?.basePrice || listing.pricePerHour;
    const currentUnit = listing.dynamicPricing?.currentPrice || listing.pricePerHour;
    const adjustment = currentUnit - baseUnit;
    
    const baseTotal = baseUnit * duration;
    const adjustmentTotal = adjustment * duration;
    const subtotal = currentUnit * duration;
    
    const platformFee = subtotal * 0.1;
    const total = subtotal + platformFee;
    const hostEarnings = subtotal * 0.9;
    const savings = (total * 0.3); // Mock generic savings

    return { 
      baseTotal, 
      adjustmentTotal, 
      subtotal, 
      platformFee, 
      total, 
      hostEarnings, 
      savings,
      label: listing.dynamicPricing?.statusLabel || "Standard Rate",
      reason: listing.dynamicPricing?.reasoning || "Good price for the current time"
    };
  }, [listing, duration]);

  const handlePayment = () => {
    // Simulate payment processing
    setStep('payment');
    setTimeout(() => {
      setStep('success');
      const newBooking: Booking = {
        id: `book-${Math.random().toString(36).substr(2, 9)}`,
        listingId: listing.id,
        driverId: 'current-user',
        vehicleId: selectedVehicle?.id || 'v-1',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + duration * 3600000).toISOString(),
        totalPrice: pricing.total,
        status: 'CONFIRMED',
      };
      onSuccess(newBooking);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step !== 'vehicle' && step !== 'success' && (
              <button 
                onClick={() => {
                  if (step === 'time') setStep('vehicle');
                  else if (step === 'review') setStep('time');
                  else if (step === 'payment') setStep('review');
                }} 
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <ArrowLeft size={20} className="text-slate-500" />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {step === 'vehicle' && 'Select Vehicle'}
                {step === 'time' && 'Select Time Slot'}
                {step === 'review' && 'Review Booking'}
                {step === 'payment' && 'Processing Payment'}
                {step === 'success' && 'Booking Confirmed'}
              </h2>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`h-1 w-6 rounded-full ${
                    (step === 'vehicle' && i === 1) || 
                    (step === 'time' && i <= 2) || 
                    (step === 'review' && i <= 3) || 
                    (step === 'payment' && i <= 4) ||
                    (step === 'success' && i <= 4)
                    ? 'bg-primary' : 'bg-slate-100'
                  }`} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          <AnimatePresence mode="wait">
            {step === 'vehicle' && (
              <motion.div 
                key="step-v"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-bold text-slate-600 uppercase tracking-widest pl-1">Your Registered Vehicles</p>
                {userVehicles.map((v) => (
                  <div 
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`p-4 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${
                      selectedVehicle?.id === v.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${selectedVehicle?.id === v.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                        <Car size={24} />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-800">{v.brand} {v.model}</p>
                        <p className="text-xs font-bold text-slate-500">{v.plateNumber} • {v.color}</p>
                      </div>
                    </div>
                    {selectedVehicle?.id === v.id && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                ))}
                <Button 
                  disabled={!selectedVehicle} 
                  onClick={() => setStep('time')}
                  className="w-full py-6 mt-8 text-lg font-black rounded-3xl"
                >
                  Continue to Time
                </Button>
              </motion.div>
            )}

            {step === 'time' && (
              <motion.div 
                key="step-t"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Arrival Time</p>
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-primary" />
                       <input 
                        type="time" 
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-transparent font-black text-slate-900 outline-none" 
                       />
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">Duration</p>
                    <div className="flex items-center justify-between">
                       <button onClick={() => setDuration(Math.max(1, duration - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold">-</button>
                       <span className="font-black text-slate-900">{duration} hrs</span>
                       <button onClick={() => setDuration(duration + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold">+</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Availability Grid</p>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className={`h-12 rounded-xl border flex items-center justify-center text-[10px] font-bold ${
                        i < 4 ? 'bg-slate-50 border-slate-100 text-slate-300' : 
                        (i >= 6 && i < 6 + duration) ? 'bg-primary/10 border-primary text-primary' :
                        'bg-white border-slate-100 text-slate-500'
                      }`}>
                        {12 + i}:00
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 italic">* Greyscale slots are currently occupied by other drivers.</p>
                </div>

                <Button onClick={() => setStep('review')} className="w-full py-6 mt-4 text-lg font-black rounded-3xl">Review Booking</Button>
              </motion.div>
            )}

            {step === 'review' && (
              <motion.div 
                key="step-r"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-6 border-slate-100 rounded-[2rem] bg-slate-50/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden shadow-sm shrink-0">
                      <img src={listing.images?.[0]} className="w-full h-full object-cover" alt="p" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{listing.title}</h4>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin size={10} /> {listing.neighborhood}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-4 border-t border-slate-100 pt-4">
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Vehicle</p>
                        <p className="text-sm font-black text-slate-800">{selectedVehicle?.plateNumber}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Time Slot</p>
                        <p className="text-sm font-black text-slate-800">{startTime} ({duration}h)</p>
                    </div>
                  </div>
                </Card>

                <div className="p-6 bg-slate-900 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Base Fare ({duration}h)</span>
                    <span className="text-white">RM {pricing.baseTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 text-slate-500">
                       <span>Price update</span>
                       <Badge variant="blue" className="bg-primary/20 text-primary border-none text-[8px] px-2">{pricing.label}</Badge>
                    </div>
                    <span className={pricing.adjustmentTotal >= 0 ? 'text-amber-400' : 'text-emerald-400'}>
                       {pricing.adjustmentTotal >= 0 ? '+' : ''}RM {pricing.adjustmentTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                     <p className="text-[10px] font-medium text-white/60 leading-tight">
                        <Info size={10} className="inline mr-1 mb-0.5" />
                        {pricing.reason}
                     </p>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Platform Fee (10%)</span>
                    <span className="text-white">RM {pricing.platformFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Total Payable</p>
                      <p className="text-3xl font-black">RM {pricing.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[9px] font-black uppercase">
                        <Zap size={10} /> Saved RM {pricing.savings.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                   <Shield size={20} className="text-primary shrink-0" />
                   <p className="text-[10px] font-medium text-slate-600">
                     By confirming, you agree that RM {pricing.hostEarnings.toFixed(2)} will be credited to the host. ParkLuar ensures safe AI-verified parking.
                   </p>
                </div>

                <Button onClick={handlePayment} className="w-full py-6 text-lg font-black rounded-3xl">Proceed to Payment</Button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="step-pay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative w-32 h-32 mb-8">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-8 border-slate-100 rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-t-8 border-primary rounded-full shadow-[0_0_20px_rgba(0,92,175,0.4)]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap size={32} className="text-primary animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Securing Payment</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest px-8">Connecting to secure bank servers...</p>
                <div className="mt-12 flex gap-1.5">
                   {[1,2,3].map(i => (
                     <motion.div 
                        key={i}
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                     />
                   ))}
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="step-s"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pb-4"
              >
                <div className="flex flex-col items-center text-center space-y-2 mb-6">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">You're all set!</h3>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Booking ID: PL-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>

                <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Parking Point</p>
                        <p className="text-sm font-black text-slate-800">{listing.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Arrival</p>
                        <p className="text-sm font-black text-slate-800">Today, {startTime}</p>
                      </div>
                    </div>
                    <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-2">
                       <QrCode size={60} className="text-slate-800" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-dashed border-slate-200">
                    <div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Plate Number</p>
                        <Badge variant="blue" className="mt-1">{selectedVehicle?.plateNumber}</Badge>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-500 uppercase">Check-In Mode</p>
                        <p className="text-xs font-black text-primary flex items-center justify-end gap-1"><Zap size={12} /> AI AUTO-SCAN</p>
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">Total Paid</p>
                      <p className="text-xl font-black text-slate-900">RM {pricing.total.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-bold text-emerald-600">+ 12 Points Earned</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button className="w-full py-5 text-base font-black rounded-3xl" onClick={onClose}>Proceed to AI Check-In</Button>
                  <Button variant="secondary" className="w-full py-5 text-base font-black rounded-3xl border-slate-200" onClick={onClose}>Download Receipt</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 bg-slate-50 shrink-0 text-center">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1">
             <Shield size={10} /> PCI-DSS Secure Encryption Active
           </p>
        </div>
      </motion.div>
    </div>
  );
};
