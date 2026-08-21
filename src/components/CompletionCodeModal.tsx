import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

interface CompletionCodeModalProps {
  visible: boolean;
  onClose: () => void;
  isPoster: boolean; // True for Tradesman A (Job Lead), False for Tradesman B (Worker)
  completionCode: string; // e.g. "8942"
  jobTitle: string;
  escrowAmount: number;
  onVerifyCode: (inputCode: string) => Promise<boolean>;
  onJobSignedOff: () => void;
}

export const CompletionCodeModal: React.FC<CompletionCodeModalProps> = ({
  visible,
  onClose,
  isPoster,
  completionCode,
  jobTitle,
  escrowAmount,
  onVerifyCode,
  onJobSignedOff,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerify = async () => {
    if (inputCode.trim().length !== 4) {
      setErrorMessage('Please enter a valid 4-digit code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const isValid = await onVerifyCode(inputCode.trim());
      if (isValid) {
        Alert.alert(
          '🎉 Job Signed Off & Escrow Released!',
          `£${escrowAmount} has been released from escrow for "${jobTitle}". Please rate your experience with your fellow tradesman.`,
          [
            {
              text: 'Proceed to Mutual Rating',
              onPress: () => {
                onClose();
                onJobSignedOff();
              },
            },
          ]
        );
      } else {
        setErrorMessage('Incorrect 4-digit code. Please check with Tradesman A on site.');
      }
    } catch (error) {
      setErrorMessage('Verification error. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>🔒 Job Sign-Off & Escrow</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.jobSubTitle}>Job: {jobTitle}</Text>
          <Text style={styles.escrowTag}>Escrow Protection Amount: £{escrowAmount}</Text>

          {isPoster ? (
            /* Tradesman A (Job Lead / Poster) View: Displays generated 4-digit code */
            <View style={styles.posterCodeBox}>
              <Text style={styles.infoLabel}>YOUR GENERATED SITE COMPLETION CODE:</Text>
              <View style={styles.codeBadge}>
                <Text style={styles.codeDigits}>{completionCode}</Text>
              </View>
              <Text style={styles.posterInstructions}>
                Show this 4-digit security code to Tradesman B on site once work has been inspected and approved. Entering this code releases the £{escrowAmount} escrow payment.
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
                <Text style={styles.doneBtnText}>Close Window</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Tradesman B (Subcontractor / Worker) View: Input box for 4-digit code */
            <View style={styles.workerInputBox}>
              <Text style={styles.infoLabel}>ENTER 4-DIGIT SIGN-OFF CODE FROM TRADESMAN A:</Text>
              <TextInput
                style={styles.codeInput}
                keyboardType="number-pad"
                maxLength={4}
                placeholder="4-DIGIT CODE"
                placeholderTextColor="#64748B"
                value={inputCode}
                onChangeText={(text) => {
                  setInputCode(text);
                  setErrorMessage('');
                }}
              />

              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

              <TouchableOpacity
                style={[styles.verifyBtn, isVerifying && styles.verifyBtnDisabled]}
                onPress={handleVerify}
                disabled={isVerifying}
              >
                <Text style={styles.verifyBtnText}>
                  {isVerifying ? 'Verifying Code...' : '🔓 Verify & Release Escrow'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 380,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  jobSubTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 4,
  },
  escrowTag: {
    fontSize: 12,
    color: '#4ADE80',
    fontWeight: '800',
    marginBottom: 16,
  },
  posterCodeBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  codeBadge: {
    backgroundColor: '#0F172A',
    borderColor: '#38BDF8',
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 14,
  },
  codeDigits: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FACC15',
    letterSpacing: 8,
  },
  posterInstructions: {
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  doneBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  workerInputBox: {
    alignItems: 'center',
  },
  codeInput: {
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
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  verifyBtn: {
    backgroundColor: '#15803D',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  verifyBtnDisabled: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default CompletionCodeModal;
