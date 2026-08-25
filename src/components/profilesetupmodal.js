import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, storage, auth } from '../../firebaseConfig'; // Adjust relative path if needed based on your folder depth
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProfileSetupModal({ isOpen, onComplete }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick Image from device library
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !phone || !location || !imageUri) {
      Alert.alert('Error', 'Please fill out all fields and upload your ID verification document.');
      return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // 1. Convert image URI to a Blob for Firebase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();

      // 2. Define storage reference path: users/{uid}/id_verification.jpg
      const storageRef = ref(storage, `users/${user.uid}/id_verification.jpg`);

      // 3. Upload the file
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);

      // 4. Save profile details and KYC status to Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName,
        phone,
        location,
        kycDocumentUrl: downloadUrl,
        kycStatus: 'pending_verification',
        kycSubmittedAt: serverTimestamp(),
        profileComplete: true,
        activeMode: 'subcontractor',
        canPostJobs: false,
        isTradesman: true
      });

      setLoading(false);
      Alert.alert('Success', 'Profile and ID uploaded successfully!');
      if (onComplete) onComplete();
    } catch (error) {
      console.error("KYC Upload Error:", error);
      Alert.alert('Upload Failed', 'Could not upload your verification document. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Complete Your Profile & KYC</Text>
          <Text style={styles.subtitle}>Upload your ID to unlock the Labora marketplace.</Text>

          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name / Trading Name"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone Number"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Location / Service Area"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
            <Text style={styles.imagePickerText}>
              {imageUri ? '✓ ID Image Selected' : 'Upload Government ID'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, loading && styles.disabledButton]} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit & Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContainer: { backgroundColor: '#ffffff', borderRadius: 12, padding: 24, width: '100%', maxWidth: 400, elevation: 5 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#4B5563', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 12, backgroundColor: '#F9FAFB' },
  imagePickerBtn: { borderWidth: 1, borderColor: '#4F46E5', borderStyle: 'dashed', borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 16, backgroundColor: '#EEF2FF' },
  imagePickerText: { color: '#4F46E5', fontWeight: '600' },
  button: { backgroundColor: '#2563EB', borderRadius: 8, padding: 12, alignItems: 'center' },
  disabledButton: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});