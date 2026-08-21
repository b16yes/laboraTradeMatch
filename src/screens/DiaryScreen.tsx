import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { ScheduleService } from '../services/scheduleService';
import { ScheduleBlockDocument, DiarySettings } from '../types/models';

interface DiaryScreenProps {
  userId?: string;
}

const DAYS_OF_WEEK = [
  { dayName: 'MON', dateNum: '18', fullDate: '2026-08-18' },
  { dayName: 'TUE', dateNum: '19', fullDate: '2026-08-19' },
  { dayName: 'WED', dateNum: '20', fullDate: '2026-08-20' },
  { dayName: 'THU', dateNum: '21', fullDate: '2026-08-21' },
  { dayName: 'FRI', dateNum: '22', fullDate: '2026-08-22' },
  { dayName: 'SAT', dateNum: '23', fullDate: '2026-08-23' },
  { dayName: 'SUN', dateNum: '24', fullDate: '2026-08-24' },
];

export const DiaryScreen: React.FC<DiaryScreenProps> = ({
  userId = 'tradesman_alpha_101',
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-20');
  const [scheduleBlocks, setScheduleBlocks] = useState<ScheduleBlockDocument[]>([]);
  const [settings, setSettings] = useState<DiarySettings>({
    autoAvailabilityEnabled: true,
    gpsBroadcastEnabled: true,
    defaultDayRate: 450,
  });

  // Manual Booking Entry Modal State
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newStartTime, setNewStartTime] = useState<string>('08:00');
  const [newEndTime, setNewEndTime] = useState<string>('17:00');
  const [newBlockType, setNewBlockType] = useState<'Existing Work' | 'Personal Time Off'>('Existing Work');
  const [newLocationNotes, setNewLocationNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadScheduleData = async () => {
    const blocks = await ScheduleService.getUserSchedule(userId);
    const diarySettings = await ScheduleService.getDiarySettings(userId);
    setScheduleBlocks(blocks);
    setSettings(diarySettings);
  };

  useEffect(() => {
    loadScheduleData();
  }, [userId]);

  const handleToggleAutoAvailability = async (value: boolean) => {
    const updated = await ScheduleService.updateAutoAvailabilityToggle(userId, value);
    setSettings(updated);
  };

  const handleAddManualBooking = async () => {
    if (!newTitle.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for this booking / time off entry.');
      return;
    }

    setIsSubmitting(true);

    try {
      await ScheduleService.addScheduleBlock({
        userId,
        title: newTitle.trim(),
        date: selectedDate,
        startTime: newStartTime,
        endTime: newEndTime,
        status: 'Busy',
        blockType: newBlockType,
        locationNotes: newLocationNotes.trim() || undefined,
      });

      Alert.alert(
        '📅 Booking Saved to Firestore',
        `"${newTitle}" marked as BUSY for ${selectedDate} (${newStartTime} - ${newEndTime}). Backend matching engine updated.`,
        [{ text: 'OK', onPress: () => setModalVisible(false) }]
      );

      // Reset form
      setNewTitle('');
      setNewLocationNotes('');
      await loadScheduleData();
    } catch (error) {
      Alert.alert('Error', 'Failed to save booking to calendar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeDayBlocks = scheduleBlocks.filter((b) => b.date === selectedDate);
  const hasBusyBlockOnDay = activeDayBlocks.some((b) => b.status === 'Busy' || b.status === 'On Site');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Digital Diary & Schedule</Text>
          <Text style={styles.headerSubtitle}>Automated Availability & Calendar Sync</Text>
        </View>

        <TouchableOpacity style={styles.addBookingHeaderBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBookingHeaderBtnText}>+ Manual Entry</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Auto-Availability Settings Toggle Card */}
        <View style={styles.card}>
          <View style={styles.toggleHeaderRow}>
            <View style={styles.toggleLabelWrap}>
              <View style={styles.titleWithDot}>
                <View
                  style={[
                    styles.pulseDot,
                    settings.autoAvailabilityEnabled && !hasBusyBlockOnDay
                      ? styles.dotGreen
                      : styles.dotYellow,
                  ]}
                />
                <Text style={styles.toggleTitle}>
                  Automatically use my diary to set availability
                </Text>
              </View>

              <Text style={styles.toggleSubText}>
                When enabled, unbooked time slots in your diary automatically broadcast your status as{' '}
                <Text style={{ color: '#4ADE80', fontWeight: '800' }}>Available</Text> for local GPS job radar.
              </Text>
            </View>

            <Switch
              value={settings.autoAvailabilityEnabled}
              onValueChange={handleToggleAutoAvailability}
              trackColor={{ false: '#334155', true: '#0284C7' }}
              thumbColor={settings.autoAvailabilityEnabled ? '#38BDF8' : '#94A3B8'}
            />
          </View>

          <View style={styles.statusBanner}>
            <Text style={styles.statusBannerText}>
              STATUS FOR {selectedDate}:{' '}
              {hasBusyBlockOnDay ? (
                <Text style={{ color: '#FACC15', fontWeight: '900' }}>
                  ⛔ BUSY (Booked Calendar Block)
                </Text>
              ) : settings.autoAvailabilityEnabled ? (
                <Text style={{ color: '#4ADE80', fontWeight: '900' }}>
                  📡 BROADCASTING AVAILABLE (Free Slot)
                </Text>
              ) : (
                <Text style={{ color: '#CBD5E1', fontWeight: '900' }}>
                  ⚪ MANUAL OVERRIDE (Off Radar)
                </Text>
              )}
            </Text>
          </View>
        </View>

        {/* Weekly Schedule Calendar Strip */}
        <View style={styles.calendarStripSection}>
          <Text style={styles.sectionHeader}>August 2026 Schedule Strip</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stripScroll}>
            {DAYS_OF_WEEK.map((item) => {
              const isSelected = selectedDate === item.fullDate;
              const dayBlocks = scheduleBlocks.filter((b) => b.date === item.fullDate);
              const isDayBusy = dayBlocks.some((b) => b.status === 'Busy' || b.status === 'On Site');

              return (
                <TouchableOpacity
                  key={item.fullDate}
                  style={[
                    styles.dayTile,
                    isSelected && styles.dayTileSelected,
                    isDayBusy && !isSelected && styles.dayTileBusy,
                  ]}
                  onPress={() => setSelectedDate(item.fullDate)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.dayTileName, isSelected && styles.dayTileNameSelected]}>
                    {item.dayName}
                  </Text>
                  <Text style={[styles.dayTileNum, isSelected && styles.dayTileNumSelected]}>
                    {item.dateNum}
                  </Text>
                  <View
                    style={[
                      styles.tileStatusIndicator,
                      isDayBusy ? styles.indBusy : styles.indFree,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Date Schedule Blocks List */}
        <View style={styles.card}>
          <View style={styles.cardHeaderBetween}>
            <Text style={styles.sectionHeader}>
              Bookings for {selectedDate} ({activeDayBlocks.length})
            </Text>
            <TouchableOpacity style={styles.addBlockInlineBtn} onPress={() => setModalVisible(true)}>
              <Text style={styles.addBlockInlineText}>+ Add Entry</Text>
            </TouchableOpacity>
          </View>

          {activeDayBlocks.length === 0 ? (
            <View style={styles.emptyBlock}>
              <Text style={styles.emptyIcon}>📅</Text>
              <Text style={styles.emptyTitle}>No Booked Calendar Blocks</Text>
              <Text style={styles.emptySub}>
                {settings.autoAvailabilityEnabled
                  ? 'Auto-Availability is active. You are automatically broadcasted as Available for emergency job alerts!'
                  : 'Tap "+ Add Entry" to log existing site work or time off.'}
              </Text>
            </View>
          ) : (
            activeDayBlocks.map((block) => (
              <View key={block.id} style={styles.blockCard}>
                <View style={styles.blockTopRow}>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>
                      ⏰ {block.startTime} - {block.endTime}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      block.status === 'On Site'
                        ? styles.statusOnSite
                        : block.status === 'Busy'
                        ? styles.statusBusy
                        : styles.statusAvailable,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{block.status.toUpperCase()}</Text>
                  </View>
                </View>

                <Text style={styles.blockTitle}>{block.title}</Text>
                <Text style={styles.blockTypeTag}>Category: {block.blockType}</Text>

                {block.locationNotes ? (
                  <Text style={styles.locationNotesText}>📍 Notes: {block.locationNotes}</Text>
                ) : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Manual Booking Entry Modal Form */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manual Booking Entry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formScroll}>
              <Text style={styles.inputLabel}>Booking Title / Description *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Existing Site Work or Personal Time Off"
                placeholderTextColor="#64748B"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Entry Type</Text>
              <View style={styles.typeRow}>
                <TouchableOpacity
                  style={[styles.typeChoice, newBlockType === 'Existing Work' && styles.typeChoiceActive]}
                  onPress={() => setNewBlockType('Existing Work')}
                >
                  <Text style={[styles.typeChoiceText, newBlockType === 'Existing Work' && styles.typeChoiceTextActive]}>
                    🏗️ Existing Work
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeChoice, newBlockType === 'Personal Time Off' && styles.typeChoiceActive]}
                  onPress={() => setNewBlockType('Personal Time Off')}
                >
                  <Text style={[styles.typeChoiceText, newBlockType === 'Personal Time Off' && styles.typeChoiceTextActive]}>
                    🌴 Personal Time Off
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.inputLabel}>Start Time *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newStartTime}
                    onChangeText={setNewStartTime}
                    placeholder="08:00"
                    placeholderTextColor="#64748B"
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.inputLabel}>End Time *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={newEndTime}
                    onChangeText={setNewEndTime}
                    placeholder="17:00"
                    placeholderTextColor="#64748B"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Location / Notes</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Private Client Site, High Street"
                placeholderTextColor="#64748B"
                value={newLocationNotes}
                onChangeText={setNewLocationNotes}
              />

              <TouchableOpacity
                style={[styles.saveBookingBtn, isSubmitting && styles.saveBookingBtnDisabled]}
                onPress={handleAddManualBooking}
                disabled={isSubmitting}
              >
                <Text style={styles.saveBookingBtnText}>
                  {isSubmitting ? 'Saving to Firestore...' : 'Mark Block as BUSY in Firestore'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addBookingHeaderBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBookingHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
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
  toggleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  toggleLabelWrap: {
    flex: 1,
    paddingRight: 12,
  },
  titleWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotGreen: {
    backgroundColor: '#22C55E',
  },
  dotYellow: {
    backgroundColor: '#EAB308',
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  toggleSubText: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  statusBanner: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusBannerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  calendarStripSection: {
    marginBottom: 14,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  stripScroll: {
    gap: 8,
  },
  dayTile: {
    width: 58,
    height: 76,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  dayTileSelected: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  dayTileBusy: {
    borderColor: '#EAB308',
  },
  dayTileName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  dayTileNameSelected: {
    color: '#FFFFFF',
  },
  dayTileNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    marginVertical: 2,
  },
  dayTileNumSelected: {
    color: '#FFFFFF',
  },
  tileStatusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  indBusy: {
    backgroundColor: '#EAB308',
  },
  indFree: {
    backgroundColor: '#22C55E',
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addBlockInlineBtn: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  addBlockInlineText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBlock: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },
  blockCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  blockTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timeBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeBadgeText: {
    color: '#38BDF8',
    fontSize: 11,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOnSite: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
  },
  statusBusy: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
  },
  statusAvailable: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  blockTypeTag: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
  },
  locationNotesText: {
    fontSize: 11,
    color: '#CBD5E1',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  closeIcon: {
    fontSize: 20,
    color: '#94A3B8',
  },
  formScroll: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeChoice: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  typeChoiceActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  typeChoiceText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  typeChoiceTextActive: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  formRow: {
    flexDirection: 'row',
  },
  saveBookingBtn: {
    backgroundColor: '#0284C7',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  saveBookingBtnDisabled: {
    opacity: 0.5,
  },
  saveBookingBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default DiaryScreen;
