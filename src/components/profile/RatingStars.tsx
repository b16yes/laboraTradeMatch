import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  totalReviews: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, totalReviews }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreText}>{rating.toFixed(1)}</Text>
        <Text style={styles.starsRow}>
          {'★'.repeat(fullStars)}
          {hasHalf ? '½' : ''}
          {'☆'.repeat(5 - fullStars - (hasHalf ? 1 : 0))}
        </Text>
        <Text style={styles.reviewCount}>{totalReviews} verified reviews</Text>
      </View>

      <View style={styles.breakdown}>
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
            <View style={[styles.barFill, { width: '95%' }]} />
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 8,
  },
  scoreBox: {
    alignItems: 'center',
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: '#334155',
    minWidth: 100,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FACC15',
  },
  starsRow: {
    color: '#FACC15',
    fontSize: 16,
    marginVertical: 2,
  },
  reviewCount: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  breakdown: {
    flex: 1,
    paddingLeft: 16,
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 10,
    color: '#94A3B8',
    width: 70,
    fontWeight: '600',
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#0F172A',
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 3,
  },
  barVal: {
    fontSize: 10,
    color: '#F8FAFC',
    fontWeight: '700',
    width: 20,
    textAlign: 'right',
  },
});
