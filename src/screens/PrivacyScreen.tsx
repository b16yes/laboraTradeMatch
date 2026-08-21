import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

interface PrivacyScreenProps {
  onBack?: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>← Back</Text>
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.headerTitle}>Privacy Policy</Text>
          <Text style={styles.headerSubtitle}>Trade Match • Data & Geolocation Clauses</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Effective Date: August 20, 2026 • Host URL: tradematch.app/privacy</Text>

        {/* Privacy Clause 1 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>1. Geolocation & Real-Time Tracking Data</Text>
          <Text style={styles.clauseText}>
            To power our real-time GPS job radar, Trade Match collects precise geolocation data from your mobile device. This data is only processed while you have toggled your status to "Available." You may disable location sharing or change availability settings at any time within your profile or device operating system permissions.
          </Text>
        </View>

        {/* Privacy Clause 2 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>2. Diary & Calendar Integration</Text>
          <Text style={styles.clauseText}>
            If you choose to sync your external digital calendar with Trade Match, our app reads schedule blocks solely for the purpose of automating your availability status. We do not store, read, or share personal event descriptions, client names, or private calendar data outside of determining free/busy time slots.
          </Text>
        </View>

        {/* Privacy Clause 3 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>3. Payment & Financial Data (Stripe Compliance)</Text>
          <Text style={styles.clauseText}>
            All credit card processing, payouts, and escrow holdings are handled securely through Stripe Connect. Trade Match does not store raw credit card numbers, bank routing codes, or full financial credentials on our local servers. All financial data is governed by Stripe's privacy standards and PCI-DSS compliance protocols.
          </Text>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  backBtn: {
    marginRight: 14,
    backgroundColor: '#1E293B',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '800',
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
    padding: 16,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 14,
    fontWeight: '600',
  },
  clauseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  clauseNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#38BDF8',
    marginBottom: 8,
  },
  clauseText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
  },
});

export default PrivacyScreen;
