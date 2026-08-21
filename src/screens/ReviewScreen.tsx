import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';

interface ReviewScreenProps {
  peerName?: string;
  peerRole?: string;
  jobTitle?: string;
  tradeContext?: string;
  onSubmitSuccess?: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  peerName = 'Dave Higgins',
  peerRole = 'Subcontractor / Electrician',
  jobTitle = 'Commercial 3-Phase Rewire',
  tradeContext = 'Electrician',
  onSubmitSuccess,
}) => {
  const [overallRating, setOverallRating] = useState<number>(5);
  const [punctualityRating, setPunctualityRating] = useState<number>(5);
  const [workmanshipRating, setWorkmanshipRating] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!commentText.trim()) {
      Alert.alert('Reference Required', 'Please leave a brief comment about your experience working on site.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '🎉 Mutual Reference Published!',
        `Your rating and reference for ${peerName} has been verified and added to their Trade Match profile.`,
        [
          {
            text: 'Return to Dashboard',
            onPress: () => {
              if (onSubmitSuccess) onSubmitSuccess();
            },
          },
        ]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post-Job Mutual Vetting</Text>
        <Text style={styles.headerSubtitle}>Job Completed & Escrow Released</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job & Peer Context Card */}
        <View style={styles.card}>
          <View style={styles.badgeRow}>
            <View style={styles.jobTag}>
              <Text style={styles.jobTagText}>📌 {jobTitle}</Text>
            </View>
            <View style={styles.tradeTag}>
              <Text style={styles.tradeTagText}>{tradeContext}</Text>
            </View>
          </View>
          <Text style={styles.peerTitle}>Reviewing Site Work: {peerName}</Text>
          <Text style={styles.peerRoleText}>{peerRole}</Text>
        </View>

        {/* Rating Metrics Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>⭐ Rating Metrics</Text>

          {/* Overall Rating */}
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Overall Site Experience</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setOverallRating(star)}>
                  <Text style={[styles.starIcon, star <= overallRating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Punctuality */}
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Punctuality & Site Arrival</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setPunctualityRating(star)}>
                  <Text style={[styles.starIcon, star <= punctualityRating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Workmanship Quality */}
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Workmanship & Safety Standard</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setWorkmanshipRating(star)}>
                  <Text style={[styles.starIcon, star <= workmanshipRating && styles.starActive]}>★</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Reference Comment Input */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>📝 Reference Comment</Text>
          <Text style={styles.inputSub}>
            Write a brief endorsement that will appear publicly on {peerName}'s verified Trade Match profile:
          </Text>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder="e.g. Flawless 3-phase electrical installation. Arrived on time with full PPE and testing gear. Highly recommended for future subcontracts."
            placeholderTextColor="#64748B"
            value={commentText}
            onChangeText={setCommentText}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting ? 'Publishing Reference...' : 'Submit Mutual Reference & Complete'}
          </Text>
        </TouchableOpacity>
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
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTag: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  jobTagText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  tradeTag: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tradeTagText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  peerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  peerRoleText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  metricRow: {
    marginBottom: 12,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  starIcon: {
    fontSize: 28,
    color: '#475569',
  },
  starActive: {
    color: '#FACC15',
  },
  inputSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    padding: 12,
    fontSize: 13,
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#0284C7',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default ReviewScreen;
