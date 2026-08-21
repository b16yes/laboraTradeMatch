import { JobListing, ReviewModel, ChatMessage, ConversationSummary, TradeCategory } from '../../types/models';

export const mockJobListings: JobListing[] = [
  {
    id: 'job-101',
    title: 'Emergency 3-Phase Rewire & Panel Upgrade',
    description: 'Subcontractor needed immediately for commercial kitchen main distribution panel replacement.',
    tradeRequired: 'Electrical',
    budget: 850,
    urgency: 'Immediate',
    location: { latitude: 51.5135, longitude: -0.1378, addressName: 'Soho Square', city: 'London' },
    distanceKm: 1.2,
    posterUid: 'client-901',
    posterName: 'Liam Carter (Subcontractor Lead)',
    posterRating: 4.8,
    status: 'Open',
    applicantCount: 3,
    createdAt: '10 mins ago',
  },
  {
    id: 'job-102',
    title: 'Commercial Boiler & Copper Piping Install',
    description: 'Looking for a certified Gas Safe plumber to pair up on a 2-day site installation.',
    tradeRequired: 'Plumbing',
    budget: 1200,
    urgency: 'Within 24h',
    location: { latitude: 51.5201, longitude: -0.0982, addressName: 'Old Street', city: 'London' },
    distanceKm: 2.8,
    posterUid: 'client-902',
    posterName: 'Sarah Jenkins (Build Co)',
    posterRating: 4.9,
    status: 'Open',
    applicantCount: 5,
    createdAt: '45 mins ago',
  },
  {
    id: 'job-103',
    title: 'Joist Repair & Roof Framing Subcontract',
    description: 'Timber frame reinforcement required for loft extension project. Materials on site.',
    tradeRequired: 'Carpentry',
    budget: 650,
    urgency: 'This Week',
    location: { latitude: 51.4923, longitude: -0.1912, addressName: 'Kensington', city: 'London' },
    distanceKm: 4.1,
    posterUid: 'client-903',
    posterName: 'Tom Reynolds',
    posterRating: 4.6,
    status: 'Open',
    applicantCount: 2,
    createdAt: '2 hours ago',
  },
  {
    id: 'job-104',
    title: 'Exterior Brickwork Repair & Pointing',
    description: 'Lime mortar repointing on historic facade. Scaffolding already erected.',
    tradeRequired: 'Masonry',
    budget: 950,
    urgency: 'Flexible',
    location: { latitude: 51.5312, longitude: -0.1042, addressName: 'Angel', city: 'London' },
    distanceKm: 3.5,
    posterUid: 'client-904',
    posterName: 'Isabella Rossi',
    posterRating: 5.0,
    status: 'Open',
    applicantCount: 4,
    createdAt: '5 hours ago',
  },
];

export const mockConversations: ConversationSummary[] = [
  {
    id: 'conv-1',
    peerId: 'tradesman-b-202',
    peerName: 'Dave Higgins',
    peerTrade: 'Electrical',
    peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'Hey Marcus! Can you pop over to Soho Square around 2 PM to check the load balancer?',
    lastTimestamp: '14:32',
    unreadCount: 1,
    jobTitle: 'Emergency 3-Phase Rewire',
  },
  {
    id: 'conv-2',
    peerId: 'tradesman-c-303',
    peerName: 'Elena Rostova',
    peerTrade: 'HVAC',
    peerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    lastMessage: 'Thanks for sending over the VRF spec sheets. Looks perfect.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    jobTitle: 'Climate System Install',
  },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm-1',
      conversationId: 'conv-1',
      senderId: 'tradesman-b-202',
      senderName: 'Dave Higgins',
      receiverId: 'tradesman_alpha_101',
      receiverName: 'Marcus Vance',
      text: 'Morning Marcus! Saw you are active on the radar around Camden.',
      timestamp: '14:28',
      isRead: true,
    },
    {
      id: 'm-2',
      conversationId: 'conv-1',
      senderId: 'tradesman_alpha_101',
      senderName: 'Marcus Vance',
      receiverId: 'tradesman-b-202',
      receiverName: 'Dave Higgins',
      text: 'Hey Dave! Yeah, just finishing up a testing report. What is up?',
      timestamp: '14:30',
      isRead: true,
    },
    {
      id: 'm-3',
      conversationId: 'conv-1',
      senderId: 'tradesman-b-202',
      senderName: 'Dave Higgins',
      receiverId: 'tradesman_alpha_101',
      receiverName: 'Marcus Vance',
      text: 'Hey Marcus! Can you pop over to Soho Square around 2 PM to check the load balancer?',
      timestamp: '14:32',
      jobId: 'job-101',
      jobTitle: 'Emergency 3-Phase Rewire',
      isRead: false,
    },
  ],
};

export class FirestoreService {
  static async getJobs(categoryFilter?: TradeCategory, radiusKm: number = 10): Promise<JobListing[]> {
    return mockJobListings.filter((job) => {
      const matchCategory = !categoryFilter || job.tradeRequired === categoryFilter;
      const matchRadius = job.distanceKm <= radiusKm;
      return matchCategory && matchRadius;
    });
  }

  static async getConversations(): Promise<ConversationSummary[]> {
    return mockConversations;
  }

  static async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return mockMessages[conversationId] || [];
  }

  static async sendMessage(conversationId: string, text: string, receiverId: string): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId,
      senderId: 'tradesman_alpha_101',
      senderName: 'Marcus Vance',
      receiverId,
      receiverName: 'Dave Higgins',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);
    return newMessage;
  }
}
