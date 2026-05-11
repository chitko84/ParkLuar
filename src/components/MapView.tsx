import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Circle, Polyline, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ParkingListing, Landmark, BusinessPartner, AdCampaign, IncidentType } from '../types';
import { Badge } from './ui';
import { Navigation, Target, Filter, Layers, MapPin as MapPinIcon, Zap, Shield, Star, Clock, AlertTriangle, TrendingUp, Info, Cpu, Brain, Activity, BarChart3, ChevronRight, Gavel, Wrench, Users, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Fix for standard marker icons in Leaflet
import 'leaflet/dist/leaflet.css';
import { useIntelligenceFeed } from '../hooks/useIntelligenceFeed';
import { useData } from '../context/DataContext';

// Icon sources
const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface MapViewProps {
  listings: ParkingListing[];
  onSelectListing: (listing: ParkingListing) => void;
  center?: [number, number];
  isNavigating?: boolean;
  navDestination?: ParkingListing | null;
  searchRadius?: number; // in meters
  searchCenter?: [number, number];
  selectedListing?: ParkingListing | null;
  userLocation?: [number, number];
  landmarks?: Landmark[];
  searchQuery?: string;
  onNearMe?: () => void;
  onArrive?: () => void;
  onNearestNode?: () => void;
  guidanceMode?: 'destination' | 'parking' | 'walking';
  onSelectPartner?: (partner: BusinessPartner) => void;
}

const PriceMarker: React.FC<{ listing: ParkingListing; onClick: () => void; isSelected: boolean }> = ({ listing, onClick, isSelected }) => {
  const isPremium = (listing.confidenceScore || 0) >= 9.5;
  const isOccupied = !listing.isAvailable;
  const occupancy = Math.round((listing.demandState?.occupancyForecast || 0.7) * 100);
  const currentPrice = listing.dynamicPricing?.currentPrice || listing.pricePerHour || 0;
  const isSurge = (listing.dynamicPricing?.adjustmentPercentage || 0) > 0;
  
  const bgColor = isOccupied 
    ? '#94a3b8' 
    : isPremium 
      ? '#7c3aed' 
      : '#0f172a';

  const badge = (listing.confidenceScore || 0) >= 9.8 ? 'Elite' : 
                listing.demandState?.level === 'Peak' ? 'Peak' :
                (listing.publicParkingComparison && listing.publicParkingComparison.savingsPercent > 25) ? 'Best' : null;

  const markerIcon = useMemo(() => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="flex flex-col items-center group transition-all duration-300 ${isSelected ? 'scale-125 z-[1000]' : 'z-[500]'}">
        <div class="relative">
          ${isSelected ? '<div class="absolute -inset-2 bg-primary/20 rounded-[1.5rem] blur-xl animate-pulse"></div>' : ''}
          <div class="px-4 py-2 rounded-[1.2rem] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] border-2 border-white transform transition-transform group-hover:-translate-y-1 active:scale-95 whitespace-nowrap relative z-10 flex flex-col items-center overflow-hidden" style="background-color: ${bgColor}">
            <div class="flex items-center gap-1.5">
               <span class="text-[9px] font-black text-white/50">RM</span>
               <span class="text-sm font-black text-white tracking-tighter">${currentPrice % 1 === 0 ? currentPrice : currentPrice.toFixed(2)}</span>
               ${isSurge ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="m13 11-2 5h-2l2-5h-2L11 6h2l-2 5h2Z"/></svg>' : ''}
            </div>
            <div class="flex items-center gap-1 mt-0.5">
              <div class="w-1.5 h-1.5 rounded-full ${occupancy > 90 ? 'bg-red-500' : occupancy > 70 ? 'bg-amber-500' : 'bg-emerald-500'}"></div>
              <span class="text-[7px] font-black text-white/70 uppercase tracking-widest">${occupancy}% FULL</span>
            </div>
            ${badge ? `<div class="absolute -top-3 -right-2 bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full border border-white shadow-sm uppercase tracking-widest">${badge}</div>` : ''}
          </div>
          <div class="w-3 h-3 rotate-45 -mt-1.5 mx-auto border-r-2 border-b-2 border-white shadow-lg relative z-10" style="background-color: ${bgColor}"></div>
        </div>
      </div>
    `,
    iconSize: [80, 60],
    iconAnchor: [40, 60],
  }), [bgColor, isSelected, badge, currentPrice, occupancy, isSurge]);

  if (!listing.lat || !listing.lng) return null;

  return (
    <Marker 
      position={[listing.lat, listing.lng]} 
      icon={markerIcon}
      eventHandlers={{ 
        click: (e) => {
          L.DomEvent.stopPropagation(e);
          onClick();
        } 
      }}
      zIndexOffset={isSelected ? 1000 : 0}
    />
  );
};

const LandmarkMarker: React.FC<{ position: [number, number], label: string, type: 'mall' | 'transport' | 'uni' | 'office' | 'landmark', image?: string }> = ({ position, label, type, image }) => {
  const markerIcon = useMemo(() => L.divIcon({
    className: 'landmark-marker',
    html: `
      <div class="flex flex-col items-center group transition-all duration-300">
        <div class="mb-1 w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden group-hover:scale-125 group-hover:z-50 transition-transform duration-300">
           <img src="${image || 'https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=100'}" 
                onerror="this.src='https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=100'"
                class="w-full h-full object-cover" />
        </div>
        <div class="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-200 shadow-sm flex items-center gap-1.5 scale-90">
           <div class="w-1 h-1 rounded-full ${type === 'mall' || type === 'landmark' ? 'bg-indigo-500' : type === 'transport' ? 'bg-primary' : 'bg-emerald-500'}"></div>
           <span class="text-[7px] font-black text-slate-700 uppercase tracking-widest whitespace-nowrap">${label}</span>
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 50],
  }), [label, type, image]);

  if (!position || !position[0] || !position[1]) return null;

  return <Marker position={position} icon={markerIcon} interactive={false} />;
};

const PartnerMarker: React.FC<{ partner: BusinessPartner, campaigns: AdCampaign[], onClick: () => void }> = ({ partner, campaigns, onClick }) => {
  const activeCampaign = campaigns.find(c => c.businessId === partner.id && c.status === 'ACTIVE');
  const hasOffer = !!activeCampaign;

  const markerIcon = useMemo(() => L.divIcon({
    className: 'partner-marker',
    html: `
      <div class="flex flex-col items-center group transition-all duration-300 scale-110">
        <div class="relative">
          ${hasOffer ? '<div class="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg animate-pulse"></div>' : ''}
          <div class="w-10 h-10 rounded-2xl bg-white border-2 border-primary shadow-xl overflow-hidden relative z-10 p-0.5 group-hover:scale-110 transition-transform">
             <img src="${partner.logo}" class="w-full h-full object-cover rounded-xl" />
             ${hasOffer ? `
               <div class="absolute -top-2 -right-2 bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce border border-white">
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 9v4M12 17h.01" /></svg>
               </div>
             ` : ''}
          </div>
          <div class="w-2 h-2 rotate-45 -mt-1 mx-auto bg-primary border-r border-b border-primary shadow-lg"></div>
        </div>
        <div class="bg-slate-900/90 text-white px-2 py-0.5 rounded-full mt-1 flex items-center gap-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
           <span class="text-[7px] font-black uppercase tracking-widest">${partner.name}</span>
        </div>
      </div>
    `,
    iconSize: [60, 60],
    iconAnchor: [30, 50],
  }), [partner, hasOffer]);

  return (
    <Marker 
      position={[partner.lat, partner.lng]} 
      icon={markerIcon} 
      eventHandlers={{ 
         click: (e) => {
            L.DomEvent.stopPropagation(e);
            onClick();
         } 
      }}
    />
  );
};

const UserLocationMarker = ({ position }: { position: [number, number] }) => {
  const markerIcon = useMemo(() => L.divIcon({
    className: 'user-location-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-blue-500/10 rounded-full animate-ping"></div>
        <div class="absolute w-8 h-8 bg-blue-500/20 rounded-full"></div>
        <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-xl"></div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  }), []);

  if (!position || !position[0] || !position[1]) return null;

  return <Marker position={position} icon={markerIcon} zIndexOffset={2000} />;
};

const MapControls: React.FC<{ 
  center: [number, number]; 
  onRecenter: () => void;
  selectedPinId: string | null;
  listings: ParkingListing[];
  onNearMe: () => void;
  onNearestNode?: () => void;
  showNearestOption?: boolean;
}> = ({ center, onRecenter, selectedPinId, listings, onNearMe, onNearestNode, showNearestOption }) => {
  const map = useMap();
  
  return (
    <div className="absolute bottom-24 right-4 z-[1000] pointer-events-none flex flex-col gap-3">
      {showNearestOption && onNearestNode && (
        <button 
          onClick={(e) => {
            L.DomEvent.stopPropagation(e);
            onNearestNode();
          }}
          className="p-5 bg-amber-500 text-white rounded-[2rem] shadow-2xl border-4 border-white transform transition-all active:scale-90 pointer-events-auto shadow-amber-500/30 group"
        >
          <Zap size={24} className="group-hover:scale-125 transition-transform animate-bounce" />
        </button>
      )}

      <button 
        onClick={(e) => {
          L.DomEvent.stopPropagation(e);
          onNearMe();
        }}
        className="p-5 bg-primary text-white rounded-[2rem] shadow-2xl border-4 border-white transform transition-all active:scale-90 pointer-events-auto shadow-primary/30 group"
      >
        <Target size={24} className="group-hover:scale-125 transition-transform animate-pulse" />
      </button>

      <button 
        onClick={(e) => {
          L.DomEvent.stopPropagation(e);
          map.setView(center, 16);
          onRecenter();
        }}
        className="p-4 bg-white rounded-[1.5rem] shadow-2xl border border-slate-100 text-slate-800 hover:bg-slate-50 transition-all active:scale-90 pointer-events-auto shadow-slate-900/10 group"
      >
        <MapPinIcon size={22} className="group-hover:text-primary transition-colors" />
      </button>

      {selectedPinId && (
        <button 
          onClick={(e) => {
            L.DomEvent.stopPropagation(e);
            const listing = listings.find(l => l.id === selectedPinId);
            if (listing) {
              window.open(`https://www.google.com/maps/dir/?api=1&destination=${listing.lat},${listing.lng}`, '_blank');
            }
          }}
          className="p-4 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl border border-slate-800 hover:shadow-slate-900/20 transition-all active:scale-90 pointer-events-auto group"
        >
          <Navigation size={22} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
};

// Simulated realistic route points with more segments
const generateRealisticPath = (start: [number, number], end: [number, number]) => {
  if (!start?.[0] || !end?.[0]) return [];
  
  const midLat = start[0] + (end[0] - start[0]) * 0.5;
  const midLng = start[1] + (end[1] - start[1]) * 0.5;
  
  // Create a more zigzag/road-like path by adding more anchor points
  return [
    start,
    [start[0], midLng], // Initial turn
    [midLat, midLng],   // Middle point
    [midLat, end[1]],   // Second turn
    end,
  ] as [number, number][];
};

const MapUpdater = ({ 
  userLocation, 
  destination, 
  searchCenter, 
  isNavigating,
  activeListingId,
  guidanceMode
}: { 
  userLocation?: [number, number], 
  destination?: [number, number], 
  searchCenter?: [number, number],
  isNavigating?: boolean,
  activeListingId?: string | null,
  guidanceMode?: 'destination' | 'parking' | 'walking'
}) => {
  const map = useMap();
  
  useEffect(() => {
    if (isNavigating && userLocation?.[0] && destination?.[0]) {
      const boundsCoords: [number, number][] = [userLocation, destination];
      if (guidanceMode === 'walking' && searchCenter?.[0]) {
        boundsCoords.push(searchCenter);
      }
      const bounds = L.latLngBounds(boundsCoords);
      map.fitBounds(bounds, { padding: [100, 100], animate: true, duration: 2 });
    } else if (searchCenter?.[0] && !isNavigating) {
      map.setView(searchCenter, 16, { animate: true });
    } else if (activeListingId && !isNavigating) {
      // Don't jump if we're just clicking a pin; maybe zoom slightly
    }
  }, [userLocation, destination, searchCenter, isNavigating, activeListingId, map, guidanceMode]);
  
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ 
  listings, 
  onSelectListing, 
  center = [3.1390, 101.6869], 
  isNavigating = false, 
  navDestination = null,
  searchRadius = 500,
  searchCenter,
  selectedListing,
  userLocation,
  landmarks = [],
  searchQuery = "",
  onNearMe,
  onArrive,
  onNearestNode,
  guidanceMode = 'destination',
  onSelectPartner
}) => {
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showSafetyOverlay, setShowSafetyOverlay] = useState(false);
  const [showPricingHeat, setShowPricingHeat] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const activeSelectedId = selectedListing?.id || internalSelectedId;
  const { 
    activeSession, 
    walkingRoute, 
    partners, 
    campaigns, 
    valetBookings, 
    valetAssistants, 
    communityReports, 
    auctions, 
    serviceProviders, 
    carpoolTrips,
    securityZones,
    securityIncidents
  } = useData();

  // Security Zone Icon
  const securityZoneIcon = (score: number) => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full animate-ping opacity-10 bg-blue-500"></div>
        <div class="relative z-10 w-10 h-10 bg-slate-900 rounded-xl border-2 border-blue-400 shadow-2xl flex flex-col items-center justify-center text-blue-400 overflow-hidden">
           <div class="text-[8px] font-black leading-none opacity-50 mt-1 uppercase">Safety</div>
           <div class="text-xs font-black italic mb-1 uppercase">${score}</div>
           <div class="absolute inset-x-0 bottom-0 h-1 bg-blue-500" style="width: ${score}%"></div>
        </div>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
  });

  // Incident Marker Icon
  const incidentMarkerIcon = (type: string) => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full animate-ping opacity-20 bg-rose-500"></div>
        <div class="relative z-10 w-8 h-8 bg-rose-600 rounded-lg shadow-xl flex items-center justify-center text-white border-2 border-white">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
  const carpoolIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 rounded-full animate-ping opacity-10 bg-emerald-500"></div>
        <div class="relative z-10 w-10 h-10 bg-emerald-600 rounded-xl shadow-2xl flex items-center justify-center text-white border-2 border-white">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
  const auctionIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full animate-ping opacity-20 bg-amber-500"></div>
        <div class="relative z-10 w-9 h-9 bg-slate-900 rounded-xl border-2 border-amber-500 shadow-xl flex items-center justify-center text-amber-500">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 3 3m0 0 3 3m-3-3 3-3m-3 3-3-3m15 3 3 3m0 0 3 3m-3-3 3-3m-3 3-3-3M9 6h12M9 12h12M9 18h12"/></svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  const serviceIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-10 h-10 rounded-full animate-pulse opacity-20 bg-indigo-500"></div>
        <div class="relative z-10 w-8 h-8 bg-indigo-600 rounded-lg shadow-xl flex items-center justify-center text-white border-2 border-white">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

  // Community report icons
  const reportIcon = (type: IncidentType) => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full animate-ping opacity-20 ${type === 'SECURITY' || type === 'CONGESTION' || type === 'FULL' ? 'bg-rose-500' : 'bg-amber-500'}"></div>
        <div class="relative z-10 w-8 h-8 ${type === 'SECURITY' || type === 'CONGESTION' || type === 'FULL' ? 'bg-rose-500' : 'bg-amber-500'} rounded-xl border-2 border-white shadow-lg flex items-center justify-center text-white">
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  // Active Valet logic
  const activeValetBooking = useMemo(() => {
    return valetBookings.find(b => ['ASSIGNED', 'EN_ROUTE', 'VEHICLE_SECURED', 'RETRIEVAL_ACTIVE'].includes(b.status));
  }, [valetBookings]);

  const assistant = useMemo(() => {
    if (!activeValetBooking) return null;
    return valetAssistants.find(a => a.id === activeValetBooking.assistantId);
  }, [activeValetBooking, valetAssistants]);

  // Create custom icon for valet assistant
  const assistantIcon = useMemo(() => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
        <div class="relative z-10 w-10 h-10 bg-white rounded-2xl border-2 border-primary shadow-2xl overflow-hidden p-0.5">
           <img src="${assistant?.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=50'}" class="w-full h-full object-cover rounded-xl" />
           <div class="absolute -bottom-1 -right-1 bg-primary text-white w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><path d="M2 3h6l4 7 4-7h6" /></svg>
           </div>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  }), [assistant]);

  // Create custom icon for user's parked vehicle
  const carIcon = useMemo(() => L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
        <div class="relative z-10 w-8 h-8 bg-blue-600 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-white">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
        </div>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  }), []);

  // Initialize Leaflet icons on mount
  useEffect(() => {
    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  // Stability Check: Ensure we have a valid center
  const mapCenter = useMemo(() => {
    if (userLocation?.[0]) return userLocation;
    if (searchCenter?.[0]) return searchCenter;
    return center || [3.1390, 101.6869];
  }, [userLocation, searchCenter, center]);

  // Navigation Logic
  const routePoints = useMemo(() => {
    const start = (userLocation?.[0] ? userLocation : center) as [number, number];
    const end = (navDestination ? [navDestination.lat, navDestination.lng] : searchCenter) as [number, number];
    
    if (isNavigating && start?.[0] && end?.[0]) {
      // If we've arrived at parking and are walking, driving route is old
      if (guidanceMode === 'walking') return generateRealisticPath(start, end);
      return generateRealisticPath(start, end);
    }
    return [];
  }, [isNavigating, navDestination, searchCenter, userLocation, center, guidanceMode]);

  const walkingRoutePoints = useMemo(() => {
    if (isNavigating && navDestination && searchCenter && (guidanceMode === 'walking' || (guidanceMode === 'parking' && selectedListing))) {
      return generateRealisticPath([navDestination.lat, navDestination.lng], searchCenter);
    }
    return [];
  }, [isNavigating, navDestination, searchCenter, guidanceMode, selectedListing]);

  const nearbyParkingAtDest = useMemo(() => {
    if (!searchCenter && !navDestination) return [];
    const target = (navDestination ? [navDestination.lat, navDestination.lng] : searchCenter) as [number, number];
    
    return listings
      .map(l => {
        const d = Math.sqrt(Math.pow(l.lat - target[0], 2) + Math.pow(l.lng - target[1], 2)) * 111;
        return {
          ...l,
          distToDest: d
        };
      })
      .sort((a, b) => a.distToDest - b.distToDest)
      .slice(0, 5);
  }, [listings, searchCenter, navDestination]);

  const mockInstructions = [
    { text: "Head north on SS15 Main Gate", dist: "200m" },
    { text: "Turn left toward Persiaran Kewajipan", dist: "1.2km" },
    { text: "Continue straight into Destination Zone", dist: "400m" },
    { text: "Parking Bay Node target identified", dist: "Arriving" }
  ];

  const forecastData = useMemo(() => [
    { time: 'Now', occupancy: 72 },
    { time: '+30m', occupancy: 84 },
    { time: '+1h', occupancy: 89 },
    { time: '+2h', occupancy: 78 }
  ], []);

  const demandIntelligence = useMemo(() => {
    const level = navDestination?.demandState?.level || "Optimal";
    const occupancy = Math.round((navDestination?.demandState?.occupancyForecast || 0.65) * 100);
    
    let recommendation = "AI Optimization Active: Stable arrival window detected.";
    let color = "text-emerald-500";
    let bgColor = "bg-emerald-500/10";
    
    if (occupancy > 85 || level === "Peak") {
      recommendation = `High demand alert: ${occupancy}% occupancy forecast. Secure your slot now.`;
      color = "text-amber-500";
      bgColor = "bg-amber-500/10";
    } else if (occupancy > 95 || level === "Critical") {
      recommendation = "Capacity threshold reached. Redirecting to secondary nodes recommended.";
      color = "text-red-500";
      bgColor = "bg-red-500/10";
    }

    return { level, occupancy, recommendation, color, bgColor };
  }, [navDestination]);

  const feed = useIntelligenceFeed(5);

  // Intelligence Pulse logic
  const pulsePoints = useMemo(() => {
    return feed.filter(f => 
      f.priority === 'SURGE_EVENT' || 
      f.priority === 'HIGH_DEMAND' || 
      f.priority === 'OPTIMIZATION' ||
      f.priority === 'INCIDENT' ||
      f.priority === 'EMERGENCY'
    ).map((f, i) => {
      // Deterministic but "random-looking" offsets based on ID/Content
      const latOffset = (f.id.length % 10 - 5) * 0.005;
      const lngOffset = (f.description.length % 10 - 5) * 0.005;
      
      let color = '#3b82f6'; // default blue
      let weight = 2;
      let opacity = 0.4;
      let radius = 350;

      if (f.priority === 'SURGE_EVENT') color = '#ef4444';
      if (f.priority === 'HIGH_DEMAND') color = '#f59e0b';
      if (f.priority === 'INCIDENT') {
        color = '#f97316';
        weight = 4;
        opacity = 0.6;
        radius = 500;
      }
      if (f.priority === 'EMERGENCY') {
        color = '#ef4444';
        weight = 6;
        opacity = 0.8;
        radius = 700;
      }

      return {
        id: f.id,
        center: [center[0] + latOffset, center[1] + lngOffset] as [number, number],
        color,
        label: f.label,
        weight,
        opacity,
        radius,
        isEmergency: f.priority === 'EMERGENCY' || f.priority === 'INCIDENT'
      };
    });
  }, [feed, center]);

  return (
    <div 
      className="relative w-full h-full bg-slate-100 rounded-[3rem] overflow-hidden border border-slate-200"
      style={{ minHeight: '600px' }}
    >
        <MapContainer 
          center={mapCenter as [number, number]} 
          zoom={15} 
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}
          zoomControl={false}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater 
          userLocation={userLocation} 
          destination={navDestination ? [navDestination.lat, navDestination.lng] : searchCenter}
          searchCenter={searchCenter}
          isNavigating={isNavigating}
          activeListingId={activeSelectedId}
          guidanceMode={guidanceMode as 'destination' | 'parking' | 'walking'}
        />

        {/* User Anchor - ALWAYS strictly defined by userLocation */}
        <UserLocationMarker position={(userLocation || [3.1390, 101.6869]) as [number, number]} />

        {landmarks?.map((mark, i) => (
           <LandmarkMarker key={mark.id || i} position={[mark.lat, mark.lng]} label={mark.name} type={mark.type as any} image={mark.image} />
        ))}

        {partners.map(partner => (
          <PartnerMarker 
            key={partner.id} 
            partner={partner} 
            campaigns={campaigns}
            onClick={() => onSelectPartner?.(partner)}
          />
        ))}

        {/* Search Center and Destination Marker */}
        {(searchCenter || navDestination) && (
          <>
            <Marker 
              position={(navDestination ? [navDestination.lat, navDestination.lng] : searchCenter) as [number, number]} 
              icon={L.divIcon({
                className: 'dest-marker',
                html: `
                  <div class="relative flex items-center justify-center">
                    <div class="absolute w-20 h-20 bg-primary/20 rounded-full animate-ping"></div>
                    <div class="absolute w-32 h-32 bg-primary/5 rounded-full"></div>
                    <div class="w-12 h-12 bg-slate-900 rounded-[1.2rem] flex items-center justify-center border-4 border-white shadow-2xl relative z-10">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${navDestination ? '#3b82f6' : '#f59e0b'}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                    </div>
                  </div>
                `,
                iconSize: [128, 128],
                iconAnchor: [64, 64]
              })} 
            />
            {searchCenter && (
              <Circle 
                center={searchCenter}
                radius={searchRadius}
                pathOptions={{ 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.05, 
                  color: '#3b82f6', 
                  weight: 1,
                  dashArray: '5, 10'
                }}
              />
            )}
          </>
        )}

        {/* Demand Heatmap Overlays */}
        {landmarks?.filter(l => l.type === 'mall' || l.type === 'transport').map((mark, i) => {
          const occupancy = 75 + (i * 7) % 20; // Simulated demand per landmark
          const color = occupancy > 85 ? '#ef4444' : occupancy > 70 ? '#f59e0b' : '#10b981';
          return (
            <Circle 
              key={`heatmap-${mark.id || i}`}
              center={[mark.lat, mark.lng]}
              radius={200}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.15,
                color: color,
                weight: 0,
                stroke: false
              }}
            />
          );
        })}

        {/* Safety & Trust Overlay Halos */}
        {showSafetyOverlay && listings.map((listing, i) => {
          const score = listing.trustIntelligence?.safetyScore || 75;
          const color = score >= 90 ? '#10b981' : score >= 75 ? '#3b82f6' : '#f59e0b';
          return (
            <Circle 
              key={`safety-${listing.id}`}
              center={[listing.lat, listing.lng]}
              radius={120}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.1,
                color: color,
                weight: 2,
                dashArray: '5, 5',
                opacity: 0.3
              }}
            />
          );
        })}
        
        {/* Pricing Heat Overlay */}
        {showPricingHeat && listings.map((listing) => {
          const adj = listing.dynamicPricing?.adjustmentPercentage || 0;
          const color = adj > 20 ? '#ef4444' : adj > 0 ? '#f59e0b' : '#3b82f6';
          return (
            <Circle 
              key={`pricing-heat-${listing.id}`}
              center={[listing.lat, listing.lng]}
              radius={180}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.15,
                color: color,
                weight: 1,
                dashArray: '10, 10',
                opacity: 0.2
              }}
            />
          );
        })}

        {/* AI Network Intelligence Pulses */}
        {pulsePoints.map((pt, idx) => (
          <React.Fragment key={`pulse-${pt.id}-${idx}`}>
            <Circle 
              center={pt.center}
              radius={pt.radius}
              pathOptions={{
                fillColor: pt.color,
                fillOpacity: pt.opacity * 0.1,
                color: pt.color,
                weight: pt.weight,
                dashArray: pt.isEmergency ? '1, 2' : '5, 10',
                opacity: pt.opacity
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                <div className={`backdrop-blur-md text-white p-2 rounded-lg border shadow-2xl flex items-center gap-2 ${pt.isEmergency ? 'bg-red-950/90 border-red-500/50' : 'bg-slate-900/90 border-white/20'}`}>
                   <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${pt.isEmergency ? 'bg-red-500' : 'bg-primary'}`} />
                   <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">{pt.label}</span>
                </div>
              </Tooltip>
            </Circle>
            <Circle 
              center={pt.center}
              radius={pt.radius * 0.4}
              pathOptions={{
                fillColor: pt.color,
                fillOpacity: pt.opacity * 0.3,
                color: pt.color,
                weight: 0,
                stroke: false
              }}
            />
          </React.Fragment>
        ))}

        {listings.map(listing => (
          <PriceMarker 
            key={listing.id} 
            listing={listing} 
            isSelected={activeSelectedId === listing.id}
            onClick={() => {
              onSelectListing(listing);
              setInternalSelectedId(listing.id);
            }} 
          />
        ))}

        {/* Valet Assistant Marker */}
        {activeValetBooking && (
          <>
            <Marker 
              position={[activeValetBooking.destination.lat + 0.002, activeValetBooking.destination.lng + 0.002]} 
              icon={assistantIcon}
              zIndexOffset={2000}
            >
               <Tooltip permanent direction="top" offset={[0, -20]} opacity={1}>
                  <div className="bg-primary text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/20">
                     <Zap size={10} className="animate-pulse" />
                     {activeValetBooking.status === 'EN_ROUTE' ? 'Assistant En Route' : 'Assistant On-Site'}
                  </div>
               </Tooltip>
            </Marker>
            {activeValetBooking.status === 'EN_ROUTE' && (
              <Polyline 
                positions={[userLocation || center, [activeValetBooking.destination.lat + 0.002, activeValetBooking.destination.lng + 0.002]]}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 3,
                  dashArray: '10, 10',
                  opacity: 0.6
                }}
              />
            )}
          </>
        )}

        {/* Auction Markers */}
        {auctions.map(auction => {
          const listing = listings.find(l => l.id === auction.listingId);
          if (!listing) return null;
          return (
            <Marker
              key={auction.id}
              position={[listing.lat + 0.001, listing.lng + 0.001]} // Offset slightly
              icon={auctionIcon}
              zIndexOffset={1000}
            >
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Gavel size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-slate-800 leading-none mb-1">Live Auction</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Ending Soon</p>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 italic mb-2 tracking-tight">{auction.listingName}</h4>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex justify-between items-center mb-3">
                     <span className="text-[9px] font-black text-slate-400 uppercase">High Bid</span>
                     <span className="text-sm font-black italic text-slate-900">RM {auction.currentBid.toFixed(2)}</span>
                  </div>
                  <button className="w-full h-10 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-amber-500 transition-colors">
                     View & Bid
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Car Service Markers */}
        {serviceProviders.map(provider => (
          <Marker
            key={provider.id}
            position={[provider.lat, provider.lng]}
            icon={serviceIcon}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[200px]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-none">
                     <img src={provider.logo} alt={provider.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 italic leading-none mb-1">{provider.name}</h4>
                    <div className="flex items-center gap-1">
                       <Star size={10} className="text-amber-500" fill="currentColor" />
                       <span className="text-[9px] font-black">{provider.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                   {provider.type.map(t => (
                      <span key={t} className="text-[8px] font-black uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-lg">
                         {t.replace('_', ' ')}
                      </span>
                   ))}
                </div>
                <button className="w-full h-10 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-slate-900 transition-colors">
                   Book Service RM{provider.services[0].price}+
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Carpool Trip Markers */}
        {carpoolTrips.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').map(trip => (
          <Marker
            key={trip.id}
            position={[trip.destinationLat, trip.destinationLng]}
            icon={carpoolIcon}
          >
            <Popup className="custom-popup">
              <div className="p-4 min-w-[220px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm flex-none">
                     <img src={trip.driverImage} alt={trip.driverName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 italic leading-none mb-1">{trip.driverName}</h4>
                    <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Shared mobility active</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                   <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                      <span className="text-[8px] font-black uppercase text-slate-400">Target</span>
                      <span className="text-[10px] font-black text-slate-900">{trip.destination}</span>
                   </div>
                   <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                      <span className="text-[8px] font-black uppercase text-slate-400">Seats</span>
                      <span className="text-[10px] font-black text-slate-900">{trip.availableSeats}/{trip.totalSeats}</span>
                   </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl mb-4 text-center">
                   <p className="text-sm font-black text-emerald-600 italic">RM {trip.contributionPerPerson}</p>
                   <p className="text-[8px] font-black uppercase text-emerald-600/50">per person contribution</p>
                </div>

                <button className="w-full h-10 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-slate-900 transition-colors">
                   Join Trip Sequence
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Security Intelligence Layer */}
        {showSafetyOverlay && (
          <>
            {securityZones.map(zone => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={securityZoneIcon(zone.safetyScore)}>
                <Popup className="custom-popup">
                  <div className="p-4 min-w-[220px]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 italic leading-none mb-1">{zone.name}</h4>
                        <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest italic">Secure Cluster Alpha</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Safety Score</span>
                        <span className="text-[10px] font-black text-blue-600 uppercase italic">{zone.safetyScore}/100</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="text-[8px] font-black text-slate-400 uppercase">CCTV Status</span>
                        <span className="text-[10px] font-black text-emerald-500 uppercase italic">{zone.hasCCTV ? 'Active' : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Security Patrol</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase italic">{zone.hasPatrol ? 'Verified' : 'Limited'}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-4 text-center">
                       <p className="text-xs font-black text-blue-700 italic uppercase italic">Neural Risk: Low</p>
                       <p className="text-[8px] font-bold text-blue-400 leading-tight mt-1 uppercase italic">Stable environment monitored by AI.</p>
                    </div>

                    <button className="w-full h-10 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                       View Coverage Map
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}

            {securityIncidents.map(incident => (
               <Marker key={incident.id} position={[incident.lat, incident.lng]} icon={incidentMarkerIcon(incident.type)}>
                  <Popup className="custom-popup">
                     <div className="p-4 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-3">
                           <AlertTriangle size={16} className="text-rose-500" />
                           <h4 className="text-xs font-black text-slate-900 uppercase italic">Threat Intelligence</h4>
                        </div>
                        <p className="text-[11px] font-black text-slate-900 italic mb-2 uppercase leading-tight">"{incident.description}"</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                           <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                           {incident.isVerified && <Badge className="bg-rose-50 text-rose-500 border-none text-[7px] font-black">AI VERIFIED</Badge>}
                        </div>
                     </div>
                  </Popup>
               </Marker>
            ))}
            
            {/* Security Heatmap Circles */}
            {securityZones.map(zone => (
               <Circle 
                 key={`heat-${zone.id}`}
                 center={[zone.lat, zone.lng]} 
                 radius={300} 
                 pathOptions={{ 
                   fillColor: zone.safetyScore > 90 ? '#3b82f6' : '#93c5fd', 
                   fillOpacity: 0.1, 
                   color: 'transparent' 
                 }} 
               />
            ))}
          </>
        )}

        {/* User's Parked Vehicle Marker */}
        {activeSession && (
          <Marker 
             position={[activeSession.location.lat, activeSession.location.lng]} 
             icon={carIcon} 
             zIndexOffset={1500}
          >
             <Tooltip permanent direction="top" offset={[0, -20]} opacity={1}>
                <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/20">
                   <Activity size={10} className="animate-pulse" />
                   My Vehicle
                </div>
             </Tooltip>
          </Marker>
        )}

        {/* Community Report Markers */}
        {communityReports.map(report => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={reportIcon(report.type)}
            zIndexOffset={500}
          >
            <Popup className="custom-popup">
              <div className="p-3 min-w-[200px] border-none shadow-none">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${report.type === 'SECURITY' || report.type === 'CONGESTION' || report.type === 'FULL' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'}`}>
                    <AlertTriangle size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-800 leading-none mb-1">{report.type.replace('_', ' ')}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Live Alert</p>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-600 italic leading-relaxed mb-4">"{report.description}"</p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                   <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-lg overflow-hidden border border-slate-100">
                         <img src={report.userImage} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[9px] font-black text-slate-500 italic">{report.userName}</span>
                   </div>
                   <Badge className="bg-primary/10 text-primary text-[8px] border-none px-2 py-0.5 font-black uppercase">Helpful ({report.helpfulCount})</Badge>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Car Finder / Return Navigation Polyline */}
        {walkingRoute && activeSession?.isFindingCar && (
          <>
            <Polyline 
              positions={walkingRoute.coordinates} 
              pathOptions={{ 
                color: '#3b82f6', 
                weight: 10, 
                opacity: 0.15,
                lineCap: 'round',
                lineJoin: 'round'
              }} 
            />
            <Polyline 
              positions={walkingRoute.coordinates} 
              pathOptions={{ 
                color: '#3b82f6', 
                weight: 4, 
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '1, 12',
                className: 'walking-route-animated'
              }} 
            />
          </>
        )}

        {/* Premium Route Rendering */}
        {isNavigating && routePoints.length > 0 && (
          <>
            {/* Glow/Shadow Layer */}
            <Polyline 
              positions={routePoints} 
              pathOptions={{ 
                color: '#3b82f6', 
                weight: 12, 
                opacity: 0.2,
                lineCap: 'round',
                lineJoin: 'round'
              }} 
            />
            {/* Base Route Line */}
            <Polyline 
              positions={routePoints} 
              pathOptions={{ 
                color: '#3b82f6', 
                weight: 8, 
                opacity: 1,
                lineCap: 'round',
                lineJoin: 'round',
              }} 
            />
            {/* Core Route Detail */}
            <Polyline 
              positions={routePoints} 
              pathOptions={{ 
                color: '#ffffff', 
                weight: 2, 
                opacity: 0.3,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '1, 15',
                className: 'route-line-animated'
              }} 
            />
          </>
        )}

        {/* Last-Mile Pedestrian Route */}
        {isNavigating && walkingRoutePoints.length > 0 && (
          <>
            <Polyline 
              positions={walkingRoutePoints} 
              pathOptions={{ 
                color: '#10b981', 
                weight: 8, 
                opacity: 0.2,
                lineCap: 'round',
                lineJoin: 'round',
              }} 
            />
            <Polyline 
              positions={walkingRoutePoints} 
              pathOptions={{ 
                color: '#10b981', 
                weight: 3, 
                opacity: 0.8,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: '5, 10'
              }} 
            />
          </>
        )}

        <MapControls 
          center={(userLocation || center) as [number, number]} 
          onRecenter={() => setInternalSelectedId(null)}
          selectedPinId={activeSelectedId}
          listings={listings}
          onNearMe={() => onNearMe?.()}
          onNearestNode={onNearestNode}
          showNearestOption={!!searchCenter || !!navDestination}
        />
        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Premium HUD Overlay */}
      <div className="absolute top-6 left-6 right-6 z-[1000] pointer-events-none flex flex-col gap-4">
        {/* Top Info Bar */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {isNavigating && guidanceMode === 'parking' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-emerald-900 text-white px-6 py-4 rounded-[2rem] shadow-2xl border border-emerald-500/50 flex items-center gap-4 pointer-events-auto"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Target size={20} className="animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Terminal Guidance Active</span>
                    <span className="text-sm font-black tracking-tighter">Navigating to Reserved Bay Node</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isNavigating && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-900 text-white px-6 py-3 rounded-[1.5rem] shadow-2xl border border-white/10 flex items-center gap-4 pointer-events-auto"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                    <Navigation size={18} className="animate-pulse" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Active Route</span>
                    <span className="text-sm font-black tracking-tighter">Syncing with Traffic Nodes...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence>
              {isNavigating && guidanceMode === 'parking' && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onArrive?.();
                  }}
                  className="bg-emerald-500 text-white px-8 py-3 rounded-[1.5rem] shadow-2xl shadow-emerald-500/30 border-2 border-white font-black text-[10px] uppercase tracking-widest pointer-events-auto active:scale-95 transition-all mb-2"
                >
                  Confirm Slot Arrival
                </motion.button>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="bg-white/95 backdrop-blur-xl px-5 py-3 rounded-[1.5rem] border border-white shadow-xl pointer-events-auto flex items-center gap-4"
            >
              <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl">
                <Shield size={16} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Satellite IQ Active</span>
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Real-time Telemetry v4.2</span>
              </div>
            </motion.div>

            {/* AI Demand Forecasting Badge */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-slate-900 text-white px-5 py-3 rounded-[1.5rem] border border-white/10 shadow-2xl pointer-events-auto flex items-center gap-4"
            >
              <div className="p-2 bg-primary/20 text-primary rounded-xl">
                <Brain size={16} />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-tighter text-primary">Predictive Intelligence</span>
                 <span className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-0.5">Processing Local Mobility Slices...</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/95 backdrop-blur-xl px-5 py-3 rounded-[1.5rem] border border-white/50 shadow-xl pointer-events-auto flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
                <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter italic leading-none">Congestion Zone: {navDestination?.neighborhood || selectedListing?.neighborhood || 'SS15'}</span>
                 <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Heavy Traffic • ETA +4m</span>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-2 items-end">
            <button 
              onClick={() => setShowSafetyOverlay(!showSafetyOverlay)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] border backdrop-blur-xl shadow-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest pointer-events-auto ${
                showSafetyOverlay 
                  ? 'bg-emerald-600 text-white border-emerald-600' 
                  : 'bg-white/90 text-slate-700 border-white'
              }`}
            >
              <Shield size={14} className={showSafetyOverlay ? 'fill-white' : ''} />
              Safety Zones
            </button>
            <button 
              onClick={() => setShowPricingHeat(!showPricingHeat)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] border backdrop-blur-xl shadow-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest pointer-events-auto ${
                showPricingHeat 
                  ? 'bg-amber-600 text-white border-amber-600' 
                  : 'bg-white/90 text-slate-700 border-white'
              }`}
            >
              <Zap size={14} className={showPricingHeat ? 'fill-white' : ''} />
              Pricing Hotspots
            </button>
            <button 
              onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-[1.5rem] border backdrop-blur-xl shadow-xl transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest pointer-events-auto ${
                showAvailableOnly 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-white/90 text-slate-700 border-white'
              }`}
            >
              <Zap size={14} className={showAvailableOnly ? 'fill-white' : ''} />
              Live Availability
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Preview (Visible during Navigation) */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-2 w-full max-w-sm self-center pointer-events-auto"
            >
              <div className="bg-white rounded-[2rem] shadow-2xl p-6 border border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Route Instructions</h5>
                  <Badge variant="blue" className="text-[8px]">Investor Preview</Badge>
                </div>
                <div className="flex flex-col gap-3">
                  {mockInstructions.map((step, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-2xl ${idx === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx === 0 ? 'bg-primary text-white' : 'bg-white text-slate-500'}`}>
                          {idx === 0 ? <Navigation size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-[11px] font-black tracking-tight ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>{step.text}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-500">{step.dist}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>

      {/* Smart Route Data Panel (Bottom) */}
      <AnimatePresence>
        {isNavigating && (navDestination || searchCenter) && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-10 left-8 right-8 z-[1000] pointer-events-none"
          >
            <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl p-8 border border-white/10 flex flex-col gap-6 pointer-events-auto max-w-2xl mx-auto w-full">
              <div className="flex justify-between items-start">
                 <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-[1.8rem] overflow-hidden relative border-2 border-primary shadow-xl bg-slate-800">
                       <img 
                         src={landmarks.find(l => l.name === searchQuery)?.image || navDestination?.images?.[0] || 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?auto=format&fit=crop&q=80&w=800'} 
                         className="w-full h-full object-cover" 
                         alt="destination" 
                       />
                       <div className="absolute inset-0 bg-primary/20" />
                    </div>
                    <div className="flex flex-col">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Destination Identified</p>
                       <h3 className="text-2xl font-black tracking-tighter leading-none mb-1 text-white">{navDestination?.title || searchQuery || 'Custom Destination'}</h3>
                       <div className="flex items-center gap-2 text-white/40">
                          <MapPinIcon size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{navDestination?.neighborhood || (searchCenter ? `Target Node: ${searchCenter[0].toFixed(3)}, ${searchCenter[1].toFixed(3)}` : 'Selected GPS Point')}</span>
                       </div>
                    </div>
                 </div>
              <div className="text-right">
                   <p className="text-4xl font-black tracking-tighter leading-none text-emerald-400">
                     {guidanceMode === 'parking' ? '140' : Math.ceil((navDestination?.distance || 2.4) * 4)}
                     <span className="text-sm font-bold text-white/40 ml-1">{guidanceMode === 'parking' ? 'm' : 'min'}</span>
                   </p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{guidanceMode === 'parking' ? 'Distance to Bay' : 'Arrival Estimate'}</p>
                </div>
              </div>

              {guidanceMode === 'parking' && (
                <div className="bg-primary/10 p-5 rounded-[2rem] border border-primary/20 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary">
                         <MapPinIcon size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1.5">Last-Mile Intel</p>
                         <h4 className="text-sm font-black text-white leading-none capitalize">Walking route to {searchQuery || 'Final Destination'}</h4>
                      </div>
                   </div>
                   <div className="flex gap-6">
                      <div className="flex flex-col items-center">
                         <span className="text-xl font-black text-white">3<span className="text-[10px] ml-0.5 opacity-50">min</span></span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Walk Time</span>
                      </div>
                      <div className="border-l border-white/10 h-8 mt-1" />
                      <div className="flex flex-col items-center">
                         <span className="text-xl font-black text-white">220<span className="text-[10px] ml-0.5 opacity-50">m</span></span>
                         <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Distance</span>
                      </div>
                   </div>
                </div>
              )}

              {/* Smart Route Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div className="bg-white/5 p-4 rounded-[1.5rem] flex flex-col">
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Distance</span>
                   <span className="text-lg font-black text-white">{(navDestination?.distance || 2.4).toFixed(1)} km</span>
                </div>
                <div className="bg-white/5 p-4 rounded-[1.5rem] flex flex-col">
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Traffic Impact</span>
                   <span className="text-lg font-black text-amber-400">+4 mins</span>
                </div>
                <div className="bg-white/5 p-4 rounded-[1.5rem] flex flex-col">
                   <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Parking Near Target</span>
                   <span className="text-lg font-black text-white">{nearbyParkingAtDest.length} Nodes</span>
                </div>
              </div>

              {/* Parking Recommendation */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onNearestNode?.();
                }}
                className="bg-primary/10 border border-primary/20 p-5 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-primary/20 transition-all group"
              >
                <div className="flex items-center gap-5">
                   <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Cpu size={20} />
                   </div>
                   <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary leading-none mb-1">Best Match Intelligence</p>
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors">
                        Park at {nearbyParkingAtDest[0]?.title || 'Nearest Node'}
                      </p>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                     <span className="text-sm font-black text-white">RM {nearbyParkingAtDest[0]?.pricePerHour || '1.00'}/hr</span>
                     <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">98% Match</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:translate-x-1 transition-transform">
                     <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
