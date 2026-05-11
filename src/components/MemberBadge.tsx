import React from 'react';
import { Crown, Star, Zap, ShieldCheck } from 'lucide-react';
import { Badge } from './ui';
import { SubscriptionTier } from '../types';

interface MemberBadgeProps {
  tier: SubscriptionTier;
  className?: string;
  showIcon?: boolean;
}

export const MemberBadge: React.FC<MemberBadgeProps> = ({ tier, className = '', showIcon = true }) => {
  const getTierConfig = () => {
    switch (tier) {
      case 'PLUS':
        return { label: 'PLUS', icon: Star, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200' };
      case 'PRO':
        return { label: 'PRO', icon: Crown, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100', border: 'border-fuchsia-200' };
      case 'HOST_ELITE':
        return { label: 'ELITE', icon: Zap, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' };
      case 'FREE_TRIAL':
        return { label: 'TRIAL', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-200' };
      default:
        return null;
    }
  };

  const config = getTierConfig();
  if (!config) return null;

  return (
    <Badge 
      variant="blue" 
      className={`${config.bg} ${config.color} ${config.border} flex items-center gap-1.5 px-3 py-1 font-black text-[9px] uppercase tracking-widest rounded-full shadow-sm ${className}`}
    >
      {showIcon && <config.icon size={10} strokeWidth={3} />}
      {config.label} MEMBER
    </Badge>
  );
};
