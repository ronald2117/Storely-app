// Firebase connection test utility
import { initializeFirebase } from './firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    const { auth, db, app } = await initializeFirebase();
    
    console.log('✅ Firebase app initialized:', !!app);
    console.log('✅ Firebase auth initialized:', !!auth);
    console.log('✅ Firebase firestore initialized:', !!db);
    
    // Test basic auth state (no sign-in required)
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser ? 'Signed in' : 'Not signed in');
    
    return {
      success: true,
      app: !!app,
      auth: !!auth,
      db: !!db,
      currentUser: currentUser
    };
    
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test environment variables
export const testEnvironmentVariables = () => {
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missing = [];
  const present = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  console.log('✅ Environment variables present:', present.length);
  console.log('❌ Environment variables missing:', missing.length);
  
  if (missing.length > 0) {
    console.error('Missing environment variables:', missing);
  }
  
  return {
    success: missing.length === 0,
    present,
    missing
  };
};
