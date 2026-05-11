import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Zap, 
  Navigation, 
  Clock, 
  MapPin, 
  Bell, 
  ChevronRight, 
  Radio, 
  Smartphone, 
  ShieldOff,
  Video,
  Sun,
  Activity,
  UserCheck,
  MessageSquare,
  AlertCircle,
  Flame,
  Power
} from 'lucide-react';
import { Card, Badge, Button, Modal, Input, useToastStore } from './ui';
import { SecurityAlert, SecurityIncident, SecurityEvent } from '../types';

export const SecurityCenter = () => {
  const { 
    activeSession, 
    vehicles, 
    securityAlerts, 
    securityIncidents, 
    securityEvents,
    acknowledgeAlert,
    triggerEmergencyMode,
    toggleSecurityShield,
    reportSecurityIncident
  } = useData();

  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'monitoring' | 'incidents' | 'settings'>('monitoring');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isShieldActive, setIsShieldActive] = useState(true);

  const parkedVehicle = vehicles.find(v => v.id === 'v-1'); // Default demo vehicle
  const activeAlerts = securityAlerts.filter(a => !a.acknowledged);

  const handleToggleShield = () => {
    const newState = !isShieldActive;
    setIsShieldActive(newState);
    toggleSecurityShield(newState);
    addToast(newState ? 'Shield Activated: AI monitoring is now active.' : 'Shield Deactivated: Monitoring has been suspended.', newState ? 'success' : 'info');
  };

  const handleTriggerEmergency = () => {
    if (parkedVehicle) {
      triggerEmergencyMode(parkedVehicle.id);
      addToast('Emergency Protocol: Security forces have been dispatched to your location.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pb-32">
      {/* Header Overlay */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        {/* Animated Grid Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 border-[0.5px] border-blue-500/30 grid grid-cols-12 pointer-events-none" />
        </div>

        <div className="relative z-10 px-6 pt-16">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-[0.3em]">Neural Security Grid</p>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight italic uppercase leading-none">Security Center</h1>
            </div>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-2 rounded-2xl flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isShieldActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                <Shield size={20} className={isShieldActive ? 'animate-pulse' : ''} />
              </div>
              <div className="pr-2">
                <p className="text-[8px] font-black uppercase text-slate-500 leading-none mb-1">Protection Status</p>
                <p className={`text-xs font-black italic uppercase ${isShieldActive ? 'text-blue-400' : 'text-slate-400'}`}>
                  {isShieldActive ? 'Active Shield' : 'Standby Mode'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 p-1.5 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5">
            {[
              { id: 'monitoring', label: 'Monitor', icon: Activity },
              { id: 'incidents', label: 'Analysis', icon: Zap },
              { id: 'settings', label: 'Protocols', icon: Power }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon size={14} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="px-6 -mt-8 relative z-20">
        <AnimatePresence mode="wait">
          {activeTab === 'monitoring' && (
            <motion.div
              key="monitoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Active Vehicle Status */}
              <Card className="p-8 bg-slate-900/60 backdrop-blur-xl border-slate-800 border-2 rounded-[2.5rem] overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-20 blur-xl group-hover:opacity-40 transition-opacity">
                  <ShieldCheck size={120} className="text-blue-500" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30 border-2 border-blue-400/30">
                      <Lock size={32} strokeWidth={2.5} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black italic tracking-tight text-white uppercase">{parkedVehicle?.brand} {parkedVehicle?.model}</h3>
                      <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{parkedVehicle?.plateNumber} • SMART SCAN ACTIVE</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Safety Rating</p>
                      <div className="flex items-end gap-2">
                        <p className="text-2xl font-black text-white italic leading-none">92<span className="text-sm font-bold text-slate-600">/100</span></p>
                        <Badge className="bg-blue-500/10 text-blue-400 border-none text-[8px] font-black h-5 flex items-center">ELITE</Badge>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Monitoring</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-black text-emerald-400 italic">SECURE</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest pb-2 border-b border-slate-800">
                      <span>Neural Scan Points</span>
                      <span className="text-blue-400">4 Points Online</span>
                    </div>
                    {[
                      { label: 'Proximity Sensor', status: 'Optimal', icon: Radio },
                      { label: 'Cloud Surveillance', status: 'Connected', icon: Video },
                      { label: 'Luminosity AI', status: 'Active', icon: Sun },
                      { label: 'Movement Tracker', status: 'Stable', icon: Activity }
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <item.icon size={14} className="text-slate-600" />
                            <span className="text-xs font-bold text-slate-300 italic">{item.label}</span>
                         </div>
                         <span className="text-[10px] font-black uppercase text-blue-500/70">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Emergency Protocol Button */}
              <button 
                onClick={handleTriggerEmergency}
                className="w-full h-24 bg-red-600 text-white rounded-[2rem] shadow-xl shadow-red-600/20 border-2 border-red-500 flex items-center justify-between px-8 relative overflow-hidden group active:scale-95 transition-transform"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div>
                   <h4 className="text-2xl font-black italic uppercase tracking-tighter text-left leading-none">Emergency Protocol</h4>
                   <p className="text-[10px] font-black uppercase tracking-widest text-red-100/60 mt-1">Dispatches Local Security Instantly</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                   <AlertTriangle size={24} />
                </div>
              </button>

              {/* Security Heatmap Preview */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Regional Intelligence</h3>
                  <Badge className="bg-slate-800 text-slate-400 border-none text-[8px] font-black">Live Update</Badge>
                </div>

                <Card className="p-6 bg-slate-900 border-slate-800 rounded-[2rem] space-y-6">
                   <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                         <Zap size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black italic text-white uppercase mb-1">AI Risk Prediction</h4>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                           Parking risk expected to increase by <span className="text-red-400 font-black">14%</span> after 11:00 PM due to reduced neighborhood activity.
                        </p>
                      </div>
                   </div>

                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <MapPin size={18} className="text-blue-500" />
                         <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recommended Port</p>
                            <p className="text-xs font-black text-white italic">Pavilion Secure Deck B2</p>
                         </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 border-slate-700 text-slate-400 text-[10px] font-black uppercase">Navigate</Button>
                   </div>
                </Card>
              </div>

              {/* Recent Alerts */}
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Security Timeline</h3>
                  <span className="text-[10px] font-bold text-slate-600">{securityEvents.length} Recent Events</span>
                </div>

                <div className="space-y-3">
                  {activeAlerts.map(alert => (
                    <motion.div 
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-5 rounded-[1.5rem] border-2 flex gap-4 ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500/10 border-red-500/30' :
                        alert.severity === 'HIGH' ? 'bg-orange-500/10 border-orange-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-none ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500 text-white' :
                        alert.severity === 'HIGH' ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        <AlertTriangle size={20} />
                      </div>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                            <Badge className="bg-white/10 text-white border-none text-[7px] font-black px-1.5 h-4 uppercase">{alert.severity}</Badge>
                         </div>
                         <p className="text-sm font-black text-white italic mb-2 leading-none">{alert.message}</p>
                         <p className="text-[10px] font-bold text-white/50 leading-tight mb-4 italic italic uppercase">{alert.suggestion}</p>
                         <Button 
                           onClick={() => acknowledgeAlert(alert.id)}
                           className="h-8 bg-white/10 hover:bg-white text-white hover:text-slate-900 border-none rounded-lg text-[9px] font-black uppercase tracking-widest"
                          >
                           Acknowledge
                         </Button>
                      </div>
                    </motion.div>
                  ))}
                  
                  {securityEvents.map(event => (
                    <div key={event.id} className="flex gap-4 px-2">
                       <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-slate-800" />
                          <div className="w-0.5 flex-1 bg-slate-800 my-1" />
                       </div>
                       <div className="pb-4">
                          <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-1">{new Date(event.timestamp).toLocaleTimeString()}</p>
                          <p className="text-[11px] font-bold text-slate-400 italic">{event.message}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'incidents' && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Button 
                onClick={() => setShowReportModal(true)}
                className="w-full h-16 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20"
              >
                <ShieldAlert size={18} />
                Report Suspicious Activity
              </Button>

              <div className="space-y-4">
                 <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 italic px-2">Community Intelligence Reports</h3>
                 {securityIncidents.map(incident => (
                    <Card key={incident.id} className="p-6 bg-slate-900 border-slate-800 rounded-[2rem] border-2">
                       <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-blue-500">
                                <Video size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-white italic uppercase">{incident.type.replace('_', ' ')}</p>
                                <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{incident.userName}</p>
                             </div>
                          </div>
                          {incident.isVerified && (
                             <Badge className="bg-blue-500/10 text-blue-400 border-none text-[7px] font-black flex items-center gap-1">
                                <ShieldCheck size={8} /> AI VERIFIED
                             </Badge>
                          )}
                       </div>
                       <p className="text-sm font-medium text-slate-400 leading-relaxed mb-6 italic italic uppercase">"{incident.description}"</p>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic">{new Date(incident.timestamp).toLocaleDateString()}</span>
                          <Button variant="outline" size="sm" className="h-8 border-slate-800 text-slate-500 text-[10px] font-black uppercase italic">View Location</Button>
                       </div>
                    </Card>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
               <Card className="p-8 bg-slate-900 border-slate-800 rounded-[2.5rem]">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20">
                        <Smartphone size={28} className="text-white" />
                     </div>
                     <div>
                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight">Active Shielding</h4>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Biometric Vehicle Lockdown</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[
                       { id: 'shield', label: 'AI Movement Tracking', desc: 'Predictive threat analysis active.', active: isShieldActive, toggle: handleToggleShield },
                       { id: 'lights', label: 'Night Beacon Protocol', desc: 'Auto-flashes lights on proximity detection.', active: true },
                       { id: 'valet', label: 'Valet Safety Mode', desc: 'Restricts speed to 10km/h and locks storage.', active: false },
                       { id: 'emergency', label: 'Global Help Tether', desc: 'Share live location with 3 pre-selected contacts.', active: true }
                     ].map(setting => (
                        <div key={setting.label} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex items-center justify-between">
                           <div className="flex-1">
                              <p className="text-sm font-black text-white italic uppercase tracking-tight leading-none mb-1">{setting.label}</p>
                              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{setting.desc}</p>
                           </div>
                           <button 
                              onClick={setting.toggle}
                              className={`w-12 h-6 rounded-full transition-colors relative ${setting.active ? 'bg-blue-600' : 'bg-slate-700'}`}
                           >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${setting.active ? 'right-1' : 'left-1'}`} />
                           </button>
                        </div>
                     ))}
                  </div>
               </Card>
               
               <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-950 border-2 border-indigo-500/30 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
                    <ShieldCheck size={160} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                       <Zap size={16} className="text-indigo-400" />
                       <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Premium Protection</span>
                    </div>
                    <h4 className="text-2xl font-black italic text-white leading-none mb-2">Upgrade to Pro Guard</h4>
                    <p className="text-xs font-medium text-slate-400 leading-relaxed italic uppercase mb-6">
                       Unlock theft-risk prediction, priority response, and enhanced insurance coverage.
                    </p>
                    <Button className="w-full bg-indigo-600 text-white rounded-xl h-12 text-[10px] font-black uppercase tracking-widest">Activate Enterprise Security</Button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Report Modal */}
      <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title="Security Report Initiation">
         <div className="space-y-6 pt-4">
            <div className="space-y-4">
               <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Incident Protocol</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl h-12 px-4 text-xs font-black italic">
                     <option>Suspicious Activity</option>
                     <option>Theft Attempt</option>
                     <option>Environmental Hazard</option>
                     <option>Broken Security Infrastructure</option>
                  </select>
               </div>
               <Input label="Spatial Intelligence" placeholder="Location Name" containerClassName="italic h-14" />
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Contextual Details</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-black italic min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Describe the nature of the security observation..."
                  />
               </div>
            </div>

            <Card className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <UserCheck size={20} />
               </div>
               <div className="flex-1">
                  <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest leading-none mb-1">Reputation Impact</p>
                  <p className="text-[9px] font-bold text-blue-600/60 lowercase italic leading-tight">Accurate reporting adds +25 to Urban Safety Score.</p>
               </div>
            </Card>

            <Button 
               onClick={() => {
                  reportSecurityIncident({
                    type: 'SUSPICIOUS_PERSON',
                    description: 'Observed person loitering near vehicles for extended period with no matching registration.',
                    lat: 3.1485,
                    lng: 101.7131
                  });
                  addToast('Report Transmitted: Protocol shared with network intelligence.', 'success');
                  setShowReportModal(false);
               }}
               className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 italic"
            >
               Deploy Community Alert
            </Button>
         </div>
      </Modal>
    </div>
  );
};
