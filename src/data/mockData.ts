/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  ParkingListing, 
  User, 
  UserRole, 
  Vehicle, 
  Booking, 
  Transaction, 
  ScanLog, 
  Notification,
  PropertyType,
  Landmark
} from "../types";

// Landmarks Data
export const landmarks: Landmark[] = [
  { id: 'lm1', name: "Pavilion KL", lat: 3.1488, lng: 101.7135, type: 'mall', image: "https://images.unsplash.com/photo-1590603730148-ebb24733629f?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm2', name: "KLCC Twin Towers", lat: 3.1579, lng: 101.7119, type: 'mall', image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm3', name: "Mid Valley Megamall", lat: 3.1186, lng: 101.6778, type: 'mall', image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm4', name: "Menara TM", lat: 3.1158, lng: 101.6669, type: 'office', image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm5', name: "The Exchange TRX", lat: 3.1430, lng: 101.7180, type: 'mall', image: "https://images.unsplash.com/photo-1548345666-a571648d9e3d?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm6', name: "KL Sentral", lat: 3.1344, lng: 101.6865, type: 'transport', image: "https://images.unsplash.com/photo-1621510456681-23a23d9a6947?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm7', name: "Sunway Pyramid", lat: 3.0733, lng: 101.6078, type: 'mall', image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=800&auto=format&fit=crop" },
  { id: 'lm8', name: "SS15 Hub", lat: 3.0787, lng: 101.5891, type: 'uni', image: "https://images.unsplash.com/photo-1558223933-7bb09c6cd58d?q=80&w=800&auto=format&fit=crop" },
];

const neighborhoods = [
  "Bukit Bintang", "KLCC", "Mid Valley City", "Bangsar South", "Damansara Heights", 
  "Damansara Uptown", "Brickfields", "Sunway City", "SS15, Subang Jaya", "Mont Kiara", 
  "Sri Hartamas", "Taman Tun Dr Ismail", "Bangsar", "Cheras", "Ampang", "Setapak"
];

// Helper for random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

const cities = ["Kuala Lumpur", "Petaling Jaya", "Subang Jaya", "Shah Alam"];

const propertyTypes: PropertyType[] = [
  "Terrace Driveway", "Apartment Bay", "Bungalow Porch", 
  "Shoplot Parking", "Gated Community Lot", "Office Lot"
];

// 20 Hosts
export const hosts: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `host-${i + 1}`,
  name: [
    "Dato' Ahmad Zaki", "Prof. Siti Nurhaliza", "Tan Boon Heong", "Lee Chong Wei", 
    "Dr. Lim Guan Eng", "Nurul Izzah", "Khairy Jamaluddin", "Syed Saddiq", 
    "Michelle Yeoh", "Henry Golding", "Harith Iskander", "Yuna", 
    "Azizulhasni Awang", "Datin Nicol David", "Pandelela Rinong", "Shila Amzah",
    "Fattah Amin", "Fazura", "Neelofa", "Noh Salleh"
  ][i],
  email: `host${i + 1}@parkluar.my`,
  phone: `+601${Math.floor(Math.random() * 9000000) + 1000000}`,
  avatar: `https://i.pravatar.cc/150?u=host${i + 1}`,
  role: UserRole.HOST,
  joinedAt: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
}));

// 30 Drivers
export const drivers: User[] = Array.from({ length: 30 }, (_, i) => ({
  id: `driver-${i + 1}`,
  name: `Driver ${i + 1}`, 
  email: `driver${i + 1}@gmail.com`,
  phone: `+601${Math.floor(Math.random() * 9000000) + 1000000}`,
  avatar: `https://i.pravatar.cc/150?u=driver${i + 1}`,
  role: UserRole.DRIVER,
  joinedAt: randomDate(new Date(2023, 0, 1), new Date(2024, 0, 1)),
}));

// Update some driver names for realism
const driverNames = [
  "Ravi Chandran", "Lim Wei Keat", "Hafiz Suip", "Mano Nair", "Chong Wei Feng",
  "Farah Ann", "Priyanka Varma", "Suresh G", "Amirul Hakim", "Sofia Jane",
  "Kavita Kaur", "Wong Kar Wai", "Dato Rizalman", "Vivy Yusof", "Bryan Loo",
  "Joel Neoh", "Anthony Tan", "Krystal Choong", "Jane Lau", "Ernest Ng"
];
driverNames.forEach((name, i) => {
  if (drivers[i]) drivers[i].name = name;
});

// 120 Parking Listings (increased for better clustering)
export const parkingListings: ParkingListing[] = Array.from({ length: 120 }, (_, i) => {
  const landmark = landmarks[i % landmarks.length];
  const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
  const host = hosts[Math.floor(Math.random() * hosts.length)];
  
  // Cluster around landmark with tighter radius (0.005 approx 500m)
  const latOffset = (Math.random() - 0.5) * 0.005;
  const lngOffset = (Math.random() - 0.5) * 0.005;
  const lat = landmark.lat + latOffset;
  const lng = landmark.lng + lngOffset;
  
  return {
    id: `listing-${i + 1}`,
    hostId: host.id,
    title: `${propertyType} near ${landmark.name}`,
    description: `Premium ${propertyType.toLowerCase()} located within walking distance of ${landmark.name}. Features high security, easy access, and ${i % 3 === 0 ? "dedicated EV charging." : "wide bay for SUVs."} Suitable for daily commuters and visitors.`,
    propertyType: propertyType,
    address: `${Math.floor(Math.random() * 100) + 1}, Jalan ${landmark.name}, Kuala Lumpur`,
    neighborhood: landmark.name,
    city: "Kuala Lumpur",
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    pricePerHour: Math.floor(Math.random() * 5) + 4, // RM 4-8 per hour
    pricePerDay: Math.floor(Math.random() * 25) + 20, // RM 20-45 per day
    peakPricePerHour: Math.floor(Math.random() * 4) + 8, // RM 8-12 peak
    distance: Number((Math.random() * 1.5 + 0.1).toFixed(1)),
    heightRestriction: i % 4 === 0 ? "2.1m" : i % 5 === 0 ? "1.9m" : "No Limit",
    suitability: ["Sedan", "SUV", "MPV", "Motorcycle"].filter(() => Math.random() > 0.3),
    hostEarningsThisMonth: Math.floor(Math.random() * 1500) + 200,
    lprEnabled: Math.random() > 0.4,
    tngAccepted: Math.random() > 0.3,
    trustBadge: Math.random() > 0.6,
    accessInstructions: "Approach the gate slowly for AI scanner. If it fails, call host via ParkLuar app.",
    features: ["CCTV", "Gated", "EV Charging", "Lighting", "Sheltered"].filter(() => Math.random() > 0.5),
    images: [`https://images.unsplash.com/photo-1590674867585-81c0534b6201?q=80&w=2070&auto=format&fit=crop&sig=${i}`],
    
    // Intelligence Layer
    confidenceScore: Number((Math.random() * 1.5 + 8.5).toFixed(1)),
    confidenceBreakdown: {
      hostReliability: Number((Math.random() * 2 + 8).toFixed(1)),
      arrivalEase: Number((Math.random() * 3 + 7).toFixed(1)),
      navigationClarity: Number((Math.random() * 1 + 9).toFixed(1)),
      safetyTrust: Number((Math.random() * 1 + 9).toFixed(1)),
    },
    publicParkingComparison: {
      nearbyPrice: Math.floor(Math.random() * 5) + 6,
      availabilityNote: ["Often full by 9 AM", "Limited street spots", "Higher weekend rates"][i % 3],
      savingsPercent: Math.floor(Math.random() * 30) + 15,
    },

    // Arrival Protocols
    arrivalProtocols: {
      previewImages: {
        entrance: `https://images.unsplash.com/photo-1545179605-1296651e9d43?q=80&w=800&auto=format&fit=crop&sig=ent${i}`,
        bay: `https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop&sig=bay${i}`,
        landmark: `https://images.unsplash.com/photo-1449156001934-030fd41ca12d?q=80&w=800&auto=format&fit=crop&sig=lm${i}`,
      },
      landmarkGuidance: ["Opposite 99 Speedmart", "Beside Mamak Corner", "Near LRT Exit B", "Junction of Shell Station"][i % 4],
      accessType: ["Open Driveway", "Gated Entry", "Guarded Access", "Basement Ramp"][i % 4] as any,
      easeRating: ["Easy", "Moderate", "Complex"][i % 3] as any,
      specificInstructions: [
        "White gate beside red mailbox",
        "Enter left driveway only",
        "Park in slot marked P2",
        "Ring bell if gate closed",
      ],
    },

    // Demand
    demandState: {
      level: ["Low", "Medium", "High", "Peak"][i % 4] as any,
      trend: ["Increasing", "Stable", "Decreasing"][i % 3] as any,
      occupancyForecast: Number(Math.random().toFixed(2)),
      peakPricingActive: i % 5 === 0,
    },
    // Smart Safety & Trust Intelligence
    trustIntelligence: (() => {
      const safetyScore = Math.floor(Math.random() * 40) + 55;
      const safetyRating = 
        safetyScore >= 90 ? "Premium Secure" as const :
        safetyScore >= 75 ? "Highly Safe" as const :
        safetyScore >= 60 ? "Standard Security" as const : "Limited Security" as const;
      
      const aiTrustLabels = [
        "AI Recommended: Best Balance of Price + Safety",
        "Top Secure Choice Near Destination",
        "Budget Friendly but Limited Security",
        "Reliable Performance Peak Choice"
      ];
      
      return {
        safetyScore,
        safetyRating,
        securityFeatures: ["CCTV Monitored", "Guarded Compound", "Gated Entry", "Covered Parking", "Residential Verified", "Well-Lit Area"].filter(() => Math.random() > 0.4),
        hostReliability: Math.floor(Math.random() * 15) + 85,
        bookingSuccessRate: Math.floor(Math.random() * 10) + 90,
        cancellationRate: Math.floor(Math.random() * 5),
        aiTrustLabel: aiTrustLabels[i % aiTrustLabels.length],
        aiTrustReasoning: "This location features multi-point surveillance and a verified host with high reliability metrics."
      };
    })(),
    // Dynamic Smart Pricing Intelligence
    dynamicPricing: (() => {
      const basePrice = Math.floor(Math.random() * 5) + 5; // 5-10
      const demandLevel = i % 7 === 0 ? "Peak" : (i % 3 === 0 ? "High" : "Medium");
      
      let adjustment = 0;
      let label: any = "Standard Rate";
      let reasoning = "Pricing optimized for current market equilibrium.";
      
      if (demandLevel === "Peak") {
        adjustment = 40;
        label = "Peak Hour Surge";
        reasoning = "High regional demand and nearby event impact detected.";
      } else if (demandLevel === "High") {
        adjustment = 20;
        label = "High Demand Pricing";
        reasoning = "Increased occupancy forecast for the next 2 hours.";
      } else if (Math.random() > 0.8) {
        adjustment = -15;
        label = "Promotional Discount";
        reasoning = "Price adjusted for off-peak optimization.";
      }

      const currentPrice = Number((basePrice * (1 + adjustment / 100)).toFixed(2));
      
      return {
        basePrice,
        currentPrice,
        adjustmentPercentage: adjustment,
        statusLabel: label,
        reasoning,
        yieldOpportunity: Math.floor(Math.random() * 15) + 10,
        marketAverage: basePrice + 1
      };
    })(),
    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
    reviewCount: Math.floor(Math.random() * 50) + 5,
    isAvailable: Math.random() > 0.1,
  };
});

// 30 Vehicles
const carMakes = ["Perodua", "Proton", "Toyota", "Honda", "Mazda", "BMW", "Mercedes"];
const carModels = ["Myvi", "Saga", "Vios", "City", "CX-5", "3 Series", "C-Class", "Bezza", "X70", "Ativa"];
export const vehicles: Vehicle[] = Array.from({ length: 30 }, (_, i) => {
  const make = carMakes[Math.floor(Math.random() * carMakes.length)];
  const model = carModels[Math.floor(Math.random() * carModels.length)];
  const isEv = i % 4 === 0;
  return {
    id: `vehicle-${i + 1}`,
    userId: drivers[i % drivers.length].id,
    brand: make,
    model: model,
    plateNumber: `V${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))} ${Math.floor(Math.random() * 9000) + 1000}`,
    color: ["White", "Silver", "Black", "Grey", "Blue", "Red"][Math.floor(Math.random() * 6)],
    fuelType: isEv ? "EV" : "PETROL",
    fuelLevel: Math.floor(Math.random() * 60) + 20,
    mileage: Math.floor(Math.random() * 50000) + 10000,
    healthScore: Math.floor(Math.random() * 20) + 80,
    lastServiceDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    nextServiceMileage: 50000,
    isEv: isEv,
    range: isEv ? 400 : 600,
    status: 'SECURE',
    image: `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400`,
    batteryStatus: isEv ? 85 : undefined,
  };
});

// 80 Bookings
export const bookings: Booking[] = Array.from({ length: 80 }, (_, i) => {
  const listing = parkingListings[Math.floor(Math.random() * parkingListings.length)];
  const driver = drivers[Math.floor(Math.random() * drivers.length)];
  const vehicle = vehicles.find(v => v.userId === driver.id) || vehicles[0];
  const startTime = randomDate(new Date(2024, 3, 1), new Date(2024, 4, 30));
  const durationHours = Math.floor(Math.random() * 6) + 1;
  const endTime = new Date(new Date(startTime).getTime() + durationHours * 60 * 60 * 1000).toISOString();
  const totalPrice = listing.pricePerHour * durationHours;

  const statuses: Booking["status"][] = ["PENDING", "CONFIRMED", "ACTIVE", "COMPLETED", "CANCELLED"];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: `booking-${i + 1}`,
    listingId: listing.id,
    driverId: driver.id,
    vehicleId: vehicle.id,
    startTime: startTime,
    endTime: endTime,
    totalPrice: totalPrice,
    status: status,
    checkInTime: status === "ACTIVE" || status === "COMPLETED" ? startTime : undefined,
    checkOutTime: status === "COMPLETED" ? endTime : undefined,
  };
});

// 100 Transactions
export const transactions: Transaction[] = Array.from({ length: 100 }, (_, i) => {
  const user = Math.random() > 0.5 ? drivers[Math.floor(Math.random() * drivers.length)] : hosts[Math.floor(Math.random() * hosts.length)];
  const type = user.role === UserRole.DRIVER ? "PAYMENT" : "PAYOUT";
  
  return {
    id: `txn-${i + 1}`,
    userId: user.id,
    amount: Math.floor(Math.random() * 50) + 5,
    type: type as any,
    status: "SUCCESS",
    createdAt: randomDate(new Date(2024, 0, 1), new Date(2024, 4, 30)),
    description: type === "PAYMENT" ? "Booking for parking" : "Payout for parking hosted",
  };
});

// 30 Scan Logs
export const scanLogs: ScanLog[] = Array.from({ length: 30 }, (_, i) => {
  const listing = parkingListings[Math.floor(Math.random() * parkingListings.length)];
  const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
  
  return {
    id: `scan-${i + 1}`,
    listingId: listing.id,
    plateNumber: vehicle.plateNumber,
    timestamp: randomDate(new Date(2024, 4, 1), new Date(2024, 4, 30)),
    confidence: Number((Math.random() * 0.2 + 0.8).toFixed(2)),
    action: Math.random() > 0.1 ? (Math.random() > 0.5 ? "ENTRY" : "EXIT") : "REJECTED",
    imageUrl: `https://picsum.photos/seed/scan${i}/400/300`,
  };
});

// 50 Notifications
const notificationTitles = [
  "Booking Confirmed", "Check-in Successful", "Check-out Recorded", 
  "New Payout Available", "Parking Listing Approved", "App Update",
  "Reminder: Upcoming Booking", "Low Balance"
];
const notificationMessages = [
  "Your booking has been successfully confirmed. Drive safely!",
  "AI detection successful. Welcome to SS15 Terrace Driveway.",
  "Check-out processed. Your total charge was RM 6.00.",
  "Your monthly payout of RM 450.00 is now being processed.",
  "New listing 'Apartment Bay in Bangsar' has been approved.",
  "Version 2.4 is now available with improved AI accuracy.",
  "You have a booking starting in 30 minutes at Subang Jaya.",
  "Your wallet balance is below RM 10.00. Top up now for hassle-free entry."
];

export const notifications: Notification[] = Array.from({ length: 50 }, (_, i) => {
  const user = Math.random() > 0.5 ? drivers[Math.floor(Math.random() * drivers.length)] : hosts[Math.floor(Math.random() * hosts.length)];
  const typeIndex = Math.floor(Math.random() * notificationTitles.length);
  
  return {
    id: `notif-${i + 1}`,
    userId: user.id,
    title: notificationTitles[typeIndex],
    message: notificationMessages[typeIndex],
    type: ["INFO", "SUCCESS", "WARNING", "ERROR"][Math.floor(Math.random() * 4)] as any,
    isRead: Math.random() > 0.7,
    createdAt: randomDate(new Date(2024, 4, 25), new Date(2024, 4, 30)),
  };
});
