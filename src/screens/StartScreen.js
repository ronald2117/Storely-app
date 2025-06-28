import React from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const StartScreen = ({ navigation }) => {
  const { continueAsGuest } = useAuth();

  const handleGuestMode = () => {
    continueAsGuest();
    navigation.navigate('HomeTabs');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header Section */}
      <View style={styles.content}>
        {/* Logo/Icon */}
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>S</Text>
          </View>
          
          {/* App Name and Tagline */}
          <Text style={styles.appName}>
            Storely
          </Text>
          <Text style={styles.tagline}>
            Your barangay marketplace{'\n'}Buy local, sell local
          </Text>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresSection}>
          <View style={styles.featureRow}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>
              Discover local stores and products
            </Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>
              Set up your own store
            </Text>
          </View>
          <View style={styles.featureRow}>
            <View style={styles.bullet} />
            <Text style={styles.featureText}>
              Offline POS system
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonSection}>
          <Button
            title="Continue as Guest"
            onPress={handleGuestMode}
            variant="primary"
            size="large"
            style={styles.fullWidth}
          />
          
          <Button
            title="Log In"
            onPress={handleLogin}
            variant="outline"
            size="large"
            style={[styles.fullWidth, styles.buttonSpacing]}
          />
          
          <Button
            title="Create Account"
            onPress={handleRegister}
            variant="ghost"
            size="large"
            style={[styles.fullWidth, styles.buttonSpacing]}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made for Filipino barangay communities 🇵🇭
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 96,
    height: 96,
    backgroundColor: '#2563eb',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bullet: {
    width: 8,
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    marginRight: 12,
  },
  featureText: {
    color: '#374151',
    fontSize: 16,
  },
  buttonSection: {
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  buttonSpacing: {
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  footerText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
});

export default StartScreen;
