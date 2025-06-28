import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';

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
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [firebaseError, setFirebaseError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing Firebase Auth...');
        
        // Initialize Firebase services
        const { initializeFirebase } = await import('../services/firebase');
        const { validateEnvironmentVariables } = await import('../services/firebaseTest');
        
        // Validate environment variables on startup
        validateEnvironmentVariables();
        
        // Initialize Firebase and get auth instance
        const { auth } = await initializeFirebase();
        
        console.log('Firebase Auth initialized, setting up state listener...');
        
        // Set up auth state listener
        unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
          setUser(user);
          setLoading(false);
          setAuthInitialized(true);
          if (user) {
            setIsGuest(false);
          }
        });
        
        console.log('Auth initialization complete');
        
      } catch (error) {
        console.error('Error initializing auth:', error);
        setFirebaseError(error.message);
        setLoading(false);
        setAuthInitialized(true);
        
        // Fallback: allow guest mode if Firebase fails
        console.log('Firebase failed, allowing guest mode only');
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email, password) => {
    try {
      const { getFirebaseAuth } = await import('../services/firebase');
      const auth = await getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const { getFirebaseAuth } = await import('../services/firebase');
      const auth = await getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      setIsGuest(false);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { getFirebaseAuth } = await import('../services/firebase');
      const auth = await getFirebaseAuth();
      await signOut(auth);
      setIsGuest(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setLoading(false);
  };

  const value = {
    user,
    isGuest,
    loading: loading || !authInitialized,
    signIn,
    signUp,
    logout,
    continueAsGuest,
    firebaseError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
