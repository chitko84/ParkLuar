/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { 
  Booking, 
  Transaction, 
  ParkingListing, 
  UserRole,
  User,
  ScanLog,
  UserSubscription,
  ActiveParkingSession,
  SubscriptionTier,
  ParkingHistoryItem,
  WalkingRoute,
  BusinessPartner,
  AdCampaign,
  Coupon,
  ValetAssistant,
  ValetBooking,
  ValetServiceType,
  ValetBookingStatus,
  CommunityUser,
  CommunityReport,
  CommunityPost,
  InternalReview,
  Achievement,
  IncidentType,
  ParkingReservation,
  ParkingAuction,
  WaitlistEntry,
  MarketplaceActivity,
  ReservationStatus,
  Vehicle,
  CarServiceProvider,
  ServiceBooking,
  MaintenanceReminder,
  EmergencyRequest,
  ServiceType,
  CarpoolTrip,
  RideRequest,
  SustainabilityStats,
  SecurityAlert,
  SecurityIncident,
  SecurityZone,
  SecurityEvent
} from '../types';
import { 
  bookings as initialBookings, 
  transactions as initialTransactions, 
  parkingListings as initialListings,
  hosts as initialHosts,
  drivers as initialDrivers,
  scanLogs as initialScanLogs
} from '../data/mockData';

interface DataContextType {
  bookings: Booking[];
  transactions: Transaction[];
  listings: ParkingListing[];
  hostListings: ParkingListing[];
  scanLogs: ScanLog[];
  walletBalance: number;
  hostEarnings: number;
  parkingHistory: ParkingHistoryItem[];
  partners: BusinessPartner[];
  campaigns: AdCampaign[];
  userCoupons: Coupon[];
  valetAssistants: ValetAssistant[];
  valetBookings: ValetBooking[];
  communityPosts: CommunityPost[];
  communityReports: CommunityReport[];
  communityUsers: CommunityUser[];
  userReputation: number;
  userRank: 'NOVICE' | 'SCOUT' | 'NAVIGATOR' | 'EXPERT' | 'ELITE';
  reservations: ParkingReservation[];
  auctions: ParkingAuction[];
  waitlist: WaitlistEntry[];
  marketplaceActivities: MarketplaceActivity[];
  vehicles: Vehicle[];
  serviceProviders: CarServiceProvider[];
  serviceBookings: ServiceBooking[];
  maintenanceReminders: MaintenanceReminder[];
  activeEmergencyRequest: EmergencyRequest | null;
  carpoolTrips: CarpoolTrip[];
  rideRequests: RideRequest[];
  sustainabilityStats: SustainabilityStats;
  securityAlerts: SecurityAlert[];
  securityIncidents: SecurityIncident[];
  securityZones: SecurityZone[];
  securityEvents: SecurityEvent[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addScanLog: (log: Omit<ScanLog, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  topUpWallet: (amount: number, method: string) => void;
  withdrawWallet: (amount: number, bank: string, account: string) => void;
  withdrawEarnings: (amount: number, bank: string, account: string) => void;
  addListing: (listing: Omit<ParkingListing, 'id' | 'rating' | 'reviewCount'>) => void;
  updateListing: (id: string, updates: Partial<ParkingListing>) => void;
  deleteListing: (id: string) => void;
  addReview: (listingId: string, rating: number, comment: string) => void;
  getListingReviews: (listingId: string) => any[];
  userSubscription: UserSubscription;
  activeSession: ActiveParkingSession | null;
  walkingRoute: WalkingRoute | null;
  updateSubscription: (tier: SubscriptionTier) => void;
  startSession: (bookingId: string) => void;
  endSession: () => void;
  extendSession: (minutes: number) => void;
  toggleFindingCar: (active: boolean) => void;
  // Partner Methods
  addPartner: (partner: Omit<BusinessPartner, 'id' | 'rating' | 'reviews'>) => void;
  updatePartner: (id: string, updates: Partial<BusinessPartner>) => void;
  addCampaign: (campaign: Omit<AdCampaign, 'id' | 'analytics' | 'spent'>) => void;
  updateCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  deleteCampaign: (id: string) => void;
  claimCoupon: (campaignId: string) => void;
  useCoupon: (couponId: string) => void;
  // Valet Methods
  requestValet: (booking: Omit<ValetBooking, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => void;
  cancelValet: (id: string) => void;
  retrieveVehicle: (id: string) => void;
  // Community Methods
  addCommunityPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'userId' | 'userName' | 'userImage'>) => void;
  addCommunityReport: (report: Omit<CommunityReport, 'id' | 'timestamp' | 'helpfulCount' | 'userId' | 'userName' | 'userImage'>) => void;
  likePost: (id: string) => void;
  savePost: (id: string) => void;
  helpfulReport: (id: string) => void;
  followUser: (userId: string) => void;
  // Marketplace Methods
  reserveSpot: (listingId: string, startTime: string, duration: number) => void;
  placeBid: (auctionId: string, amount: number) => void;
  joinWaitlist: (listingId: string) => void;
  transferReservation: (reservationId: string, price: number) => void;
  buyReservation: (reservationId: string) => void;
  cancelReservation: (reservationId: string) => void;
  // Vehicle & Service Methods
  bookService: (providerId: string, serviceName: string, dateTime: string, price: number, type: ServiceType) => void;
  requestEmergency: (type: EmergencyRequest['type'], lat: number, lng: number) => void;
  cancelEmergency: () => void;
  updateVehicleFuel: (vehicleId: string, fuelLevel: number) => void;
  dismissReminder: (reminderId: string) => void;
  // Carpool Methods
  offerRide: (trip: Omit<CarpoolTrip, 'id' | 'driverId' | 'driverName' | 'driverImage' | 'status' | 'passengers'>) => void;
  requestRide: (request: Omit<RideRequest, 'id' | 'userId' | 'userName' | 'userImage' | 'status'>) => void;
  joinCarpool: (tripId: string, pickupPoint: string) => void;
  acceptPassenger: (tripId: string, passengerId: string) => void;
  updateTripStatus: (tripId: string, status: CarpoolTrip['status']) => void;
  // Security Methods
  reportSecurityIncident: (incident: Omit<SecurityIncident, 'id' | 'timestamp' | 'isVerified' | 'userId' | 'userName'>) => void;
  triggerEmergencyMode: (vehicleId: string) => void;
  acknowledgeAlert: (alertId: string) => void;
  toggleSecurityShield: (active: boolean) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  BOOKINGS: 'parkluar_bookings',
  TRANSACTIONS: 'parkluar_transactions',
  LISTINGS: 'parkluar_listings',
  WALLET_BALANCE: 'parkluar_wallet_balance',
  HOST_EARNINGS: 'parkluar_host_earnings',
  REVIEWS: 'parkluar_reviews',
  SUBSCRIPTION: 'parkluar_subscription',
  ACTIVE_SESSION: 'parkluar_active_session',
  PARKING_HISTORY: 'parkluar_parking_history',
  PARTNERS: 'parkluar_partners',
  CAMPAIGNS: 'parkluar_campaigns',
  USER_COUPONS: 'parkluar_user_coupons',
  VALET_BOOKINGS: 'parkluar_valet_bookings',
  COMMUNITY_POSTS: 'parkluar_community_posts',
  COMMUNITY_REPORTS: 'parkluar_community_reports',
  USER_REPUTATION: 'parkluar_user_reputation',
  RESERVATIONS: 'parkluar_reservations',
  AUCTIONS: 'parkluar_auctions',
  WAITLIST: 'parkluar_waitlist',
  MARKETPLACE_ACTIVITIES: 'parkluar_marketplace_activities',
  VEHICLES: 'parkluar_vehicles',
  SERVICE_BOOKINGS: 'parkluar_service_bookings',
  MAINTENANCE_REMINDERS: 'parkluar_maintenance_reminders',
  CARPOOL_TRIPS: 'parkluar_carpool_trips',
  RIDE_REQUESTS: 'parkluar_ride_requests',
  SUSTAINABILITY_STATS: 'parkluar_sustainability_stats',
  SECURITY_ALERTS: 'parkluar_security_alerts',
  SECURITY_INCIDENTS: 'parkluar_security_incidents',
  SECURITY_EVENTS: 'parkluar_security_events',
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [listings, setListings] = useState<ParkingListing[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return saved ? JSON.parse(saved) : initialListings;
  });

  const [scanLogs, setScanLogs] = useState<ScanLog[]>(() => {
    return initialScanLogs;
  });

  const hostListings = useMemo(() => {
    return listings.filter(l => l.hostId === 'host-1');
  }, [listings]);

  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLET_BALANCE);
    return saved ? parseFloat(saved) : 142.50;
  });

  const [hostEarnings, setHostEarnings] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HOST_EARNINGS);
    return saved ? parseFloat(saved) : 4520.80;
  });

  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return saved ? JSON.parse(saved) : [];
  });

  const [userSubscription, setUserSubscription] = useState<UserSubscription>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    return saved ? JSON.parse(saved) : {
      userId: 'driver-1',
      tier: 'FREE_TRIAL',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      trialDaysRemaining: 7
    };
  });

  const [activeSession, setActiveSession] = useState<ActiveParkingSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    return saved ? JSON.parse(saved) : null;
  });

  const [parkingHistory, setParkingHistory] = useState<ParkingHistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARKING_HISTORY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'h1',
        listingId: 'l1',
        listingTitle: 'Pavilion KL - Zone B',
        startTime: '2024-05-08T10:00:00Z',
        endTime: '2024-05-08T14:30:00Z',
        location: { lat: 3.1488, lng: 101.7135, level: 'B2', zone: '4C' },
        cost: 24.50
      },
      {
        id: 'h2',
        listingId: 'l2',
        listingTitle: 'Suria KLCC Premium',
        startTime: '2024-05-06T18:00:00Z',
        endTime: '2024-05-06T21:00:00Z',
        location: { lat: 3.1579, lng: 101.7119, level: 'P1', zone: 'Row 2' },
        cost: 15.00
      }
    ];
  });

  const [walkingRoute, setWalkingRoute] = useState<WalkingRoute | null>(null);

  const [partners, setPartners] = useState<BusinessPartner[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARTNERS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'p1',
        name: 'Pavilion Coffee Lounge',
        category: 'CAFE',
        logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=100',
        banner: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
        address: 'Level 3, Pavilion KL',
        description: 'Elite coffee and pastries in the heart of Bukit Bintang.',
        lat: 3.1490,
        lng: 101.7130,
        rating: 4.8,
        reviews: 1250
      },
      {
        id: 'p2',
        name: 'ChargeGo EV Station',
        category: 'EV_CHARGING',
        logo: 'https://images.unsplash.com/photo-1620067925093-801122da1688?q=80&w=100',
        banner: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
        address: 'B2 Parking, Pavilion KL',
        description: 'Fast EV charging nodes for smart mobility.',
        lat: 3.1485,
        lng: 101.7140,
        rating: 4.9,
        reviews: 840
      },
      {
        id: 'p3',
        name: 'QuickWash Auto Spa',
        category: 'CAR_WASH',
        logo: 'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?q=80&w=100',
        banner: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=800',
        address: 'Level B1, KLCC Parking',
        description: 'Premium waterless car wash while you shop.',
        lat: 3.1575,
        lng: 101.7115,
        rating: 4.7,
        reviews: 2100
      }
    ];
  });

  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'c1',
        businessId: 'p1',
        title: 'Morning Fuel Reward',
        description: 'Get RM5 off your favorite brew when you park at Pavilion KL Zone B.',
        type: 'COUPON',
        discountValue: 'RM 5.00',
        budget: 5000,
        spent: 1250,
        status: 'ACTIVE',
        startDate: '2024-05-01T00:00:00Z',
        endDate: '2024-06-01T00:00:00Z',
        targetRadius: 1,
        analytics: { views: 4500, clicks: 820, conversions: 250 }
      },
      {
        id: 'c2',
        businessId: 'p2',
        title: 'EV Flash Deal',
        description: 'Free 30 mins charging for all ParkLuar PRO members.',
        type: 'BANNER',
        discountValue: '30 Mins FREE',
        budget: 10000,
        spent: 4500,
        status: 'ACTIVE',
        startDate: '2024-05-05T00:00:00Z',
        endDate: '2024-05-20T00:00:00Z',
        targetRadius: 0.5,
        analytics: { views: 12000, clicks: 3400, conversions: 890 }
      }
    ];
  });

  const [userCoupons, setUserCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_COUPONS);
    return saved ? JSON.parse(saved) : [];
  });

  const [valetAssistants] = useState<ValetAssistant[]>([
    {
      id: 'v1',
      name: 'Amir Valet Services',
      rating: 4.9,
      completedJobs: 1240,
      responseTime: 4,
      specialization: ['SMART_VALET', 'RETRIEVAL'],
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100'
    },
    {
      id: 'v2',
      name: 'KL Rapid Parking Assist',
      rating: 4.8,
      completedJobs: 890,
      responseTime: 6,
      specialization: ['PARKING_FINDER', 'EV_ASSIST'],
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100'
    },
    {
      id: 'v3',
      name: 'Elite Urban Valet',
      rating: 5.0,
      completedJobs: 2100,
      responseTime: 3,
      specialization: ['EVENT', 'SMART_VALET'],
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100'
    }
  ]);

  const [valetBookings, setValetBookings] = useState<ValetBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VALET_BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'p1',
        userId: 'u1',
        userName: 'KLCCNavigator',
        userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
        content: 'Covered parking near Pavilion KL currently filling fast. Zone B is almost full.',
        type: 'UPDATE',
        likes: 12,
        comments: 4,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        locationName: 'Pavilion KL',
        tags: ['Busy', 'Covered']
      },
      {
        id: 'p2',
        userId: 'u2',
        userName: 'SarahUrbanMove',
        userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
        content: 'Zone B lighting conditions improved recently. Feels much safer at night now.',
        type: 'TIP',
        likes: 24,
        comments: 2,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        locationName: 'Mid Valley Megamall',
        tags: ['Safety', 'Lighting']
      }
    ];
  });

  const [communityReports, setCommunityReports] = useState<CommunityReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMUNITY_REPORTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'r1',
        userId: 'u3',
        userName: 'EVHunter_MY',
        userImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100',
        type: 'CHARGER_BROKEN',
        description: 'EV Charger in Level 2 is out of order. Reported to management.',
        lat: 3.1488,
        lng: 101.7135,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        helpfulCount: 8,
        isVerified: true
      }
    ];
  });

  const [communityUsers] = useState<CommunityUser[]>([
    {
      id: 'u1',
      name: 'KLCCNavigator',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      reputation: 2450,
      rank: 'EXPERT',
      badges: ['Parking Scout', 'Verified Safety Reporter'],
      helpfulReports: 145
    },
    {
      id: 'u2',
      name: 'SarahUrbanMove',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100',
      reputation: 1890,
      rank: 'NAVIGATOR',
      badges: ['Trusted Driver', 'Urban Mobility Expert'],
      helpfulReports: 89
    }
  ]);

  const [userReputation, setUserReputation] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_REPUTATION);
    return saved ? parseInt(saved) : 450;
  });

  const userRank = useMemo(() => {
    if (userReputation > 2000) return 'ELITE';
    if (userReputation > 1000) return 'EXPERT';
    if (userReputation > 500) return 'NAVIGATOR';
    if (userReputation > 100) return 'SCOUT';
    return 'NOVICE';
  }, [userReputation]);

  const [reservations, setReservations] = useState<ParkingReservation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RESERVATIONS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'res-1',
        userId: 'driver-1',
        listingId: 'l1',
        listingName: 'Pavilion KL - Zone B',
        startTime: new Date(Date.now() + 86400000).toISOString(),
        endTime: new Date(Date.now() + 90000000).toISOString(),
        status: 'CONFIRMED',
        price: 25.0,
        createdAt: new Date().toISOString(),
        expiryTime: new Date(Date.now() + 86400000).toISOString()
      }
    ];
  });

  const [auctions, setAuctions] = useState<ParkingAuction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUCTIONS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'auc-1',
        listingId: 'l1',
        listingName: 'Pavilion KL Premium - VIP Row',
        currentBid: 18.0,
        highestBidderId: 'u-99',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
        bidsCount: 14,
        demandLevel: 'EXTREME'
      },
      {
        id: 'auc-2',
        listingId: 'l2',
        listingName: 'Suria KLCC - Executive Bay',
        currentBid: 12.5,
        highestBidderId: 'u-102',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        bidsCount: 8,
        demandLevel: 'HIGH'
      }
    ];
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WAITLIST);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'w-1',
        listingId: 'l1',
        userId: 'driver-1',
        position: 3,
        estimatedWait: 12,
        probability: 87,
        joinedAt: new Date().toISOString()
      }
    ];
  });

  const [marketplaceActivities, setMarketplaceActivities] = useState<MarketplaceActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MARKETPLACE_ACTIVITIES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ma-1',
        type: 'RESERVATION',
        message: 'Premium spot reserved near Pavilion KL.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        userId: 'u-105'
      },
      {
        id: 'ma-2',
        type: 'BID',
        message: 'Auction bid increased in Zone B.',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        userId: 'u-108'
      },
      {
        id: 'ma-3',
        type: 'TRANSFER',
        message: 'Reservation transfer completed at Mid Valley.',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        userId: 'u-110'
      }
    ];
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'v-1',
        userId: 'driver-1',
        model: 'Model 3',
        brand: 'Tesla',
        plateNumber: 'WQX 8888',
        fuelType: 'EV',
        fuelLevel: 68,
        mileage: 12450,
        healthScore: 94,
        lastServiceDate: '2024-03-15',
        nextServiceMileage: 15000,
        isEv: true,
        batteryStatus: 68,
        range: 320,
        status: 'SECURE',
        image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=400'
      },
      {
        id: 'v-2',
        userId: 'driver-1',
        model: 'Myvi',
        brand: 'Perodua',
        plateNumber: 'VBT 2020',
        fuelType: 'PETROL',
        fuelLevel: 45,
        mileage: 45000,
        healthScore: 82,
        lastServiceDate: '2024-01-10',
        nextServiceMileage: 50000,
        isEv: false,
        range: 280,
        status: 'PARKED',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=400'
      }
    ];
  });

  const [serviceProviders] = useState<CarServiceProvider[]>([
    {
      id: 'sp-1',
      name: 'QuickFix Auto Care',
      type: ['MAINTENANCE', 'TIRE', 'INSPECTION'],
      rating: 4.8,
      distance: 1.2,
      priceRange: '$$',
      logo: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=200',
      lat: 3.1478,
      lng: 101.7100,
      description: 'Expert vehicle maintenance and quick repairs in the heart of KL.',
      services: [
        { name: 'Oil Change', price: 120, duration: 45 },
        { name: 'Brake Inspection', price: 50, duration: 30 },
        { name: 'Tire Rotation', price: 80, duration: 40 }
      ]
    },
    {
      id: 'sp-2',
      name: 'ChargeGo EV Services',
      type: ['EV_CHARGING', 'MAINTENANCE'],
      rating: 4.9,
      distance: 0.8,
      priceRange: '$$$',
      logo: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=200',
      lat: 3.1588,
      lng: 101.7111,
      description: 'Premium EV charging and software diagnostics specialist.',
      services: [
        { name: 'Fast Charging (60kW)', price: 45, duration: 30 },
        { name: 'Battery Health Check', price: 150, duration: 60 },
        { name: 'Firmware Update', price: 0, duration: 20 }
      ]
    },
    {
      id: 'sp-3',
      name: 'SparkWash Express',
      type: ['CAR_WASH'],
      rating: 4.7,
      distance: 2.1,
      priceRange: '$',
      logo: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=200',
      lat: 3.1322,
      lng: 101.6841,
      description: 'Quick and eco-friendly car wash services with premium wax options.',
      services: [
        { name: 'Exterior Wash', price: 15, duration: 15 },
        { name: 'Full Detail', price: 85, duration: 90 },
        { name: 'Ceramic Coating', price: 250, duration: 180 }
      ]
    }
  ]);

  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SERVICE_BOOKINGS);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [maintenanceReminders, setMaintenanceReminders] = useState<MaintenanceReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MAINTENANCE_REMINDERS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'mr-1',
        vehicleId: 'v-1',
        title: 'Tire Rotation Recommended',
        description: 'Your Tesla Model 3 is due for a tire rotation based on mileage.',
        urgency: 'MEDIUM',
        type: 'TIRE',
        estimatedCost: 80
      },
      {
        id: 'mr-2',
        vehicleId: 'v-2',
        title: 'Brake Inspection Overdue',
        description: 'Brake health check is overdue by 3 months.',
        urgency: 'HIGH',
        type: 'MAINTENANCE',
        estimatedCost: 50
      }
    ];
  });

  const [activeEmergencyRequest, setActiveEmergencyRequest] = useState<EmergencyRequest | null>(null);

  const [carpoolTrips, setCarpoolTrips] = useState<CarpoolTrip[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARPOOL_TRIPS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'ct-1',
        driverId: 'sp-1',
        driverName: 'Ahmad Faiz',
        driverImage: 'https://i.pravatar.cc/150?u=ahmad',
        vehicleId: 'v-1',
        vehicleModel: 'Tesla Model 3',
        origin: 'Petaling Jaya',
        destination: 'KLCC',
        destinationLat: 3.1588,
        destinationLng: 101.7111,
        departureTime: new Date(Date.now() + 3600000).toISOString(),
        totalSeats: 4,
        availableSeats: 2,
        contributionPerPerson: 10,
        pickupPoints: ['SS2 Mall', 'Digital Mall'],
        status: 'OPEN',
        passengers: [
          { userId: 'u-101', userName: 'Sarah Tan', userImage: 'https://i.pravatar.cc/150?u=sarah', pickupPoint: 'SS2 Mall', status: 'CONFIRMED' }
        ],
        estimatedCO2Savings: 5.4,
        estimatedFuelSavings: 15.0
      },
      {
        id: 'ct-2',
        driverId: 'sp-2',
        driverName: 'Wei Leong',
        driverImage: 'https://i.pravatar.cc/150?u=wei',
        vehicleId: 'v-2',
        vehicleModel: 'Honda City',
        origin: 'Cheras',
        destination: 'Pavilion KL',
        destinationLat: 3.1485,
        destinationLng: 101.7131,
        departureTime: new Date(Date.now() + 7200000).toISOString(),
        totalSeats: 3,
        availableSeats: 3,
        contributionPerPerson: 8,
        pickupPoints: ['Leisure Mall', 'Sunway Velocity'],
        status: 'OPEN',
        passengers: [],
        estimatedCO2Savings: 4.2,
        estimatedFuelSavings: 12.0
      }
    ];
  });

  const [rideRequests, setRideRequests] = useState<RideRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RIDE_REQUESTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'rr-1',
        userId: 'u-102',
        userName: 'John Wick',
        userImage: 'https://i.pravatar.cc/150?u=john',
        origin: 'Bangsar',
        destination: 'Mid Valley',
        destinationLat: 3.1168,
        destinationLng: 101.6766,
        preferredTime: new Date(Date.now() + 1800000).toISOString(),
        seatsNeeded: 1,
        status: 'PENDING'
      }
    ];
  });

  const [sustainabilityStats, setSustainabilityStats] = useState<SustainabilityStats>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUSTAINABILITY_STATS);
    if (saved) return JSON.parse(saved);
    return {
      totalFuelSaved: 145.5,
      totalCarsReduced: 12,
      totalCO2Avoided: 84.2,
      participationScore: 850
    };
  });

  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_ALERTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sa-1',
        vehicleId: 'v-1',
        type: 'MOVEMENT',
        severity: 'MEDIUM',
        message: 'Suspicious movement detected near driver side door.',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        suggestion: 'Activate emergency lights to deter.',
        acknowledged: false
      },
      {
        id: 'sa-2',
        vehicleId: 'v-1',
        type: 'UNSAFE_ZONE',
        severity: 'LOW',
        message: 'Low lighting conditions in current parking zone.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        suggestion: 'Consider moving to a more illuminated area.',
        acknowledged: true
      }
    ];
  });

  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_INCIDENTS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'si-1',
        userId: 'u1',
        userName: 'KLCCNavigator',
        type: 'BROKEN_LIGHT',
        description: 'Several street lights are out in the back row of Zone B.',
        lat: 3.1492,
        lng: 101.7145,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        isVerified: true
      }
    ];
  });

  const [securityZones] = useState<SecurityZone[]>([
    {
      id: 'sz-1',
      name: 'Pavilion KL Secure Zone',
      lat: 3.1488,
      lng: 101.7135,
      safetyScore: 92,
      hasCCTV: true,
      hasPatrol: true,
      lightingQuality: 'EXCELLENT',
      incidentCount: 2
    },
    {
      id: 'sz-2',
      name: 'KLCC CCTV Protected Parking',
      lat: 3.1579,
      lng: 101.7119,
      safetyScore: 88,
      hasCCTV: true,
      hasPatrol: false,
      lightingQuality: 'GOOD',
      incidentCount: 5
    },
    {
      id: 'sz-3',
      name: 'Mid Valley Premium Safety Parking',
      lat: 3.1170,
      lng: 101.6765,
      safetyScore: 95,
      hasCCTV: true,
      hasPatrol: true,
      lightingQuality: 'EXCELLENT',
      incidentCount: 1
    }
  ]);

  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SECURITY_EVENTS);
    if (saved) return JSON.parse(saved);
    return [];
  });

   // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    localStorage.setItem(STORAGE_KEYS.WALLET_BALANCE, walletBalance.toString());
    localStorage.setItem(STORAGE_KEYS.HOST_EARNINGS, hostEarnings.toString());
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(userSubscription));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    localStorage.setItem(STORAGE_KEYS.PARKING_HISTORY, JSON.stringify(parkingHistory));
    localStorage.setItem(STORAGE_KEYS.PARTNERS, JSON.stringify(partners));
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    localStorage.setItem(STORAGE_KEYS.USER_COUPONS, JSON.stringify(userCoupons));
    localStorage.setItem(STORAGE_KEYS.VALET_BOOKINGS, JSON.stringify(valetBookings));
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(communityPosts));
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_REPORTS, JSON.stringify(communityReports));
    localStorage.setItem(STORAGE_KEYS.USER_REPUTATION, userReputation.toString());
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
    localStorage.setItem(STORAGE_KEYS.AUCTIONS, JSON.stringify(auctions));
    localStorage.setItem(STORAGE_KEYS.WAITLIST, JSON.stringify(waitlist));
    localStorage.setItem(STORAGE_KEYS.MARKETPLACE_ACTIVITIES, JSON.stringify(marketplaceActivities));
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    localStorage.setItem(STORAGE_KEYS.SERVICE_BOOKINGS, JSON.stringify(serviceBookings));
    localStorage.setItem(STORAGE_KEYS.MAINTENANCE_REMINDERS, JSON.stringify(maintenanceReminders));
    localStorage.setItem(STORAGE_KEYS.CARPOOL_TRIPS, JSON.stringify(carpoolTrips));
    localStorage.setItem(STORAGE_KEYS.RIDE_REQUESTS, JSON.stringify(rideRequests));
    localStorage.setItem(STORAGE_KEYS.SUSTAINABILITY_STATS, JSON.stringify(sustainabilityStats));
    localStorage.setItem(STORAGE_KEYS.SECURITY_ALERTS, JSON.stringify(securityAlerts));
    localStorage.setItem(STORAGE_KEYS.SECURITY_INCIDENTS, JSON.stringify(securityIncidents));
    localStorage.setItem(STORAGE_KEYS.SECURITY_EVENTS, JSON.stringify(securityEvents));
  }, [bookings, transactions, listings, walletBalance, hostEarnings, reviews, userSubscription, activeSession, parkingHistory, partners, campaigns, userCoupons, valetBookings, communityPosts, communityReports, userReputation, reservations, auctions, waitlist, marketplaceActivities, vehicles, serviceBookings, maintenanceReminders, carpoolTrips, rideRequests, sustainabilityStats, securityAlerts, securityIncidents, securityEvents]);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b && b.id === id ? { ...b, status } : b).filter(Boolean));
  };

  const addScanLog = (log: Omit<ScanLog, 'id'>) => {
    const newLog: ScanLog = {
      ...log,
      id: `scan-${Date.now()}`
    };
    setScanLogs(prev => [newLog, ...prev]);
  };

  const addTransaction = (txn: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTxn: Transaction = {
      ...txn,
      id: `txn-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTxn, ...prev]);
  };

  const topUpWallet = (amount: number, method: string) => {
    setWalletBalance(prev => prev + amount);
    addTransaction({
      userId: 'driver-1', // Mock current user
      amount,
      type: 'TOPUP',
      description: `Top up via ${method}`,
      status: 'SUCCESS'
    });
  };

  const withdrawWallet = (amount: number, bank: string, account: string) => {
    setWalletBalance(prev => prev - amount);
    addTransaction({
      userId: 'driver-1',
      amount: -amount,
      type: 'PAYOUT',
      description: `Withdrawal to ${bank} (${account})`,
      status: 'SUCCESS'
    });
  };

  const withdrawEarnings = (amount: number, bank: string, account: string) => {
    setHostEarnings(prev => prev - amount);
    addTransaction({
      userId: 'host-1',
      amount: -amount,
      type: 'PAYOUT',
      description: `Earnings withdrawal to ${bank} (${account})`,
      status: 'SUCCESS'
    });
  };

  const addListing = (listing: Omit<ParkingListing, 'id' | 'rating' | 'reviewCount'>) => {
    const newListing: ParkingListing = {
      ...listing,
      id: `listing-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0
    };
    setListings(prev => [newListing, ...prev]);
  };

  const updateListing = (id: string, updates: Partial<ParkingListing>) => {
    setListings(prev => prev.map(l => l && l.id === id ? { ...l, ...updates } : l).filter(Boolean));
  };

  const deleteListing = (id: string) => {
    setListings(prev => prev.filter(l => l && l.id !== id));
  };

  const addReview = (listingId: string, rating: number, comment: string) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      listingId,
      userName: 'Lim Wei Keat', // Mock current user
      rating,
      comment,
      date: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
    
    // Update listing rating
    setListings(prev => prev.map(l => {
      if (l.id === listingId) {
        const newCount = l.reviewCount + 1;
        const newRating = ((l.rating * l.reviewCount) + rating) / newCount;
        return { ...l, reviewCount: newCount, rating: Number(newRating.toFixed(1)) };
      }
      return l;
    }));
  };

  const getListingReviews = (listingId: string) => {
    // Return some mock reviews if none exist for realism
    const listingReviews = reviews.filter(r => r.listingId === listingId);
    if (listingReviews.length === 0) {
      return [
        { id: 'm1', userName: 'Ahmad Zaki', rating: 5, comment: 'Very convenient and secure!', date: '2024-04-20T10:00:00Z' },
        { id: 'm2', userName: 'Siti Nur', rating: 4, comment: 'Good spot, easy check-in.', date: '2024-04-18T14:30:00Z' }
      ];
    }
    return listingReviews;
  };

  const updateSubscription = (tier: SubscriptionTier) => {
    setUserSubscription(prev => ({
      ...prev,
      tier,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      trialDaysRemaining: undefined
    }));
  };

  const startSession = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const listing = listings.find(l => l.id === booking.listingId);

    setActiveSession({
      id: `session-${Date.now()}`,
      bookingId,
      listingId: booking.listingId,
      startTime: new Date().toISOString(),
      endTime: booking.endTime,
      location: { 
        lat: listing?.lat || 3.139, 
        lng: listing?.lng || 101.686,
        level: 'B2',
        zone: '4C',
        buildingName: listing?.title || 'Unknown Terminal'
      },
      assistantInsights: [
        "Parking session verified. AI monitoring active.",
        "Congestion detected near KLCC corridor. Return within 45 mins recommended.",
        "Vehicle location cached in Smart Memory."
      ]
    });
    
    updateBookingStatus(bookingId, 'ACTIVE');
  };

  const endSession = () => {
    if (activeSession) {
      const booking = bookings.find(b => b.id === activeSession.bookingId);
      const listing = listings.find(l => l.id === activeSession.listingId);
      
      // Save to history
      const historyItem: ParkingHistoryItem = {
        id: `h-${Date.now()}`,
        listingId: activeSession.listingId,
        listingTitle: listing?.title || 'Completed Session',
        startTime: activeSession.startTime,
        endTime: new Date().toISOString(),
        location: { 
          lat: activeSession.location.lat, 
          lng: activeSession.location.lng,
          level: activeSession.location.level,
          zone: activeSession.location.zone
        },
        cost: booking?.totalPrice || 0
      };
      
      setParkingHistory(prev => [historyItem, ...prev]);
      updateBookingStatus(activeSession.bookingId, 'COMPLETED');
      setActiveSession(null);
      setWalkingRoute(null);
    }
  };

  const extendSession = (minutes: number) => {
    if (activeSession) {
      const currentEnd = new Date(activeSession.endTime).getTime();
      const newEnd = new Date(currentEnd + minutes * 60000).toISOString();
      setActiveSession(prev => prev ? ({ ...prev, endTime: newEnd }) : null);
      
      setBookings(prev => prev.map(b => b.id === activeSession.bookingId ? { ...b, endTime: newEnd } : b));
    }
  };

  const toggleFindingCar = (active: boolean) => {
    if (!activeSession) return;
    
    setActiveSession(prev => prev ? ({ ...prev, isFindingCar: active }) : null);
    
    if (active) {
       // Mock walking route
       const userLoc: [number, number] = [3.141, 101.690]; // Fake user current loc
       const carLoc: [number, number] = [activeSession.location.lat, activeSession.location.lng];
       
       setWalkingRoute({
          coordinates: [
             userLoc,
             [3.143, 101.692],
             [3.145, 101.695],
             [3.147, 101.705],
             carLoc
          ],
          distance: 1200,
          duration: 15,
          instructions: [
             "Head North toward Jalan Ampang",
             "Turn right onto Jalan Sultan Ismail",
             "Your vehicle is in Zone B, Level 2"
          ]
       });
    } else {
       setWalkingRoute(null);
    }
  };

  const addPartner = (partner: Omit<BusinessPartner, 'id' | 'rating' | 'reviews'>) => {
    const newPartner: BusinessPartner = {
      ...partner,
      id: `p-${Date.now()}`,
      rating: 5.0,
      reviews: 0
    };
    setPartners(prev => [newPartner, ...prev]);
  };

  const updatePartner = (id: string, updates: Partial<BusinessPartner>) => {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addCampaign = (campaign: Omit<AdCampaign, 'id' | 'analytics' | 'spent'>) => {
    const newCampaign: AdCampaign = {
      ...campaign,
      id: `c-${Date.now()}`,
      spent: 0,
      analytics: { views: 0, clicks: 0, conversions: 0 }
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const claimCoupon = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId);
    const business = partners.find(p => p.id === campaign?.businessId);
    if (!campaign || !business) return;

    const newCoupon: Coupon = {
      id: `cpn-${Date.now()}`,
      campaignId,
      businessId: business.id,
      userId: 'driver-1',
      code: `PL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      title: campaign.title,
      businessName: business.name,
      discountValue: campaign.discountValue || 'Special Offer',
      expiryDate: campaign.endDate,
      claimedAt: new Date().toISOString(),
      isUsed: false
    };

    setUserCoupons(prev => [newCoupon, ...prev]);
    
    // Update campaign analytics
    updateCampaign(campaignId, {
      analytics: {
        ...campaign.analytics,
        conversions: campaign.analytics.conversions + 1
      }
    });
  };

  const useCoupon = (couponId: string) => {
    setUserCoupons(prev => prev.map(c => c.id === couponId ? { ...c, isUsed: true } : c));
  };

  const requestValet = (booking: Omit<ValetBooking, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'timeline'>) => {
    const id = `valet-${Date.now()}`;
    const newBooking: ValetBooking = {
      ...booking,
      id,
      status: 'SEARCHING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        { status: 'SEARCHING', timestamp: new Date().toISOString(), label: 'Service Request Created' }
      ]
    };
    setValetBookings(prev => [newBooking, ...prev]);

    // Simulate assignment
    setTimeout(() => {
      const assistant = valetAssistants.find(a => a.specialization.includes(booking.type)) || valetAssistants[0];
      setValetBookings(prev => prev.map(b => b.id === id ? {
        ...b,
        status: 'ASSIGNED',
        assistantId: assistant.id,
        eta: assistant.responseTime,
        updatedAt: new Date().toISOString(),
        timeline: [...b.timeline, { status: 'ASSIGNED', timestamp: new Date().toISOString(), label: `Assistant Assigned: ${assistant.name}` }]
      } : b));

      // Progress to En Route
      setTimeout(() => {
        setValetBookings(prev => prev.map(b => b.id === id ? {
          ...b,
          status: 'EN_ROUTE',
          updatedAt: new Date().toISOString(),
          timeline: [...b.timeline, { status: 'EN_ROUTE', timestamp: new Date().toISOString(), label: 'Assistant is en route to pickup point' }]
        } : b));

        // Progress to Secured
        setTimeout(() => {
          setValetBookings(prev => prev.map(b => b.id === id ? {
            ...b,
            status: 'VEHICLE_SECURED',
            updatedAt: new Date().toISOString(),
            timeline: [...b.timeline, { status: 'VEHICLE_SECURED', timestamp: new Date().toISOString(), label: 'Vehicle successfully handed over' }]
          } : b));

          // Final Completion
          setTimeout(() => {
             setValetBookings(prev => prev.map(b => b.id === id ? {
                ...b,
                status: 'PARKING_COMPLETED',
                updatedAt: new Date().toISOString(),
                timeline: [...b.timeline, { status: 'PARKING_COMPLETED', timestamp: new Date().toISOString(), label: 'Parking Secured & Protected' }]
             } : b));
          }, 8000);
        }, 8000);
      }, 5000);
    }, 3000);
  };

  const cancelValet = (id: string) => {
    setValetBookings(prev => prev.map(b => b.id === id ? {
      ...b,
      status: 'CANCELLED',
      updatedAt: new Date().toISOString(),
      timeline: [...b.timeline, { status: 'CANCELLED', timestamp: new Date().toISOString(), label: 'Service Cancelled by User' }]
    } : b));
    
    // Remove if it was just created
    setTimeout(() => {
       setValetBookings(prev => prev.filter(b => b.id !== id || b.status !== 'CANCELLED'));
    }, 5000);
  };

  const retrieveVehicle = (id: string) => {
    setValetBookings(prev => prev.map(b => b.id === id ? {
      ...b,
      status: 'RETRIEVAL_ACTIVE',
      updatedAt: new Date().toISOString(),
      timeline: [...b.timeline, { status: 'RETRIEVAL_ACTIVE', timestamp: new Date().toISOString(), label: 'Retrieval Request Initialized' }]
    } : b));

    // Simulate retrieval
    setTimeout(() => {
       setValetBookings(prev => prev.map(b => b.id === id ? {
          ...b,
          status: 'COMPLETED',
          updatedAt: new Date().toISOString(),
          timeline: [...b.timeline, { status: 'COMPLETED', timestamp: new Date().toISOString(), label: 'Vehicle Returned to Pickup Point' }]
       } : b));
    }, 10000);
  };

  const addCommunityPost = (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'comments' | 'userId' | 'userName' | 'userImage'>) => {
    const newPost: CommunityPost = {
      ...post,
      id: `p-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0
    };
    setCommunityPosts(prev => [newPost, ...prev]);
    setUserReputation(prev => prev + 10);
  };

  const addCommunityReport = (report: Omit<CommunityReport, 'id' | 'timestamp' | 'helpfulCount' | 'userId' | 'userName' | 'userImage'>) => {
    const newReport: CommunityReport = {
      ...report,
      id: `r-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100',
      timestamp: new Date().toISOString(),
      helpfulCount: 0
    };
    setCommunityReports(prev => [newReport, ...prev]);
    setUserReputation(prev => prev + 25);
  };

  const likePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, likes: p.likes + (p.isLiked ? -1 : 1), isLiked: !p.isLiked };
      }
      return p;
    }));
  };

  const savePost = (id: string) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));
  };

  const helpfulReport = (id: string) => {
    setCommunityReports(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    }));
    setUserReputation(prev => prev + 5);
  };

  const followUser = (userId: string) => {
    // Logic for following users could go here
    console.log(`Following user: ${userId}`);
  };

  const reserveSpot = (listingId: string, startTime: string, duration: number) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const price = listing.pricePerHour * duration;
    const newReservation: ParkingReservation = {
      id: `res-${Date.now()}`,
      userId: 'driver-1',
      listingId,
      listingName: listing.title,
      startTime,
      endTime: new Date(new Date(startTime).getTime() + duration * 3600000).toISOString(),
      status: 'CONFIRMED',
      price,
      createdAt: new Date().toISOString(),
      expiryTime: startTime
    };

    setReservations(prev => [newReservation, ...prev]);
    addTransaction({
      userId: 'driver-1',
      amount: -price,
      type: 'PAYMENT',
      description: `Reservation for ${listing.title}`,
      status: 'SUCCESS'
    });
    setWalletBalance(prev => prev - price);
    
    setMarketplaceActivities(prev => [{
      id: `ma-${Date.now()}`,
      type: 'RESERVATION',
      message: `You reserved a spot at ${listing.title}`,
      timestamp: new Date().toISOString(),
      userId: 'driver-1'
    }, ...prev]);
  };

  const placeBid = (auctionId: string, amount: number) => {
    setAuctions(prev => prev.map(a => {
      if (a.id === auctionId && amount > a.currentBid) {
        return {
          ...a,
          currentBid: amount,
          highestBidderId: 'driver-1',
          bidsCount: a.bidsCount + 1
        };
      }
      return a;
    }));

    setMarketplaceActivities(prev => [{
      id: `ma-${Date.now()}`,
      type: 'BID',
      message: `You placed a bid of RM${amount} for an auction`,
      timestamp: new Date().toISOString(),
      userId: 'driver-1'
    }, ...prev]);
  };

  const joinWaitlist = (listingId: string) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;

    const newEntry: WaitlistEntry = {
      id: `w-${Date.now()}`,
      listingId,
      userId: 'driver-1',
      position: Math.floor(Math.random() * 5) + 2,
      estimatedWait: Math.floor(Math.random() * 20) + 10,
      probability: Math.floor(Math.random() * 30) + 60,
      joinedAt: new Date().toISOString()
    };

    setWaitlist(prev => [...prev, newEntry]);
    
    setMarketplaceActivities(prev => [{
      id: `ma-${Date.now()}`,
      type: 'QUEUE',
      message: `You joined the waitlist for ${listing.title}`,
      timestamp: new Date().toISOString(),
      userId: 'driver-1'
    }, ...prev]);
  };

  const transferReservation = (reservationId: string, price: number) => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        return { ...r, status: 'FOR_SALE', transferPrice: price };
      }
      return r;
    }));

    setMarketplaceActivities(prev => [{
      id: `ma-${Date.now()}`,
      type: 'TRANSFER',
      message: `You listed a reservation for transfer`,
      timestamp: new Date().toISOString(),
      userId: 'driver-1'
    }, ...prev]);
  };

  const buyReservation = (reservationId: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        return { ...r, userId: 'driver-1', status: 'CONFIRMED', transferPrice: undefined };
      }
      return r;
    }));
    
    // In a real app, money would transfer here
    setMarketplaceActivities(prev => [{
      id: `ma-${Date.now()}`,
      type: 'TRANSFER',
      message: `You bought a transferred reservation`,
      timestamp: new Date().toISOString(),
      userId: 'driver-1'
    }, ...prev]);
  };

  const cancelReservation = (reservationId: string) => {
    setReservations(prev => prev.map(r => {
      if (r.id === reservationId) {
        return { ...r, status: 'CANCELLED' };
      }
      return r;
    }));
  };

  const bookService = (providerId: string, serviceName: string, dateTime: string, price: number, type: ServiceType) => {
    const provider = serviceProviders.find(p => p.id === providerId);
    if (!provider) return;

    const newBooking: ServiceBooking = {
      id: `sb-${Date.now()}`,
      vehicleId: 'v-1', // Default to first vehicle for demo
      providerId,
      providerName: provider.name,
      type,
      serviceName,
      status: 'SCHEDULED',
      dateTime,
      price,
      createdAt: new Date().toISOString()
    };

    setServiceBookings(prev => [newBooking, ...prev]);
    
    addTransaction({
       userId: 'driver-1',
       amount: -price,
       type: 'PAYMENT',
       description: `Booking: ${serviceName} at ${provider.name}`,
       status: 'SUCCESS'
    });
    setWalletBalance(prev => prev - price);
  };

  const requestEmergency = (type: EmergencyRequest['type'], lat: number, lng: number) => {
    const newRequest: EmergencyRequest = {
      id: `er-${Date.now()}`,
      userId: 'driver-1',
      vehicleId: 'v-1',
      type,
      status: 'SEARCHING',
      lat,
      lng,
      createdAt: new Date().toISOString()
    };

    setActiveEmergencyRequest(newRequest);

    // Simulate assignment after 3 seconds
    setTimeout(() => {
      setActiveEmergencyRequest(prev => prev ? {
        ...prev,
        status: 'ASSIGNED',
        providerId: 'sp-roadside-1',
        eta: 12
      } : null);
    }, 3000);
  };

  const cancelEmergency = () => {
    setActiveEmergencyRequest(null);
  };

  const updateVehicleFuel = (vehicleId: string, fuelLevel: number) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        return { ...v, fuelLevel, batteryStatus: v.isEv ? fuelLevel : v.batteryStatus };
      }
      return v;
    }));
  };

  const dismissReminder = (reminderId: string) => {
    setMaintenanceReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const offerRide = (trip: Omit<CarpoolTrip, 'id' | 'driverId' | 'driverName' | 'driverImage' | 'status' | 'passengers'>) => {
    const newTrip: CarpoolTrip = {
      ...trip,
      id: `ct-${Date.now()}`,
      driverId: 'driver-1',
      driverName: 'You',
      driverImage: 'https://i.pravatar.cc/150?u=you',
      status: 'OPEN',
      passengers: []
    };
    setCarpoolTrips(prev => [newTrip, ...prev]);
  };

  const requestRide = (request: Omit<RideRequest, 'id' | 'userId' | 'userName' | 'userImage' | 'status'>) => {
    const newRequest: RideRequest = {
      ...request,
      id: `rr-${Date.now()}`,
      userId: 'driver-1',
      userName: 'You',
      userImage: 'https://i.pravatar.cc/150?u=you',
      status: 'PENDING'
    };
    setRideRequests(prev => [newRequest, ...prev]);
  };

  const joinCarpool = (tripId: string, pickupPoint: string) => {
    setCarpoolTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          availableSeats: trip.availableSeats - 1,
          passengers: [...trip.passengers, {
            userId: 'driver-1',
            userName: 'You',
            userImage: 'https://i.pravatar.cc/150?u=you',
            pickupPoint,
            status: 'REQUESTED'
          }]
        };
      }
      return trip;
    }));
  };

  const acceptPassenger = (tripId: string, passengerId: string) => {
    setCarpoolTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          passengers: trip.passengers.map(p => p.userId === passengerId ? { ...p, status: 'CONFIRMED' } : p)
        };
      }
      return trip;
    }));
  };

  const updateTripStatus = (tripId: string, status: CarpoolTrip['status']) => {
    setCarpoolTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        if (status === 'COMPLETED') {
           // Update sustainability stats
           setSustainabilityStats(s => ({
              ...s,
              totalFuelSaved: s.totalFuelSaved + trip.estimatedFuelSavings,
              totalCO2Avoided: s.totalCO2Avoided + trip.estimatedCO2Savings,
              totalCarsReduced: s.totalCarsReduced + trip.passengers.length,
              participationScore: s.participationScore + (trip.passengers.length * 50) + 100
           }));
        }
        return { ...trip, status };
      }
      return trip;
    }));
  };

  const reportSecurityIncident = (incident: Omit<SecurityIncident, 'id' | 'timestamp' | 'isVerified' | 'userId' | 'userName'>) => {
    const newIncident: SecurityIncident = {
      ...incident,
      id: `si-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isVerified: false,
      userId: 'driver-1',
      userName: 'You'
    };
    setSecurityIncidents(prev => [newIncident, ...prev]);
  };

  const triggerEmergencyMode = (vehicleId: string) => {
    const event: SecurityEvent = {
      id: `se-${Date.now()}`,
      sessionId: activeSession?.id || 'none',
      type: 'ACTIVATED',
      message: 'Vehicle Emergency Mode Activated. Alarm triggered and support notified.',
      timestamp: new Date().toISOString()
    };
    setSecurityEvents(prev => [event, ...prev]);
    
    // Add alert
    const alert: SecurityAlert = {
      id: `sa-${Date.now()}`,
      vehicleId,
      type: 'MOVEMENT',
      severity: 'CRITICAL',
      message: 'EMERGENCY PROTOCOL ACTIVE: Help is on the way.',
      timestamp: new Date().toISOString(),
      suggestion: 'Stay in a well-lit area.',
      acknowledged: false
    };
    setSecurityAlerts(prev => [alert, ...prev]);
  };

  const acknowledgeAlert = (alertId: string) => {
    setSecurityAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  const toggleSecurityShield = (active: boolean) => {
    if (!activeSession) return;
    const event: SecurityEvent = {
      id: `se-${Date.now()}`,
      sessionId: activeSession.id,
      type: active ? 'ACTIVATED' : 'DEACTIVATED',
      message: active ? 'AI Security Shield Activated. Active monitoring engaged.' : 'Security monitoring suspended.',
      timestamp: new Date().toISOString()
    };
    setSecurityEvents(prev => [event, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      bookings,
      transactions,
      listings,
      hostListings,
      scanLogs,
      walletBalance,
      hostEarnings,
      parkingHistory,
      partners,
      campaigns,
      userCoupons,
      valetAssistants,
      valetBookings,
      addBooking,
      updateBookingStatus,
      addScanLog,
      addTransaction,
      topUpWallet,
      withdrawWallet,
      withdrawEarnings,
      addListing,
      updateListing,
      deleteListing,
      addReview,
      getListingReviews,
      userSubscription,
      activeSession,
      walkingRoute,
      updateSubscription,
      startSession,
      endSession,
      extendSession,
      toggleFindingCar,
      addPartner,
      updatePartner,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      claimCoupon,
      useCoupon,
      requestValet,
      cancelValet,
      retrieveVehicle,
      communityPosts,
      communityReports,
      communityUsers,
      userReputation,
      userRank,
      addCommunityPost,
      addCommunityReport,
      likePost,
      savePost,
      helpfulReport,
      followUser,
      reservations,
      auctions,
      waitlist,
      marketplaceActivities,
      reserveSpot,
      placeBid,
      joinWaitlist,
      transferReservation,
      buyReservation,
      cancelReservation,
      vehicles,
      serviceProviders,
      serviceBookings,
      maintenanceReminders,
      activeEmergencyRequest,
      carpoolTrips,
      rideRequests,
      sustainabilityStats,
      securityAlerts,
      securityIncidents,
      securityZones,
      securityEvents,
      bookService,
      requestEmergency,
      cancelEmergency,
      updateVehicleFuel,
      dismissReminder,
      offerRide,
      requestRide,
      joinCarpool,
      acceptPassenger,
      updateTripStatus,
      reportSecurityIncident,
      triggerEmergencyMode,
      acknowledgeAlert,
      toggleSecurityShield
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
