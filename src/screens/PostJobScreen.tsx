import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { TradeCategory } from '../types/models';
import { JobService } from '../services/jobService';

const TRADE_CATEGORIES: TradeCategory[] = [
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

const URGENCY_OPTIONS: ('Immediate' | 'Within 24h' | 'This Week' | 'Flexible')[] = [
  'Immediate',
  'Within 24h',
  'This Week',
  'Flexible',
];

interface PostJobScreenProps {
  onSuccess?: () => void;
}

export const PostJobScreen: React.FC<PostJobScreenProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [tradeCategory, setTradeCategory] = useState<TradeCategory>('Electrician');
  const [requiredSpots, setRequiredSpots] = useState('2');
  const [budget, setBudget] = useState('850');
  const [urgency, setUrgency] = useState<'Immediate' | 'Within 24h' | 'This Week' | 'Flexible'>('Immediate');
  const [radiusMiles, setRadiusMiles] = useState('5');
  const [addressName, setAddressName] = useState('Camden Town, London');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePostJob = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a job title/summary.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please enter a description of the work needed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const createdJob = await JobService.createJobDocument({
        posterId: 'tradesman_alpha_101',
        posterName: 'Marcus Vance (Lead Contractor)',
        posterRating: 4.9,
        title: title.trim(),
        description: description.trim(),
        tradeCategory,
        requiredSpots: parseInt(requiredSpots, 10) || 1,
        location: {
          latitude: 51.5074,
          longitude: -0.1278,
          addressName: addressName.trim() || 'Camden Town',
          city: 'London',
        },
        radiusMiles: parseInt(radiusMiles, 10) || 5,
        budget: parseInt(budget, 10) || 500,
        urgency,
      });

      Alert.alert(
        '🚀 Job Broadcast Live!',
        `Your job request for ${createdJob.requiredSpots} ${createdJob.tradeCategory}(s) is now active on the local GPS radar within ${createdJob.radiusMiles} miles.`,
        [{ text: 'OK', onPress: onSuccess }]
      );

      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to broadcast job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Post Trade Job Request</Text>
        <Text style={styles.headerSubtitle}>Broadcast needed tradesmen to local GPS radar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Title / Header */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Job Title / Main Requirement *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 2 Commercial Electricians for 3-Phase Rewire"
            placeholderTextColor="#64748B"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Trade Type Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Trade Category Needed *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {TRADE_CATEGORIES.map((trade) => {
              const isSelected = tradeCategory === trade;
              return (
                <TouchableOpacity
                  key={trade}
                  style={[styles.tradeChip, isSelected && styles.tradeChipActive]}
                  onPress={() => setTradeCategory(trade)}
                >
                  <Text style={[styles.tradeChipText, isSelected && styles.tradeChipTextActive]}>
                    {trade}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Workers Needed & Budget Row */}
        <View style={styles.formRow}>
          <View style={[styles.fieldGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Workers Needed (Spots) *</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={requiredSpots}
              onChangeText={setRequiredSpots}
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Budget / Day Rate (£) *</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={budget}
              onChangeText={setBudget}
            />
          </View>
        </View>

        {/* Urgency Selector */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Urgency Level</Text>
          <View style={styles.urgencyRow}>
            {URGENCY_OPTIONS.map((urg) => {
              const isSelected = urgency === urg;
              return (
                <TouchableOpacity
                  key={urg}
                  style={[styles.urgencyChip, isSelected && styles.urgencyChipActive]}
                  onPress={() => setUrgency(urg)}
                >
                  <Text style={[styles.urgencyChipText, isSelected && styles.urgencyChipTextActive]}>
                    {urg}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Location & Radius */}
        <View style={styles.formRow}>
          <View style={[styles.fieldGroup, { flex: 2, marginRight: 8 }]}>
            <Text style={styles.label}>Site Address / Area</Text>
            <TextInput
              style={styles.textInput}
              value={addressName}
              onChangeText={setAddressName}
              placeholder="e.g. Camden Town, London"
              placeholderTextColor="#64748B"
            />
          </View>

          <View style={[styles.fieldGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.label}>Radius (Miles)</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={radiusMiles}
              onChangeText={setRadiusMiles}
            />
          </View>
        </View>

        {/* Description & Site Access */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Job Scope & Site Instructions *</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            multiline
            numberOfLines={4}
            placeholder="Specify scope of work, tools required, certifications (e.g. NICEIC, Gas Safe), PPE requirements, and site access codes..."
            placeholderTextColor="#64748B"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Broadcast Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handlePostJob}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Broadcasting to Radar...' : '📡 Broadcast Job Request to Radar'}
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
    padding: 20,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
  },
  tradeChip: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 8,
  },
  tradeChipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  tradeChipText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  tradeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  urgencyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgencyChip: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  urgencyChipActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  urgencyChipText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  urgencyChipTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  submitButton: {
    backgroundColor: '#0284C7',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});

export default PostJobScreen;
