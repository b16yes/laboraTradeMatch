import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';

export type TradeCategory =
  | 'Electrician'
  | 'Plumber'
  | 'Carpenter'
  | 'Mason'
  | 'Painter'
  | 'HVAC Technician'
  | 'Roofer'
  | 'General Contractor';

export interface LocalJobRequest {
  id: string;
  title: string;
  tradesmenNeeded: number;
  tradeCategory: TradeCategory;
  distanceMiles: number;
  locationName: string;
  budget: number;
  urgency: 'Immediate' | 'Within 24h' | 'This Week' | 'Flexible';
  description: string;
  posterName: string;
  posterRating: number;
  applicantsCount: number;
  createdAt: string;
}

const INITIAL_MOCK_JOBS: LocalJobRequest[] = [
  {
    id: 'job-1',
    title: '2 Electricians needed for Commercial Rewire',
    tradesmenNeeded: 2,
    tradeCategory: 'Electrician',
    distanceMiles: 2.5,
    locationName: 'Camden Town, London',
    budget: 850,
    urgency: 'Immediate',
    description: 'Subcontractors needed for 3-phase distribution panel installation and testing.',
    posterName: 'Marcus Vance (Lead Contractor)',
    posterRating: 4.9,
    applicantsCount: 3,
    createdAt: '15 mins ago',
  },
  {
    id: 'job-2',
    title: 'Gas Safe Plumber for Boiler & Pipework Retrofit',
    tradesmenNeeded: 1,
    tradeCategory: 'Plumber',
    distanceMiles: 4.1,
    locationName: 'Islington, London',
    budget: 650,
    urgency: 'Within 24h',
    description: 'High-efficiency heat pump connection and copper pipe manifold installation.',
    posterName: 'Sarah Jenkins (Build Co)',
    posterRating: 4.8,
    applicantsCount: 5,
    createdAt: '45 mins ago',
  },
  {
    id: 'job-3',
    title: '3 Carpenters for Timber Loft Framing',
    tradesmenNeeded: 3,
    tradeCategory: 'Carpenter',
    distanceMiles: 5.8,
    locationName: 'Kensington, London',
    budget: 1200,
    urgency: 'This Week',
    description: 'Roof joist reinforcement and timber frame construction. All materials on site.',
    posterName: 'Apex Structural Group',
    posterRating: 4.7,
    applicantsCount: 2,
    createdAt: '2 hours ago',
  },
  {
    id: 'job-4',
    title: 'Exterior Masonry & Brickwork Pointing',
    tradesmenNeeded: 2,
    tradeCategory: 'Mason',
    distanceMiles: 8.2,
    locationName: 'Hackney, London',
    budget: 950,
    urgency: 'Flexible',
    description: 'Lime mortar repointing on historic building facade. Scaffolding already erected.',
    posterName: 'Tom Reynolds',
    posterRating: 5.0,
    applicantsCount: 4,
    createdAt: '4 hours ago',
  },
];

const RADIUS_OPTIONS = [5, 10, 15, 25];

export const RadarScreen: React.FC = () => {
  const [selectedRadius, setSelectedRadius] = useState<number>(5);
  const [selectedTrade, setSelectedTrade] = useState<TradeCategory | 'All'>('All');
  const [jobs, setJobs] = useState<LocalJobRequest[]>(INITIAL_MOCK_JOBS);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTrade, setNewTrade] = useState<TradeCategory>('Electrician');
  const [newNeeded, setNewNeeded] = useState('1');
  const [newBudget, setNewBudget] = useState('500');
  const [newLocation, setNewLocation] = useState('Central London');
  const [newDesc, setNewDesc] = useState('');

  const filteredJobs = jobs.filter(
    (job) =>
      job.distanceMiles <= selectedRadius &&
      (selectedTrade === 'All' || job.tradeCategory === selectedTrade)
  );

  const handlePostJob = () => {
    if (!newTitle.trim()) return;

    const newJob: LocalJobRequest = {
      id: `job-${Date.now()}`,
      title: newTitle,
      tradesmenNeeded: parseInt(newNeeded, 10) || 1,
      tradeCategory: newTrade,
      distanceMiles: 1.5,
      locationName: newLocation || 'Local Radius',
      budget: parseInt(newBudget, 10) || 500,
      urgency: 'Immediate',
      description: newDesc || 'No additional description provided.',
      posterName: 'You (Current Tradesman)',
      posterRating: 5.0,
      applicantsCount: 0,
      createdAt: 'Just now',
    };

    setJobs([newJob, ...jobs]);
    setModalVisible(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>Trade Match</Text>
          <Text style={styles.brandSubtitle}>GPS Job Radar • Local Trade Network</Text>
        </View>

        <TouchableOpacity style={styles.postJobHeaderBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.postJobHeaderBtnText}>+ Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* Radius Selector Controls */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>GPS RADIUS FILTER</Text>
        <View style={styles.radiusRow}>
          {RADIUS_OPTIONS.map((radius) => (
            <TouchableOpacity
              key={radius}
              style={[styles.radiusChip, selectedRadius === radius && styles.radiusChipActive]}
              onPress={() => setSelectedRadius(radius)}
            >
              <Text style={[styles.radiusChipText, selectedRadius === radius && styles.radiusChipTextActive]}>
                Within {radius} mi
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Jobs List Header Summary */}
      <View style={styles.feedHeader}>
        <Text style={styles.feedTitle}>
          Nearby Job Requests ({filteredJobs.length})
        </Text>
        <View style={styles.livePulseTag}>
          <View style={styles.pulseDot} />
          <Text style={styles.liveTagText}>RADAR LIVE</Text>
        </View>
      </View>

      {/* Local Jobs Feed */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📡</Text>
            <Text style={styles.emptyTitle}>No Jobs Detected in {selectedRadius} Miles</Text>
            <Text style={styles.emptySubtitle}>Try expanding your GPS radius filter or post a new job request.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.jobCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.tradeBadge}>
                <Text style={styles.tradeBadgeText}>
                  {item.tradesmenNeeded} {item.tradeCategory}{item.tradesmenNeeded > 1 ? 's' : ''} needed
                </Text>
              </View>
              <View style={[styles.urgencyBadge, item.urgency === 'Immediate' && styles.urgencyImmediate]}>
                <Text style={styles.urgencyText}>{item.urgency}</Text>
              </View>
            </View>

            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobDesc} numberOfLines={2}>
              {item.description}
            </Text>

            <View style={styles.metaBox}>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>DISTANCE</Text>
                <Text style={styles.metaValue}>📍 {item.distanceMiles} miles away</Text>
              </View>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>BUDGET</Text>
                <Text style={styles.budgetValue}>£{item.budget}</Text>
              </View>
              <View style={styles.metaColumn}>
                <Text style={styles.metaLabel}>POSTER</Text>
                <Text style={styles.metaValue}>⭐ {item.posterRating}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.timeText}>{item.locationName} • {item.createdAt}</Text>
              <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8}>
                <Text style={styles.applyBtnText}>Quick Apply ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button for Posting New Job */}
      <TouchableOpacity style={styles.fabBtn} onPress={() => setModalVisible(true)} activeOpacity={0.85}>
        <Text style={styles.fabText}>+ Post New Job</Text>
      </TouchableOpacity>

      {/* Modal Form to Post New Job */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post Local Trade Request</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.inputLabel}>Job Title / Requirements</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 2 Electricians needed within 5 miles"
                placeholderTextColor="#64748B"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Trade Category Needed</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tradeCatRow}>
                {(['Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'HVAC Technician'] as TradeCategory[]).map(
                  (cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.tradeChoice, newTrade === cat && styles.tradeChoiceActive]}
                      onPress={() => setNewTrade(cat)}
                    >
                      <Text style={[styles.tradeChoiceText, newTrade === cat && styles.tradeChoiceTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </ScrollView>

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Number Needed</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={newNeeded}
                    onChangeText={setNewNeeded}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>Budget (£)</Text>
                  <TextInput
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={newBudget}
                    onChangeText={setNewBudget}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Site Location / Radius</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Camden Town, 5 mile radius"
                placeholderTextColor="#64748B"
                value={newLocation}
                onChangeText={setNewLocation}
              />

              <Text style={styles.inputLabel}>Description / Access Details</Text>
              <TextInput
                style={[styles.textInput, { height: 80 }]}
                multiline
                placeholder="Specify scope of work, tools required, PPE or site access instructions..."
                placeholderTextColor="#64748B"
                value={newDesc}
                onChangeText={setNewDesc}
              />

              <TouchableOpacity style={styles.submitJobBtn} onPress={handlePostJob}>
                <Text style={styles.submitJobBtnText}>Broadcast to Local Radar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '600',
  },
  postJobHeaderBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  postJobHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  filterSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  filterLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  radiusRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radiusChip: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  radiusChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  radiusChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  radiusChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  feedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  livePulseTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
    marginRight: 6,
  },
  liveTagText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '800',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  jobCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tradeBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tradeBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
  },
  urgencyBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyImmediate: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  urgencyText: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '700',
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  jobDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 12,
  },
  metaBox: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metaColumn: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  budgetValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#38BDF8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#64748B',
  },
  applyBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  fabBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  closeIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  formScroll: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  tradeCatRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tradeChoice: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  tradeChoiceActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  tradeChoiceText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  tradeChoiceTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  formRow: {
    flexDirection: 'row',
  },
  submitJobBtn: {
    backgroundColor: '#0284C7',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitJobBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default RadarScreen;
