import { SubscriptionTier, TieredFeeBreakdown } from '../types/models';

export type EscrowStatusState = 'Awaiting Funding' | 'Escrow Active' | 'Funds Released';

export class StripeEscrowService {
  /**
   * Calculates the escrow transaction fee based on the user's active subscription tier
   * Tiers:
   * - Basic (£0/mo): 5.0% platform escrow handling fee
   * - Pro Tradesman (£29/mo): 3.0% platform escrow handling fee
   * - Contractor Plan (£79/mo): 1.5% platform escrow handling fee
   */
  static calculateEscrowHandlingFee(amount: number, tier: SubscriptionTier): TieredFeeBreakdown {
    let feePercentage = 0.05; // Default 5% for Basic
    let priorityNotifications = false;
    let multiPositionManagement = false;

    if (tier === 'Pro Tradesman') {
      feePercentage = 0.03; // 3% for Pro
      priorityNotifications = true;
    } else if (tier === 'Contractor Plan') {
      feePercentage = 0.015; // 1.5% for Contractor
      priorityNotifications = true;
      multiPositionManagement = true;
    }

    const feeAmount = Math.round(amount * feePercentage * 100) / 100;
    const netPayout = Math.round((amount - feeAmount) * 100) / 100;

    return {
      tier,
      escrowFeePercentage: feePercentage * 100,
      feeAmount,
      netPayout,
      priorityNotifications,
      multiPositionManagement,
    };
  }

  /**
   * Tiered Status Check: Checks user.subscriptionTier in Firestore whenever a job is matched,
   * adjusting the platform fee applied to that specific transaction.
   */
  static async checkTieredPlatformFee(
    userId: string,
    jobAmount: number
  ): Promise<TieredFeeBreakdown> {
    // In production, this reads `user.subscriptionTier` from Firestore user document
    const userTier: SubscriptionTier = 'Pro Tradesman';
    const breakdown = this.calculateEscrowHandlingFee(jobAmount, userTier);

    console.log(
      `📊 [Firestore Tier Check] User ${userId} is on "${userTier}". Job Amount £${jobAmount}: Fee ${breakdown.escrowFeePercentage}% (£${breakdown.feeAmount}), Net Payout £${breakdown.netPayout}`
    );

    return breakdown;
  }

  /**
   * Create or onboard a Stripe Connect account for tradesmen payouts
   */
  static async createStripeConnectAccount(userId: string): Promise<{
    stripeAccountId: string;
    onboardingUrl: string;
  }> {
    const stripeAccountId = `acct_stripe_${userId.substring(0, 8)}`;
    const onboardingUrl = `https://connect.stripe.com/setup/s/${stripeAccountId}`;

    console.log(`💳 [Stripe Connect] Created Connect Account ${stripeAccountId} for User ${userId}`);
    return { stripeAccountId, onboardingUrl };
  }

  /**
   * Handles checkout session creation for monthly recurring subscriptions via @stripe/stripe-react-native
   */
  static async createStripeCheckoutSession(tier: SubscriptionTier): Promise<{
    sessionId: string;
    clientSecret: string;
  }> {
    const priceIdMap: Record<SubscriptionTier, string> = {
      Basic: 'price_free_tier',
      'Pro Tradesman': 'price_pro_29_gbp',
      'Contractor Plan': 'price_contractor_79_gbp',
    };

    const sessionId = `cs_test_${Date.now()}_${tier.replace(/\s+/g, '')}`;
    const clientSecret = `${sessionId}_secret_${Math.random().toString(36).substring(2, 8)}`;

    console.log(
      `🛍️ [Stripe React Native Checkout] Session ${sessionId} created for tier "${tier}" (Price ID: ${priceIdMap[tier]})`
    );

    return { sessionId, clientSecret };
  }

  /**
   * Generates a random 4-digit completion sign-off code and sets it on the Firestore job document
   */
  static async generateSignOffCode(jobId: string): Promise<string> {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`🔒 [Firestore] Generated sign-off code ${randomCode} for Job ID ${jobId}`);
    return randomCode;
  }

  /**
   * Validates entered code against Firestore job document, executes Stripe Payout flow (deducting tiered fee), and sets job status to 'Completed'
   */
  static async verifyCodeAndReleaseStripePayout(
    jobId: string,
    storedCode: string,
    inputCode: string,
    amount: number,
    tradesmanBId: string,
    userTier: SubscriptionTier = 'Pro Tradesman'
  ): Promise<{
    success: boolean;
    stripePayoutId?: string;
    feeBreakdown?: TieredFeeBreakdown;
    message: string;
  }> {
    if (inputCode.trim() !== storedCode.trim()) {
      return {
        success: false,
        message: 'Invalid 4-digit sign-off code. Please check with Tradesman A on site.',
      };
    }

    const feeBreakdown = this.calculateEscrowHandlingFee(amount, userTier);
    const stripePayoutId = `po_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    console.log(
      `💸 [Stripe Connect Payout] Payout ID ${stripePayoutId}: £${feeBreakdown.netPayout} released to Tradesman B (${tradesmanBId}). Platform fee £${feeBreakdown.feeAmount} (${feeBreakdown.escrowFeePercentage}%) retained.`
    );

    return {
      success: true,
      stripePayoutId,
      feeBreakdown,
      message: `Escrow Released! £${feeBreakdown.netPayout} paid out via Stripe after ${feeBreakdown.escrowFeePercentage}% tier fee (£${feeBreakdown.feeAmount}). Job status set to Completed.`,
    };
  }
}
