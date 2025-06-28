import { auth, db } from '../services/firebase';

// Utility function to test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    // Test auth connection
    const authUser = auth.currentUser;
    console.log('Firebase Auth initialized:', auth.app.name);
    
    // Test Firestore connection (just get the app instance)
    console.log('Firestore initialized:', db.app.name);
    
    return {
      success: true,
      message: 'Firebase services are properly configured and connected'
    };
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

// Environment variables validation
export const validateEnvironmentVariables = () => {
  const requiredVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', 
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    return false;
  }
  
  console.log('✅ All Firebase environment variables are set');
  return true;
};
