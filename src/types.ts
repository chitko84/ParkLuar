/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  DRIVER = "DRIVER",
  HOST = "HOST",
  ADMIN = "ADMIN",
  PARTNER = "PARTNER",
}

export type ValetServiceType = 'SMART_VALET' | 'PARKING_FINDER' | 'RETRIEVAL' | 'EVENT' | 'EV_ASSIST';

export interface ValetAssistant {
  id: string;
  name: string;
  rating: number;
  completedJobs: number;
  responseTime: number; // minutes
  specialization: ValetServiceType[];
  image: string;
}

export type ValetBookingStatus = 
  | 'SEARCHING' 
  | 'ASSIGNED' 
  | 'EN_ROUTE' 
  | 'VEHICLE_SECURED' 
  | 'PARKING_COMPLETED' 
  | 'RETRIEVAL_ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ValetBooking {
  id: string;
  userId: string;
  assistantId?: string;
  type: ValetServiceType;
  status: ValetBookingStatus;
  destination: {
    name: string;
    lat: number;
    lng: number;
  };
  pickupTime: string;
  vehicleId: string;
  baseFee: number;
  peakSurcharge: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  eta?: number; // minutes
  assistantLocation?: {
    lat: number;
    lng: number;
  };
  timeline: {
    status: ValetBookingStatus;
    timestamp: string;
    label: string;
  }[];
}

export interface CommunityUser {
  id: string;
  name: string;
  image: string;
  reputation: number;
  rank: 'NOVICE' | 'SCOUT' | 'NAVIGATOR' | 'EXPERT' | 'ELITE';
  badges: string[];
  helpfulReports: number;
}

export type IncidentType = 'FULL' | 'ILLEGAL_PARKING' | 'SECURITY' | 'CONGESTION' | 'FLOOD' | 'CHARGER_BROKEN' | 'UNSAFE';

export interface CommunityReport {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  type: IncidentType;
  description: string;
  lat: number;
  lng: number;
  timestamp: string;
  helpfulCount: number;
  isVerified?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  type: 'TIP' | 'REVIEW' | 'WARNING' | 'UPDATE';
  likes: number;
  comments: number;
  timestamp: string;
  locationName?: string;
  tags?: string[];
  image?: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface InternalReview extends Review {
  safetyRating: number;
  accessibilityRating: number;
  cleanlinessScore: number;
  exitConvenienceScore: number;
  tips?: string[];
  isHelpful?: boolean;
}

export interface Vehicle {
  id: string;
  userId: string;
  model: string;
  brand: string;
  plateNumber: string;
  fuelType: 'PETROL' | 'DIESEL' | 'EV' | 'HYBRID';
  fuelLevel: number; // 0-100
  mileage: number;
  healthScore: number; // 0-100
  lastServiceDate: string;
  nextServiceMileage: number;
  isEv: boolean;
  batteryStatus?: number; // 0-100
  range: number; // km
  status: 'SECURE' | 'DRIVING' | 'PARKED';
  image: string;
  color?: string;
}

export type ServiceType = 'MAINTENANCE' | 'CAR_WASH' | 'TIRE' | 'EV_CHARGING' | 'ROADSIDE' | 'INSPECTION';

export interface CarServiceProvider {
  id: string;
  name: string;
  type: ServiceType[];
  rating: number;
  distance: number; // km
  priceRange: string;
  logo: string;
  lat: number;
  lng: number;
  description: string;
  services: {
    name: string;
    price: number;
    duration: number; // minutes
  }[];
}

export interface ServiceBooking {
  id: string;
  vehicleId: string;
  providerId: string;
  providerName: string;
  type: ServiceType;
  serviceName: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  dateTime: string;
  price: number;
  createdAt: string;
}

export interface MaintenanceReminder {
  id: string;
  vehicleId: string;
  title: string;
  description: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH';
  type: string;
  estimatedCost: number;
}

export interface EmergencyRequest {
  id: string;
  userId: string;
  vehicleId: string;
  type: 'BATTERY' | 'TIRE' | 'TOW' | 'FUEL' | 'EV_RESCUE';
  status: 'SEARCHING' | 'ASSIGNED' | 'EN_ROUTE' | 'COMPLETED';
  lat: number;
  lng: number;
  providerId?: string;
  eta?: number; // minutes
  createdAt: string;
}

export interface CarpoolTrip {
  id: string;
  driverId: string;
  driverName: string;
  driverImage: string;
  vehicleId: string;
  vehicleModel: string;
  origin: string;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  contributionPerPerson: number;
  pickupPoints: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  passengers: {
    userId: string;
    userName: string;
    userImage: string;
    pickupPoint: string;
    status: 'REQUESTED' | 'CONFIRMED' | 'PICKED_UP' | 'REJECTED';
  }[];
  parkingReservationId?: string;
  sharedParkingListingId?: string;
  estimatedCO2Savings: number; // kg
  estimatedFuelSavings: number; // RM
}

export interface RideRequest {
  id: string;
  userId: string;
  userName: string;
  userImage: string;
  origin: string;
  destination: string;
  destinationLat: number;
  destinationLng: number;
  preferredTime: string;
  seatsNeeded: number;
  status: 'PENDING' | 'MATCHED' | 'EXPIRED';
}

export interface SustainabilityStats {
  totalFuelSaved: number;
  totalCarsReduced: number;
  totalCO2Avoided: number;
  participationScore: number;
}

export type SecuritySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityAlert {
  id: string;
  vehicleId: string;
  type: 'MOVEMENT' | 'PROXIMITY' | 'LIGHTING' | 'GLASS_BREAK' | 'TILT' | 'UNSAFE_ZONE';
  severity: SecuritySeverity;
  message: string;
  timestamp: string;
  suggestion: string;
  acknowledged: boolean;
}

export interface SecurityIncident {
  id: string;
  userId: string;
  userName: string;
  type: 'SUSPICIOUS_PERSON' | 'THEFT_ATTEMPT' | 'BROKEN_LIGHT' | 'VANDALISM' | 'OTHER';
  description: string;
  lat: number;
  lng: number;
  timestamp: string;
  isVerified: boolean;
}

export interface SecurityZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  safetyScore: number; // 0-100
  hasCCTV: boolean;
  hasPatrol: boolean;
  lightingQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  incidentCount: number;
}

export interface SecurityEvent {
  id: string;
  sessionId: string;
  type: 'ACTIVATED' | 'MONITORING' | 'PATROL_NEARBY' | 'HEALTH_CHECK' | 'DEACTIVATED';
  message: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'FOR_SALE';

export interface ParkingReservation {
  id: string;
  userId: string;
  listingId: string;
  listingName: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  price: number;
  createdAt: string;
  expiryTime: string;
  transferPrice?: number;
}

export interface ParkingAuction {
  id: string;
  listingId: string;
  listingName: string;
  currentBid: number;
  highestBidderId: string;
  startTime: string;
  endTime: string;
  bidsCount: number;
  demandLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
}

export interface WaitlistEntry {
  id: string;
  listingId: string;
  userId: string;
  position: number;
  estimatedWait: number; // minutes
  probability: number; // 0-100
  joinedAt: string;
}

export interface MarketplaceActivity {
  id: string;
  type: 'RESERVATION' | 'BID' | 'TRANSFER' | 'QUEUE';
  message: string;
  timestamp: string;
  userId: string;
}

export interface BusinessPartner {
  id: string;
  name: string;
  category: "RESTAURANT" | "CAFE" | "MALL" | "EV_CHARGING" | "CAR_WASH" | "PETROL" | "RETAIL";
  logo: string;
  banner: string;
  address: string;
  description: string;
  lat: number;
  lng: number;
  rating: number;
  safetyScore?: number;
  hasCCTV?: boolean;
  hasPatrol?: boolean;
  reviews: number;
}

export interface AdCampaign {
  id: string;
  businessId: string;
  title: string;
  description: string;
  type: "BANNER" | "COUPON" | "DEAL";
  promotionCode?: string;
  discountValue?: string;
  budget: number;
  spent: number;
  status: "ACTIVE" | "PAUSED" | "FINISHED";
  startDate: string;
  endDate: string;
  targetRadius?: number; // km
  analytics: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

export interface Coupon {
  id: string;
  campaignId: string;
  businessId: string;
  userId: string;
  code: string;
  title: string;
  businessName: string;
  discountValue: string;
  expiryDate: string;
  isUsed: boolean;
  claimedAt: string;
}

export type PropertyType = 
  | "Terrace Driveway"
  | "Apartment Bay"
  | "Bungalow Porch"
  | "Shoplot Parking"
  | "Gated Community Lot"
  | "Office Lot";

export interface Landmark {
  id: string;
  name: string;
  image?: string;
  lat: number;
  lng: number;
  type: 'mall' | 'transport' | 'uni' | 'office' | 'landmark';
}

export interface ParkingListing {
  id: string;
  hostId: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  address: string;
  neighborhood: string;
  city: string;
  pricePerHour: number;
  pricePerDay: number;
  peakPricePerHour?: number;
  distance?: number;
  heightRestriction?: string;
  suitability?: string[];
  hostEarningsThisMonth?: number;
  lprEnabled: boolean;
  tngAccepted: boolean;
  trustBadge: boolean;
  accessInstructions: string;
  lat: number;
  lng: number;
  features: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  latitude: number;
  longitude: number;
  // Intelligence Layer
  confidenceScore: number;
  confidenceBreakdown: {
    hostReliability: number;
    arrivalEase: number;
    navigationClarity: number;
    safetyTrust: number;
  };
  publicParkingComparison?: {
    nearbyPrice: number;
    availabilityNote: string;
    savingsPercent: number;
  };
  // High Fidelity Arrival Guidance
  arrivalProtocols: {
    previewImages: {
      entrance: string;
      bay: string;
      landmark: string;
    };
    landmarkGuidance: string;
    accessType: "Open Driveway" | "Gated Entry" | "Guarded Access" | "Basement Ramp";
    easeRating: "Easy" | "Moderate" | "Complex";
    specificInstructions: string[];
  };
  // Demand Intelligence
  demandState: {
    level: "Low" | "Medium" | "High" | "Peak";
    trend: "Increasing" | "Stable" | "Decreasing";
    occupancyForecast: number; // 0-1
    peakPricingActive: boolean;
  };
  // Smart Safety & Trust Intelligence
  trustIntelligence: {
    safetyScore: number; // 0-100
    safetyRating: "Premium Secure" | "Highly Safe" | "Standard Security" | "Limited Security";
    securityFeatures: string[];
    hostReliability: number; // percentage
    bookingSuccessRate: number; // percentage
    cancellationRate: number; // percentage
    aiTrustLabel: string;
    aiTrustReasoning: string;
  };
  // Dynamic Smart Pricing Intelligence
  dynamicPricing: {
    basePrice: number;
    currentPrice: number;
    adjustmentPercentage: number; // e.g. +15 or -10
    statusLabel: "Standard Rate" | "Peak Hour Surge" | "High Demand Pricing" | "Promotional Discount" | "Early Bird Discount";
    reasoning: string;
    yieldOpportunity: number; // For host side: projected % increase
    marketAverage: number;
  };
}

export type SubscriptionTier = 'FREE_TRIAL' | 'PLUS' | 'PRO' | 'HOST_ELITE' | 'NONE';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: number;
  features: string[];
  color: string;
  description: string;
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  trialDaysRemaining?: number;
}

export interface ActiveParkingSession {
  id: string;
  bookingId: string;
  listingId: string;
  startTime: string;
  endTime: string;
  location: {
    lat: number;
    lng: number;
    bayNumber?: string;
    level?: string;
    zone?: string;
    buildingName?: string;
  };
  assistantInsights: string[];
  isFindingCar?: boolean;
}

export interface ParkingHistoryItem {
  id: string;
  listingId: string;
  listingTitle: string;
  startTime: string;
  endTime: string;
  location: {
    lat: number;
    lng: number;
    level?: string;
    zone?: string;
  };
  cost: number;
}

export interface WalkingRoute {
  coordinates: [number, number][];
  distance: number; // meters
  duration: number; // minutes
  instructions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  driverId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  checkInTime?: string;
  checkOutTime?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  bookingId?: string;
  amount: number;
  type: "PAYMENT" | "PAYOUT" | "REFUND" | "TOPUP";
  status: "SUCCESS" | "FAILED" | "PENDING";
  createdAt: string;
  description: string;
}

export interface ScanLog {
  id: string;
  listingId: string;
  plateNumber: string;
  timestamp: string;
  confidence: number;
  action: "ENTRY" | "EXIT" | "REJECTED";
  imageUrl: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ERROR";
  isRead: boolean;
  createdAt: string;
}
