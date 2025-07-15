import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '../services/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🚀 Initializing authentication...');
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        console.log('🔧 Auth running in demo mode');
        setFirebaseError('Firebase not configured - running in demo mode');
        setLoading(false);
        return;
      }

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          console.log('✅ User authenticated:', firebaseUser.uid);
          
          // Get additional user data from Firestore
          try {
            const db = await getFirebaseDb();
            if (db) {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              const userData = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                emailVerified: firebaseUser.emailVerified,
                ...userDoc.data() // Additional data from Firestore
              };
              setUser(userData);
            } else {
              // Fallback if Firestore isn't available
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                emailVerified: firebaseUser.emailVerified,
              });
            }
            setIsGuest(false);
          } catch (error) {
            console.log('⚠️ Error fetching user data from Firestore:', error);
            // Still set basic user info even if Firestore fails
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            });
            setIsGuest(false);
          }
        } else {
          console.log('👤 No authenticated user');
          setUser(null);
          setIsGuest(false);
        }
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error('🚨 Auth initialization error:', error);
      setFirebaseError(`Authentication error: ${error.message}`);
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔐 Signing in user...');
      
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        // Demo mode - create mock user
        console.log('🔧 Demo login for:', email);
        const mockUser = {
          uid: 'demo-' + Date.now(),
          email: email,
          displayName: email.split('@')[0],
          emailVerified: false
        };
        setUser(mockUser);
        setIsGuest(false);
        setLoading(false);
        return mockUser;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ User signed in successfully:', firebaseUser.uid);
      return firebaseUser;

    } catch (error) {
      console.error('🚨 Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      console.log('📝 Creating new user account...');
      
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        // Demo mode - create mock user
        console.log('🔧 Demo signup for:', email);
        const mockUser = {
          uid: 'demo-' + Date.now(),
          email: email,
          displayName: additionalData.name || email.split('@')[0],
          emailVerified: false,
          ...additionalData
        };
        setUser(mockUser);
        setIsGuest(false);
        setLoading(false);
        return mockUser;
      }

      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      console.log('✅ Firebase user created:', firebaseUser.uid);

      // Update profile with display name (non-blocking)
      if (additionalData.name) {
        updateProfile(firebaseUser, {
          displayName: additionalData.name
        }).catch(error => console.log('⚠️ Profile update failed:', error));
      }

      // Save additional user data to Firestore (non-blocking)
      const db = await getFirebaseDb();
      if (db) {
        const userDocData = {
          email: firebaseUser.email,
          displayName: additionalData.name || firebaseUser.displayName,
          userType: additionalData.userType || 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          profileCompleted: false,
          storeCreated: false,
          ...additionalData
        };

        setDoc(doc(db, 'users', firebaseUser.uid), userDocData)
          .then(() => console.log('✅ User profile saved to Firestore'))
          .catch(error => console.log('⚠️ Error saving user profile to Firestore:', error));
      }

      return firebaseUser;

    } catch (error) {
      console.error('🚨 Registration error:', error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Signing out user...');
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        // Demo mode
        console.log('🔧 Demo logout');
        setUser(null);
        setIsGuest(false);
        return;
      }

      await signOut(auth);
      setUser(null);
      setIsGuest(false);
      console.log('✅ User signed out successfully');

    } catch (error) {
      console.error('🚨 Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      console.log('📧 Sending password reset email...');
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        // Demo mode
        console.log('🔧 Demo password reset for:', email);
        return { success: true, message: 'Password reset email sent (demo mode)' };
      }

      await sendPasswordResetEmail(auth, email);
      console.log('✅ Password reset email sent');
      return { success: true, message: 'Password reset email sent successfully' };

    } catch (error) {
      console.error('🚨 Password reset error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      console.log('📝 Updating user profile...');
      
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      const auth = await getFirebaseAuth();
      const db = await getFirebaseDb();
      
      if (!auth || !db) {
        console.log('🔧 Demo mode: Profile update simulated');
        setUser(prev => ({ ...prev, ...updates }));
        return { success: true, message: 'Profile updated (demo mode)' };
      }

      // Update Firebase Auth profile if needed
      if (updates.displayName || updates.photoURL) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName || user.displayName,
          photoURL: updates.photoURL || user.photoURL
        });
      }

      // Update Firestore document
      const userDocData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'users', user.uid), userDocData);

      // Update local user state
      setUser(prev => ({ ...prev, ...updates }));
      
      console.log('✅ User profile updated successfully');
      return { success: true, message: 'Profile updated successfully' };

    } catch (error) {
      console.error('🚨 Profile update error:', error);
      throw error;
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    setLoading(false);
    console.log('👤 Continuing as guest');
  };

  const value = {
    user,
    isGuest,
    loading,
    firebaseError,
    signIn,
    signUp,
    logout,
    resetPassword,
    updateUserProfile,
    continueAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
