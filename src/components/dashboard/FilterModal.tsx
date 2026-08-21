import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { TradeCategory } from '../../types/models';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: TradeCategory | 'All';
  onSelectCategory: (cat: TradeCategory | 'All') => void;
  radiusKm: number;
  onSelectRadius: (radius: number) => void;
}

const CATEGORIES: (TradeCategory | 'All')[] = [
  'All',
  'Electrical',
  'Plumbing',
  'Carpentry',
  'Masonry',
  'Painting',
  'HVAC',
  'Roofing',
  'General Contracting',
];

const RADII = [1, 3, 5, 10, 25];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  radiusKm,
  onSelectRadius,
}) => {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Radar Filter Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>GPS Radius Range</Text>
            <View style={styles.chipRow}>
              {RADII.map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.chip, radiusKm === r && styles.chipActive]}
                  onPress={() => onSelectRadius(r)}
                >
                  <Text style={[styles.chipText, radiusKm === r && styles.chipTextActive]}>
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Trade Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catCard, selectedCategory === cat && styles.catCardActive]}
                  onPress={() => onSelectCategory(cat)}
                >
                  <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
            <Text style={styles.applyBtnText}>Apply Radar Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  closeText: {
    fontSize: 20,
    color: '#94A3B8',
  },
  content: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipActive: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  chipText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  catCardActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  catText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  catTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  applyBtn: {
    backgroundColor: '#0284C7',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
