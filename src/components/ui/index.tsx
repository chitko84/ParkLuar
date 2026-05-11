/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode, ButtonHTMLAttributes, HTMLAttributes, ComponentPropsWithoutRef } from 'react';
import { motion } from 'motion/react';

// Card
export const Card = ({ children, className = "", noPadding = false, hover = false, ...props }: any) => (
  <div 
    className={`bg-white rounded-[2.5rem] border border-slate-100 shadow-soft overflow-hidden transition-all duration-300 ${hover ? "hover:shadow-premium hover:-translate-y-1" : ""} ${noPadding ? "" : "p-8"} ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Badge
export const Badge = ({ children, variant = "slate", className = "", ...props }: any) => {
  const variants: Record<string, string> = {
    primary: "bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/5",
    warning: "bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-sm shadow-amber-500/5",
    error: "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-sm shadow-rose-500/5",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    blue: "bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-sm shadow-blue-500/5",
  };

  return (
    <span 
      className={`px-3 py-1.5 rounded-xl text-[9px] uppercase font-black border tracking-[0.1em] inline-flex items-center justify-center ${variants[variant] || variants.slate} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Button
export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  isLoading = false, 
  icon,
  className = "", 
  ...props 
}: any) => {
  const baseStyles = "inline-flex items-center justify-center font-black transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest";
  
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white shadow-xl shadow-primary/20 border-none",
    secondary: "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-soft",
    ghost: "bg-transparent hover:bg-slate-50 text-slate-600",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-500/20 border-none",
  };

  const sizes = {
    sm: "px-4 py-2 text-[9px] rounded-xl",
    md: "px-6 py-3.5 text-[10px] rounded-2xl",
    lg: "px-10 py-5 text-[12px] rounded-[1.5rem]",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// Stats Card
export const StatsCard = ({ label, value, subValue, icon: Icon, trend, className = "" }: any) => (
  <Card hover className={`flex flex-col gap-1 border-slate-100/50 ${className}`}>
    <div className="flex justify-between items-start mb-4">
       <div className={`p-3 rounded-[1.2rem] ${trend?.positive ? 'bg-emerald-50 text-emerald-500' : 'bg-primary/5 text-primary'}`}>
          {Icon && <Icon size={20} />}
       </div>
       {trend && (
         <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black ${trend.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
           {trend.positive ? '↑' : '↓'} {trend.value}
         </div>
       )}
    </div>
    <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em] leading-none mb-2">
      {label}
    </p>
    <div className="flex items-end justify-between">
      <span className="text-3xl font-black text-blue-950 tracking-tighter leading-none italic">{value}</span>
    </div>
    {subValue && <span className="text-[10px] font-bold text-blue-700 mt-3 font-mono opacity-100 uppercase">{subValue}</span>}
  </Card>
);

// Section Header
export const SectionHeader = ({ title, subtitle, actionLabel, onAction, className = "" }: { title: string, subtitle?: string, actionLabel?: string, onAction?: () => void, className?: string }) => (
  <div className={`flex items-center justify-between mb-6 ${className}`}>
    <div>
      <h2 className="text-lg font-black text-blue-950 tracking-tight">{title}</h2>
      {subtitle && <p className="text-xs font-bold text-blue-700 mt-1">{subtitle}</p>}
    </div>
    {actionLabel && (
      <button 
        onClick={onAction}
        className="text-sm font-black text-primary hover:text-primary-light transition-colors uppercase tracking-widest text-[11px]"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

// Input
export const Input = ({ label, error, containerClassName = "", ...props }: { label?: string, error?: string, containerClassName?: string } & ComponentPropsWithoutRef<'input'>) => (
  <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
    {label && <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest">{label}</label>}
    <input 
      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-blue-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${error ? 'border-rose-500 bg-rose-50' : ''}`}
      {...props} 
    />
    {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight ml-1">{error}</span>}
  </div>
);

// Select
export const Select = ({ label, options, error, containerClassName = "", ...props }: { label?: string, options: (string | { label: string, value: string })[], error?: string, containerClassName?: string } & ComponentPropsWithoutRef<'select'>) => (
  <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
    {label && <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest">{label}</label>}
    <select 
      className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm font-black text-blue-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all ${error ? 'border-rose-500 bg-rose-50' : ''}`}
      {...props}
    >
      {options.map((opt, idx) => {
        const option = typeof opt === 'string' ? { label: opt, value: opt } : opt;
        return <option key={`${option.value}-${idx}`} value={option.value}>{option.label}</option>;
      })}
    </select>
    {error && <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tight ml-1">{error}</span>}
  </div>
);

// Toast System
import { create } from 'zustand';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

import { AnimatePresence } from 'motion/react';
import { X, CheckCircle2, AlertCircle, Info, Bell } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();
  
  return (
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-[1.5rem] shadow-2xl shadow-slate-900/10 border ${
              toast.type === 'success' ? 'bg-white border-emerald-100' : 
              toast.type === 'error' ? 'bg-white border-rose-100' : 
              'bg-white border-blue-100'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 
              toast.type === 'error' ? 'bg-rose-50 text-rose-500' : 
              'bg-blue-50 text-blue-500'
            }`}>
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : 
               toast.type === 'error' ? <AlertCircle size={18} /> : 
               <Info size={18} />}
            </div>
            <p className="text-xs font-black text-slate-800 tracking-tight pr-4">{toast.message}</p>
            <button onClick={() => removeToast(toast.id)} className="text-slate-300 hover:text-slate-500">
               <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Modal
export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[500]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[510] pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-2xl font-black text-blue-950 tracking-tighter leading-none">{title}</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5 font-sans">Network Protocol</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto no-scrollbar flex-1 whitespace-normal text-left">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// Drawer (Slide-up for mobile/detail)
export const Drawer = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: ReactNode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[500]"
          />
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:right-auto sm:w-full sm:max-w-2xl sm:-translate-x-1/2 max-h-[95vh] bg-white rounded-t-[3rem] shadow-2xl z-[510] overflow-hidden flex flex-col"
          >
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
            <div className="p-8 pb-4 flex items-center justify-between shrink-0">
               <div>
                  <h3 className="text-2xl font-black text-blue-950 tracking-tighter leading-none">{title}</h3>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1.5 font-sans">Intelligence Protocol</p>
               </div>
               <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-500 transition-colors">
                  <X size={20} />
               </button>
            </div>
            <div className="p-8 flex-1 overflow-y-auto no-scrollbar mb-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Empty State
export const EmptyState = ({ title, description, icon: Icon, action }: { title: string, description: string, icon: any, action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center">
    <div className="p-4 bg-slate-50 rounded-full mb-4">
      <Icon size={32} className="text-slate-300" />
    </div>
    <h3 className="text-lg font-display font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-slate-600 text-sm max-w-xs mb-6">{description}</p>
    {action}
  </div>
);
