import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Button } from '../common/Button';

export const CalendarSyncPlaceholder: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  const handleSync = () => {
    setIsSynced(true);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>External Calendar Sync</Text>
          <Text style={styles.subtitle}>
            {isSynced ? 'Synced with Google Calendar & iCal' : 'Auto-block off busy days from Google/Apple Calendar'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.syncBtn, isSynced && styles.syncBtnActive]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={[styles.syncBtnText, isSynced && styles.syncBtnTextActive]}>
            {isSynced ? '✓ Synced' : 'Sync Calendar'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>📅</Text>
            <Text style={styles.modalTitle}>Connect External Calendar</Text>
            <Text style={styles.modalDesc}>
              Tradesman Radar will automatically sync your availability from Google Calendar or Apple iCal so you never get double-booked on site.
            </Text>

            <TouchableOpacity style={styles.providerBtn} onPress={handleSync}>
              <Text style={styles.providerText}>Google Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.providerBtn} onPress={handleSync}>
              <Text style={styles.providerText}>Apple iCal / Outlook</Text>
            </TouchableOpacity>

            <Button title="Cancel" variant="secondary" onPress={() => setModalVisible(false)} style={{ marginTop: 8 }} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  syncBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  syncBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: '#22C55E',
  },
  syncBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  syncBtnTextActive: {
    color: '#4ADE80',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  providerBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    width: '100%',
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  providerText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
});
