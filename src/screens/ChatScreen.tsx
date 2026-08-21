import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { ChatBubble } from '../components/messages/ChatBubble';
import { ChatInput } from '../components/messages/ChatInput';
import { ChatMessage } from '../types/models';
import { StripeEscrowService, EscrowStatusState } from '../services/stripeEscrowService';
import ReviewScreen from './ReviewScreen';

interface ChatScreenProps {
  jobId?: string;
  onNavigateToReview?: () => void;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    conversationId: 'conv-job-101',
    senderId: 'tradesman-b-202',
    senderName: 'Dave Higgins',
    receiverId: 'tradesman_alpha_101',
    receiverName: 'Marcus Vance',
    text: 'Morning Marcus! Saw your radar posting for 2 electricians on the Soho 3-phase rewire job.',
    timestamp: '09:15 AM',
    jobId: 'job-101',
    jobTitle: 'Commercial 3-Phase Rewire',
    isRead: true,
  },
  {
    id: 'm-2',
    conversationId: 'conv-job-101',
    senderId: 'tradesman_alpha_101',
    senderName: 'Marcus Vance',
    receiverId: 'tradesman-b-202',
    receiverName: 'Dave Higgins',
    text: 'Hey Dave! Yes, day rate is £425. Escrow has been funded.',
    timestamp: '09:18 AM',
    jobId: 'job-101',
    jobTitle: 'Commercial 3-Phase Rewire',
    isRead: true,
  },
];

export const ChatScreen: React.FC<ChatScreenProps> = ({
  jobId = 'job-101',
  onNavigateToReview,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [escrowStatus, setEscrowStatus] = useState<EscrowStatusState>('Escrow Active');
  const [escrowAmount] = useState<number>(850);
  const [storedCompletionCode, setStoredCompletionCode] = useState<string>('');
  
  // User perspective toggle (Tradesman A = Lead/Poster, Tradesman B = Worker)
  const [isTradesmanA, setIsTradesmanA] = useState<boolean>(true);

  // Modals & Navigation state
  const [codeModalVisible, setCodeModalVisible] = useState<boolean>(false);
  const [showReviewScreen, setShowReviewScreen] = useState<boolean>(false);
  const [workerInputCode, setWorkerInputCode] = useState<string>('');
  const [isProcessingPayout, setIsProcessingPayout] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const currentUserId = isTradesmanA ? 'tradesman_alpha_101' : 'tradesman-b-202';

  // Handle Tradesman A: Generate Sign-Off Code Action
  const handleGenerateCode = async () => {
    const code = await StripeEscrowService.generateSignOffCode(jobId);
    setStoredCompletionCode(code);
    setCodeModalVisible(true);
  };

  // Handle Tradesman B: Submit 4-digit code & trigger Stripe Payout Flow
  const handleSubmitCodeAndVerify = async () => {
    if (workerInputCode.trim().length !== 4) {
      setErrorMsg('Please enter a 4-digit code.');
      return;
    }

    setIsProcessingPayout(true);
    setErrorMsg('');

    try {
      const result = await StripeEscrowService.verifyCodeAndReleaseStripePayout(
        jobId,
        storedCompletionCode || '8942', // Fallback for instant test mode if code generated
        workerInputCode.trim(),
        escrowAmount,
        'tradesman-b-202'
      );

      if (result.success) {
        setEscrowStatus('Funds Released');
        setCodeModalVisible(false);
        setWorkerInputCode('');

        Alert.alert(
          '💸 Escrow Released!',
          result.message,
          [
            {
              text: 'Proceed to Mutual Vetting',
              onPress: () => {
                if (onNavigateToReview) {
                  onNavigateToReview();
                } else {
                  setShowReviewScreen(true);
                }
              },
            },
          ]
        );
      } else {
        setErrorMsg(result.message);
      }
    } catch (err) {
      setErrorMsg('Payout execution error. Try again.');
    } finally {
      setIsProcessingPayout(false);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: `conv-${jobId}`,
      senderId: currentUserId,
      senderName: isTradesmanA ? 'Marcus Vance' : 'Dave Higgins',
      receiverId: isTradesmanA ? 'tradesman-b-202' : 'tradesman_alpha_101',
      receiverName: isTradesmanA ? 'Dave Higgins' : 'Marcus Vance',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      jobId,
      isRead: true,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  if (showReviewScreen) {
    return (
      <ReviewScreen
        peerName={isTradesmanA ? 'Dave Higgins' : 'Marcus Vance'}
        peerRole={isTradesmanA ? 'Subcontractor / Electrician' : 'Lead Contractor'}
        jobTitle="Commercial 3-Phase Rewire"
        tradeContext="Electrician"
        onSubmitSuccess={() => setShowReviewScreen(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' }}
          style={styles.avatar}
        />
        <View style={styles.headerMeta}>
          <Text style={styles.peerName}>Dave Higgins (Electrician)</Text>
          <Text style={styles.jobRefHeader}>📌 Job Session #{jobId}</Text>
        </View>

        {/* Perspective Toggle for Testing both roles */}
        <TouchableOpacity style={styles.roleToggle} onPress={() => setIsTradesmanA(!isTradesmanA)}>
          <Text style={styles.roleToggleText}>{isTradesmanA ? 'Role: Tradesman A' : 'Role: Tradesman B'}</Text>
        </TouchableOpacity>
      </View>

      {/* Escrow Status Indicator Banner Widget */}
      <View style={styles.escrowCard}>
        <View style={styles.escrowTopRow}>
          <Text style={styles.escrowLabel}>ESCROW STATUS:</Text>
          <View
            style={[
              styles.escrowBadge,
              escrowStatus === 'Awaiting Funding'
                ? styles.badgeAwaiting
                : escrowStatus === 'Escrow Active'
                ? styles.badgeActive
                : styles.badgeReleased,
            ]}
          >
            <Text style={styles.escrowBadgeText}>
              {escrowStatus === 'Awaiting Funding'
                ? '🔴 Awaiting Funding'
                : escrowStatus === 'Escrow Active'
                ? '🔵 Escrow Active (£850 Funded)'
                : '🟢 Funds Released (£850 Paid)'}
            </Text>
          </View>
        </View>

        {/* Funding Controls / Action Triggers */}
        {escrowStatus === 'Awaiting Funding' ? (
          <TouchableOpacity style={styles.fundBtn} onPress={() => setEscrowStatus('Escrow Active')}>
            <Text style={styles.fundBtnText}>💳 Fund £850 into Escrow (Tradesman A)</Text>
          </TouchableOpacity>
        ) : escrowStatus === 'Escrow Active' ? (
          <View style={styles.actionRow}>
            {isTradesmanA ? (
              <TouchableOpacity style={styles.generateBtn} onPress={handleGenerateCode}>
                <Text style={styles.generateBtnText}>🔒 Generate Sign-off Code (Tradesman A)</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.inputCodeTriggerBtn} onPress={() => setCodeModalVisible(true)}>
                <Text style={styles.inputCodeTriggerText}>🔑 Enter 4-Digit Code to Release Funds (Tradesman B)</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <TouchableOpacity style={styles.vettingTriggerBtn} onPress={() => setShowReviewScreen(true)}>
            <Text style={styles.vettingTriggerText}>⭐ Complete Mutual Rating & Vetting ➔</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Messages Thread (Gifted Chat style layout) */}
      <KeyboardAvoidingView style={styles.chatContainer} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          renderItem={({ item }) => (
            <ChatBubble message={item} isCurrentUser={item.senderId === currentUserId} />
          )}
        />

        <ChatInput onSend={handleSendMessage} />
      </KeyboardAvoidingView>

      {/* Completion Code Modal */}
      <Modal visible={codeModalVisible} transparent animationType="slide" onRequestClose={() => setCodeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🔒 Site Sign-Off & Escrow</Text>
              <TouchableOpacity onPress={() => setCodeModalVisible(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            {isTradesmanA ? (
              /* Tradesman A: Displays Generated Code stored in Firestore */
              <View style={styles.modalBodyCenter}>
                <Text style={styles.modalInstructionLabel}>
                  4-DIGIT SIGN-OFF CODE STORED IN FIRESTORE:
                </Text>
                <View style={styles.codeDisplayBox}>
                  <Text style={styles.codeDisplayText}>{storedCompletionCode || '8942'}</Text>
                </View>
                <Text style={styles.modalNotice}>
                  Give this 4-digit code to Tradesman B on site after inspecting the work. When Tradesman B inputs this code, Stripe releases the £{escrowAmount} escrow payout automatically.
                </Text>
                <TouchableOpacity style={styles.closeModalBtn} onPress={() => setCodeModalVisible(false)}>
                  <Text style={styles.closeModalBtnText}>Close Window</Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Tradesman B: Inputs 4-Digit Code to verify & trigger Stripe Payout */
              <View style={styles.modalBodyCenter}>
                <Text style={styles.modalInstructionLabel}>
                  ENTER 4-DIGIT CODE FROM TRADESMAN A:
                </Text>
                <TextInput
                  style={styles.codeInputField}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="4-DIGIT PIN"
                  placeholderTextColor="#64748B"
                  value={workerInputCode}
                  onChangeText={(text) => {
                    setWorkerInputCode(text);
                    setErrorMsg('');
                  }}
                />

                {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

                <TouchableOpacity
                  style={[styles.verifyPayoutBtn, isProcessingPayout && styles.verifyPayoutBtnDisabled]}
                  onPress={handleSubmitCodeAndVerify}
                  disabled={isProcessingPayout}
                >
                  <Text style={styles.verifyPayoutBtnText}>
                    {isProcessingPayout ? 'Executing Stripe Payout...' : '💸 Verify & Trigger Stripe Payout'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  headerMeta: {
    flex: 1,
  },
  peerName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  jobRefHeader: {
    fontSize: 11,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '600',
  },
  roleToggle: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleToggleText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  escrowCard: {
    backgroundColor: '#1E293B',
    margin: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#0284C7',
  },
  escrowTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  escrowLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  escrowBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeAwaiting: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  badgeActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  badgeReleased: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  escrowBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  fundBtn: {
    backgroundColor: '#EF4444',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fundBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  actionRow: {
    flexDirection: 'row',
  },
  generateBtn: {
    backgroundColor: '#0284C7',
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  generateBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  inputCodeTriggerBtn: {
    backgroundColor: '#15803D',
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  inputCodeTriggerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  vettingTriggerBtn: {
    backgroundColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: '#EAB308',
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vettingTriggerText: {
    color: '#FACC15',
    fontSize: 13,
    fontWeight: '800',
  },
  chatContainer: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
  modalBodyCenter: {
    alignItems: 'center',
  },
  modalInstructionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
    marginBottom: 10,
    textAlign: 'center',
  },
  codeDisplayBox: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginBottom: 14,
  },
  codeDisplayText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FACC15',
    letterSpacing: 8,
  },
  modalNotice: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
  },
  closeModalBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  codeInputField: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 2,
    borderRadius: 14,
    color: '#FACC15',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 6,
    width: '80%',
    paddingVertical: 8,
    marginBottom: 10,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  verifyPayoutBtn: {
    backgroundColor: '#15803D',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  verifyPayoutBtnDisabled: {
    opacity: 0.5,
  },
  verifyPayoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});

export default ChatScreen;
