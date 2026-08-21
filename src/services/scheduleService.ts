import { ScheduleBlockDocument, DiarySettings } from '../types/models';

let mockScheduleStore: ScheduleBlockDocument[] = [
  {
    id: 'block-1',
    userId: 'tradesman_alpha_101',
    title: 'Commercial 3-Phase Rewire (Soho)',
    date: '2026-08-20',
    startTime: '07:30',
    endTime: '17:00',
    status: 'On Site',
    blockType: 'Trade Match Job',
    locationNotes: 'Soho Commercial Center, Bay B2',
    createdAt: '2026-08-19T10:00:00Z',
  },
  {
    id: 'block-2',
    userId: 'tradesman_alpha_101',
    title: 'Boiler Maintenance & Inspection (Private Site)',
    date: '2026-08-21',
    startTime: '08:00',
    endTime: '13:00',
    status: 'Busy',
    blockType: 'Existing Work',
    locationNotes: 'Islington High St',
    createdAt: '2026-08-18T14:00:00Z',
  },
  {
    id: 'block-3',
    userId: 'tradesman_alpha_101',
    title: 'Personal Time Off / Equipment Servicing',
    date: '2026-08-23',
    startTime: '09:00',
    endTime: '18:00',
    status: 'Busy',
    blockType: 'Personal Time Off',
    locationNotes: 'Workshop Day',
    createdAt: '2026-08-15T09:00:00Z',
  },
];

let mockDiarySettings: Record<string, DiarySettings> = {
  tradesman_alpha_101: {
    autoAvailabilityEnabled: true,
    gpsBroadcastEnabled: true,
    defaultDayRate: 450,
  },
};

export class ScheduleService {
  /**
   * Saves a booked calendar block under Firestore 'schedules' collection linked to user's ID
   */
  static async addScheduleBlock(
    blockParams: Omit<ScheduleBlockDocument, 'id' | 'createdAt'>
  ): Promise<ScheduleBlockDocument> {
    const newBlock: ScheduleBlockDocument = {
      id: `block-${Date.now()}`,
      userId: blockParams.userId,
      title: blockParams.title,
      date: blockParams.date,
      startTime: blockParams.startTime,
      endTime: blockParams.endTime,
      status: blockParams.status || 'Busy',
      blockType: blockParams.blockType,
      locationNotes: blockParams.locationNotes,
      createdAt: new Date().toISOString(),
    };

    console.log(
      `📅 [Firestore schedules Collection] Saved block "${newBlock.title}" for User ${newBlock.userId} on ${newBlock.date}`
    );

    mockScheduleStore = [newBlock, ...mockScheduleStore];
    return newBlock;
  }

  /**
   * Fetches booked calendar blocks for a user
   */
  static async getUserSchedule(userId: string): Promise<ScheduleBlockDocument[]> {
    return mockScheduleStore.filter((b) => b.userId === userId);
  }

  /**
   * Checked by backend matching engine before notifying tradesman of an emergency job
   */
  static async isTradesmanFreeAtTime(
    userId: string,
    date: string,
    time: string
  ): Promise<{ isFree: boolean; conflictingBlock?: ScheduleBlockDocument }> {
    const userBlocks = mockScheduleStore.filter((b) => b.userId === userId && b.date === date);

    const conflictingBlock = userBlocks.find((b) => {
      if (b.status === 'Busy' || b.status === 'On Site') {
        // Compare time overlap
        return time >= b.startTime && time <= b.endTime;
      }
      return false;
    });

    if (conflictingBlock) {
      console.log(
        `⛔ [Backend Matching Engine] User ${userId} is BUSY on ${date} at ${time} ("${conflictingBlock.title}"). Skipping emergency job alert.`
      );
      return { isFree: false, conflictingBlock };
    }

    console.log(
      `✅ [Backend Matching Engine] User ${userId} is FREE on ${date} at ${time}. Proceeding with emergency job notification!`
    );
    return { isFree: true };
  }

  /**
   * Fetch user's diary & auto-availability settings
   */
  static async getDiarySettings(userId: string): Promise<DiarySettings> {
    return (
      mockDiarySettings[userId] || {
        autoAvailabilityEnabled: true,
        gpsBroadcastEnabled: true,
        defaultDayRate: 450,
      }
    );
  }

  /**
   * Toggle "Automatically use my diary to set availability"
   */
  static async updateAutoAvailabilityToggle(
    userId: string,
    autoEnabled: boolean
  ): Promise<DiarySettings> {
    if (!mockDiarySettings[userId]) {
      mockDiarySettings[userId] = {
        autoAvailabilityEnabled: autoEnabled,
        gpsBroadcastEnabled: true,
        defaultDayRate: 450,
      };
    } else {
      mockDiarySettings[userId].autoAvailabilityEnabled = autoEnabled;
    }

    console.log(
      `⚡ [Diary Settings] Updated "Automatically use my diary to set availability" to ${autoEnabled} for User ${userId}`
    );

    return mockDiarySettings[userId];
  }
}
