import { auth } from './config';
import { UserProfile } from '../../types/models';

export const mockDefaultTradesman: UserProfile = {
  uid: 'tradesman_alpha_101',
  email: 'marcus.vance@sparkworks.co.uk',
  fullName: 'Marcus Vance',
  phone: '+44 7700 900142',
  avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  bio: 'Master Electrician & Certified HVAC Specialist with 12+ years on commercial & residential builds. Subcontracting ready.',
  trades: [
    { id: 't1', category: 'Electrical', isPrimary: true, yearsExperience: 12, licenseNumber: 'NICEIC-89421' },
    { id: 't2', category: 'HVAC', isPrimary: false, yearsExperience: 6, licenseNumber: 'FGAS-55310' },
  ],
  rating: 4.9,
  totalReviews: 48,
  hourlyRate: 65,
  isAvailable: true,
  currentLocation: {
    latitude: 51.5074,
    longitude: -0.1278,
    addressName: 'Camden Town',
    city: 'London',
  },
  verifiedStatus: {
    isIdentityVerified: true,
    isInsuranceVerified: true,
    isLicenseVerified: true,
  },
  references: [
    {
      id: 'ref-1',
      authorName: 'Dave Higgins',
      authorRole: 'Peer Tradesman',
      rating: 5,
      date: '12 Aug 2026',
      comment: 'Marcus covered my electrical rough-in on a 4-bed site when I broke my arm. Flawless work, fully certified.',
      tradeContext: 'Electrical',
    },
    {
      id: 'ref-2',
      authorName: 'Apex Build Group',
      authorRole: 'Client',
      rating: 5,
      date: '28 Jul 2026',
      comment: 'Punctual, highly organized, and solved a complex distribution board issue fast.',
      tradeContext: 'HVAC',
    },
  ],
  portfolio: [
    {
      id: 'p-1',
      title: 'Commercial Distribution Board Retrofit',
      tradeCategory: 'Electrical',
      imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
      dateCompleted: 'July 2026',
      description: 'Complete replacement of 3-phase board with smart metering.',
    },
    {
      id: 'p-2',
      title: 'Heat Pump & Climate System Install',
      tradeCategory: 'HVAC',
      imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format&fit=crop&q=80',
      dateCompleted: 'May 2026',
      description: 'Multi-zone VRF system for modern office space.',
    },
  ],
  createdAt: '2024-01-15T10:00:00Z',
};

export class AuthService {
  static async getCurrentUser(): Promise<UserProfile> {
    // In production, this queries Firebase Auth & Firestore doc
    return mockDefaultTradesman;
  }

  static async updateAvailability(uid: string, isAvailable: boolean): Promise<boolean> {
    console.log(`Updated availability for ${uid} to ${isAvailable}`);
    return isAvailable;
  }

  static async updateTrades(uid: string, trades: UserProfile['trades']): Promise<UserProfile['trades']> {
    console.log(`Updated trades for ${uid}:`, trades);
    return trades;
  }
}
