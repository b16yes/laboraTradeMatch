import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { ProfileQRCode } from '../components/ProfileQRCode';
import { ReferralService } from '../services/referralService';
import { LotteryTicketDocument, AreaLotteryProgress, ReferralHistoryItem } from '../types/models';

interface LotteryScreenProps {
  userId?: string;
}

export const LotteryScreen: React.FC<LotteryScreenProps> = ({
  userId = 'tradesman_alpha_101',
}) => {
  const [ticketDoc, setTicketDoc] = useState<LotteryTicketDocument | null>(null);
  const [areaProgress, setAreaProgress] = useState<AreaLotteryProgress | null>(null);
  const [history, setHistory] = useState<ReferralHistoryItem[]>([]);
  const [isSimulatingSignup, setIsSimulatingSignup] = useState(false);

  const loadData = async () => {
    const stats = await ReferralService.getUserLotteryStats(userId);
    setTicketDoc(stats.ticketDoc);
    setAreaProgress(stats.areaProgress);
    setHistory(stats.history);
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const handleSimulateReferralSignup = async () => {
    setIsSimulatingSignup(true);
    const mockNames = ['Alex Construction', 'Ben Smith (Plumber)', 'Chris Wright (Roofer)'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

    await ReferralService.trackUserReferralSignup(
      `user-${Date.now()}`,
      randomName,
      userId
    );

    await loadData();
    setIsSimulatingSignup(false);
  };

  if (!ticketDoc || !areaProgress) return null;

  const progressPercent = Math.min(
    100,
    Math.round((areaProgress.currentTicketsPool / areaProgress.thresholdTickets) * 100)
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trade Match Lottery & Rewards</Text>
        <Text style={styles.headerSubtitle}>Earn 1 Ticket per Verified Tradesman Referral</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Ticket & Referral Counter Dashboard Cards */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.cardGold]}>
            <Text style={styles.statIcon}>🎟️</Text>
            <Text style={styles.statNumber}>{ticketDoc.ticketsEarned}</Text>
            <Text style={styles.statLabel}>MY TICKETS EARNED</Text>
          </View>

          <View style={[styles.statCard, styles.cardCyan]}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>{ticketDoc.referralCount}</Text>
            <Text style={styles.statLabel}>TRADESMEN REFERRED</Text>
          </View>
        </View>

        {/* Local Area Progress toward Next Prize Draw Threshold */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.sectionHeader}>🏆 Local Area Prize Draw Threshold</Text>
            <View style={styles.areaBadge}>
              <Text style={styles.areaBadgeText}>{areaProgress.areaName}</Text>
            </View>
          </View>

          <Text style={styles.prizeTitle}>{areaProgress.prizeDescription}</Text>
          <Text style={styles.drawPeriodText}>{ticketDoc.drawPeriod} • {areaProgress.daysRemaining} Days Left</Text>

          {/* Progress Bar Container */}
          <View style={styles.progressSection}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>Area Ticket Pool Progress</Text>
              <Text style={styles.progressCount}>
                {areaProgress.currentTicketsPool} / {areaProgress.thresholdTickets} Tickets ({progressPercent}%)
              </Text>
            </View>

            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>

            <Text style={styles.thresholdSub}>
              Need {areaProgress.thresholdTickets - areaProgress.currentTicketsPool} more tickets in {areaProgress.areaName} to unlock the prize draw!
            </Text>
          </View>
        </View>

        {/* Unique Referral QR Code & Invite Link Component */}
        <ProfileQRCode userId={userId} userName={ticketDoc.userName} />

        {/* Test Trigger: Simulate New Referral Scanning QR */}
        <TouchableOpacity
          style={[styles.simBtn, isSimulatingSignup && styles.simBtnDisabled]}
          onPress={handleSimulateReferralSignup}
          disabled={isSimulatingSignup}
        >
          <Text style={styles.simBtnText}>
            {isSimulatingSignup ? 'Adding Referral Ticket...' : '⚡ Test: Simulate Friend Scanning My QR Code (+1 Ticket)'}
          </Text>
        </TouchableOpacity>

        {/* Recent Referrals History */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>📋 Successful Referrals History ({history.length})</Text>

          {history.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyMeta}>
                <Text style={styles.historyName}>{item.referredUserName}</Text>
                <Text style={styles.historySub}>
                  Trade: {item.referredUserTrade} • {item.dateReferred}
                </Text>
              </View>
              <View style={styles.ticketAwardBadge}>
                <Text style={styles.ticketAwardText}>+1 Ticket 🎟️</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  cardGold: {
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: '#EAB308',
  },
  cardCyan: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: '#38BDF8',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#CBD5E1',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  areaBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  areaBadgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  prizeTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FACC15',
    marginBottom: 2,
  },
  drawPeriodText: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },
  progressSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  progressCount: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#1E293B',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0284C7',
    borderRadius: 5,
  },
  thresholdSub: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
  simBtn: {
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
    borderWidth: 1.5,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  simBtnDisabled: {
    opacity: 0.5,
  },
  simBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '800',
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyMeta: {
    flex: 1,
  },
  historyName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  historySub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  ticketAwardBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ticketAwardText: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '800',
  },
});

export default LotteryScreen;
