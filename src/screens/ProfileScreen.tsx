import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';

export type TradeType =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Bricklayer'
  | 'Mason'
  | 'Painter'
  | 'HVAC'
  | 'Roofer'
  | 'General Contractor';

export interface ReferenceComment {
  id: string;
  authorName: string;
  authorTrade: TradeType;
  rating: number;
  date: string;
  commentText: string;
  jobContext: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  trade: TradeType;
  imageUrl: string;
  dateCompleted: string;
}

const ALL_AVAILABLE_TRADES: TradeType[] = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Bricklayer',
  'Mason',
  'Painter',
  'HVAC',
  'Roofer',
  'General Contractor',
];

const INITIAL_REFERENCES: ReferenceComment[] = [
  {
    id: 'ref-1',
    authorName: 'Dave Higgins',
    authorTrade: 'Electrician',
    rating: 5,
    date: '12 Aug 2026',
    commentText: 'Marcus covered my electrical rough-in on a 4-bed commercial site. Flawless 3-phase work and fully certified testing.',
    jobContext: 'Commercial Rewire',
  },
  {
    id: 'ref-2',
    authorName: 'Elena Rostova',
    authorTrade: 'HVAC',
    rating: 5,
    date: '28 Jul 2026',
    commentText: 'Great subcontractor to pair with on site. Punctual, organized, and followed all VRF system specs precisely.',
    jobContext: 'Climate System Retrofit',
  },
  {
    id: 'ref-3',
    authorName: 'Apex Build Group',
    authorTrade: 'General Contractor',
    rating: 5,
    date: '15 Jul 2026',
    commentText: 'Solved a complex distribution board issue on short notice. Highly recommended for commercial contracts.',
    jobContext: 'Panel Upgrade',
  },
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p-1',
    title: '3-Phase Distribution Panel Installation',
    trade: 'Electrician',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    dateCompleted: 'July 2026',
  },
  {
    id: 'p-2',
    title: 'Heat Pump & Climate System Integration',
    trade: 'HVAC',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=600&auto=format&fit=crop&q=80',
    dateCompleted: 'May 2026',
  },
  {
    id: 'p-3',
    title: 'Commercial Copper Pipe Manifold Assembly',
    trade: 'Plumber',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
    dateCompleted: 'March 2026',
  },
  {
    id: 'p-4',
    title: 'Timber Frame & Joist Structural Work',
    trade: 'Carpenter',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    dateCompleted: 'January 2026',
  },
];

export const ProfileScreen: React.FC = () => {
  // Availability Toggles
  const [instantWorkAvailable, setInstantWorkAvailable] = useState<boolean>(true);
  const [syncDigitalDiary, setSyncDigitalDiary] = useState<boolean>(true);

  // Multi-Trade Selector State
  const [selectedTrades, setSelectedTrades] = useState<TradeType[]>([
    'Electrician',
    'HVAC',
  ]);

  // Verification & Credentials State
  const [licenseNumber, setLicenseNumber] = useState<string>('NICEIC-89421');
  const [insuranceInfo, setInsuranceInfo] = useState<string>('£5M Public Liability (Active)');
  const [isIdentityVerified] = useState<boolean>(true);

  // Portfolio & References State
  const [portfolio] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);
  const [references] = useState<ReferenceComment[]>(INITIAL_REFERENCES);

  const toggleTrade = (trade: TradeType) => {
    if (selectedTrades.includes(trade)) {
      if (selectedTrades.length > 1) {
        setSelectedTrades(selectedTrades.filter((t) => t !== trade));
      }
    } else {
      setSelectedTrades([...selectedTrades, trade]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tradesman Profile</Text>
        <Text style={styles.headerSubtitle}>Trade Match • Verified Profile & Credentials</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Availability Toggles Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>⚡ Availability Controls</Text>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <View style={styles.toggleTitleRow}>
                <View style={[styles.statusDot, instantWorkAvailable ? styles.dotGreen : styles.dotGray]} />
                <Text style={styles.toggleTitle}>Available for Instant Work</Text>
              </View>
              <Text style={styles.toggleDesc}>
                Broadcasting live GPS status on local job radar for immediate subcontract calls.
              </Text>
            </View>
            <Switch
              value={instantWorkAvailable}
              onValueChange={setInstantWorkAvailable}
              trackColor={{ false: '#334155', true: '#0284C7' }}
              thumbColor={instantWorkAvailable ? '#38BDF8' : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextWrap}>
              <Text style={styles.toggleTitle}>📅 Sync with Digital Diary</Text>
              <Text style={styles.toggleDesc}>
                Automatically block off busy calendar days & sync Google/Apple Calendar.
              </Text>
            </View>
            <Switch
              value={syncDigitalDiary}
              onValueChange={setSyncDigitalDiary}
              trackColor={{ false: '#334155', true: '#0284C7' }}
              thumbColor={syncDigitalDiary ? '#38BDF8' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Profile Info Header */}
        <View style={styles.card}>
          <View style={styles.profileHeaderRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' }}
              style={styles.avatar}
            />
            <View style={styles.profileMeta}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>Marcus Vance</Text>
                {isIdentityVerified ? (
                  <View style={styles.idBadge}>
                    <Text style={styles.idBadgeText}>✓ ID VERIFIED</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.userBio}>
                Master Electrician & Certified HVAC Specialist with 12+ years experience on commercial & residential builds.
              </Text>

              <View style={styles.activeTradesRow}>
                {selectedTrades.map((t) => (
                  <View key={t} style={styles.tradeBadgeChip}>
                    <Text style={styles.tradeBadgeText}>{t}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Multi-Trade Selector Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>🛠️ Multi-Trade Specialization</Text>
          <Text style={styles.sectionSub}>Check off all trade skills you offer for local job radar matching:</Text>

          <View style={styles.tradesGrid}>
            {ALL_AVAILABLE_TRADES.map((trade) => {
              const isChecked = selectedTrades.includes(trade);
              return (
                <TouchableOpacity
                  key={trade}
                  style={[styles.tradeItemChip, isChecked && styles.tradeItemChipActive]}
                  onPress={() => toggleTrade(trade)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.checkboxIcon, isChecked && styles.checkboxIconActive]}>
                    {isChecked ? '☑' : '☐'}
                  </Text>
                  <Text style={[styles.tradeItemText, isChecked && styles.tradeItemTextActive]}>
                    {trade}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Verification & Credentials Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>🛡️ Verification & Credentials</Text>

          <View style={styles.credRow}>
            <View style={styles.credIconWrap}>
              <Text style={styles.credIcon}>🆔</Text>
            </View>
            <View style={styles.credMeta}>
              <Text style={styles.credTitle}>Identity Verification</Text>
              <Text style={styles.credStatusGreen}>✓ Passport & Driving License Verified</Text>
            </View>
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>License / Accreditation Number</Text>
            <TextInput
              style={styles.fieldInput}
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              placeholder="e.g. NICEIC-89421 or Gas Safe #123456"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={styles.fieldBlock}>
            <Text style={styles.fieldLabel}>Public Liability Insurance Info</Text>
            <TextInput
              style={styles.fieldInput}
              value={insuranceInfo}
              onChangeText={setInsuranceInfo}
              placeholder="e.g. £5M Coverage Policy #POL-9921"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        {/* Portfolio Gallery Grid */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.sectionHeader}>📷 Past Work Portfolio</Text>
            <TouchableOpacity style={styles.uploadBtn}>
              <Text style={styles.uploadBtnText}>+ Add Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.portfolioGrid}>
            {portfolio.map((item) => (
              <View key={item.id} style={styles.portfolioCard}>
                <Image source={{ uri: item.imageUrl }} style={styles.portfolioImg} />
                <View style={styles.portfolioOverlay}>
                  <Text style={styles.portfolioTradeTag}>{item.trade}</Text>
                  <Text style={styles.portfolioTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Mutual Ratings & References */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>⭐ Mutual Ratings & References</Text>

          {/* Average Rating Score Box */}
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.bigScore}>4.9</Text>
              <Text style={styles.starString}>★★★★★</Text>
              <Text style={styles.reviewSub}>48 Verified Jobs</Text>
            </View>

            <View style={styles.scoreBreakdown}>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Workmanship</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '98%' }]} />
                </View>
                <Text style={styles.barVal}>4.9</Text>
              </View>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Punctuality</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '96%' }]} />
                </View>
                <Text style={styles.barVal}>4.8</Text>
              </View>
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Safety / Certs</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: '100%' }]} />
                </View>
                <Text style={styles.barVal}>5.0</Text>
              </View>
            </View>
          </View>

          {/* References List */}
          <Text style={[styles.sectionSub, { marginTop: 14 }]}>References Left by Peer Tradesmen:</Text>

          {references.map((ref) => (
            <View key={ref.id} style={styles.refBox}>
              <View style={styles.refHeader}>
                <View style={styles.refAuthorInfo}>
                  <Text style={styles.refName}>{ref.authorName}</Text>
                  <View style={styles.refTradeChip}>
                    <Text style={styles.refTradeText}>{ref.authorTrade}</Text>
                  </View>
                </View>
                <Text style={styles.refStars}>{'★'.repeat(ref.rating)}</Text>
              </View>

              <Text style={styles.refComment}>"{ref.commentText}"</Text>

              <View style={styles.refFooter}>
                <Text style={styles.refJobContext}>Context: {ref.jobContext}</Text>
                <Text style={styles.refDate}>{ref.date}</Text>
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
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  toggleTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  toggleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotGreen: {
    backgroundColor: '#22C55E',
  },
  dotGray: {
    backgroundColor: '#64748B',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  toggleDesc: {
    fontSize: 11,
    color: '#CBD5E1',
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  profileHeaderRow: {
    flexDirection: 'row',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  profileMeta: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  idBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  idBadgeText: {
    color: '#4ADE80',
    fontSize: 9,
    fontWeight: '800',
  },
  userBio: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 16,
    marginBottom: 8,
  },
  activeTradesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tradeBadgeChip: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tradeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  tradesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tradeItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  tradeItemChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  checkboxIcon: {
    fontSize: 14,
    color: '#64748B',
    marginRight: 6,
  },
  checkboxIconActive: {
    color: '#38BDF8',
  },
  tradeItemText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  tradeItemTextActive: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  credRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  credIconWrap: {
    marginRight: 10,
  },
  credIcon: {
    fontSize: 24,
  },
  credMeta: {},
  credTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  credStatusGreen: {
    fontSize: 11,
    color: '#4ADE80',
    fontWeight: '700',
  },
  fieldBlock: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  uploadBtnText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  portfolioCard: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  portfolioImg: {
    width: '100%',
    height: '100%',
  },
  portfolioOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    padding: 6,
  },
  portfolioTradeTag: {
    fontSize: 9,
    color: '#38BDF8',
    fontWeight: '800',
  },
  portfolioTitle: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  scoreBox: {
    alignItems: 'center',
    paddingRight: 14,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    minWidth: 80,
  },
  bigScore: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FACC15',
  },
  starString: {
    color: '#FACC15',
    fontSize: 12,
    marginVertical: 2,
  },
  reviewSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  scoreBreakdown: {
    flex: 1,
    paddingLeft: 12,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 9,
    color: '#94A3B8',
    width: 65,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    marginHorizontal: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  barVal: {
    fontSize: 9,
    color: '#F8FAFC',
    fontWeight: '800',
  },
  refBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  refHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  refAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  refTradeChip: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  refTradeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  refStars: {
    color: '#FACC15',
    fontSize: 11,
  },
  refComment: {
    fontSize: 12,
    color: '#CBD5E1',
    fontStyle: 'italic',
    lineHeight: 16,
    marginVertical: 4,
  },
  refFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  refJobContext: {
    fontSize: 10,
    color: '#38BDF8',
    fontWeight: '600',
  },
  refDate: {
    fontSize: 10,
    color: '#64748B',
  },
});

export default ProfileScreen;
