import React, { createContext, useContext, useState } from 'react';

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
  const [loading, setLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      // Simulate Firebase auth for testing
      setTimeout(() => {
        setUser({ email, uid: 'test-uid' });
        setIsGuest(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      setLoading(true);
      // Simulate Firebase auth for testing
      setTimeout(() => {
        setUser({ email, uid: 'test-uid-new' });
        setIsGuest(false);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsGuest(false);
    } catch (error) {
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
    loading,
    signIn,
    signUp,
    logout,
    continueAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
