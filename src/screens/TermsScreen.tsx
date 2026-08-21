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

interface TermsScreenProps {
  onBack?: () => void;
}

export const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
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
          <Text style={styles.headerTitle}>Terms of Service</Text>
          <Text style={styles.headerSubtitle}>Trade Match • Core Marketplace Clauses</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Effective Date: August 20, 2026 • Host URL: tradematch.app/terms</Text>

        {/* Clause 1 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>1. Nature of the Platform & Independent Status</Text>
          <Text style={styles.clauseText}>
            Trade Match is a technology platform connecting independent trade professionals ("Tradesmen"). Trade Match is not a general contractor, employer, or employment agency. Users contract directly with one another. Nothing in this Agreement creates an employment, partnership, or joint venture relationship between Trade Match and any user. Tradesmen are solely responsible for their own taxes, insurance, licensing, and compliance with local regulatory laws.
          </Text>
        </View>

        {/* Clause 2 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>2. The Escrow & Completion Code System</Text>
          <Text style={styles.clauseText}>
            When Tradesman A elects to use Trade Match's optional escrow management service, funds are collected via our third-party payment processor (Stripe Connect) and held securely in suspense. Release of funds is strictly contingent upon the mutual entry of the unique 4-digit completion code generated within the app. Entering the code constitutes final acceptance of the work by Tradesman A. Trade Match bears no liability for funds once successfully released via verified code entry or resolved through our dispute process.
          </Text>
        </View>

        {/* Clause 3 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>3. Dispute Resolution & Photo Evidence</Text>
          <Text style={styles.clauseText}>
            In the event of a dispute regarding job completion, quality, or a "no-show," either party may raise a formal dispute via the app within 48 hours, submitting supporting photographic evidence. During a dispute, escrow funds will remain frozen. Trade Match reserves the right to review evidence and make a final administrative determination on fund distribution. Users agree to accept Trade Match's final resolution on disputed escrow allocations.
          </Text>
        </View>

        {/* Clause 4 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>4. Mandatory Mutual Vetting & Rating Penalties</Text>
          <Text style={styles.clauseText}>
            To maintain platform integrity, users are required to submit ratings and reference comments immediately following job completion. Failure to show up for an accepted job ("No-Show") will result in an immediate strike against the user's profile score, which may lead to temporary suspension or permanent termination of platform access and forfeiture of subscription benefits.
          </Text>
        </View>

        {/* Clause 5 */}
        <View style={styles.clauseCard}>
          <Text style={styles.clauseNumber}>5. Subscription Tiers & Referral Lottery Rules</Text>
          <Text style={styles.clauseText}>
            Monthly subscriptions billed via tradematch.app renew automatically unless canceled prior to the billing cycle. Referral lottery entries are earned strictly through verified app sign-ups via unique QR code links. Lottery draws are regulated by platform milestones, and Trade Match reserves the right to alter or conclude promotional draws at any time.
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

export default TermsScreen;
