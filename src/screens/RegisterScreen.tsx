import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import TermsScreen from './TermsScreen';
import PrivacyScreen from './PrivacyScreen';

interface RegisterScreenProps {
  onRegisterSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegisterSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tradeCategory, setTradeCategory] = useState('Electrician');

  // Mandatory Legal Terms Agreement State
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);

  // Modals for Terms & Privacy
  const [termsModalVisible, setTermsModalVisible] = useState<boolean>(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRegister = () => {
    if (!agreedToTerms) {
      Alert.alert('Agreement Required', 'You must agree to the Terms of Service and Privacy Policy before signing up.');
      return;
    }

    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Missing Fields', 'Please enter your Full Name and Email Address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '🎉 Account Created!',
        `Welcome to Trade Match, ${fullName}! Your account has been registered under ${tradeCategory}.`,
        [
          {
            text: 'Start Using App',
            onPress: () => {
              if (onRegisterSuccess) onRegisterSuccess();
            },
          },
        ]
      );
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>Trade Match</Text>
        <Text style={styles.brandSubtitle}>New Tradesman Account Registration</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Your Verified Profile</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Marcus Vance"
              placeholderTextColor="#64748B"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="email-address"
              placeholder="e.g. marcus@sparkworks.co.uk"
              placeholderTextColor="#64748B"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Mobile Phone Number</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="phone-pad"
              placeholder="+44 7700 900142"
              placeholderTextColor="#64748B"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Primary Trade Specialty</Text>
            <TextInput
              style={styles.textInput}
              value={tradeCategory}
              onChangeText={setTradeCategory}
              placeholder="e.g. Electrician, Plumber, Carpenter"
              placeholderTextColor="#64748B"
            />
          </View>

          {/* Mandatory In-App Terms & Privacy Acceptance Checkbox */}
          <View style={styles.agreementBox}>
            <TouchableOpacity
              style={styles.checkboxTouchable}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              activeOpacity={0.8}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                {agreedToTerms ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
            </TouchableOpacity>

            <View style={styles.agreementTextWrap}>
              <Text style={styles.agreementText}>
                I agree to the Trade Match{' '}
                <Text style={styles.linkText} onPress={() => setTermsModalVisible(true)}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.linkText} onPress={() => setPrivacyModalVisible(true)}>
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </View>

          {/* Registration Submit Button (Disabled until agreedToTerms is true) */}
          <TouchableOpacity
            style={[styles.signupBtn, (!agreedToTerms || isSubmitting) && styles.signupBtnDisabled]}
            onPress={handleRegister}
            disabled={!agreedToTerms || isSubmitting}
            activeOpacity={0.85}
          >
            <Text style={styles.signupBtnText}>
              {isSubmitting ? 'Registering Account...' : 'Complete Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Terms of Service In-App Modal */}
      <Modal visible={termsModalVisible} animationType="slide">
        <TermsScreen onBack={() => setTermsModalVisible(false)} />
      </Modal>

      {/* Privacy Policy In-App Modal */}
      <Modal visible={privacyModalVisible} animationType="slide">
        <PrivacyScreen onBack={() => setPrivacyModalVisible(false)} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#38BDF8',
    marginTop: 2,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38BDF8',
    marginBottom: 6,
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
  agreementBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  checkboxTouchable: {
    marginRight: 10,
    paddingTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#64748B',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  checkboxChecked: {
    backgroundColor: '#0284C7',
    borderColor: '#38BDF8',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  agreementTextWrap: {
    flex: 1,
  },
  agreementText: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  linkText: {
    color: '#38BDF8',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  signupBtn: {
    backgroundColor: '#0284C7',
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  signupBtnDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  signupBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default RegisterScreen;
