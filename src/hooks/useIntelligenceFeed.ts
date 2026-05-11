import { useState, useEffect, useCallback } from 'react';
import { 
  Zap, 
  Car, 
  Shield, 
  Activity, 
  Wind, 
  Navigation2, 
  TrendingUp, 
  Cpu, 
  Users,
  AlertCircle,
  BrainCircuit,
  CheckCircle
} from 'lucide-react';

export type IntelligencePriority = 'INFO' | 'OPTIMIZATION' | 'SURGE_EVENT' | 'HIGH_DEMAND' | 'SECURITY_VERIFIED' | 'INCIDENT' | 'EMERGENCY' | 'PERSONALIZED';

export interface IntelligenceEvent {
  id: string;
  timestamp: string;
  label: string;
  priority: IntelligencePriority;
  icon: any;
  category: 'DRIVER' | 'HOST' | 'PLATFORM' | 'SUSTAINABILITY' | 'EMERGENCY';
  description: string;
  nodeId?: string;
  value?: string;
  metadata?: Record<string, any>;
}

const EVENT_POOL: Omit<IntelligenceEvent, 'id' | 'timestamp'>[] = [
  // Driver Activity
  { label: 'Driver Secured', priority: 'SECURITY_VERIFIED', icon: Car, category: 'DRIVER', description: 'Parking node secured near Pavilion KL.', nodeId: 'KL-PV-08' },
  { label: 'Node Check-in', priority: 'SECURITY_VERIFIED', icon: Shield, category: 'DRIVER', description: 'Vehicle verified via P.A.I.D. Scanner™.', nodeId: 'MY-BN-12' },
  { label: 'Route Recalculated', priority: 'OPTIMIZATION', icon: Navigation2, category: 'DRIVER', description: 'Congestion detected near Bukit Bintang. Route updated.' },
  { label: 'Mobile Sync', priority: 'INFO', icon: Activity, category: 'DRIVER', description: 'Satellite IQ handoff complete for user vcc-8122.' },
  
  // Host Activity
  { label: 'High Occupancy', priority: 'HIGH_DEMAND', icon: Users, category: 'HOST', description: 'Node occupancy reached 92% in SS15 Cluster.', nodeId: 'SS15-HUB-01' },
  { label: 'Dynamic Surge', priority: 'SURGE_EVENT', icon: Zap, category: 'HOST', description: 'Surge pricing proxy (+15%) active in Zone B.' },
  { label: 'Node Upgraded', priority: 'INFO', icon: TrendingUp, category: 'HOST', description: 'Host upgraded node to Premium Covered status.', nodeId: 'KLCC-A-04' },
  
  // Platform Intelligence
  { label: 'Congestion Guard', priority: 'OPTIMIZATION', icon: Cpu, category: 'PLATFORM', description: 'AI congestion prediction triggered for KLCC district.' },
  { label: 'Demand Spike', priority: 'HIGH_DEMAND', icon: Zap, category: 'PLATFORM', description: 'Abnormal demand spike detected near University Cluster.' },
  { label: 'Network Balance', priority: 'OPTIMIZATION', icon: Activity, category: 'PLATFORM', description: 'Initiating demand redistribution to underused corridors.' },
  { label: 'Predictive Load', priority: 'INFO', icon: Cpu, category: 'PLATFORM', description: 'Cluster saturation predicted within 35 minutes.' },

  // Emergency & Incident Response (Feature 1)
  { label: 'Incident Detected', priority: 'INCIDENT', icon: AlertCircle, category: 'EMERGENCY', description: 'Traffic bottleneck identified near Damansara Link. AI Rerouting active.' },
  { label: 'Emergency Reroute', priority: 'EMERGENCY', icon: Navigation2, category: 'EMERGENCY', description: 'Critical congestion detected. Redirecting 42 active navigations to Zone C.' },
  { label: 'Safety Anomaly', priority: 'INCIDENT', icon: Shield, category: 'EMERGENCY', description: 'Abnormal vehicle loitering detected in Basement 3. Visual verification initiated.', nodeId: 'KLCC-B3-12' },
  { label: 'Grid Lock Warning', priority: 'EMERGENCY', icon: Activity, category: 'PLATFORM', description: 'Sultan Ismail corridor approaching saturation. Throttling node availability.' },

  // Personalized Mobility (Feature 2)
  { label: 'Pattern Learned', priority: 'PERSONALIZED', icon: BrainCircuit, category: 'DRIVER', description: 'AI detected daily preference for Secure Covered parking near university.' },
  { label: 'Smart Choice', priority: 'PERSONALIZED', icon: TrendingUp, category: 'DRIVER', description: 'Recommended 12% cheaper alternative based on your historical budget.' },
  { label: 'Mobility DNA Sync', priority: 'INFO', icon: Activity, category: 'DRIVER', description: 'User mobility profile updated with last 14 sessions.' },

  // Reservation Confidence (Feature 3)
  { label: 'Confidence Locked', priority: 'INFO', icon: Shield, category: 'PLATFORM', description: '98% Reservation Confidence achieved for Node KL-012.' },
  { label: 'Arrival Assurance', priority: 'OPTIMIZATION', icon: CheckCircle, category: 'PLATFORM', description: 'Smart arrival window verified for all premium bookings in Zone A.' },

  // Sustainability
  { label: 'CO2 Reduction', priority: 'INFO', icon: Wind, category: 'SUSTAINABILITY', description: 'Estimated 38kg CO₂ reduction achieved this hour.', value: '38kg' },
  { label: 'Traffic Efficiency', priority: 'OPTIMIZATION', icon: Wind, category: 'SUSTAINABILITY', description: 'Idle traffic time reduced by 18% across central zones.', value: '18%' },
];

export const useIntelligenceFeed = (maxItems: number = 8) => {
  const [events, setEvents] = useState<IntelligenceEvent[]>([]);

  const generateEvent = useCallback(() => {
    const rawEvent = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    const newEvent: IntelligenceEvent = {
      ...rawEvent,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    
    setEvents(prev => [newEvent, ...prev].slice(0, maxItems));
  }, [maxItems]);

  useEffect(() => {
    // Initial events
    for(let i = 0; i < 4; i++) {
       setTimeout(generateEvent, i * 800);
    }

    const interval = setInterval(() => {
      generateEvent();
    }, 4500 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [generateEvent]);

  return events;
};
