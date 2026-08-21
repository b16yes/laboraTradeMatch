import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TradeCategory, TradeSpecialty } from '../../types/models';

interface TradeSelectorProps {
  currentTrades: TradeSpecialty[];
  onToggleTrade: (trade: TradeCategory) => void;
}

const ALL_TRADES: TradeCategory[] = [
  'Electrical',
  'Plumbing',
  'Carpentry',
  'Masonry',
  'Painting',
  'HVAC',
  'Roofing',
  'General Contracting',
];

export const TradeSelector: React.FC<TradeSelectorProps> = ({ currentTrades, onToggleTrade }) => {
  const isSelected = (cat: TradeCategory) => currentTrades.some((t) => t.category === cat);
  const getTradeObj = (cat: TradeCategory) => currentTrades.find((t) => t.category === cat);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multi-Trade Specialization</Text>
      <Text style={styles.subtitle}>Select primary & secondary trade certifications for job matching</Text>

      <View style={styles.grid}>
        {ALL_TRADES.map((cat) => {
          const selected = isSelected(cat);
          const tradeObj = getTradeObj(cat);
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.tradeCard, selected && styles.tradeCardSelected]}
              onPress={() => onToggleTrade(cat)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.catName, selected && styles.catNameSelected]}>{cat}</Text>
                {selected ? (
                  <View style={[styles.roleBadge, tradeObj?.isPrimary ? styles.primaryBadge : styles.secBadge]}>
                    <Text style={styles.roleText}>{tradeObj?.isPrimary ? 'PRIMARY' : 'SECONDARY'}</Text>
                  </View>
                ) : null}
              </View>
              {selected && tradeObj ? (
                <Text style={styles.expText}>
                  {tradeObj.yearsExperience} yrs exp • {tradeObj.licenseNumber || 'Verified'}
                </Text>
              ) : (
                <Text style={styles.addText}>+ Tap to Add</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
  },
  grid: {
    gap: 8,
  },
  tradeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tradeCardSelected: {
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderColor: '#38BDF8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  catNameSelected: {
    color: '#F8FAFC',
    fontWeight: '800',
  },
  roleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryBadge: {
    backgroundColor: '#0284C7',
  },
  secBadge: {
    backgroundColor: '#475569',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  expText: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 4,
    fontWeight: '600',
  },
  addText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
