export type TradeCategory =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Bricklayer'
  | 'Mason'
  | 'Painter'
  | 'HVAC'
  | 'Roofer'
  | 'General Contractor';

export type SubscriptionTier = 'Basic' | 'Pro Tradesman' | 'Contractor Plan';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  addressName?: string;
  city?: string;
  geohash?: string;
}

export interface TradeSpecialty {
  id: string;
  category: TradeCategory;
  isPrimary: boolean;
  yearsExperience: number;
  licenseNumber?: string;
}

export interface ReferenceItem {
  id: string;
  authorName: string;
  authorRole: 'Client' | 'Peer Tradesman' | 'Subcontractor';
  rating: number;
  date: string;
  comment: string;
  tradeContext: TradeCategory;
}

export interface PortfolioItem {
  id: string;
  title: string;
  tradeCategory: TradeCategory;
  imageUrl: string;
  dateCompleted: string;
  description?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  bio: string;
  trades: TradeSpecialty[];
  rating: number;
  totalReviews: number;
  hourlyRate: number;
  isAvailable: boolean;
  currentLocation: LocationCoordinates;
  references: ReferenceItem[];
  portfolio: PortfolioItem[];
  verifiedStatus: {
    isIdentityVerified: boolean;
    isInsuranceVerified: boolean;
    isLicenseVerified: boolean;
  };
  subscriptionTier: SubscriptionTier;
  stripeAccountId?: string;
  stripeCustomerId?: string;
  referredBy?: string;
  createdAt: string;
}

// Firestore Job Document Schema
export interface FirestoreJobDocument {
  id: string;
  posterId: string;
  posterName: string;
  posterRating: number;
  title: string;
  description: string;
  tradeCategory: TradeCategory;
  requiredSpots: number;
  filledSpots: number;
  status: 'open' | 'matched' | 'closed';
  location: LocationCoordinates;
  radiusMiles: number;
  budget: number;
  urgency: 'Immediate' | 'Within 24h' | 'This Week' | 'Flexible';
  acceptedTradesmanIds: string[];
  appliedFeePercentage?: number;
  timestamp: string;
}

// Escrow & Tiered Platform Fee Calculation Details
export interface TieredFeeBreakdown {
  tier: SubscriptionTier;
  escrowFeePercentage: number;
  feeAmount: number;
  netPayout: number;
  priorityNotifications: boolean;
  multiPositionManagement: boolean;
}

// Firestore Digital Diary Schedule Schema
export interface ScheduleBlockDocument {
  id: string;
  userId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Busy' | 'Available' | 'On Site';
  blockType: 'Existing Work' | 'Personal Time Off' | 'Trade Match Job';
  locationNotes?: string;
  createdAt: string;
}

export interface DiarySettings {
  autoAvailabilityEnabled: boolean;
  gpsBroadcastEnabled: boolean;
  defaultDayRate: number;
}

// Firestore Lottery Ticket & Referral Schema
export interface LotteryTicketDocument {
  id: string;
  userId: string;
  userName: string;
  ticketsEarned: number;
  referralCount: number;
  referredByUserId?: string;
  referralLink: string;
  drawPeriod: string;
  createdAt: string;
}

export interface AreaLotteryProgress {
  areaName: string;
  currentTicketsPool: number;
  thresholdTickets: number;
  prizeDescription: string;
  daysRemaining: number;
}

export interface ReferralHistoryItem {
  id: string;
  referredUserName: string;
  referredUserTrade: TradeCategory;
  dateReferred: string;
  ticketsAwarded: number;
  status: 'Verified Signup' | 'Pending First Job';
}

export interface ReviewModel {
  id: string;
  targetUid: string;
  reviewerUid: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  comment: string;
  trade: TradeCategory;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  text: string;
  timestamp: string;
  jobId?: string;
  jobTitle?: string;
  isRead: boolean;
}

export interface ConversationSummary {
  id: string;
  peerId: string;
  peerName: string;
  peerTrade: TradeCategory;
  peerAvatar?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  jobTitle?: string;
}
