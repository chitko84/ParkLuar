import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Car, 
  MapPin, 
  ShieldCheck, 
  DollarSign, 
  ArrowRight,
  TrendingUp,
  Activity,
  Cpu
} from 'lucide-react';
import { Button, Card, Badge } from './ui';

interface IntroScreenProps {
  onStart: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary/10 overflow-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <motion.div 
            animate={{ 
                x: [0, 100, 0], 
                y: [0, -100, 0],
                rotate: [0, 90, 0] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" 
         />
         <motion.div 
            animate={{ 
                x: [0, -100, 0], 
                y: [0, 100, 0],
                rotate: [0, -90, 0] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-400/20 blur-[100px] rounded-full" 
         />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-32 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 border border-white/10 shadow-2xl">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                MALAYSIA'S NEW WAY TO PARK
             </div>
             <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-[0.9]">
                Shared Parking. <br/>
                <span className="text-primary italic">Smart & Simple.</span>
             </h1>
             <p className="text-xl md:text-2xl font-medium text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto">
                ParkLuar is Malaysia's first peer-to-peer parking network. Earn easy income from your empty porch or book verified spots in seconds.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <Button 
                   onClick={onStart}
                   className="h-16 px-10 text-lg font-black rounded-3xl shadow-[0_20px_50px_rgba(0,92,175,0.3)] hover:scale-105 transition-transform"
                >
                   Try ParkLuar Now
                   <ArrowRight className="ml-2" />
                </Button>
                <div className="flex flex-col items-center sm:items-start text-left">
                   <div className="flex -space-x-2 mb-1">
                      {[1,2,3,4].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="u" />
                         </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white">+2.4k</div>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">JOIN 2,400+ MALAYSIANS</p>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Demo Logic / Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { 
               title: 'Find Parking', 
               icon: Car, 
               color: 'bg-primary/5 text-primary',
               desc: 'Browse verified listings in Bangsar, Subang, and KLCC. Book instantly and pay digitally.',
               tags: ['Live Map', 'e-Wallet']
             },
             { 
               title: 'Smart Entry', 
               icon: Cpu, 
               color: 'bg-slate-900 text-white',
               desc: 'Our system automatically identifies your car for easy entry. No stickers needed.',
               tags: ['Entry Scan', 'Security']
             },
             { 
               title: 'Earn Extra Income', 
               icon: DollarSign, 
               color: 'bg-emerald-50 text-emerald-600',
               desc: 'Residents earn RM400-RM1,200 monthly in easy income. Fully automated management.',
               tags: ['Earn Money', 'Dashboard']
             }
           ].map((pillar, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.2 + (i * 0.1) }}
             >
                <Card className="h-full p-8 group hover:border-primary/20 transition-all border-slate-200 shadow-sm rounded-[3rem]">
                   <div className={`w-14 h-14 ${pillar.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <pillar.icon size={28} />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{pillar.title}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed mb-6">
                      {pillar.desc}
                   </p>
                   <div className="flex gap-2">
                      {pillar.tags.map(tag => (
                         <Badge key={tag} variant="slate" className="text-[9px] px-2 py-0.5 bg-slate-50 border-slate-100">{tag}</Badge>
                      ))}
                   </div>
                </Card>
             </motion.div>
           ))}
        </div>

        {/* Malaysian Stats */}
        <div className="mt-32 pt-20 border-t border-slate-100 text-center">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Platform Traction</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 { label: 'Listed Spots', value: '1,240', suffix: '+' },
                 { label: 'Active Drivers', value: '4.8', suffix: 'k' },
                 { label: 'Scan Success', value: '99', suffix: '%' },
                 { label: 'Total Paid Out', value: 'RM 2.4', suffix: 'M' },
               ].map((stat, i) => (
                 <div key={i}>
                    <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.value}{stat.suffix}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                 </div>
               ))}
            </div>
        </div>
      </div>

      {/* Floating Demo Path Helper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 md:flex hidden"
      >
         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Demo Flow:</p>
         <div className="flex items-center gap-2">
            <Badge variant="blue" className="text-[9px]">DRIVER</Badge>
            <ChevronRight size={12} className="text-slate-300" />
            <Badge variant="slate" className="text-[9px]">AI SCANNER</Badge>
            <ChevronRight size={12} className="text-slate-300" />
            <Badge variant="success" className="text-[9px]">HOST</Badge>
            <ChevronRight size={12} className="text-slate-300" />
            <Badge variant="primary" className="text-[9px]">ADMIN</Badge>
         </div>
      </motion.div>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
