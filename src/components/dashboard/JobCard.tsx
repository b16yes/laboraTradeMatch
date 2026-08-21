import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { JobListing } from '../../types/models';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';

interface JobCardProps {
  job: JobListing;
  onApply: (jobId: string) => void;
  onContactPoster: (posterUid: string, posterName: string, jobTitle: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApply, onContactPoster }) => {
  const getUrgencyVariant = () => {
    switch (job.urgency) {
      case 'Immediate':
        return 'danger';
      case 'Within 24h':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Badge label={job.tradeRequired} variant="primary" />
        <Badge label={job.urgency} variant={getUrgencyVariant()} />
      </View>

      <Text style={styles.title}>{job.title}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.metaContainer}>
        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>BUDGET</Text>
          <Text style={styles.budgetText}>£{job.budget}</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>DISTANCE</Text>
          <Text style={styles.metaValue}>📍 {job.distanceKm} km</Text>
        </View>

        <View style={styles.metaItem}>
          <Text style={styles.metaLabel}>POSTER</Text>
          <Text style={styles.metaValue}>
            ⭐ {job.posterRating} ({job.posterName.split(' ')[0]})
          </Text>
        </View>
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.postedTime}>Posted {job.createdAt} • {job.applicantCount} applicants</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.chatBtn}
            onPress={() => onContactPoster(job.posterUid, job.posterName, job.title)}
          >
            <Text style={styles.chatBtnText}>💬 Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.applyBtn, job.status === 'In Progress' && styles.applyBtnDone]}
            onPress={() => onApply(job.id)}
            disabled={job.status === 'In Progress'}
          >
            <Text style={styles.applyBtnText}>
              {job.status === 'In Progress' ? 'Applied ✓' : 'Quick Apply'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  metaItem: {
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  budgetText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38BDF8',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postedTime: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chatBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chatBtnText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyBtnDone: {
    backgroundColor: '#15803D',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
