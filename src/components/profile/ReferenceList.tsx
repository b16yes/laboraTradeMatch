import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ReferenceItem } from '../../types/models';
import { Badge } from '../common/Badge';

interface ReferenceListProps {
  references: ReferenceItem[];
}

export const ReferenceList: React.FC<ReferenceListProps> = ({ references }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Peer & Client References ({references.length})</Text>

      {references.map((item) => (
        <View key={item.id} style={styles.refCard}>
          <View style={styles.cardHeader}>
            <View style={styles.authorMeta}>
              <Text style={styles.authorName}>{item.authorName}</Text>
              <Badge
                label={item.authorRole}
                variant={item.authorRole === 'Peer Tradesman' ? 'primary' : 'success'}
                isSmall
              />
            </View>
            <Text style={styles.ratingText}>{'★'.repeat(item.rating)}</Text>
          </View>

          <Text style={styles.comment}>"{item.comment}"</Text>

          <View style={styles.footerRow}>
            <Text style={styles.contextTag}>Trade: {item.tradeContext}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  refCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  authorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  ratingText: {
    color: '#FACC15',
    fontSize: 12,
  },
  comment: {
    fontSize: 13,
    color: '#CBD5E1',
    fontStyle: 'italic',
    lineHeight: 18,
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    alignItems: 'center',
  },
  contextTag: {
    fontSize: 11,
    color: '#38BDF8',
    fontWeight: '600',
  },
  dateText: {
    fontSize: 10,
    color: '#64748B',
  },
});
