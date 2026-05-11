import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  Zap, 
  Crown, 
  Star, 
  ShieldCheck, 
  Navigation2, 
  BrainCircuit, 
  TrendingUp,
  Activity,
  Cpu
} from 'lucide-react';
import { Card, Badge, Button, SectionHeader } from './ui';
import { useData } from '../context/DataContext';
import { SubscriptionTier } from '../types';

const PLANS = [
  {
    id: 'PLUS' as SubscriptionTier,
    name: 'ParkLuar Plus',
    price: '14.90',
    color: 'blue',
    icon: Star,
    features: [
      'Lower service fees',
      'Better recommendations',
      'See busy times',
      'Faster booking',
      'Hold spots longer',
      'Fastest directions',
      'Member badge'
    ]
  },
  {
    id: 'PRO' as SubscriptionTier,
    name: 'ParkLuar Pro',
    price: '29.90',
    popular: true,
    color: 'fuchsia',
    icon: Crown,
    features: [
      'Extra parking discounts',
      'Guaranteed reservations',
      'Automatic backup spot',
      'Access to busy areas',
      'Advanced safety info',
      'Traffic avoidance',
      'Exclusive parking zones',
      'Better city insights'
    ]
  },
  {
    id: 'HOST_ELITE' as SubscriptionTier,
    name: 'Host Elite',
    price: '49.90',
    color: 'emerald',
    icon: Zap,
    features: [
      'Advanced host tools',
      'Automatic pricing',
      'Best spot optimization',
      'Earnings forecast',
      'Featured listings',
      'Booking predictions',
      'Host dashboard'
    ]
  }
];

export const SubscriptionPlans: React.FC = () => {
  const { userSubscription, updateSubscription } = useData();

  return (
    <div className="space-y-10 py-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
           <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary">
              <Crown size={32} />
           </div>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Choose Your Plan</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm font-medium">
          Choose the best way to park and earn. We have a plan for everyone.
        </p>
      </div>

      {userSubscription.tier === 'FREE_TRIAL' && (
        <Card className="p-6 border-fuchsia-100 bg-fuchsia-50/50 backdrop-blur-md relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity size={80} className="text-fuchsia-500" />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                 <div className="flex items-center gap-2 mb-2">
                    <Badge variant="blue" className="bg-fuchsia-500 text-white border-none text-[10px] uppercase font-black px-2">FREE TRIAL ACTIVE</Badge>
                    <span className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest">{userSubscription.trialDaysRemaining} days remaining</span>
                 </div>
                 <p className="text-sm font-bold text-slate-700">Experience premium features for a limited time. Upgrade now to avoid interruption.</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="text-right mr-4 hidden md:block">
                    <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Savings to date</p>
                    <p className="text-xl font-black text-slate-900 leading-none italic">RM 24.50</p>
                 </div>
                 <Badge className="bg-white/60 text-slate-600 px-4 py-2 rounded-2xl border-white/40">TRIAL USER</Badge>
              </div>
           </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`p-8 h-full flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] ${
              plan.popular ? 'border-fuchsia-200 ring-2 ring-fuchsia-500/20 shadow-xl' : 'border-slate-100'
            } rounded-[3rem] overflow-hidden`}>
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-fuchsia-500 text-white text-[10px] font-black px-8 py-2 rounded-bl-3xl uppercase tracking-[0.2em] shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="flex-1">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
                  plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  plan.color === 'fuchsia' ? 'bg-fuchsia-100 text-fuchsia-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  <plan.icon size={28} />
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">RM {plan.price}</span>
                    <span className="text-xs font-bold text-slate-400">/month</span>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-0.5 rounded-full ${
                        plan.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                        plan.color === 'fuchsia' ? 'bg-fuchsia-100 text-fuchsia-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => updateSubscription(plan.id)}
                className={`w-full py-8 rounded-[2.5rem] font-black text-sm uppercase tracking-widest shadow-xl transition-all shadow-${plan.color}-200 ${
                  userSubscription.tier === plan.id 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none'
                  : plan.color === 'blue' ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                    plan.color === 'fuchsia' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white' :
                    'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
                disabled={userSubscription.tier === plan.id}
              >
                {userSubscription.tier === plan.id ? 'CURRENT PLAN' : 'UPGRADE NOW'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
         <Card className="p-8 border-slate-950 bg-slate-950 text-white rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Cpu size={100} className="text-white" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                     <BrainCircuit size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-black italic tracking-tight">Savings Report</h3>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  "Based on your parking in Zone A, <span className="text-blue-400 font-black">ParkLuar Plus</span> will save you about <span className="text-emerald-400 font-black">RM740/year</span> through better pricing and avoiding traffic."
               </p>
               <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 h-14 font-black text-[10px] uppercase tracking-widest">
                  View Full Report
               </Button>
            </div>
         </Card>

         <Card className="p-8 border-fuchsia-500 bg-gradient-to-br from-fuchsia-600 to-indigo-700 text-white rounded-[3rem] relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
               <ShieldCheck size={120} className="text-white" />
            </div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <TrendingUp size={20} className="text-white" />
                     </div>
                     <h3 className="text-xl font-black italic tracking-tight">Spot Guarantee</h3>
                  </div>
                  <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[300px]">
                     "Premium members get <span className="text-white font-black underline decoration-fuchsia-300">Spot Protection</span>. If your spot becomes unavailable, we automatically find you a better one at no extra cost."
                  </p>
               </div>
               <div className="flex items-center gap-2 mt-8">
                  <div className="flex -space-x-2">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-fuchsia-600 bg-slate-200 overflow-hidden">
                           <img 
                             src={`https://i.pravatar.cc/100?u=user${i+10}`} 
                             className="w-full h-full object-cover" 
                             referrerPolicy="no-referrer"
                             onError={(e) => {
                               (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User&background=random`;
                             }}
                           />
                        </div>
                     ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Join 12,402 Pro members</span>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};
