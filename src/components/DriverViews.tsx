/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { CommandTimeline } from './CommandTimeline';
import { ConfidenceScore } from './ConfidenceScore';
import { MobilityProfile } from './MobilityProfile';
import { 
  Search, Filter, MapPin, Star, Clock, Info, 
  ArrowRight, Heart, Share2, Shield, Zap, 
  Car, Ruler, ChevronRight, MessageSquare, 
  CheckCircle2, CreditCard, X, Navigation, Map as MapIcon, List as ListIcon, Cpu, AlertCircle, Trash2, Send, Activity, 
  Target, Briefcase, ShoppingBag, Ticket, Moon, Brain, BrainCircuit, ArrowUp, ArrowDown, Plus,
  Bookmark, User as UserIcon, LogOut, Settings as SettingsIcon, Crown, ShieldCheck, TrendingUp
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card, Badge, Button, SectionHeader, Modal, Drawer, Input, useToastStore } from './ui';
import { ParkingListing, Booking, Vehicle, ScanLog, SubscriptionTier } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MapView } from './MapView';
import { BookingFlow } from './BookingFlow';
import { AIScanner } from './AIScanner';
import { MemberBadge } from './MemberBadge';
import { SmartAdBanner } from './SmartAds';
import { ValetLiveTracking } from './ValetMarketplace';
import { hosts, landmarks, vehicles } from '../data/mockData';
import { Landmark } from '../types';

const EmptyState = ({ icon: Icon, title, description, action }: { icon: any, title: string, description: string, action?: React.ReactNode }) => (
  <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-100 rounded-[2.5rem]">
    <div className="w-16 h-16 rounded-[2rem] bg-white shadow-sm flex items-center justify-center text-slate-300 mb-6">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
    <p className="text-sm font-medium text-slate-600 max-w-[240px] mb-8">{description}</p>
    {action}
  </div>
);

export const ExploreView = () => {
  const { 
    bookings = [], 
    listings = [], 
    getListingReviews, 
    addReview, 
    userSubscription, 
    valetBookings, 
    cancelValet, 
    retrieveVehicle 
  } = useData();
  const { addToast } = useToastStore();
  
  const activeValetBooking = valetBookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<'near' | 'destination'>('near');
  const [searchRadius, setSearchRadius] = useState(2000); // Expanded to 2000m for better demo coverage
  const [parkingIntent, setParkingIntent] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<ParkingListing | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  
  // Guidance & Last-Mile States
  const [guidanceMode, setGuidanceMode] = useState<'destination' | 'parking' | 'walking'>('destination');
  const [arrivalTriggered, setArrivalTriggered] = useState(false);

  // Advanced Features State
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    maxPrice: 30,
    minSafety: 0,
    evOnly: false,
    covered: false,
    security: false,
    disabled: false,
  });
  const [comparisonList, setComparisonList] = useState<ParkingListing[]>([]);
  const [bookingSchedule, setBookingSchedule] = useState({
    arrival: new Date().toISOString().slice(0, 16),
    departure: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });
  
  // Navigation Simulation State
  const [isNavigatingPreview, setIsNavigatingPreview] = useState(false);
  const [navTarget, setNavTarget] = useState<ParkingListing | null>(null);
  
  // Reviews state
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  // AI Scanner state
  const [showScanner, setShowScanner] = useState(false);
  const [scannerProps, setScannerProps] = useState<{ booking?: Booking; vehicle?: Vehicle; listing?: ParkingListing }>({});

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [activeSearchCenter, setActiveSearchCenter] = useState<[number, number] | null>(null);

  const categories = [
    { label: "All", icon: null },
    { label: "Shared Driveways", icon: Navigation },
    { label: "Private Lots", icon: Shield },
    { label: "Covered Parking", icon: Navigation },
    { label: "EV Friendly", icon: Zap },
    { label: "Budget Nearby", icon: CreditCard },
  ];

  const bookingDurationHours = useMemo(() => {
    const start = new Date(bookingSchedule.arrival);
    const end = new Date(bookingSchedule.departure);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Math.max(0.5, Number(diff.toFixed(1)));
  }, [bookingSchedule]);

  const filteredListings = useMemo(() => {
    let results = [...listings];
    
    // Dynamic Distance Calculation to user anchor OR search center
    const anchor = userLocation || activeSearchCenter || [3.1390, 101.6869];
    const destinationCoord = activeSearchCenter || [3.1390, 101.6869];

    results = results.map(l => {
      const distToUser = Math.sqrt(
        Math.pow(l.lat - anchor[0], 2) + 
        Math.pow(l.lng - anchor[1], 2)
      ) * 111; 

      const distToDest = Math.sqrt(
        Math.pow(l.lat - destinationCoord[0], 2) + 
        Math.pow(l.lng - destinationCoord[1], 2)
      ) * 111;

      // Smart Suitability Intelligence
      let suitability = "";
      if (distToDest < 0.2) suitability = "Best Walking Distance";
      else if (l.pricePerHour < 5) suitability = "Best Value Overall";
      else if (l.confidenceScore > 9.5) suitability = "Fastest Arrival";
      else if (l.features.includes("Covered")) suitability = "Closest Covered Parking";

      // Time-Based Recommendations
      let slotRecommendation = "";
      if (bookingDurationHours <= 2) slotRecommendation = "Best for Short Stay";
      else if (bookingDurationHours >= 8) slotRecommendation = "Best for Full Day Parking";
      else if (l.pricePerHour <= 4 && bookingDurationHours >= 4) slotRecommendation = "Cheapest for Long Duration";
      else if (l.confidenceScore >= 9.8) slotRecommendation = "Closest Premium Option";

      return { 
        ...l, 
        distance: Number(distToUser.toFixed(1)),
        distToDest: Number(distToDest.toFixed(1)),
        suitability: suitability || slotRecommendation,
        slotRecommendation
      };
    });

    if (searchMode === 'destination' && activeSearchCenter) {
      results = results.filter(l => (l.distance || 0) <= searchRadius / 1000);
    }

    // Advanced Filters
    if (activeFilters.evOnly) results = results.filter(l => l.features.includes("EV Charging") || l.description.includes("EV"));
    if (activeFilters.covered) results = results.filter(l => l.features.includes("Covered") || l.propertyType.includes("Office") || l.propertyType.includes("Apartment"));
    if (activeFilters.security) results = results.filter(l => (l.trustIntelligence?.safetyScore || 0) > 85 || l.features.includes("CCTV") || l.features.includes("Guarded"));
    if (activeFilters.disabled) results = results.filter(l => l.features.includes("Disabled Access") || l.features.includes("Handicap"));
    
    results = results.filter(l => (l.dynamicPricing?.currentPrice || l.pricePerHour) <= activeFilters.maxPrice);
    results = results.filter(l => (l.trustIntelligence?.safetyScore || 0) >= activeFilters.minSafety);

    // Search Query filter
    if (searchQuery && searchMode === 'destination') {
      results = results.filter(l => 
        l.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Intent specific filtering
    if (parkingIntent === "Work") {
      // Prioritize office/commercial in results
      results = results.sort((a, b) => {
        const aIsOffice = a.propertyType.includes("Office") || a.propertyType.includes("Corporate");
        const bIsOffice = b.propertyType.includes("Office") || b.propertyType.includes("Corporate");
        if (aIsOffice && !bIsOffice) return -1;
        if (!aIsOffice && bIsOffice) return 1;
        return (a.distance || 0) - (b.distance || 0);
      });
    }

    if (activeCategory !== "All") {
      results = results.filter(l => {
        if (activeCategory === "Shared Driveways") return l.propertyType.includes("Driveway") || l.propertyType.includes("Landed");
        if (activeCategory === "Private Lots") return l.propertyType.includes("Compound") || l.propertyType.includes("Gated");
        if (activeCategory === "EV Friendly") return l.description.includes("EV") || l.features.includes("EV Charging");
        if (activeCategory === "Budget Nearby") return l.pricePerHour <= 5;
        return true;
      });
    }

    if (sortBy === "nearest") results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    if (sortBy === "cheapest") results.sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sortBy === "highest rated") results.sort((a, b) => b.rating - a.rating);

    // Limit to top results for performance when searching
    if (searchQuery && searchMode === 'destination') {
       return results.slice(0, 10);
    }

    return results;
  }, [searchQuery, activeCategory, sortBy, listings, parkingIntent, userLocation, activeSearchCenter, activeFilters, searchRadius, searchMode, bookingDurationHours]);

  // Handle "Near Me" location detection - Strictly Anchor User
  const handleNearMe = () => {
    setSearchMode('near');
    setActiveSearchCenter(null);
    setNavTarget(null);
    setIsNavigatingPreview(false);
    
    if ("geolocation" in navigator) {
      addToast("Connecting to GPS...", "info");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Set persistent user anchor
          setUserLocation([latitude, longitude]);
          // Center the view on user
          setActiveSearchCenter([latitude, longitude]);
          setSearchQuery("My Current Location");
          addToast("Location found", "success");
          
          if (viewMode === 'list') setViewMode('map');
        },
        (error) => {
          console.error("Error detecting location", error);
          // Fallback to central KL center if blocked
          const klCenter: [number, number] = [3.1390, 101.6869];
          setUserLocation(klCenter);
          setActiveSearchCenter(klCenter);
          setSearchQuery("KL Central (Manual)");
          addToast("GPS signal low. Using central location.", "info");
          if (viewMode === 'list') setViewMode('map');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      addToast("Geolocation protocol not supported", "error");
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery) return;

    const topLandmark = autocompleteSuggestions.landmarks[0];
    const topListing = autocompleteSuggestions.listings[0];

    if (topLandmark && topLandmark.name.toLowerCase() === searchQuery.toLowerCase()) {
      handleLandmarkSelect(topLandmark);
    } else if (topListing && topListing.title.toLowerCase() === searchQuery.toLowerCase()) {
      setSelectedListing(topListing);
      setViewMode('map');
    } else if (autocompleteSuggestions.landmarks.length > 0) {
      handleLandmarkSelect(autocompleteSuggestions.landmarks[0]);
    } else if (autocompleteSuggestions.listings.length > 0) {
      setSelectedListing(autocompleteSuggestions.listings[0]);
      setViewMode('map');
    }
    setShowAutocomplete(false);
  };
  const handleLandmarkSelect = (landmark: Landmark) => {
    // User location remains FIXED. Clear any old navigation target first.
    setNavTarget(null);
    setSelectedLandmark(landmark);
    setIsNavigatingPreview(true); // Auto-start navigation preview
    setGuidanceMode('destination');
    setArrivalTriggered(false);
    
    // Set the focus center for the destination
    setActiveSearchCenter([landmark.lat, landmark.lng]);
    setSearchQuery(landmark.name);
    setSearchMode('destination');
    setViewMode('map');
    
    addToast(`${landmark.name} targeted. Finding best way...`, "info");
  };

  const autocompleteSuggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return { landmarks: [], listings: [] };
    const lowerQuery = searchQuery.toLowerCase();
    return {
      landmarks: landmarks.filter(l => l.name.toLowerCase().includes(lowerQuery)).slice(0, 3),
      listings: listings.filter(l => 
        l.title.toLowerCase().includes(lowerQuery) || 
        l.neighborhood.toLowerCase().includes(lowerQuery)
      ).slice(0, 3)
    };
  }, [searchQuery, listings]);

  const toggleComparison = (listing: ParkingListing) => {
    setComparisonList(prev => {
      const exists = prev.find(p => p.id === listing.id);
      if (exists) return prev.filter(p => p.id !== listing.id);
      if (prev.length >= 3) {
        addToast("Comparison limit reached (max 3)", "warning");
        return prev;
      }
      return [...prev, listing];
    });
  };

  const handleSelectParking = (listing: ParkingListing) => {
    setSelectedListing(listing);
    setNavTarget(listing);
    setGuidanceMode('parking');
    setIsNavigatingPreview(true);
    addToast(`Guidance locked to ${listing.title}. Starting navigation.`, "success");
    if (viewMode === 'list') setViewMode('map');
  };

  const handleArrival = () => {
    setArrivalTriggered(true);
    addToast("Parked! We've detected your car.", "success");
    
    // Select the current vehicle being used (simulated)
    const activeVehicle = vehicles.find(v => v.userId === 'me' || v.userId === 'driver-1') || vehicles[0];
    
    // Prepare props for AI Scanner
    setScannerProps({
      listing: navTarget || selectedListing || undefined,
      vehicle: activeVehicle,
      // If there's an active booking for this listing, pass it
      booking: bookings.find(b => b.listingId === (navTarget?.id || selectedListing?.id) && b.status === 'CONFIRMED')
    });

    // Offer to scan automatically
    setTimeout(() => {
      setShowScanner(true);
    }, 2000);
  };

  const handleNearestNode = () => {
    const anchor = activeSearchCenter || userLocation;
    if (!anchor) {
      addToast("Set a destination first to find the nearest node.", "warning");
      return;
    }

    // Try finding in filtered results first, but if empty, look in all listings
    let pool = filteredListings;
    if (pool.length === 0) {
      pool = listings;
    }

    // Sort pool by physical distance to the anchor
    const nearest = [...pool].sort((a, b) => {
      // If listing has lat/lng use it, else calculate from user anchor
      const latA = a.lat || a.latitude;
      const lngA = a.lng || a.longitude;
      const latB = b.lat || b.latitude;
      const lngB = b.lng || b.longitude;
      
      const distA = Math.sqrt(Math.pow(latA - anchor[0], 2) + Math.pow(lngA - anchor[1], 2));
      const distB = Math.sqrt(Math.pow(latB - anchor[0], 2) + Math.pow(lngB - anchor[1], 2));
      return distA - distB;
    })[0];

    if (nearest) {
      handleSelectParking(nearest);
      addToast(`Nearest Spot Found: ${nearest.title}`, "success");
      // Auto-start navigation to this node for demo flow
      setTimeout(() => {
        setNavTarget(nearest);
        setGuidanceMode('parking');
        setIsNavigatingPreview(true);
        addToast("Routing to spot...", "info");
      }, 1000);
    } else {
      addToast("Recalibrating search parameters...", "info");
      // Try again with the bare listings if everything failed
      const absoluteNearest = [...listings].sort((a, b) => {
        const distA = Math.sqrt(Math.pow((a.lat || a.latitude) - anchor[0], 2) + Math.pow((a.lng || a.longitude) - anchor[1], 2));
        const distB = Math.sqrt(Math.pow((b.lat || b.latitude) - anchor[0], 2) + Math.pow((b.lng || b.longitude) - anchor[1], 2));
        return distA - distB;
      })[0];
      
      if (absoluteNearest) {
        handleSelectParking(absoluteNearest);
        addToast(`Targeting Best Match: ${absoluteNearest.title}`, "success");
        setTimeout(() => {
          setNavTarget(absoluteNearest);
          setGuidanceMode('parking');
          setIsNavigatingPreview(true);
          addToast("Routing to spot...", "info");
        }, 1000);
      } else {
        addToast("No nodes found in the entire network.", "error");
      }
    }
  };

  const handleSubmitReview = () => {
    if (!selectedListing) return;
    if (!newComment.trim()) {
      addToast("Please enter a comment", "error");
      return;
    }
    addReview(selectedListing.id, newRating, newComment);
    addToast("Review shared with the network", "success");
    setNewComment("");
    setShowWriteReview(false);
  };

  const toggleNavigation = (listing: ParkingListing) => {
    setNavTarget(listing);
    setIsNavigatingPreview(true);
    setViewMode('map');
    addToast("Navigation preview active", "info");
  };

  const intents = [
    { label: "Work", description: "Priority: Monthly, Budget", icon: Briefcase },
    { label: "Shopping", description: "Priority: Proximity", icon: ShoppingBag },
    { label: "Event", description: "Priority: Capacity", icon: Ticket },
    { label: "Short Stop", description: "Priority: Instant", icon: Zap },
    { label: "Overnight", description: "Priority: Security", icon: Moon },
  ];

  const recommendations = useMemo(() => {
    // Intelligent sorting for recommendations
    const results = [...filteredListings].sort((a, b) => {
      // Weight safety score and confidence in recommendations
      const scoreA = (a.trustIntelligence?.safetyScore || 0) * 0.6 + (a.confidenceScore || 0) * 4;
      const scoreB = (b.trustIntelligence?.safetyScore || 0) * 0.6 + (b.confidenceScore || 0) * 4;
      return scoreB - scoreA;
    }).slice(0, 3);

    return results.map(l => {
      let reason = l.trustIntelligence?.aiTrustLabel || "Best balance of distance, price, and trust";
      if (parkingIntent === "Work") reason = "Cheapest commuter-friendly node with high reliability";
      if (parkingIntent === "Shopping") reason = "Optimized proximity for target commercial zone";
      if (parkingIntent === "Overnight") reason = l.trustIntelligence?.safetyRating === "Premium Secure" ? "Top Secure Choice for overnight storage" : "Standard Security for short stays";
      return { ...l, reason };
    });
  }, [filteredListings, parkingIntent]);

  const LANDMARKS = landmarks;

  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const intelligenceLogs = [
    "High demand predicted in KLCC (12:00 PM)",
    "Secure parking node added in Bangsar South",
    "ALPR Gateway active at SS15/4 Node",
    "Network capacity: 84.6% (Optimal)",
    "Rainfall detected in PJ: Indoor spots prioritized",
    "Tesla Powerwall charging available at Node-42"
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveLogIndex(prev => (prev + 1) % intelligenceLogs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col gap-6 ${viewMode === 'list' ? 'pb-20' : 'pb-0'} h-full flex-1 overflow-hidden relative`}>
      {/* Smart Ad Banner Overlay */}
      {viewMode === 'map' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1001] w-full max-w-lg px-4 pointer-events-none">
          <div className="pointer-events-auto space-y-4">
            <SmartAdBanner />
            {activeValetBooking && (
               <div className="scale-90 origin-top shadow-2xl">
                  <ValetLiveTracking 
                    booking={activeValetBooking} 
                    onCancel={() => cancelValet(activeValetBooking.id)} 
                    onRetrieve={() => retrieveVehicle(activeValetBooking.id)} 
                  />
               </div>
            )}
          </div>
        </div>
      )}

      {/* Premium Header */}
      <div className="flex flex-col gap-4 shrink-0 px-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
               <h1 className="text-4xl font-black text-slate-950 tracking-tighter leading-none italic uppercase">ParkLuar</h1>
               <MemberBadge tier={userSubscription.tier} />
            </div>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">System Online • Live</p>
            </div>
          </div>
                   <div className="flex gap-3 items-center">
             <div className="hidden lg:flex items-center gap-4 bg-slate-900 overflow-hidden rounded-2xl pr-6 pl-4 border border-white/5 shadow-2xl h-14 translate-z-0">
                <div className="flex flex-col justify-center border-r border-white/10 pr-4 shrink-0">
                   <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em] leading-none mb-1">Updates</span>
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">LIVE</span>
                   </div>
                </div>
                
                <div className="w-64 h-full relative overflow-hidden flex items-center">
                   <CommandTimeline variant="minimal" maxEvents={1} className="px-0 border-none bg-transparent shadow-none w-full" />
                </div>
             </div>
             
             <button
              onClick={() => {
                setIsNavigatingPreview(false);
                setNavTarget(null);
                setViewMode(viewMode === 'list' ? 'map' : 'list');
              }}
              className={`h-14 w-28 rounded-2xl shadow-premium transition-all active:scale-95 border flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-widest ${
                viewMode === 'map' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-950 border-slate-100 hover:bg-slate-50'
              }`}
            >
              {viewMode === 'list' ? (
                <>
                  <MapIcon size={16} />
                  <span>Map</span>
                </>
              ) : (
                <>
                  <ListIcon size={16} />
                  <span>List</span>
                </>
              )}
            </button>
          </div>
          </div>
        </div>

        {/* Dual Search Bar Container */}
        <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 translate-x-12">
             <Target size={120} className="text-white" />
          </div>
          
          <div className="flex flex-col gap-5 relative z-10">
            {/* Mode Switcher */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 self-start">
               <button 
                 onClick={handleNearMe}
                 className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'near' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
               >
                 Near Me
               </button>
               <button 
                 onClick={() => {
                   setSearchMode('destination');
                   setUserLocation(null);
                 }}
                 className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'destination' ? 'bg-primary text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
               >
                 Destination
               </button>
            </div>

            {/* Smart Input */}
              <form onSubmit={handleSearchSubmit} className="relative group/input">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-primary transition-all">
                  {searchMode === 'near' ? <Navigation size={22} /> : <Search size={22} />}
                </div>
                <input 
                  type="text" 
                  placeholder={searchMode === 'near' ? "Finding parking near you..." : "Search destination, landmark, area..."}
                  className="w-full bg-white/5 border-2 border-white/10 rounded-[1.8rem] py-5 pl-14 pr-14 text-white text-base font-bold focus:ring-8 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all placeholder:text-white/20"
                  value={searchQuery}
                  readOnly={searchMode === 'near'}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchMode === 'near') setSearchMode('destination');
                    setShowAutocomplete(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchSubmit();
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`absolute inset-y-0 right-5 flex items-center transition-all ${showFilters ? 'text-primary' : 'text-white/20 hover:text-primary'}`}
                >
                  <Filter size={22} />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showAutocomplete && searchQuery.length >= 2 && (autocompleteSuggestions.landmarks.length > 0 || autocompleteSuggestions.listings.length > 0) && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl z-[1100] overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-4 flex flex-col gap-1">
                          {autocompleteSuggestions.landmarks.length > 0 && (
                            <div className="flex flex-col gap-1 mb-2">
                              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-4 mb-2">Nearby Landmarks</p>
                              {autocompleteSuggestions.landmarks.map(sm => (
                                <button 
                                  key={sm.id}
                                  onClick={() => {
                                    handleLandmarkSelect(sm);
                                    setShowAutocomplete(false);
                                  }}
                                  className="w-full text-left p-2 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors group"
                                >
                                  <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/50 transition-colors">
                                    <img src={sm.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={sm.name} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none mb-1">{sm.name}</span>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{sm.type}</span>
                                  </div>
                                  <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                                    <ArrowRight size={14} />
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {autocompleteSuggestions.listings.length > 0 && (
                            <div className="flex flex-col gap-1">
                              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] px-4 mb-2">Available Parking</p>
                              {autocompleteSuggestions.listings.map(l => (
                                <button 
                                  key={l.id}
                                  onClick={() => {
                                    setSelectedListing(l);
                                    setSearchQuery(l.title);
                                    setShowAutocomplete(false);
                                    setViewMode('map');
                                  }}
                                  className="w-full text-left p-4 hover:bg-white/5 rounded-2xl flex items-center gap-4 transition-colors group"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 transition-colors">
                                    <Zap size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none mb-1">{l.title}</span>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{l.neighborhood} • RM {l.pricePerHour}/hr</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Landmarks / Context */}
            {searchMode === 'destination' && (
               <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {landmarks.map(landmark => (
                    <button 
                      key={landmark.id}
                      onClick={() => handleLandmarkSelect(landmark)}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-white/60 uppercase tracking-widest whitespace-nowrap transition-colors"
                    >
                      {landmark.name}
                    </button>
                  ))}
               </div>
            )}

            {/* Radius Control */}
            {searchMode === 'destination' && searchQuery && (
               <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                       <span className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Search Radius</span>
                       <span className="text-xs font-bold text-emerald-400">Showing within {searchRadius}m of point</span>
                    </div>
                    <div className="flex gap-1.5">
                       {[100, 300, 500, 1000].map(r => (
                          <button 
                            key={r}
                            onClick={() => setSearchRadius(r)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black flex items-center justify-center transition-all border ${searchRadius === r ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/40'}`}
                          >
                             {r >= 1000 ? '1km' : `${r}m`}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>
            )}

                 {/* Advanced Filter Drawer Section */}
                 <AnimatePresence>
                    {showFilters && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden bg-white/5 rounded-[2rem] border border-white/10"
                       >
                         <div className="p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                               <h3 className="text-sm font-black text-white uppercase tracking-widest">Search Filters</h3>
                               <button 
                                 onClick={() => setActiveFilters({ maxPrice: 30, minSafety: 0, evOnly: false, covered: false, security: false })}
                                 className="text-[9px] font-black text-primary uppercase tracking-[0.2em]"
                               >
                                 Reset Filters
                               </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div className="flex flex-col gap-3">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Max Price (per hour)</span>
                                     <span className="text-xs font-bold text-white">RM {activeFilters.maxPrice}</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="2" 
                                    max="50" 
                                    step="1"
                                    value={activeFilters.maxPrice}
                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                                    className="w-full accent-primary h-1.5 bg-white/10 rounded-lg cursor-pointer"
                                  />
                               </div>
                               <div className="flex flex-col gap-3">
                                  <div className="flex justify-between items-end">
                                     <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Safety Rating</span>
                                     <span className="text-xs font-bold text-white">{activeFilters.minSafety}+ Score</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="95" 
                                    step="5"
                                    value={activeFilters.minSafety}
                                    onChange={(e) => setActiveFilters(prev => ({ ...prev, minSafety: parseInt(e.target.value) }))}
                                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                                  />
                               </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                               {[
                                 { id: 'evOnly', label: 'EV Charging', icon: Zap },
                                 { id: 'covered', label: 'Covered spots', icon: Shield },
                                 { id: 'security', label: 'CCTV & Security', icon: Moon },
                                 { id: 'disabled', label: 'Special Access', icon: Heart },
                               ].map(f => (
                                 <button 
                                   key={f.id}
                                   onClick={() => setActiveFilters(prev => ({ ...prev, [f.id]: !prev[f.id as keyof typeof prev] }))}
                                   className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${
                                     activeFilters[f.id as keyof typeof activeFilters] 
                                     ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                                     : 'bg-white/5 border-white/10 text-white/30 hover:text-white/50'
                                   }`}
                                 >
                                   <f.icon size={12} />
                                   {f.label}
                                 </button>
                               ))}
                            </div>
                         </div>
                       </motion.div>
                    )}
                 </AnimatePresence>

                 {/* Booking Time Intelligence */}
                 <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-primary" />
                       <h3 className="text-[9px] font-black text-white/40 uppercase tracking-widest">Select your time</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-black text-white/30 uppercase tracking-widest pl-2">Planned Arrival</label>
                          <input 
                            type="datetime-local" 
                            value={bookingSchedule.arrival}
                            onChange={(e) => setBookingSchedule(prev => ({ ...prev, arrival: e.target.value }))}
                            className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-primary/50 transition-colors"
                          />
                       </div>
                       <div className="flex flex-col gap-1.5">
                          <label className="text-[8px] font-black text-white/30 uppercase tracking-widest pl-2">Planned Exit</label>
                          <input 
                            type="datetime-local" 
                            value={bookingSchedule.departure}
                            onChange={(e) => setBookingSchedule(prev => ({ ...prev, departure: e.target.value }))}
                            className="bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-white outline-none focus:border-primary/50 transition-colors"
                          />
                       </div>
                    </div>
                    <div className="flex items-center justify-between px-2 pt-1">
                       <div className="flex items-center gap-2">
                          <SectionHeader title={`${bookingDurationHours} Hour Session`} className="mb-0" />
                          <Badge className="bg-primary/20 text-primary border-none text-[8px] font-black">AI Optimized</Badge>
                       </div>
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                          Availability recalibrated for this window
                       </p>
                    </div>
                 </div>
               </div>

        {/* Intent Chips */}
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest px-2">What are you parking for?</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {intents.map((intent) => (
              <button 
                key={intent.label}
                onClick={() => setParkingIntent(parkingIntent === intent.label ? null : intent.label)}
                className={`p-4 rounded-[2rem] border-2 flex flex-col items-center gap-2 transition-all min-w-[100px] shadow-sm ${
                  parkingIntent === intent.label
                  ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20 -translate-y-1' 
                  : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${parkingIntent === intent.label ? 'bg-white/20' : 'bg-slate-50'}`}>
                   <intent.icon size={18} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{intent.label}</span>
              </button>
            ))}
          </div>
        </div>

      <div className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div 
              key="list-view"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="flex-1 flex flex-col gap-8 overflow-y-auto pr-2 px-1 scrollbar-hide pb-10"
            >
               <div className="flex flex-col gap-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Location Synchronization Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNearMe}
                      className="w-full p-6 bg-white border-2 border-slate-50 text-slate-950 rounded-[2.5rem] shadow-xl flex items-center justify-between group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 text-slate-500 group-hover:bg-primary group-hover:text-white transition-colors">
                          <Target size={24} className="animate-pulse" />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Your Location</p>
                          <h4 className="text-xl font-black tracking-tighter leading-none">Update Location</h4>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </motion.button>
 
                    {/* Park at Nearest Node Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNearestNode}
                      className="w-full p-6 bg-primary text-white rounded-[2.5rem] shadow-2xl shadow-primary/30 flex items-center justify-between border-2 border-white/20 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/20">
                          <Zap size={24} className="animate-pulse" />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">Quick Path</p>
                          <h4 className="text-xl font-black tracking-tighter leading-none">Find Nearest Spot</h4>
                        </div>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center relative z-10">
                        <ArrowRight size={20} />
                      </div>
                    </motion.button>
                 </div>
               </div>

              {/* Destination Shortcuts Grid */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter">Popular Destinations</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Find parking near these areas</p>
                  </div>
                  <Badge variant="slate" className="bg-slate-100 text-slate-600 border-none font-black text-[9px] uppercase tracking-widest px-3 py-1">Spots Ready</Badge>
                </div>
                
               <div className="grid grid-cols-2 gap-4">
                  {landmarks.slice(0, 4).map((landmark, idx) => (
                    <motion.div 
                      key={landmark.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleLandmarkSelect(landmark)}
                      className="bg-white rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-900/5 flex flex-col cursor-pointer hover:border-primary/20 transition-all group relative overflow-hidden"
                    >
                      <div className="h-36 w-full relative">
                        <img 
                          src={landmark.image} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={landmark.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=800";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent group-hover:from-slate-900/60 transition-all opacity-60" />
                        <div className="absolute top-3 right-3">
                           <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                             {landmark.type === 'mall' ? <ShoppingBag size={14} /> : landmark.type === 'transport' ? <Navigation size={14} /> : <Briefcase size={14} />}
                           </div>
                        </div>
                        <div className="absolute bottom-3 left-4">
                           <Badge className="bg-primary/90 text-[7px] text-white border-none font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-full">Top Spot</Badge>
                        </div>
                      </div>
                      <div className="p-4 flex flex-col gap-1 bg-white">
                        <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none truncate group-hover:text-primary transition-colors">{landmark.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                           <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">Fastest Route Active</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Comparison Tool Interaction */}
              <AnimatePresence>
                {comparisonList.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex flex-col gap-4 bg-slate-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Zap size={60} className="text-white" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex flex-col">
                          <h3 className="text-xl font-black text-white tracking-tighter">Quick Comparison</h3>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Checking your options</p>
                       </div>
                       <button 
                         onClick={() => setComparisonList([])}
                         className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/40"
                       >
                          <X size={20} />
                       </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                       {comparisonList.map(item => (
                         <div key={item.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                            <h4 className="text-xs font-black text-white tracking-tight line-clamp-1">{item.title}</h4>
                            <div className="flex flex-col gap-1">
                               <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40">
                                  <span>Price</span>
                                  <span className="text-white">RM {item.pricePerHour * bookingDurationHours}</span>
                               </div>
                               <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40">
                                  <span>Trust</span>
                                  <span className="text-emerald-400">{item.trustIntelligence?.safetyScore}%</span>
                               </div>
                               <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40">
                                  <span>Dist</span>
                                  <span className="text-primary">{item.distance}km</span>
                               </div>
                            </div>
                            <Button 
                              size="xs" 
                              variant="blue" 
                              onClick={() => setSelectedListing(item)}
                              className="h-7 text-[8px] font-black uppercase tracking-widest"
                            >
                              Details
                            </Button>
                         </div>
                       ))}
                       {comparisonList.length < 3 && (
                         <div className="bg-white/5 border-2 border-dashed border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-white/20 gap-2">
                            <Plus size={16} />
                            <span className="text-[7px] font-black uppercase tracking-widest text-center">Add Spot to Compare</span>
                         </div>
                       )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Intelligent Recommendations */}
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between px-1">
                    <div className="flex flex-col">
                       <div className="flex items-center gap-2 mb-1">
                          <BrainCircuit size={14} className="text-fuchsia-500" />
                          <h3 className="text-xl font-black text-slate-900 tracking-tighter">Personalized For You</h3>
                       </div>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Matched to your Mobility DNA™</p>
                    </div>
                    <Badge variant="blue" className="bg-fuchsia-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-fuchsia-200">Recommended</Badge>
                 </div>
                 
                 <div className="grid grid-cols-1 gap-4">
                    {recommendations.map((rec, idx) => (
                      <motion.div 
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => setSelectedListing(rec)}
                        className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-50 shadow-xl shadow-slate-900/5 flex items-center gap-5 cursor-pointer hover:border-primary/20 transition-all group"
                      >
                         <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden relative shrink-0">
                            <img src={rec.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="rec" />
                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                         </div>
                         <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                            <div className="flex items-center gap-2">
                               <Badge className="bg-emerald-500 text-white border-none text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{rec.confidenceScore} IQ Score</Badge>
                               <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none line-clamp-1">{rec.reason}</span>
                            </div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tighter leading-none line-clamp-1">{rec.title}</h4>
                            <div className="flex items-center justify-between border-t border-slate-50 pt-2 mt-1">
                               <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-black text-slate-900">RM {rec.pricePerHour}</span>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">/hr</span>
                               </div>
                               <div className="flex items-center gap-1.5">
                                  <Star size={10} className="fill-amber-500 text-amber-500" />
                                  <span className="text-[10px] font-black text-slate-900">{rec.rating}</span>
                               </div>
                            </div>
                         </div>
                         <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all scale-0 group-hover:scale-100 shrink-0">
                            <ArrowRight size={18} />
                         </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              {/* Category Chips */}
              <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide shrink-0">
                {categories.map((cat, idx) => (
                  <motion.button 
                    key={cat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`px-5 py-3 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest whitespace-nowrap border-2 flex items-center gap-2.5 transition-all ${
                      activeCategory === cat.label
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xl shadow-slate-900/20 -translate-y-1' 
                      : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    {cat.icon && <cat.icon size={14} className={activeCategory === cat.label ? 'text-primary' : ''} />}
                    {cat.label}
                  </motion.button>
                ))}
              </div>

              {/* Smart Demand Warning */}
              <div className="bg-amber-900 text-white p-5 rounded-[2.5rem] flex items-center justify-between border-2 border-amber-800 shadow-2xl shadow-amber-900/10 overflow-hidden relative group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <AlertCircle size={80} />
                 </div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                       <Clock size={24} className="text-amber-400" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-amber-200/60 leading-none mb-1.5 font-sans">Smart Prediction</p>
                       <h4 className="text-xl font-black tracking-tighter leading-none mb-1">Peak Demand Expected</h4>
                       <p className="text-xs font-bold text-amber-100/70">12:00 PM – 2:00 PM • Book early</p>
                    </div>
                 </div>
                 <div className="relative z-10 px-4 py-2 bg-amber-800/50 rounded-xl border border-amber-700">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Busy Zone</span>
                 </div>
              </div>

              {/* Main Listing Section */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <SectionHeader title="Nearby Hotspots" subtitle="Explore current network capacity" />
                  <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-[1.2rem] backdrop-blur-sm border border-slate-100">
                    {["nearest", "cheapest"].map((opt) => (
                      <button 
                        key={opt}
                        onClick={() => setSortBy(opt)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${sortBy === opt ? 'bg-white shadow-xl text-primary border border-slate-100' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredListings.slice(0, 16).map((listing, i) => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      i={i} 
                      onClick={() => handleSelectParking(listing)} 
                      onCompare={() => toggleComparison(listing)}
                      isComparing={!!comparisonList.find(p => p.id === listing.id)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="map-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 w-full min-h-[500px] h-full"
            >
              <div className="w-full h-full relative">
                <MapView 
                  listings={filteredListings} 
                  onSelectListing={handleSelectParking}
                  center={userLocation || activeSearchCenter || [3.1390, 101.6869]}
                  isNavigating={isNavigatingPreview}
                  navDestination={navTarget}
                  searchRadius={searchRadius}
                  searchCenter={activeSearchCenter || undefined}
                  selectedListing={selectedListing || undefined}
                  userLocation={userLocation || undefined}
                  landmarks={landmarks}
                  searchQuery={searchQuery}
                  onNearMe={handleNearMe}
                  onArrive={handleArrival}
                  onNearestNode={handleNearestNode}
                  guidanceMode={guidanceMode}
                />

                {/* Smart Arrival Guidance Banner */}
                <AnimatePresence>
                  {isNavigatingPreview && (navTarget || selectedLandmark) && (
                    <motion.div 
                      key={navTarget?.id || selectedLandmark?.id}
                      initial={{ opacity: 0, y: -50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      className="absolute top-6 left-1/2 -translate-x-1/2 z-[1002] w-[90%] max-w-md"
                    >
                      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-6 rounded-[2.5rem] shadow-2xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        {/* Destination Thumbnail Card */}
                        {(navTarget?.images?.[0] || selectedLandmark?.image) && (
                          <div className="absolute top-4 right-4 w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl pointer-events-none z-20">
                            <img 
                              src={navTarget?.images?.[0] || selectedLandmark?.image} 
                              className="w-full h-full object-cover pulse-glow" 
                              alt="dest"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=800";
                              }}
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4 relative z-10">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                              {guidanceMode === 'walking' ? <Zap size={20} className="animate-pulse" /> : <Navigation size={20} className="animate-bounce" />}
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">
                                {guidanceMode === 'destination' ? 'Area Infiltration' : guidanceMode === 'parking' ? 'Terminal Guidance' : 'Pedestrian Sync'}
                              </p>
                              <h3 className="text-sm font-black text-white tracking-tight leading-none uppercase">
                                {guidanceMode === 'walking' ? 'Walking to Target' : `Routing to ${navTarget?.title || selectedLandmark?.name}`}
                              </h3>
                            </div>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-none text-[8px] font-black uppercase tracking-widest">Active</Badge>
                        </div>

                        {selectedLandmark && !navTarget && (
                          <div className="flex flex-col gap-2 relative z-10 mb-4">
                             <div className="flex items-center gap-2">
                                <Badge variant="blue" className="bg-primary/20 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">High Demand Area</Badge>
                                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Estimated Arrival: 12 Mins</span>
                             </div>
                             <p className="text-[10px] font-medium text-white/40 leading-snug">ParkLuar IQ has detected multiple secure nodes near this destination. Deploying terminal search...</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 relative z-10">
                          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Remaining Time</p>
                            <div className="flex items-baseline gap-1">
                               <span className="text-xl font-black text-white font-mono tracking-tighter">
                                 {guidanceMode === 'walking' ? '4' : '12'}
                               </span>
                               <span className="text-[10px] font-black text-white/40">MIN</span>
                            </div>
                          </div>
                          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                            <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Target Cluster</p>
                            <div className="flex items-baseline gap-1">
                               <span className="text-xl font-black text-white font-mono tracking-tighter">
                                 {guidanceMode === 'walking' ? '280' : '4.2'}
                               </span>
                               <span className="text-[10px] font-black text-white/40">{guidanceMode === 'walking' ? 'METERS' : 'KM'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrival Simulator / Terminal Action Button */}
                        {!arrivalTriggered && (
                          <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => {
                              if (!navTarget && selectedLandmark) {
                                handleNearestNode();
                                return;
                              }
                              handleArrival();
                              if (guidanceMode === 'parking') {
                                setGuidanceMode('walking');
                                addToast("Target Reached. Calibrating Walking Footprints.", "success");
                              } else if (guidanceMode === 'walking') {
                                setIsNavigatingPreview(false);
                                addToast("Final Destination Confirmed. Intelligence Session Active.", "success");
                              }
                            }}
                            className="w-full mt-4 py-3 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group/btn"
                          >
                            {!navTarget && selectedLandmark ? (
                              <>
                                <Target size={14} className="group-hover/btn:animate-ping" />
                                Deploy Terminal Node Search
                              </>
                            ) : (
                              guidanceMode === 'walking' ? 'Confirm Destination Reach' : 'Simulate Slot Arrival'
                            )}
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Map Overlay Fallback Button */}
                <div className="absolute top-4 left-4 z-[1001] md:hidden">
                   <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className="h-10 rounded-xl bg-white/90 backdrop-blur-md shadow-lg border-white/50 text-[9px] font-black uppercase tracking-widest"
                   >
                     Back to List
                   </Button>
                </div>

                {/* Navigation HUD Overlay */}
                <AnimatePresence>
                  {isNavigatingPreview && (navTarget || selectedLandmark) && (
                    <motion.div 
                      key={`hud-${navTarget?.id || selectedLandmark?.id}`}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      className="absolute bottom-8 left-6 right-6 z-20 pointer-events-none"
                    >
                      <div className="bg-slate-900/90 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col gap-6 pointer-events-auto relative overflow-hidden">
                         {/* Visual Backdrop Overlay */}
                         {(navTarget?.images?.[0] || selectedLandmark?.image) && (
                           <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none">
                             <img 
                               src={navTarget?.images?.[0] || selectedLandmark?.image} 
                               className="w-full h-full object-cover opacity-30" 
                               alt="dest" 
                               onError={(e) => {
                                 (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=800";
                               }}
                             />
                             <div className="absolute inset-0 bg-gradient-to-l from-slate-900 via-slate-900/40 to-transparent" />
                           </div>
                         )}

                         <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-4">
                               <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                  <Navigation size={28} />
                               </div>
                               <div>
                                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Navigating</p>
                                  <h3 className="text-2xl font-black text-white tracking-tighter leading-none">{navTarget?.title || selectedLandmark?.name}</h3>
                               </div>
                            </div>
                            <button 
                              onClick={() => {
                                setIsNavigatingPreview(false);
                                setNavTarget(null);
                                setSelectedLandmark(null);
                              }}
                              className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                            >
                               <X size={20} />
                            </button>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex flex-col gap-1">
                               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Estimated Arrival</span>
                               <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-emerald-400" />
                                  <span className="text-xl font-black text-white leading-none">08 Mins</span>
                               </div>
                            </div>
                            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 flex flex-col gap-1">
                               <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Protocol Sync</span>
                               <div className="flex items-center gap-2">
                                  <Shield size={14} className="text-blue-400" />
                                  <span className="text-xl font-black text-white leading-none">Running</span>
                                </div>
                            </div>
                         </div>

                         <div className="px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Approaching Spot</p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Listing Detail Drawer */}
      <Drawer
        isOpen={!!selectedListing && !showBookingFlow}
        onClose={() => setSelectedListing(null)}
        title={selectedListing?.title || "Listing Details"}
      >
        {selectedListing && (
          <div className="flex flex-col gap-8 pb-10">
            {/* Intel Gallery */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2 h-48">
                <div className="col-span-3 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                  <img 
                    src={selectedListing.images?.[0]} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt="p1" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=800";
                    }}
                  />
                  <div className="absolute top-4 left-4">
                     <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">Verified Arrival View</Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-full rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-100">
                    <img 
                      src={selectedListing.arrivalProtocols?.previewImages?.entrance || selectedListing.images?.[0]} 
                      className="w-full h-full object-cover" 
                      alt="p2" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1545179605-1296651e9d43?q=80&w=400";
                      }}
                    />
                  </div>
                  <div className="h-full rounded-2xl overflow-hidden shadow-lg relative border border-slate-100 bg-slate-100">
                    <img 
                      src={selectedListing.arrivalProtocols?.previewImages?.bay || selectedListing.images?.[0]} 
                      className="w-full h-full object-cover opacity-50" 
                      alt="p3" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=400";
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-slate-800 font-black text-xs uppercase">+3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Score Header */}
            <div className={`flex justify-between items-center bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl shadow-slate-900/20 ${(selectedListing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? 'border-r-8 border-amber-500' : (selectedListing.dynamicPricing?.adjustmentPercentage || 0) < 0 ? 'border-r-8 border-emerald-500' : ''}`}>
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Dynamic Optimized Fare</p>
                     <Badge variant="blue" className="bg-primary/20 text-primary border-none text-[8px] font-black">{selectedListing.dynamicPricing?.statusLabel}</Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black tracking-tighter leading-none">
                       <span className="text-sm font-bold text-primary mr-1 text-emerald-400">RM</span>
                       {(selectedListing.dynamicPricing?.currentPrice || selectedListing.pricePerHour).toFixed(2)}
                    </p>
                    {(selectedListing.dynamicPricing?.adjustmentPercentage !== 0) && (
                      <span className={`text-xs font-bold ${ (selectedListing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        { (selectedListing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? '↑' : '↓' }
                        { Math.abs(selectedListing.dynamicPricing?.adjustmentPercentage || 0) }%
                      </span>
                    )}
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 mb-2">
                       <Shield size={14} className="text-blue-400" />
                       <span className="text-lg font-black tracking-tight">{selectedListing.trustIntelligence?.safetyScore}/100</span>
                    </div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Safety Score</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 mb-2">
                       <Cpu size={14} className="text-emerald-400" />
                       <span className="text-lg font-black tracking-tight">{selectedListing.confidenceScore} IQ</span>
                    </div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Confidence Score</p>
                  </div>
               </div>
            </div>

            {/* AI Reservation Confidence Shield */}
            <div className="px-2">
               <ConfidenceScore 
                  score={selectedListing.confidenceScore} 
                  stability={selectedListing.confidenceScore > 95 ? 'ELITE' : 'STABLE'} 
               />
            </div>

            {/* Smart Pricing Breakdown */}
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                     <h3 className="text-lg font-black text-slate-900 tracking-tight">Trust Breakdown</h3>
                     <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Session: {bookingDurationHours} Hours</p>
                  </div>
                  <Badge className="bg-white text-slate-900 border-slate-200 font-black text-[8px] uppercase tracking-widest">Protocol V4</Badge>
               </div>
               
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Base Hourly Rate</span>
                     <span className="text-sm font-black text-slate-900 font-mono">RM {selectedListing.pricePerHour.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-500">Duration Multiplier (x{bookingDurationHours})</span>
                     <span className="text-sm font-black text-slate-900 font-mono">RM {(selectedListing.pricePerHour * bookingDurationHours).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Dynamic Demand Adjustment</span>
                        <Info size={12} className="text-slate-300" />
                     </div>
                     <span className={`text-sm font-black font-mono ${(selectedListing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        { (selectedListing.dynamicPricing?.adjustmentPercentage || 0) > 0 ? '+' : '' }
                        RM {( (selectedListing.dynamicPricing?.currentPrice || selectedListing.pricePerHour) * bookingDurationHours - (selectedListing.pricePerHour * bookingDurationHours) ).toFixed(2)}
                     </span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex justify-between items-center">
                     <span className="text-base font-black text-slate-900 uppercase tracking-tight">Final Optimized Total</span>
                     <span className="text-2xl font-black text-primary tracking-tighter font-mono">
                        RM {( (selectedListing.dynamicPricing?.currentPrice || selectedListing.pricePerHour) * bookingDurationHours ).toFixed(2)}
                     </span>
                  </div>
               </div>
            </div>

            {/* AI Trust & Pricing Reasoning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2.5rem] flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Brain size={18} className="text-primary" />
                      <h4 className="text-[10px] font-black text-primary uppercase tracking-widest font-mono">Trust Recommendation</h4>
                   </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter italic">"{selectedListing.trustIntelligence?.aiTrustLabel}"</h3>
                    <p className="text-sm font-medium text-slate-500 leading-tight">
                       {selectedListing.trustIntelligence?.aiTrustReasoning}
                    </p>
                 </div>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedListing.trustIntelligence?.securityFeatures.slice(0, 2).map(feature => (
                      <div key={feature} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-slate-100">
                         <CheckCircle2 size={12} className="text-emerald-500" />
                         <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{feature}</span>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="bg-amber-50 border border-amber-200 p-6 rounded-[2.5rem] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Zap size={18} className="text-amber-600" />
                       <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest font-mono">Price History</h4>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700 border-none text-[8px] font-black uppercase tracking-widest">{selectedListing.dynamicPricing?.statusLabel}</Badge>
                  </div>
                  <div className="flex flex-col gap-2">
                     <h3 className="text-xl font-black text-amber-900 tracking-tighter">Market Equilibrium Optimization</h3>
                     <p className="text-xs font-black text-amber-800 leading-snug">
                        {selectedListing.dynamicPricing?.reasoning}
                     </p>
                  </div>
                  <div className="mt-auto pt-2 border-t border-amber-200 flex justify-between items-center">
                     <span className="text-[9px] font-black text-amber-700 uppercase tracking-widest">Base Rate: RM {selectedListing.dynamicPricing?.basePrice.toFixed(2)}</span>
                     <span className="text-[9px] font-black text-amber-700 font-mono italic">AI Optimised</span>
                  </div>
               </div>
            </div>

            {/* Confidence Breakdown & Host Trust */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                     <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Key Metrics</h4>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black px-2 py-0.5 rounded-full">Optimized</Badge>
                  </div>
                  <div className="space-y-3">
                     {[
                       { label: 'Host Reliability', val: selectedListing.trustIntelligence?.hostReliability || 95 },
                       { label: 'Booking Success', val: selectedListing.trustIntelligence?.bookingSuccessRate || 98 },
                       { label: 'Safety Integrity', val: selectedListing.trustIntelligence?.safetyScore || 90 },
                       { label: 'Navigation Clarity', val: selectedListing.confidenceBreakdown?.navigationClarity || 9 }
                     ].map(metric => (
                        <div key={metric.label} className="w-full">
                           <div className="flex justify-between text-[10px] font-bold mb-1 px-1">
                               <span>{metric.label}</span>
                               <span className="text-slate-900">{typeof metric.val === 'number' ? (metric.val > 10 ? metric.val : metric.val * 10) : 0}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${typeof metric.val === 'number' ? (metric.val > 10 ? metric.val : metric.val * 10) : 0}%` }} 
                                className={`h-full rounded-full ${metric.label === 'Safety Integrity' ? 'bg-blue-500' : 'bg-emerald-500'}`} 
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div className="flex flex-col gap-4">
                  <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-amber-700/60 uppercase tracking-widest">Public Parking Intel</h4>
                    <p className="text-sm font-bold text-amber-900 leading-tight">
                       {selectedListing.publicParkingComparison?.availabilityNote || "High occupancy"}. Save <span className="text-emerald-600 font-black">{(selectedListing.publicParkingComparison?.savingsPercent || 0)}%</span> vs public lots.
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                       <Clock size={14} className="text-amber-600" />
                       <span className="text-xs font-black text-amber-900/60">Verified Price comparison active</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-2">
                     <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Host Record</span>
                        <div className="flex gap-1">
                           {[1, 2, 3, 4, 5].map(s => (
                             <Star key={s} size={10} className="fill-amber-500 text-amber-500" />
                           ))}
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Cancellation Rate</span>
                        <span className="text-xs font-black text-red-500">{selectedListing.trustIntelligence?.cancellationRate}%</span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Dispute History</span>
                        <span className="text-xs font-black text-emerald-500">None Reported</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Arrival Rules */}
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 flex flex-col gap-6">
               <SectionHeader 
                 title="Arrival Instructions" 
                 subtitle="Follow the guide below for easy parking" 
                 actionLabel="View Map"
               />
               
               <div className="flex flex-col gap-5">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                     <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                        <Navigation size={24} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Navigation Guidance</p>
                        <p className="text-sm font-bold text-slate-800 leading-snug">
                           Enter via <span className="text-primary font-black">{selectedListing.arrivalProtocols?.landmarkGuidance || "Main Entrance"}</span>. {selectedListing.arrivalProtocols?.easeRating || "Moderate"} Access Rating.
                        </p>
                     </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
                        <CheckCircle2 size={24} />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Protocol</p>
                        <p className="text-sm font-medium text-slate-500 leading-snug italic px-1">
                           "{selectedListing.arrivalProtocols?.specificInstructions?.[0] || selectedListing.accessInstructions}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-3">
               <div className="flex gap-3">
                  <Button 
                    onClick={() => {
                        toggleNavigation(selectedListing);
                        setSelectedListing(null);
                    }}
                    variant="outline"
                    className="flex-1 h-18 rounded-[2rem] font-black text-lg border-2 border-slate-100 shadow-sm hover:border-primary transition-all flex gap-3"
                  >
                    <Navigation size={20} className="text-primary" />
                    Preview Route
                  </Button>
                  <Button 
                    onClick={() => setShowBookingFlow(true)}
                    className="flex-[1.5] h-18 rounded-[2rem] font-black text-lg shadow-2xl shadow-primary/30 flex gap-3 items-center group overflow-hidden relative"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 animate-pulse" />
                    <div className="relative flex items-center gap-3">
                        Secure Intelligence Bay
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Button>
               </div>
               <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Secure Site
               </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* All Reviews Modal */}
      <Modal 
        isOpen={showAllReviews} 
        onClose={() => setShowAllReviews(false)} 
        title="Network Reviews"
      >
         {selectedListing && (
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">Average Rating: {selectedListing.rating}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedListing.reviewCount} total experiences</p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setShowWriteReview(true)}
                    className="rounded-xl h-10 px-4 text-[10px] uppercase font-black tracking-widest"
                  >
                    Write Review
                  </Button>
               </div>

               <div className="space-y-4">
                  {getListingReviews(selectedListing.id).map((rev: any) => (
                    <div key={rev.id} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-white shadow-sm overflow-hidden border border-slate-100">
                                 <img 
                                   src={`https://i.pravatar.cc/150?u=${rev.userName}`} 
                                   className="w-full h-full object-cover" 
                                   referrerPolicy="no-referrer"
                                   onError={(e) => {
                                     (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${rev.userName}&background=random`;
                                   }}
                                 />
                              </div>
                              <div>
                                 <p className="text-sm font-black text-slate-900">{rev.userName}</p>
                                 <p className="text-[9px] font-bold text-slate-500 uppercase">{new Date(rev.date).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex gap-1 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                 <Star key={i} size={12} className={i < rev.rating ? "fill-amber-500" : "text-slate-200"} />
                              ))}
                           </div>
                        </div>
                        <p className="text-sm font-medium text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
               </div>
            </div>
         )}
      </Modal>

      {/* Write Review Modal */}
      <Modal 
        isOpen={showWriteReview} 
        onClose={() => setShowWriteReview(false)} 
        title="Share Experience"
      >
         <div className="space-y-6">
            <div className="flex flex-col items-center gap-4 py-4">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Rate the service</p>
               <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                     <button 
                       key={star} 
                       onClick={() => setNewRating(star)}
                       className={`p-2 transition-transform active:scale-90 ${newRating >= star ? 'text-amber-500' : 'text-slate-200'}`}
                     >
                        <Star size={32} className={newRating >= star ? "fill-amber-500" : ""} />
                     </button>
                  ))}
               </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Your Comments</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-3xl px-5 py-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-none"
                  placeholder="Tell others about your experience..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
            </div>

            <Button onClick={handleSubmitReview} className="w-full h-14 rounded-2xl font-black">
               Post Review
            </Button>
         </div>
      </Modal>

      <AnimatePresence>
        {showBookingFlow && selectedListing && (
          <BookingFlow 
            listing={selectedListing} 
            onClose={() => setShowBookingFlow(false)} 
            onSuccess={(booking) => {
              console.log("Booking success", booking);
              setShowBookingFlow(false);
              // Store props for scanner and show it immediately for demo
              setScannerProps({ 
                booking, 
                listing: selectedListing!, 
                vehicle: { id: 'v-1', driverId: 'me', make: 'Perodua', model: 'Myvi', plateNumber: 'VCC 8122', color: 'Electric Blue' } 
              });
              setShowScanner(true);
              setSelectedListing(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {comparisonList.length > 1 && (
          <Modal
            isOpen={comparisonList.length > 0}
            onClose={() => setComparisonList([])}
            title="Compare Options"
          >
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="flex flex-col gap-8 pt-20">
                  <div className="h-10 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Metric</div>
                  <div className="flex flex-col gap-6">
                    <span className="text-xs font-bold text-slate-500">Hourly Rate</span>
                    <span className="text-xs font-bold text-slate-500">Distance</span>
                    <span className="text-xs font-bold text-slate-500">Safety IQ</span>
                    <span className="text-xs font-bold text-slate-500">Rating</span>
                    <span className="text-xs font-bold text-slate-500">Walking ETA</span>
                    <span className="text-xs font-bold text-slate-500">Trust Factor</span>
                  </div>
                </div>
                
                {comparisonList.map((item, idx) => (
                  <div key={item.id} className="flex flex-col gap-8 relative">
                    <div className="h-20 flex flex-col items-center text-center gap-2">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden">
                          <img src={item.images?.[0]} className="w-full h-full object-cover" />
                       </div>
                       <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter line-clamp-1 h-4">{item.title}</span>
                    </div>
                    <div className="flex flex-col gap-6 items-center text-center pt-2 border-l border-slate-100 border-dashed">
                      <span className="text-sm font-black text-slate-900">RM {item.pricePerHour}</span>
                      <span className="text-sm font-black text-primary">{(item.distance || 0).toFixed(1)} km</span>
                      <span className="text-sm font-black text-emerald-500">{item.trustIntelligence?.safetyScore}%</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span className="text-sm font-black text-slate-900">{item.rating}</span>
                      </div>
                      <span className="text-sm font-black text-blue-500">{Math.round((item.distToDest || 0) * 12)} min</span>
                      <Badge className="bg-slate-900 text-white text-[8px] font-black uppercase tracking-tighter">{item.trustIntelligence?.safetyRating.split(' ')[0]}</Badge>
                    </div>
                    <Button 
                      size="xs" 
                      onClick={() => {
                        setSelectedListing(item);
                        setComparisonList([]);
                      }}
                      className="mt-4 rounded-xl py-2 h-auto text-[9px] font-black"
                    >
                      Select
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10">
                <div className="flex items-center gap-3 mb-3">
                  <Brain size={20} className="text-primary" />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">AI Verdict</h4>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                  Based on your current booking duration of {bookingDurationHours} hours and {parkingIntent || 'general'} intent, 
                  <span className="text-primary font-black mx-1">
                    {comparisonList.reduce((prev, curr) => ( (curr.trustIntelligence?.safetyScore || 0) > (prev.trustIntelligence?.safetyScore || 0) ? curr : prev )).title}
                  </span>
                  is the superior choice for security integrity, while 
                  <span className="text-emerald-600 font-black mx-1">
                    {comparisonList.reduce((prev, curr) => ( curr.pricePerHour < prev.pricePerHour ? curr : prev )).title}
                  </span>
                  offers maximum financial efficiency.
                </p>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScanner && (
          <AIScanner 
            onClose={() => setShowScanner(false)} 
            {...scannerProps}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const ListingCard: React.FC<{ 
  listing: ParkingListing; 
  i: number; 
  onClick: () => void;
  onCompare: () => void;
  isComparing: boolean;
}> = ({ listing, i, onClick, onCompare, isComparing }) => {
  const isPremium = (listing.rating || 0) >= 4.8;
  const imageUrl = listing.images && listing.images.length > 0 
    ? listing.images?.[0] 
    : "https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=2070&auto=format&fit=crop";
  
    // Smart Safety & Trust
    const trust = listing.trustIntelligence;
    const safetyBadgeColor = 
      trust?.safetyRating === "Premium Secure" ? "bg-emerald-500" :
      trust?.safetyRating === "Highly Safe" ? "bg-blue-500" :
      trust?.safetyRating === "Standard Security" ? "bg-slate-700" : "bg-amber-600";

    const isSurge = (listing.dynamicPricing?.adjustmentPercentage || 0) > 0;
    const isDiscount = (listing.dynamicPricing?.adjustmentPercentage || 0) < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 + 0.2, type: "spring", stiffness: 100 }}
      whileHover={{ y: -12, transition: { duration: 0.4 } }}
      className="group cursor-pointer border border-slate-100 rounded-[3rem] overflow-hidden bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(0,92,175,0.15)] transition-all duration-500 relative"
    >
      <div className="relative h-64 overflow-hidden" onClick={onClick}>
        <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={listing.title} />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 backdrop-blur-[2px]" />
        
        {/* Top Status Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          <div className="flex gap-2">
            <Badge 
              variant={listing.isAvailable ? "success" : "slate"} 
              className={`shadow-2xl border-none font-black text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full ${listing.isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-white'}`}
            >
              {listing.isAvailable ? "Network Active" : "Fully Reserved"}
            </Badge>
            <Badge className={`${safetyBadgeColor} text-white border-none font-black text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-xl flex gap-2 items-center`}>
               <Shield size={12} className="fill-white" /> {trust?.safetyRating || "Secure Node"}
            </Badge>
          </div>
          {isPremium && (
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-600 text-white border-none font-black text-[9px] uppercase tracking-widest px-5 py-2.5 rounded-full shadow-xl shadow-amber-500/20 flex gap-2 items-center self-start">
               <Star size={12} className="fill-white" /> ELITE SPOT
            </Badge>
          )}
        </div>

        {/* Intelligence Overlays */}
        <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-2">
           <div className="flex items-center gap-3">
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em] leading-none mb-1 font-mono">Safety IQ</span>
                 <div className="h-1.5 w-24 bg-white/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${trust?.safetyScore || 70}%` }}
                      className="h-full bg-emerald-400"
                    />
                 </div>
              </div>
           </div>
        </div>
        
        {/* Confidence Score Float */}
        <div className="absolute bottom-6 right-6 bg-slate-950/50 backdrop-blur-2xl px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10 z-10 group-hover:bg-primary transition-colors">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
           <span className="text-xs font-black text-white tracking-tight uppercase"><span className="text-white/50 lowercase">iq</span> {listing.confidenceScore || 0}</span>
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
           <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Connect to Spot</span>
              <ArrowRight size={16} className="text-primary" />
           </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex flex-col mb-6" onClick={onClick}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 font-mono">
                 <Cpu size={10} className="text-primary group-hover:animate-pulse" />
                 {listing.propertyType}
              </p>
              <div className="flex items-center gap-2">
                 <h3 className="font-black text-slate-950 text-2xl tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-1">{listing.title}</h3>
                 {(listing as any).suitability && (
                   <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase tracking-widest px-2 whitespace-nowrap">{ (listing as any).suitability }</Badge>
                 )}
              </div>
            </div>
            <div className={`bg-slate-950 text-white p-3 px-5 rounded-2xl shadow-xl flex flex-col items-end transition-colors ${isSurge ? 'group-hover:bg-amber-600' : isDiscount ? 'group-hover:bg-emerald-600' : 'group-hover:bg-primary'}`}>
               <div className="flex items-center gap-1 mb-0.5">
                  {isSurge ? <ArrowUp size={8} className="text-amber-400" /> : isDiscount ? <ArrowDown size={8} className="text-emerald-400" /> : null}
                  <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">
                    {listing.dynamicPricing?.statusLabel || "Network Fare"}
                  </p>
               </div>
               <p className="text-lg font-black text-white leading-none tracking-tight">
                  RM {(listing.dynamicPricing?.currentPrice || listing.pricePerHour).toFixed(2)}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
               <MapPin size={14} className="text-primary" />
               <span>{listing.neighborhood}</span>
             </div>
             <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
               <Navigation size={14} className="text-emerald-500" />
               <span>{(listing.distance || 0).toFixed(1)} km away</span>
             </div>
             <div className="flex items-center gap-2 text-[11px] text-slate-600 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
               <Clock size={14} className="text-slate-400" />
               <span>Instant Access</span>
             </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <Star size={16} className="fill-amber-500 text-amber-500" />
                 <span className="text-base font-black text-slate-900">{listing.rating || 0}</span>
                 <span className="text-[10px] font-bold text-slate-400">({listing.reviewCount || 0})</span>
              </div>
           </div>
           
           <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCompare();
                }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm border ${isComparing ? 'bg-primary text-white border-primary' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-primary/50'}`}
              >
                <Plus size={18} className={isComparing ? 'rotate-45 transition-transform' : ''} />
              </button>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
                className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
              >
                <Navigation size={18} className="group-hover:rotate-12 transition-transform" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm">
                <Heart size={18} />
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};
export const BookingsView = () => {
  const { bookings, listings, updateBookingStatus, startSession, activeSession, userSubscription } = useData();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'intelligence'>('upcoming');
  const [showScanner, setShowScanner] = useState(false);
  
  // Navigation Modal State
  const [showNavigation, setShowNavigation] = useState(false);
  const [navTarget, setNavTarget] = useState<any>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Detail Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const upcomingBookings = bookings?.filter(b => b && (b.status === "CONFIRMED" || b.status === "ACTIVE" || b.status === "PENDING")) || [];
  const pastBookings = bookings?.filter(b => b && (b.status === "COMPLETED" || b.status === "CANCELLED")) || [];

  const handleStartNavigation = () => {
    setIsNavigating(true);
    addToast("Real-time telemetry started", "info");
    setTimeout(() => {
       setIsNavigating(false);
       setShowNavigation(false);
       addToast("Arrived at destination", "success");
    }, 3000);
  };

  const handleCancelBooking = (id: string) => {
    if (confirm("Are you sure you want to cancel this booking? A 10% fee may apply.")) {
      updateBookingStatus(id, "CANCELLED");
      addToast("Booking cancelled successfully", "success");
      setSelectedBooking(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex items-center justify-between">
        <SectionHeader title="My Network" subtitle="Live mobility monitoring" />
        <Button 
          size="sm" 
          onClick={() => setShowScanner(true)}
          className="rounded-2xl gap-2 bg-slate-900 border-slate-900 shadow-lg h-12 px-6"
        >
          <Zap size={14} className="fill-white" />
          Smart Scan
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-100 mb-2">
        {['upcoming', 'history', 'intelligence'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-blue-700' : 'text-blue-900/40'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        {activeTab === 'intelligence' ? (
           <MobilityProfile />
        ) : activeTab === 'upcoming' ? (
          upcomingBookings.length > 0 ? upcomingBookings.map((booking) => {
            const listing = listings.find(l => l.id === booking.listingId);
            const isActive = booking.status === "ACTIVE";
            
            return (
              <Card key={booking.id} noPadding className="flex flex-col border-2 border-slate-50 shadow-xl shadow-slate-900/5 rounded-[3rem] bg-white transition-all hover:shadow-2xl hover:border-primary/20 overflow-hidden group">
                <div className="relative h-60 overflow-hidden">
                  <img src={listing?.images?.[0] || `https://picsum.photos/seed/${booking.id}/800/600`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="book" />
                  
                  {/* Glassmorphic Top Overlay */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                    <Badge variant={isActive ? "success" : booking.status === "CONFIRMED" ? "blue" : "warning"} className="shadow-2xl border-none font-black px-5 py-2 text-[10px] uppercase tracking-widest rounded-full">
                      <div className="flex items-center gap-2">
                        {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        {booking.status}
                      </div>
                    </Badge>
                    <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-2xl border border-white/20">
                       <span className="text-[10px] font-black text-blue-800 tracking-[0.2em] uppercase">Ref: {booking.id.toUpperCase().replace('BOOKING-', 'PL-')}</span>
                    </div>
                  </div>

                  {/* Progressive Interaction Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60" />
                  
                  {isActive && (
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="bg-primary/90 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/20 shadow-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3 text-white">
                             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
                                <Activity size={20} className="animate-pulse" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">System Online</p>
                                <p className="text-sm font-black tracking-tight">Active Occupation Tracking</p>
                             </div>
                          </div>
                          <div className="text-right text-white">
                             <p className="text-xl font-black tracking-tighter">01:42:55</p>
                             <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Elapsed</p>
                          </div>
                       </div>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="slate" className="bg-slate-50 text-slate-400 border-none font-black text-[9px] uppercase tracking-[0.2em]">{listing?.propertyType || "Parking Bay"}</Badge>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tighter leading-none mb-3 group-hover:text-primary transition-colors">{listing?.title || "Reserved Spot"}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 self-start px-3 py-1.5 rounded-xl">
                        <MapPin size={16} className="text-primary" />
                        {listing?.neighborhood || "Kuala Lumpur"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Modern Telemetry Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8 border-y-2 border-slate-50 py-6">
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                             <Clock size={22} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-0.5">Entry Window</p>
                             <p className="text-lg font-black text-slate-900 tracking-tighter">
                                {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </p>
                          </div>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                             <Car size={22} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-0.5">Whitelisted VRN</p>
                             <p className="text-lg font-black text-slate-900 tracking-tighter">VCC 8122</p>
                          </div>
                      </div>
                  </div>

                  <div className="flex gap-4 mt-auto">
                    {booking.status === 'CONFIRMED' && (
                      <Button 
                        size="lg" 
                        onClick={() => {
                           startSession(booking.id);
                           addToast("Parking session activated. Assistant online.", "success");
                        }}
                        className="rounded-[1.5rem] h-18 text-base flex-1 font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20 flex gap-3"
                      >
                        Start Session
                      </Button>
                    )}
                    <Button 
                      size="lg" 
                      onClick={() => {
                         setNavTarget(listing);
                         setShowNavigation(true);
                      }}
                      className="rounded-[1.5rem] h-18 text-base flex-1 font-black shadow-2xl shadow-primary/20 flex gap-3 group/btn"
                    >
                      Initialize Drive
                      <Navigation size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      onClick={() => setSelectedBooking(booking)}
                      className="rounded-[1.5rem] h-18 text-base flex-1 font-black bg-slate-50 border-2 border-slate-100 hover:bg-white hover:border-primary/20 transition-all"
                    >
                      Access Protocol
                    </Button>
                  </div>
                </div>
              </Card>
            );
          }) : (
            <EmptyState 
              title="No live bookings" 
              description="Your upcoming reservations will appear here." 
              icon={Clock} 
              action={<Button onClick={() => window.location.reload()}>Browse Network</Button>}
            />
          )
        ) : (
          <div className="space-y-6">
             {pastBookings.length > 0 ? (
               <div className="overflow-hidden bg-white border-2 border-slate-50 rounded-[3rem] shadow-xl shadow-slate-900/5">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-50/50 border-b-2 border-slate-50">
                           <th className="px-8 py-6 text-[10px] font-black text-blue-800 uppercase tracking-widest">Bay / Reference</th>
                           <th className="px-8 py-6 text-[10px] font-black text-blue-800 uppercase tracking-widest">Temporal Log</th>
                           <th className="px-8 py-6 text-[10px] font-black text-blue-800 uppercase tracking-widest text-right whitespace-nowrap">Net Fare</th>
                           <th className="px-8 py-6 text-[10px] font-black text-blue-800 uppercase tracking-widest text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody>
                        {pastBookings.map((booking) => {
                           const listing = listings.find(l => l.id === booking.listingId);
                           return (
                              <tr key={booking.id} className="border-b-2 border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                 <td className="px-8 py-6">
                                    <p className="text-base font-black text-slate-900 tracking-tight">{listing?.title || "Bay Spot"}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="slate" className="bg-slate-100 text-slate-400 border-none font-black text-[8px] uppercase tracking-wider">{booking.id.replace('booking-', 'PL-')}</Badge>
                                    </div>
                                 </td>
                                 <td className="px-8 py-6">
                                    <p className="text-xs font-black text-slate-800">{new Date(booking.startTime).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mt-1">Recorded Session</p>
                                 </td>
                                 <td className="px-8 py-6 text-right font-black text-slate-900 text-lg tracking-tighter">
                                    RM {booking.totalPrice.toFixed(2)}
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <Badge variant={booking.status === 'COMPLETED' ? 'success' : 'slate'} className={`uppercase text-[9px] font-black px-4 py-1.5 rounded-full ${booking.status === 'COMPLETED' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : ''}`}>
                                       {booking.status}
                                    </Badge>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>
             ) : (
               <EmptyState title="History is clear" description="Completed booking history will be archived here." icon={Clock} />
             )}
          </div>
        )}
      </div>

      {/* Navigation Modal - UPGRADED MALAYSIAN CONTEXT */}
      <Modal isOpen={showNavigation} onClose={() => setShowNavigation(false)} title="Active Intelligence Route">
        {navTarget && (
           <div className="space-y-8">
              <div className="rounded-[3rem] overflow-hidden border-2 border-slate-50 h-56 shadow-2xl relative group">
                 <img src="https://images.unsplash.com/photo-1548345666-a571648d9e3d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale opacity-40" />
                 <div className="absolute inset-0 bg-primary/10 transition-colors group-hover:bg-primary/5" />
                 
                 {/* Simulated Route Line */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      className="w-[80%] h-[2px] bg-primary relative"
                    >
                       <div className="absolute -left-1 -top-1 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_#2563eb]" />
                       <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-slate-900 rounded-full shadow-[0_0_10px_#0f172a]" />
                       <Navigation className="absolute left-[40%] -top-3 text-primary animate-pulse" size={24} />
                    </motion.div>
                 </div>

                 <div className="absolute top-6 left-6">
                    <Badge className="bg-slate-900 text-white border-none px-4 py-1.5 font-black uppercase tracking-widest scale-110 origin-left">Live Telemetry</Badge>
                 </div>

                 <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-[1.5rem] shadow-2xl border border-white/50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Road</span>
                             <span className="text-sm font-black text-slate-800 tracking-tight">Lebuhraya Pantai Baru (NPE)</span>
                          </div>
                       </div>
                       <Badge variant="success" className="bg-emerald-500 text-white border-none">Smooth Flow</Badge>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                      <Clock size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-0.5">Est. Arrival</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter">14 Mins</p>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm border border-slate-100">
                      <Zap size={24} />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-0.5">Distance</p>
                       <p className="text-2xl font-black text-slate-900 tracking-tighter">4.8 KM</p>
                    </div>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute -left-1 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                 <div className="space-y-6 pl-6">
                    <div className="relative">
                       <div className="absolute -left-[1.85rem] top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-lg" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Starting Location</p>
                       <p className="text-sm font-black text-slate-800 tracking-tight">Your Current Coordinates</p>
                    </div>
                    <div className="relative">
                       <div className="absolute -left-[1.85rem] top-1.5 w-4 h-4 bg-slate-900 rounded-full border-4 border-white shadow-lg" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">Destination Spot</p>
                       <p className="text-sm font-black text-slate-800 tracking-tight">{navTarget.title}</p>
                       <p className="text-[11px] text-slate-500 font-bold mt-1.5 italic opacity-80">{navTarget.address}</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                 <div className="flex gap-4">
                    <Button 
                      onClick={() => window.open('https://maps.google.com', '_blank')} 
                      variant="secondary" 
                      className="flex-1 h-18 rounded-[1.5rem] font-black bg-white border-2 border-slate-100 hover:border-primary/20 shadow-xl shadow-slate-900/5"
                    >
                       Waze Sync
                    </Button>
                    <Button 
                      onClick={() => window.open('https://maps.google.com', '_blank')} 
                      variant="secondary" 
                      className="flex-1 h-18 rounded-[1.5rem] font-black bg-white border-2 border-slate-100 hover:border-primary/20 shadow-xl shadow-slate-900/5"
                    >
                       Google Flow
                    </Button>
                 </div>
                 <Button 
                    onClick={handleStartNavigation} 
                    isLoading={isNavigating} 
                    className="h-18 rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 text-base"
                 >
                    Proprietary Navigation
                 </Button>
              </div>
           </div>
        )}
      </Modal>

      {/* Booking Details Drawer */}
      <Drawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Protocol"
      >
        {selectedBooking && (
           <div className="space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                       <Badge variant="blue" className="bg-white/10 text-white border-white/20">#{selectedBooking.id.toUpperCase().replace('BOOKING-', '')}</Badge>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Transaction</p>
                          <p className="text-2xl font-black tracking-tighter">RM {selectedBooking.totalPrice.toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><Navigation size={20} /></div>
                          <div>
                             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Parking Address</p>
                             <p className="text-sm font-black tracking-tight">{listings.find(l => l.id === selectedBooking.listingId)?.address || "Loading..."}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center"><Car size={20} /></div>
                          <div>
                             <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">Verified Vehicle</p>
                             <p className="text-sm font-black tracking-tight">Perodua Myvi (VCC 8122)</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 p-8 transform translate-x-1/3 -translate-y-1/3 opacity-10">
                    <LogoIcon size={300} className="text-white" />
                 </div>
              </div>

              <div className="space-y-4">
                 <SectionHeader title="Access Info" />
                 <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex gap-4">
                    <Cpu className="text-primary shrink-0" size={24} />
                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">
                       "AI Scanner will detect your plate VCC 8122 at the entrance. Drive slowly to the gate."
                    </p>
                 </div>
              </div>

              <div className="pt-4 space-y-3">
                 <Button className="w-full h-16 rounded-2xl font-black">Contact Host</Button>
                 {selectedBooking?.status !== 'CANCELLED' && selectedBooking?.status !== 'COMPLETED' && (
                    <Button 
                       onClick={() => handleCancelBooking(selectedBooking.id)} 
                       variant="ghost" 
                       className="w-full h-14 rounded-2xl font-black text-rose-500 hover:bg-rose-50 hover:text-rose-600 uppercase tracking-widest text-[10px]"
                    >
                       Request Cancellation
                    </Button>
                 )}
              </div>
           </div>
        )}
      </Drawer>

      <AnimatePresence>
        {showScanner && (
          <AIScanner 
            onClose={() => setShowScanner(false)} 
            vehicle={{ id: 'v-1', driverId: 'me', make: 'Perodua', model: 'Myvi', plateNumber: 'VCC 8122', color: 'Electric Blue' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const LogoIcon = ({ size, className }: { size: number, className: string }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
   </svg>
);

export const ProfileView = () => {
  const { userSubscription } = useData();
  
  const stats = [
    { label: 'Network Points', value: '4,250', icon: Zap },
    { label: 'Carbon Saved', value: '12.4 kg', icon: Activity },
    { label: 'Smart Hours', value: '128', icon: Clock },
    { label: 'Savings IQ', value: 'RM 142', icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <Brain size={120} className="text-primary" />
        </div>
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden ring-8 ring-primary/5">
           <img src="https://i.pravatar.cc/400?u=driver-1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
           <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter italic">Lim Wei Keat</h2>
              <MemberBadge tier={userSubscription.tier} className="self-center md:self-auto" />
           </div>
           <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full">Level 14 Mobility Agent</Badge>
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-full flex gap-1.5 items-center">
                 <ShieldCheck size={10} /> Verified Identity
              </Badge>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 flex flex-col items-center justify-center text-center rounded-[2.5rem] border-slate-100 hover:border-primary/20 transition-all group">
             <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                <stat.icon size={20} />
             </div>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
             <p className="text-xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <SectionHeader title="ParkLuar Assistance" />
           <Card className="p-8 border-slate-200 rounded-[2.5rem] bg-indigo-50/50">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck size={24} />
                 </div>
                 <div>
                    <h3 className="text-lg font-black text-slate-900 italic tracking-tight">VIP Assistant Market</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Smart Valet & Helpers</p>
                 </div>
              </div>
              <p className="text-xs font-bold text-slate-600 mb-6 italic leading-relaxed">
                 Access professional valet services or hire a parking assistant to secure premium slots in high-demand zones.
              </p>
              <Button className="w-full h-14 bg-indigo-600 text-white rounded-2xl font-black italic tracking-tight shadow-xl shadow-indigo-600/20">
                 Explore Marketplace
              </Button>
           </Card>

           <SectionHeader title="Current Rules" />
           <Card className="p-0 overflow-hidden rounded-[3rem] border-slate-100 shadow-lg">
              <div className="p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-black italic tracking-tighter">Current Plan</h3>
                       <Badge variant="blue" className="bg-white/10 text-white border-white/20">{userSubscription.tier.replace('_', ' ')}</Badge>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-4xl font-black">RM {userSubscription.tier === 'FREE_TRIAL' ? '0.00' : userSubscription.tier === 'PLUS' ? '14.90' : '29.90'}</span>
                       <span className="text-xs font-bold text-white/40 uppercase">/month</span>
                    </div>
                    <p className="text-xs font-bold text-white/60 mb-8 uppercase tracking-widest">Renewal Date: {new Date(userSubscription.endDate).toLocaleDateString()}</p>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10 rounded-2xl h-14 font-black">
                       Manage Billing
                    </Button>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Crown size={120} className="text-white" />
                 </div>
              </div>
              <div className="p-8 bg-white space-y-4">
                 {[
                   'Standard parking booking',
                   'AI Navigation assistance',
                   'Smart network scanner',
                   'Verified member status'
                 ].map((feat, i) => (
                   <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                         <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{feat}</span>
                   </div>
                 ))}
              </div>
           </Card>
        </div>

        <div className="space-y-6">
           <SectionHeader title="Fleet Management" />
           <div className="space-y-4">
              {[
                { brand: 'Perodua', model: 'Myvi', plate: 'VCC 8122', color: 'Electric Blue' },
                { brand: 'Honda', model: 'City', plate: 'WQH 5521', color: 'Modern Steel' }
              ].map((v, i) => (
                <Card key={i} className="p-6 rounded-[2.5rem] border-slate-100 flex items-center justify-between group hover:border-primary/20 transition-all">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                         <Car size={24} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{v.brand} {v.model}</p>
                         <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{v.plate}</h4>
                      </div>
                   </div>
                   <Badge className="bg-slate-50 text-slate-400 border-none font-mono text-[10px]">{v.color}</Badge>
                </Card>
              ))}
              <Button variant="outline" className="w-full h-16 rounded-[2rem] border-dashed border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 font-black gap-3">
                 <Plus size={20} /> Add New Vehicle
              </Button>
           </div>
        </div>
      </div>

      <Card className="p-10 rounded-[3rem] border-slate-900 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
           <LogOut size={100} className="text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
              <h3 className="text-2xl font-black text-white tracking-tighter italic mb-2">Security & Identity</h3>
              <p className="text-slate-400 text-sm font-medium">Manage your personal profile and account settings.</p>
           </div>
           <div className="flex gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-8 h-14 font-black">Account Settings</Button>
              <Button className="bg-rose-500 hover:bg-rose-600 text-white rounded-2xl px-8 h-14 font-black">Log Out</Button>
           </div>
        </div>
      </Card>
    </div>
  );
};

