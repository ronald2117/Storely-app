import React, { useState } from 'react';
import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContextSimple';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signIn, continueAsGuest } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigation.navigate('HomeTabs');
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
      }
      
      Alert.alert('Login Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    Alert.alert('Coming Soon', 'Google Sign-In will be available soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Welcome Back
            </Text>
            <Text style={styles.subtitle}>
              Sign in to access your store and sell your products
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
            />

            <Button
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              size="large"
              disabled={loading}
              style={[styles.fullWidth, styles.buttonSpacing]}
            />

            {/* Forgot Password */}
            <Button
              title="Forgot Password?"
              onPress={() => Alert.alert('Coming Soon', 'Password reset will be available soon!')}
              variant="ghost"
              size="medium"
              style={styles.fullWidth}
            />
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <Button
            title="Continue with Google"
            onPress={handleGoogleSignIn}
            variant="outline"
            size="large"
            style={[styles.fullWidth, styles.socialButton]}
          />

          {/* Register Link */}
          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Don't have an account?{' '}
            </Text>
            <Button
              title="Sign Up"
              onPress={() => navigation.navigate('Register')}
              variant="ghost"
              size="medium"
              style={styles.linkButton}
            />
          </View>

          {/* Guest Mode Link */}
          <View style={styles.guestContainer}>
            <Button
              title="Continue as Guest"
              onPress={() => {
                continueAsGuest();
                navigation.navigate('HomeTabs');
              }}
              variant="ghost"
              size="medium"
              style={styles.fullWidth}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 16,
  },
  form: {
    marginBottom: 32,
  },
  fullWidth: {
    width: '100%',
  },
  buttonSpacing: {
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#9ca3af',
  },
  socialButton: {
    marginBottom: 24,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    color: '#6b7280',
    fontSize: 16,
  },
  linkButton: {
    padding: 0,
  },
  guestContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
});

export default LoginScreen;
