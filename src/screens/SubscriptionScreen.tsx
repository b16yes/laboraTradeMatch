import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { SubscriptionTier } from '../types/models';
import { StripeEscrowService } from '../services/stripeEscrowService';

interface SubscriptionScreenProps {
  currentTier?: SubscriptionTier;
  onSelectTierSuccess?: (tier: SubscriptionTier) => void;
}

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({
  currentTier = 'Pro Tradesman',
  onSelectTierSuccess,
}) => {
  const [activeTier, setActiveTier] = useState<SubscriptionTier>(currentTier);
  const [calcAmount, setCalcAmount] = useState<string>('1000');
  const [isProcessingStripe, setIsProcessingStripe] = useState<boolean>(false);

  const sampleAmount = parseFloat(calcAmount) || 1000;
  const basicFee = StripeEscrowService.calculateEscrowHandlingFee(sampleAmount, 'Basic');
  const proFee = StripeEscrowService.calculateEscrowHandlingFee(sampleAmount, 'Pro Tradesman');
  const contractorFee = StripeEscrowService.calculateEscrowHandlingFee(sampleAmount, 'Contractor Plan');

  const handleSubscribeStripe = async (tier: SubscriptionTier) => {
    if (tier === activeTier) {
      Alert.alert('Current Plan', `You are already subscribed to the ${tier}.`);
      return;
    }

    setIsProcessingStripe(true);

    try {
      // Execute Stripe React Native Checkout Session
      const session = await StripeEscrowService.createStripeCheckoutSession(tier);

      Alert.alert(
        '💳 Stripe Checkout Session Created',
        `Stripe session initialized (${session.sessionId}). Upgrading to ${tier}...`,
        [
          {
            text: 'Complete Subscription',
            onPress: () => {
              setActiveTier(tier);
              if (onSelectTierSuccess) onSelectTierSuccess(tier);
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to initialize Stripe checkout session.');
    } finally {
      setIsProcessingStripe(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Plans & Fees</Text>
        <Text style={styles.headerSubtitle}>Upgrade your tier to lower escrow fees & get priority jobs</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tier Cards Container */}
        <View style={styles.tiersContainer}>
          {/* Tier 1: Basic */}
          <View style={[styles.tierCard, activeTier === 'Basic' && styles.tierCardActive]}>
            <View style={styles.tierHeader}>
              <View>
                <Text style={styles.tierName}>Basic</Text>
                <Text style={styles.tierSub}>For occasional job seekers</Text>
              </View>
              <Text style={styles.tierPrice}>£0<Text style={styles.perMo}>/mo</Text></Text>
            </View>

            <View style={styles.feeHighlightBadge}>
              <Text style={styles.feeHighlightText}>5.0% Escrow Handling Fee</Text>
            </View>

            <View style={styles.featureList}>
              <Text style={styles.featureItem}>✓ Standard connection fees apply</Text>
              <Text style={styles.featureItem}>✓ Standard GPS Job Radar access</Text>
              <Text style={styles.featureItem}>✓ Direct peer-to-peer messaging</Text>
            </View>

            <TouchableOpacity
              style={[styles.planBtn, activeTier === 'Basic' ? styles.planBtnCurrent : styles.planBtnSecondary]}
              onPress={() => handleSubscribeStripe('Basic')}
              disabled={isProcessingStripe}
            >
              <Text style={styles.planBtnText}>
                {activeTier === 'Basic' ? 'Current Plan ✓' : 'Select Basic'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tier 2: Pro Tradesman */}
          <View style={[styles.tierCard, styles.tierCardPro, activeTier === 'Pro Tradesman' && styles.tierCardActive]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>MOST POPULAR FOR TRADESMEN</Text>
            </View>

            <View style={styles.tierHeader}>
              <View>
                <Text style={styles.tierName}>Pro Tradesman</Text>
                <Text style={styles.tierSub}>For active daily subcontractors</Text>
              </View>
              <Text style={styles.tierPrice}>£29<Text style={styles.perMo}>/mo</Text></Text>
            </View>

            <View style={[styles.feeHighlightBadge, styles.feeHighlightPro]}>
              <Text style={styles.feeHighlightProText}>3.0% Escrow Fee (Save 40%)</Text>
            </View>

            <View style={styles.featureList}>
              <Text style={styles.featureItem}>✓ 3.0% Reduced Escrow Handling Fee</Text>
              <Text style={styles.featureItem}>⚡ Priority Emergency Job Notifications</Text>
              <Text style={styles.featureItem}>⭐ Verified PRO Badge on Profile & Radar</Text>
              <Text style={styles.featureItem}>✓ Automated Digital Diary Sync</Text>
            </View>

            <TouchableOpacity
              style={[styles.planBtn, styles.planBtnPrimary]}
              onPress={() => handleSubscribeStripe('Pro Tradesman')}
              disabled={isProcessingStripe}
            >
              <Text style={styles.planBtnText}>
                {activeTier === 'Pro Tradesman' ? 'Current Active Plan ✓' : 'Upgrade via Stripe (£29/mo)'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tier 3: Contractor Plan */}
          <View style={[styles.tierCard, styles.tierCardContractor, activeTier === 'Contractor Plan' && styles.tierCardActive]}>
            <View style={styles.tierHeader}>
              <View>
                <Text style={styles.tierName}>Contractor Plan</Text>
                <Text style={styles.tierSub}>For lead contractors & multi-site teams</Text>
              </View>
              <Text style={styles.tierPrice}>£79<Text style={styles.perMo}>/mo</Text></Text>
            </View>

            <View style={[styles.feeHighlightBadge, styles.feeHighlightGold]}>
              <Text style={styles.feeHighlightGoldText}>1.5% Escrow Fee (Save 70%)</Text>
            </View>

            <View style={styles.featureList}>
              <Text style={styles.featureItem}>👑 Lowest 1.5% Escrow Handling Fee</Text>
              <Text style={styles.featureItem}>🏗️ Multi-Position Job Management Features</Text>
              <Text style={styles.featureItem}>⚡ VIP Instant Matching & Priority Alerts</Text>
              <Text style={styles.featureItem}>📊 Detailed Site Expense & Payout Analytics</Text>
            </View>

            <TouchableOpacity
              style={[styles.planBtn, styles.planBtnGold]}
              onPress={() => handleSubscribeStripe('Contractor Plan')}
              disabled={isProcessingStripe}
            >
              <Text style={styles.planBtnGoldText}>
                {activeTier === 'Contractor Plan' ? 'Current Active Plan ✓' : 'Subscribe Contractor (£79/mo)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tiered Fee Comparison Calculator Widget */}
        <View style={styles.calculatorCard}>
          <Text style={styles.calcHeader}>🧮 Interactive Platform Fee Calculator</Text>
          <Text style={styles.calcSub}>
            Compare platform escrow handling fees across subscription tiers for any job payout amount:
          </Text>

          <View style={styles.inputRow}>
            <Text style={styles.inputPrefix}>Payout Amount (£):</Text>
            <TextInput
              style={styles.calcInput}
              keyboardType="numeric"
              value={calcAmount}
              onChangeText={setCalcAmount}
            />
          </View>

          <View style={styles.compareGrid}>
            <View style={styles.compareItem}>
              <Text style={styles.compareTier}>Basic (5%)</Text>
              <Text style={styles.compareFee}>£{basicFee.feeAmount}</Text>
              <Text style={styles.compareNet}>Net: £{basicFee.netPayout}</Text>
            </View>

            <View style={[styles.compareItem, styles.comparePro]}>
              <Text style={styles.compareTier}>Pro (3%)</Text>
              <Text style={styles.compareFeePro}>£{proFee.feeAmount}</Text>
              <Text style={styles.compareNet}>Net: £{proFee.netPayout}</Text>
              <Text style={styles.saveText}>Save £{Math.round((basicFee.feeAmount - proFee.feeAmount) * 100) / 100}</Text>
            </View>

            <View style={[styles.compareItem, styles.compareGold]}>
              <Text style={styles.compareTier}>Contractor (1.5%)</Text>
              <Text style={styles.compareFeeGold}>£{contractorFee.feeAmount}</Text>
              <Text style={styles.compareNet}>Net: £{contractorFee.netPayout}</Text>
              <Text style={styles.saveTextGold}>Save £{Math.round((basicFee.feeAmount - contractorFee.feeAmount) * 100) / 100}</Text>
            </View>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  tiersContainer: {
    gap: 16,
    marginBottom: 20,
  },
  tierCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    position: 'relative',
  },
  tierCardPro: {
    borderColor: '#0284C7',
    borderWidth: 2,
  },
  tierCardContractor: {
    borderColor: '#EAB308',
    borderWidth: 2,
  },
  tierCardActive: {
    backgroundColor: '#162238',
  },
  popularBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  tierSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  tierPrice: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  perMo: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  feeHighlightBadge: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
  },
  feeHighlightText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '800',
  },
  feeHighlightPro: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: '#38BDF8',
  },
  feeHighlightProText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '900',
  },
  feeHighlightGold: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#EAB308',
  },
  feeHighlightGoldText: {
    color: '#FACC15',
    fontSize: 12,
    fontWeight: '900',
  },
  featureList: {
    gap: 8,
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  planBtn: {
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planBtnSecondary: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
  },
  planBtnPrimary: {
    backgroundColor: '#0284C7',
  },
  planBtnGold: {
    backgroundColor: '#EAB308',
  },
  planBtnCurrent: {
    backgroundColor: '#15803D',
  },
  planBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  planBtnGoldText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
  },
  calculatorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  calcHeader: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  calcSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  inputPrefix: {
    fontSize: 13,
    fontWeight: '800',
    color: '#38BDF8',
    marginRight: 10,
  },
  calcInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  compareGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  compareItem: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  comparePro: {
    borderColor: '#0284C7',
    backgroundColor: 'rgba(2, 132, 199, 0.1)',
  },
  compareGold: {
    borderColor: '#EAB308',
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  compareTier: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 2,
  },
  compareFee: {
    fontSize: 16,
    fontWeight: '900',
    color: '#EF4444',
  },
  compareFeePro: {
    fontSize: 16,
    fontWeight: '900',
    color: '#38BDF8',
  },
  compareFeeGold: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FACC15',
  },
  compareNet: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 2,
  },
  saveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4ADE80',
    marginTop: 4,
  },
  saveTextGold: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FACC15',
    marginTop: 4,
  },
});

export default SubscriptionScreen;
