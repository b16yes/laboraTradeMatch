import { FirestoreJobDocument, LocationCoordinates, TradeCategory } from '../types/models';
import { LocationService } from './locationService';

// Mock in-memory database store for real-time reactive job testing
let jobsDatabase: FirestoreJobDocument[] = [
  {
    id: 'job-101',
    posterId: 'contractor-901',
    posterName: 'Marcus Vance (Lead Contractor)',
    posterRating: 4.9,
    title: '2 Commercial Electricians Needed for 3-Phase Rewire',
    description: 'Subcontractors needed for main distribution board installation and circuit testing.',
    tradeCategory: 'Electrician',
    requiredSpots: 2,
    filledSpots: 1,
    status: 'open',
    location: {
      latitude: 51.5074,
      longitude: -0.1278,
      addressName: 'Camden Town, London',
      city: 'London',
      geohash: 'gcpvh',
    },
    radiusMiles: 5,
    budget: 850,
    urgency: 'Immediate',
    acceptedTradesmanIds: ['tradesman-b-202'],
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'job-102',
    posterId: 'contractor-902',
    posterName: 'Sarah Jenkins (Build Co)',
    posterRating: 4.8,
    title: 'Gas Safe Plumber for Heat Pump Manifold Retrofit',
    description: 'High-efficiency heat pump connection and copper pipe assembly.',
    tradeCategory: 'Plumber',
    requiredSpots: 1,
    filledSpots: 0,
    status: 'open',
    location: {
      latitude: 51.5201,
      longitude: -0.0982,
      addressName: 'Islington, London',
      city: 'London',
      geohash: 'gcpvj',
    },
    radiusMiles: 10,
    budget: 650,
    urgency: 'Within 24h',
    acceptedTradesmanIds: [],
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'job-103',
    posterId: 'contractor-903',
    posterName: 'Apex Structural Group',
    posterRating: 4.7,
    title: '3 Carpenters for Timber Loft Roof Joist Framing',
    description: 'Timber frame reinforcement and roof joist construction. Materials on site.',
    tradeCategory: 'Carpenter',
    requiredSpots: 3,
    filledSpots: 2,
    status: 'open',
    location: {
      latitude: 51.4923,
      longitude: -0.1912,
      addressName: 'Kensington, London',
      city: 'London',
      geohash: 'gcpuu',
    },
    radiusMiles: 15,
    budget: 1200,
    urgency: 'This Week',
    acceptedTradesmanIds: ['tradesman-c-303', 'tradesman-d-404'],
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
];

type JobsSubscriptionCallback = (jobs: FirestoreJobDocument[]) => void;
const listeners: Set<JobsSubscriptionCallback> = new Set();

const notifyListeners = () => {
  listeners.forEach((callback) => callback([...jobsDatabase]));
};

export class JobService {
  /**
   * Post a new trade job request
   */
  static async createJobDocument(
    jobParams: {
      posterId: string;
      posterName: string;
      posterRating: number;
      title: string;
      description: string;
      tradeCategory: TradeCategory;
      requiredSpots: number;
      location: LocationCoordinates;
      radiusMiles: number;
      budget: number;
      urgency: 'Immediate' | 'Within 24h' | 'This Week' | 'Flexible';
    }
  ): Promise<FirestoreJobDocument> {
    const newJob: FirestoreJobDocument = {
      id: `job-${Date.now()}`,
      posterId: jobParams.posterId,
      posterName: jobParams.posterName,
      posterRating: jobParams.posterRating,
      title: jobParams.title,
      description: jobParams.description,
      tradeCategory: jobParams.tradeCategory,
      requiredSpots: Math.max(1, jobParams.requiredSpots),
      filledSpots: 0,
      status: 'open',
      location: jobParams.location,
      radiusMiles: jobParams.radiusMiles,
      budget: jobParams.budget,
      urgency: jobParams.urgency,
      acceptedTradesmanIds: [],
      timestamp: new Date().toISOString(),
    };

    jobsDatabase = [newJob, ...jobsDatabase];
    notifyListeners();
    return newJob;
  }

  /**
   * Real-time subscription for jobs within user defined GPS radius
   */
  static subscribeToJobsInRadius(
    userLocation: LocationCoordinates,
    radiusMiles: number,
    callback: JobsSubscriptionCallback
  ): () => void {
    const filterAndCallback = () => {
      const filtered = jobsDatabase.filter((job) => {
        const distanceKm = LocationService.calculateDistance(userLocation, job.location);
        const distanceMiles = distanceKm * 0.621371;
        return distanceMiles <= radiusMiles;
      });
      callback(filtered);
    };

    listeners.add(filterAndCallback);
    filterAndCallback(); // Initial emission

    return () => {
      listeners.delete(filterAndCallback);
    };
  }

  /**
   * Atomic Job Slot Acceptance with Overbooking Prevention (Firestore runTransaction pattern)
   */
  static async acceptJobSlotAtomic(
    jobId: string,
    tradesmanId: string
  ): Promise<{
    success: boolean;
    isCrewFull: boolean;
    remainingSpots: number;
    message: string;
  }> {
    // Simulate atomic Firestore runTransaction concurrency check
    const jobIndex = jobsDatabase.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      return { success: false, isCrewFull: false, remainingSpots: 0, message: 'Job not found.' };
    }

    const job = jobsDatabase[jobIndex];

    // Check if tradesman already accepted
    if (job.acceptedTradesmanIds.includes(tradesmanId)) {
      return {
        success: false,
        isCrewFull: job.filledSpots >= job.requiredSpots,
        remainingSpots: job.requiredSpots - job.filledSpots,
        message: 'You have already accepted a slot for this job.',
      };
    }

    // Atomic overbooking check: Are there open spots?
    if (job.filledSpots >= job.requiredSpots || job.status !== 'open') {
      return {
        success: false,
        isCrewFull: true,
        remainingSpots: 0,
        message: 'Sorry! All spots for this crew have just been filled.',
      };
    }

    // Increment filledSpots atomically
    const newFilledSpots = job.filledSpots + 1;
    const isCrewFull = newFilledSpots >= job.requiredSpots;
    const newStatus: 'open' | 'matched' | 'closed' = isCrewFull ? 'closed' : 'open';

    const updatedJob: FirestoreJobDocument = {
      ...job,
      filledSpots: newFilledSpots,
      status: newStatus,
      acceptedTradesmanIds: [...job.acceptedTradesmanIds, tradesmanId],
    };

    jobsDatabase[jobIndex] = updatedJob;

    // Trigger notification if crew is now full
    if (isCrewFull) {
      this.triggerCrewFullNotification(updatedJob);
    }

    notifyListeners();

    return {
      success: true,
      isCrewFull,
      remainingSpots: updatedJob.requiredSpots - updatedJob.filledSpots,
      message: isCrewFull
        ? 'Slot accepted! Crew is now FULL. Poster notified.'
        : `Slot accepted! ${updatedJob.requiredSpots - updatedJob.filledSpots} spots remaining.`,
    };
  }

  /**
   * Trigger notification to job poster when crew is full
   */
  private static triggerCrewFullNotification(job: FirestoreJobDocument) {
    console.log(
      `🔔 NOTIFICATION TO POSTER (${job.posterName}): Crew is fully matched! All ${job.requiredSpots} spots filled for "${job.title}".`
    );
  }
}
