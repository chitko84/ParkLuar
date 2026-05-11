import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Shield, X, CheckCircle2, 
  AlertTriangle, Phone, Upload, 
  Camera, Loader2, Scan, 
  Maximize, Activity, Cpu, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card, Badge, useToastStore } from './ui';
import { ParkingListing, Vehicle, Booking, ScanLog } from '../types';
import { useData } from '../context/DataContext';

interface AIScannerProps {
  onClose: () => void;
  booking?: Booking;
  listing?: ParkingListing;
  vehicle?: Vehicle;
}

type ScanStatus = 
  | 'INITIALIZING' 
  | 'DETECTING_VEHICLE' 
  | 'READING_PLATE' 
  | 'MATCHING_BOOKING' 
  | 'VERIFYING_LOCATION' 
  | 'APPROVED' 
  | 'MISMATCH' 
  | 'MANUAL';

export const AIScanner: React.FC<AIScannerProps> = ({ onClose, booking, listing, vehicle }) => {
  const { updateBookingStatus, addScanLog } = useData();
  const { addToast } = useToastStore();
  const [status, setStatus] = useState<ScanStatus>('INITIALIZING');
  const [confidence, setConfidence] = useState(0);
  const [progress, setProgress] = useState(0);
  const [detectedPlate, setDetectedPlate] = useState<string | null>(null);

  const handleFinalizeEntry = () => {
    if (booking) {
      updateBookingStatus(booking.id, 'ACTIVE');
      addToast(`Booking ${booking.id} is now ACTIVE. Enjoy your stay!`, "success");
    }
    
    if (listing && vehicle) {
      addScanLog({
        listingId: listing.id,
        plateNumber: vehicle.plateNumber,
        timestamp: new Date().toISOString(),
        confidence: confidence / 100,
        action: 'ENTRY'
      });
    }

    onClose();
  };

  // Simulation steps
  useEffect(() => {
    const steps: { status: ScanStatus; duration: number }[] = [
      { status: 'INITIALIZING', duration: 1200 },
      { status: 'DETECTING_VEHICLE', duration: 1800 },
      { status: 'READING_PLATE', duration: 1800 },
      { status: 'MATCHING_BOOKING', duration: 1200 },
      { status: 'VERIFYING_LOCATION', duration: 1200 },
    ];

    let currentTimeout: any;
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex < steps.length && steps[stepIndex]) {
        setStatus(steps[stepIndex].status);
        
        const stepDuration = steps[stepIndex].duration;
        const startTime = Date.now();
        
        const updateProgress = () => {
          const elapsed = Date.now() - startTime;
          const p = Math.min(100, (elapsed / stepDuration) * 100);
          setProgress(p);
          
          if (steps[stepIndex]?.status === 'READING_PLATE') {
            setConfidence(88 + Math.random() * 11.5);
          }

          if (p < 100) {
            requestAnimationFrame(updateProgress);
          }
        };
        requestAnimationFrame(updateProgress);

        currentTimeout = setTimeout(() => {
          stepIndex++;
          runStep();
        }, stepDuration);
      } else {
        const isSuccess = Math.random() > 0.05; // 95% success for demo
        if (isSuccess && vehicle) {
          setDetectedPlate(vehicle.plateNumber);
          setStatus('APPROVED');
          setConfidence(99.8);
        } else {
          setDetectedPlate("VDC 1234");
          setStatus('MISMATCH');
          setConfidence(96.2);
        }
      }
    };

    runStep();

    return () => clearTimeout(currentTimeout);
  }, [vehicle]);

  const stages = [
    { label: 'System Ready', status: 'INITIALIZING', icon: Camera },
    { label: 'Finding Car', status: 'DETECTING_VEHICLE', icon: Scan },
    { label: 'Checking Plate', status: 'READING_PLATE', icon: Cpu },
    { label: 'Confirming Booking', status: 'MATCHING_BOOKING', icon: Activity },
    { label: 'All Checks Clear', status: 'VERIFYING_LOCATION', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-[3000] bg-black flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=2070&auto=format&fit=crop" 
            className="w-full h-full object-cover grayscale brightness-[0.2]" 
            alt="scannerbg" 
         />
         <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/80 to-primary/20" />
         
         {/* Grid Pattern */}
         <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Top HUD */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-start z-50">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-primary animate-pulse rounded-sm" />
              <h2 className="text-2xl font-black text-blue-400 tracking-widest uppercase italic">ParkLuar Smart Scan</h2>
           </div>
           <div className="flex gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Live Scanner</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest">Local Security Ready</span>
              </div>
           </div>
        </div>
        <div className="flex flex-col items-end gap-3">
           <div className="text-right">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[.3em] mb-1">Status</p>
              <p className="text-xl font-black text-white tracking-tighter uppercase">{status.replace('_', ' ')}</p>
           </div>
           <div className="flex gap-2">
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">SIGNAL: OPTIMAL</div>
              <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-md text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">SPEED: 12ms</div>
           </div>
        </div>
      </div>

      {/* Scanning Viewport */}
      <div className="relative w-full max-w-2xl aspect-video px-8 z-10 flex items-center justify-center">
        {/* Frame Brackets */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-[6px] border-l-[6px] border-primary rounded-tl-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.4)]" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-[6px] border-r-[6px] border-primary rounded-tr-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.4)]" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-[6px] border-l-[6px] border-primary rounded-bl-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.4)]" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-[6px] border-r-[6px] border-primary rounded-br-[3rem] shadow-[0_0_40px_rgba(37,99,235,0.4)]" />

        <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden rounded-[2.5rem]">
            {/* Visual Scan Layer */}
            <AnimatePresence>
              {status !== 'APPROVED' && status !== 'MISMATCH' && status !== 'MANUAL' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                   {/* Scanning Laser Line */}
                   <motion.div 
                     animate={{ top: ['10%', '90%', '10%'] }}
                     transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute left-10 right-10 h-[2px] bg-primary/80 shadow-[0_0_30px_#2563eb] z-20"
                   >
                      <div className="absolute -top-4 -left-1 text-[8px] font-black text-primary uppercase whitespace-nowrap">Scanning...</div>
                   </motion.div>

                   {/* Digital Noise Background */}
                   <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Decision Logic Cards */}
            <AnimatePresence mode="wait">
              {(status === 'APPROVED' || status === 'MISMATCH') ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="bg-slate-900/40 backdrop-blur-3xl p-12 rounded-[4rem] border-2 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-sm relative perspective-1000"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
                  
                  {status === 'APPROVED' ? (
                    <>
                      <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-[2rem] flex items-center justify-center mb-8 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 size={48} className="animate-bounce" />
                      </div>
                      <Badge className="bg-emerald-500 text-white border-none px-6 py-2 rounded-full mb-4 font-black uppercase tracking-[.3em] scale-110">Spot Verified</Badge>
                      <h3 className="text-4xl font-black text-white tracking-tighter mb-6 leading-none">Ready to Park</h3>
                      
                      <div className="bg-white/5 w-full p-6 rounded-[2rem] mb-8 text-left border border-white/10 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                           <div>
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Plate Number</p>
                              <p className="text-3xl font-black text-primary tracking-tighter leading-none">{detectedPlate}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Accuracy</p>
                              <p className="text-xl font-black text-emerald-400 leading-none">{confidence.toFixed(1)}%</p>
                           </div>
                        </div>
                        
                        <div className="space-y-3">
                           <div className="flex justify-between items-center text-white/60">
                              <span className="text-[10px] font-black uppercase tracking-widest">Plate Match</span>
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Matched</span>
                           </div>
                           <div className="flex justify-between items-center text-white/60">
                              <span className="text-[10px] font-black uppercase tracking-widest">Your Location</span>
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified</span>
                           </div>
                           <div className="flex justify-between items-center text-white/60">
                              <span className="text-[10px] font-black uppercase tracking-widest">Payment Info</span>
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ready</span>
                           </div>
                        </div>
                      </div>
                      <Button className="w-full h-20 text-xl font-black rounded-[2rem] shadow-2xl shadow-primary/40 flex gap-4 group" onClick={handleFinalizeEntry}>
                        Start Parking
                        <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-red-500/20 text-red-400 rounded-[2rem] flex items-center justify-center mb-8 border-2 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <AlertTriangle size={48} />
                      </div>
                      <Badge className="bg-red-500 text-white border-none px-6 py-2 rounded-full mb-4 font-black uppercase tracking-[.3em] scale-110">Wait a second</Badge>
                      <h2 className="text-[42px] font-black text-white tracking-widest leading-none mb-4 italic">Error</h2>
                      <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Plate Mismatch</h3>
                      <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-[200px]">The car doesn't match our records for this booking.</p>
                      
                      <div className="flex flex-col gap-3 w-full">
                        <Button className="w-full h-18 text-base font-black rounded-[1.5rem] shadow-2xl shadow-primary/20" onClick={() => setStatus('MANUAL')}>Manual Verification</Button>
                        <Button variant="secondary" className="w-full h-16 bg-white/5 border-white/10 text-white rounded-[1.5rem] font-bold" onClick={onClose}>Abort Entry</Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ) : status === 'MANUAL' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-slate-900/80 backdrop-blur-3xl p-12 rounded-[4rem] border-2 border-white/10 shadow-2xl flex flex-col items-center text-center max-w-sm"
                >
                  <div className="w-24 h-24 bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center mb-8 border-2 border-primary/40">
                    <Shield size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Need Help?</h3>
                  <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
                    Automated scan failed. Please upload a clear dashboard photo showing the environment, or contact the verified host.
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4 w-full">
                     <Button variant="secondary" className="w-full bg-white/5 border-white/10 text-white rounded-[1.5rem] h-18 flex items-center justify-center gap-3 font-black">
                        <Upload size={22} className="text-primary" /> Upload Photo
                     </Button>
                     <Button className="w-full h-18 font-black rounded-[1.5rem] shadow-2xl shadow-primary/20 text-base">Message Owner</Button>
                  </div>
                  <button className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[.3em] hover:text-white transition-colors" onClick={onClose}>Cancel</button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-10">
                   <div className="relative">
                      <div className="w-40 h-40 border-l-4 border-r-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                      <div className="absolute inset-4 border-l-4 border-r-4 border-blue-400/20 border-b-blue-400 rounded-full animate-reverse-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Zap size={32} className="text-primary animate-pulse" />
                      </div>
                   </div>
                   <div className="space-y-3 text-center">
                      <h4 className="text-white font-black uppercase tracking-[.5em] text-2xl leading-none italic">Analyzing</h4>
                      <div className="flex items-center gap-2 justify-center">
                         <Activity size={14} className="text-primary" />
                         <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Confidence Index: {confidence.toFixed(1)}%</p>
                      </div>
                   </div>
                </div>
              )}
            </AnimatePresence>
        </div>
      </div>

      {/* Sidebar Hardware Status */}
      <div className="absolute bottom-16 left-16 right-16 flex flex-col gap-8 z-50">
        <div className="grid grid-cols-5 gap-6 max-w-4xl mx-auto w-full">
          {stages.map((stage, i) => {
             const isActive = status === stage.status;
             const isPast = stages.findIndex(s => s.status === status) > i;
             return (
               <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className={`w-16 h-16 rounded-[1.5rem] border-2 transition-all duration-700 flex items-center justify-center relative overflow-hidden ${
                     isActive ? 'bg-primary border-primary text-white scale-110 shadow-[0_0_30px_#2563eb]' : 
                     isPast ? 'bg-emerald-500 border-emerald-500 text-white' :
                     'bg-white/5 border-white/10 text-white/20'
                  }`}>
                     {isActive && <motion.div layoutId="stage-glow" className="absolute inset-0 bg-white/20" />}
                     {isPast ? <CheckCircle2 size={24} /> : <stage.icon size={24} />}
                  </div>
                  <div className="flex flex-col items-center">
                     <span className={`text-[9px] font-black uppercase tracking-[.2em] text-center transition-colors ${isActive ? 'text-primary' : 'text-white/20'}`}>
                        {stage.label}
                     </span>
                     {isActive && (
                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-0.5 bg-primary mt-1" />
                     )}
                  </div>
               </div>
             );
          })}
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 flex justify-between items-center max-w-5xl mx-auto w-full group relative overflow-hidden">
           <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-primary">
                 <Cpu size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5 leading-none">Security Environment</p>
                 <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                       <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">PDRM Linked Area</span>
                    </div>
                    <p className="text-sm font-black text-white/80 tracking-tight">Access Node: MY-HUB-{listing?.id || 'SS15'}</p>
                 </div>
              </div>
           </div>
           <div className="flex gap-8 px-8 border-l border-white/10">
              <div className="text-right">
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Network Load</p>
                 <p className="text-2xl font-black text-white italic tracking-tighter">{(40 + Math.random() * 5).toFixed(1)}%</p>
              </div>
              <div className="text-right">
                 <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Uptime</p>
                 <p className="text-2xl font-black text-primary italic tracking-tighter leading-none">99.9<span className="text-sm">%</span></p>
              </div>
           </div>
        </div>
      </div>

      {/* Close button in absolute top */}
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/5 border border-white/10 rounded-2xl text-white/50 hover:text-white transition-all hover:bg-white/10 z-50"
      >
        <X size={20} />
      </button>

      <style>{`
        @keyframes reverse-spin {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-reverse-spin {
          animation: reverse-spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
};
