import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyMockKeyForTradesmanAppDevelopment123',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'tradesman-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'tradesman-app',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'tradesman-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase init notice: Running with mock development fallback.', error);
}

export { app, auth, db, firebaseConfig };
