import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  console.error('Please check your .env file and ensure all EXPO_PUBLIC_FIREBASE_* variables are set');
  throw new Error('Firebase configuration is incomplete. Please check your .env file.');
}

// Initialize Firebase app
let app;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized');
  } else {
    app = getApps()[0];
    console.log('✅ Using existing Firebase app');
  }
} catch (error) {
  console.error('❌ Firebase app initialization failed:', error);
  throw error;
}

// Initialize services with basic auth (no AsyncStorage persistence for now)
let auth = null;
let db = null;

const initializeServices = () => {
  try {
    if (!auth) {
      auth = getAuth(app);
      console.log('✅ Firebase Auth initialized (basic mode)');
    }
    
    if (!db) {
      db = getFirestore(app);
      console.log('✅ Firestore initialized');
    }
    
    return { auth, db, app };
  } catch (error) {
    console.error('❌ Firebase services initialization failed:', error);
    throw error;
  }
};

// Initialize Firebase services
export const initializeFirebase = async () => {
  try {
    // Add a small delay to ensure React Native is ready
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const services = initializeServices();
    console.log('✅ Firebase fully initialized');
    return services;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

// Lazy getters that ensure Firebase is initialized
export const getFirebaseAuth = async () => {
  if (auth) {
    return auth;
  }
  
  const services = await initializeFirebase();
  return services.auth;
};

export const getFirebaseDb = async () => {
  if (db) {
    return db;
  }
  
  const services = await initializeFirebase();
  return services.db;
};

// Export default instances (may be null until initialized)
export { auth, db };
export default app;
