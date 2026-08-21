import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList } from 'react-native';
import { Header } from '../components/common/Header';
import { JobRadarMap } from '../components/dashboard/JobRadarMap';
import { JobCard } from '../components/dashboard/JobCard';
import { FilterModal } from '../components/dashboard/FilterModal';
import { useJobs } from '../state/JobsContext';
import { useAuth } from '../state/AuthContext';
import { DashboardScreenProps } from '../navigation/types';

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { user } = useAuth();
  const {
    jobs,
    radiusKm,
    selectedCategory,
    setRadiusKm,
    setSelectedCategory,
    applyForJob,
  } = useJobs();

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'radar' | 'list'>('radar');

  const handleContactPoster = (posterUid: string, posterName: string, jobTitle: string) => {
    navigation.navigate('Messages', { conversationId: 'conv-1' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Job Radar & Feed"
        subtitle={`GPS Radar • ${jobs.length} open jobs within ${radiusKm}km`}
        rightActionText="⚙️ Filter"
        onRightAction={() => setFilterModalVisible(true)}
      />

      <View style={styles.toggleBar}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'radar' && styles.toggleBtnActive]}
          onPress={() => setViewMode('radar')}
        >
          <Text style={[styles.toggleText, viewMode === 'radar' && styles.toggleTextActive]}>
            📡 Radar View
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            📋 List Feed ({jobs.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        {viewMode === 'radar' ? (
          <JobRadarMap
            currentLocation={user?.currentLocation || { latitude: 51.5074, longitude: -0.1278 }}
            jobs={jobs}
            radiusKm={radiusKm}
            onSelectJob={(job) => {
              // Quick action when blip tapped on radar
              applyForJob(job.id);
            }}
          />
        ) : null}

        <View style={styles.feedHeader}>
          <Text style={styles.feedTitle}>Nearby Subcontract Opportunities</Text>
          <Text style={styles.categoryBadge}>Filter: {selectedCategory}</Text>
        </View>

        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={applyForJob}
            onContactPoster={handleContactPoster}
          />
        ))}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        radiusKm={radiusKm}
        onSelectRadius={setRadiusKm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  toggleBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#0284C7',
  },
  toggleText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  feedTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  categoryBadge: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
});
