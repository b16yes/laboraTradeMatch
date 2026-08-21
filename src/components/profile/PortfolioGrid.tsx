import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { PortfolioItem } from '../../types/models';
import { Badge } from '../common/Badge';

interface PortfolioGridProps {
  portfolio: PortfolioItem[];
}

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({ portfolio }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Completed Site Portfolio ({portfolio.length})</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ Add Work Photo</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {portfolio.map((item) => (
          <View key={item.id} style={styles.portfolioCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.cardBody}>
              <View style={styles.badgeRow}>
                <Badge label={item.tradeCategory} variant="primary" isSmall />
                <Text style={styles.dateText}>{item.dateCompleted}</Text>
              </View>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  addBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    gap: 12,
  },
  portfolioCard: {
    width: 220,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#0F172A',
  },
  cardBody: {
    padding: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  itemDesc: {
    fontSize: 11,
    color: '#94A3B8',
    lineHeight: 15,
  },
});
