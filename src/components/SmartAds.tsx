import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { Card, Badge, Button } from './ui';
import { Megaphone, ArrowRight, Zap, X, MapPin } from 'lucide-react';

export const SmartAdBanner = () => {
  const { campaigns, partners, claimCoupon, userCoupons } = useData();
  
  // Show the most relevant campaign (simplified logic)
  const activeCampaign = campaigns.find(c => c.status === 'ACTIVE' && c.type === 'COUPON');
  const business = partners.find(p => p.id === activeCampaign?.businessId);
  const alreadyClaimed = userCoupons.some(c => c.campaignId === activeCampaign?.id);

  if (!activeCampaign || !business || alreadyClaimed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-[1000]"
    >
      <Card className="bg-slate-900/90 backdrop-blur-xl border-white/10 shadow-3xl rounded-3xl overflow-hidden p-0 flex">
        <div className="w-1.5 bg-primary h-full" />
        <div className="flex-1 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-white">
                <img src={business.logo} className="w-full h-full object-cover" />
             </div>
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <Badge className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0 h-auto border-0">Ad</Badge>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{business.name}</span>
                </div>
                <h4 className="text-xs font-black text-white italic leading-tight">{activeCampaign.title}</h4>
                <p className="text-[10px] font-bold text-emerald-400 mt-1">{activeCampaign.discountValue} available now</p>
             </div>
          </div>
          <Button 
            onClick={() => claimCoupon(activeCampaign.id)}
            className="bg-primary text-white hover:bg-primary/90 h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2 flex-shrink-0"
          >
             Claim
             <ArrowRight size={12} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export const CouponWallet = () => {
  const { userCoupons, useCoupon } = useData();
  const activeCoupons = userCoupons.filter(c => !c.isUsed);

  if (activeCoupons.length === 0) return null;

  return (
    <div className="space-y-4">
      <SectionHeader 
        title="Smart Rewards" 
        subtitle="Claimed ecosystem benefits" 
        icon={Zap} 
      />
      <div className="space-y-3">
        {activeCoupons.map(coupon => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="p-4 border-slate-100 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 pointer-events-none group-hover:bg-primary/10 transition-colors" />
               <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white overflow-hidden border border-slate-800">
                        <span className="text-[10px] font-black italic">{coupon.businessName.substring(0, 2)}</span>
                     </div>
                     <div>
                        <h5 className="text-[11px] font-black text-slate-800 leading-tight">{coupon.title}</h5>
                        <p className="text-[10px] font-bold text-primary italic uppercase tracking-widest">{coupon.discountValue}</p>
                     </div>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-primary/20 text-primary hover:bg-primary hover:text-white text-[9px] font-black uppercase tracking-widest italic"
                    onClick={() => useCoupon(coupon.id)}
                  >
                     Apply
                  </Button>
               </div>
               <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Code:</span>
                     <span className="text-[8px] font-mono font-bold text-slate-700 bg-slate-100 px-1 rounded">{coupon.code}</span>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 italic">Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, icon: Icon }: any) => (
  <div className="flex items-center justify-between mb-4 px-1">
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Icon size={16} />
       </div>
       <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 leading-none mb-1">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 italic">{subtitle}</p>
       </div>
    </div>
  </div>
);
