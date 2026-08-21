import {
  LotteryTicketDocument,
  AreaLotteryProgress,
  ReferralHistoryItem,
} from '../types/models';

let mockTicketStore: Record<string, LotteryTicketDocument> = {
  tradesman_alpha_101: {
    id: 'ticket-101',
    userId: 'tradesman_alpha_101',
    userName: 'Marcus Vance',
    ticketsEarned: 12,
    referralCount: 12,
    referralLink: 'https://tradematch.app/invite?ref=tradesman_alpha_101',
    drawPeriod: 'August 2026 Monthly Prize Draw',
    createdAt: '2026-08-01T00:00:00Z',
  },
};

let mockReferralHistory: ReferralHistoryItem[] = [
  {
    id: 'ref-item-1',
    referredUserName: 'Dave Higgins',
    referredUserTrade: 'Electrician',
    dateReferred: '10 Aug 2026',
    ticketsAwarded: 1,
    status: 'Verified Signup',
  },
  {
    id: 'ref-item-2',
    referredUserName: 'Elena Rostova',
    referredUserTrade: 'HVAC',
    dateReferred: '14 Aug 2026',
    ticketsAwarded: 1,
    status: 'Verified Signup',
  },
  {
    id: 'ref-item-3',
    referredUserName: 'Liam Carter',
    referredUserTrade: 'Plumber',
    dateReferred: '18 Aug 2026',
    ticketsAwarded: 1,
    status: 'Verified Signup',
  },
];

let mockAreaProgress: AreaLotteryProgress = {
  areaName: 'Greater London Area',
  currentTicketsPool: 385,
  thresholdTickets: 500,
  prizeDescription: '£1,000 DeWalt & Milwaukee Professional Power Tool Bundle',
  daysRemaining: 11,
};

export class ReferralService {
  /**
   * Tracks a new user referral signup, storing referredBy ID and incrementing referrer's ticket count
   */
  static async trackUserReferralSignup(
    newUserId: string,
    newUserName: string,
    referrerId: string
  ): Promise<{ success: boolean; ticketsEarned: number }> {
    console.log(`🎟️ [Firestore] New user ${newUserName} (${newUserId}) signed up via referral from ${referrerId}`);

    if (!mockTicketStore[referrerId]) {
      mockTicketStore[referrerId] = {
        id: `ticket-${Date.now()}`,
        userId: referrerId,
        userName: 'Tradesman Lead',
        ticketsEarned: 0,
        referralCount: 0,
        referralLink: `https://tradematch.app/invite?ref=${referrerId}`,
        drawPeriod: 'August 2026 Monthly Prize Draw',
        createdAt: new Date().toISOString(),
      };
    }

    // Atomically increment ticket count & referral count
    mockTicketStore[referrerId].ticketsEarned += 1;
    mockTicketStore[referrerId].referralCount += 1;

    // Increment Area Pool total
    mockAreaProgress.currentTicketsPool += 1;

    mockReferralHistory = [
      {
        id: `ref-item-${Date.now()}`,
        referredUserName: newUserName,
        referredUserTrade: 'General Contractor',
        dateReferred: 'Today',
        ticketsAwarded: 1,
        status: 'Verified Signup',
      },
      ...mockReferralHistory,
    ];

    return {
      success: true,
      ticketsEarned: mockTicketStore[referrerId].ticketsEarned,
    };
  }

  /**
   * Fetch lottery ticket stats and referral progress for a user
   */
  static async getUserLotteryStats(userId: string): Promise<{
    ticketDoc: LotteryTicketDocument;
    areaProgress: AreaLotteryProgress;
    history: ReferralHistoryItem[];
  }> {
    const ticketDoc = mockTicketStore[userId] || {
      id: `ticket-${userId}`,
      userId,
      userName: 'Marcus Vance',
      ticketsEarned: 12,
      referralCount: 12,
      referralLink: `https://tradematch.app/invite?ref=${userId}`,
      drawPeriod: 'August 2026 Monthly Prize Draw',
      createdAt: '2026-08-01T00:00:00Z',
    };

    return {
      ticketDoc,
      areaProgress: mockAreaProgress,
      history: mockReferralHistory,
    };
  }
}
