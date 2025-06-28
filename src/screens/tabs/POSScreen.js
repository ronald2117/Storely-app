import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';

const POSScreen = ({ navigation }) => {
  const { isGuest, user } = useAuth();

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.title}>POS System 🧾</Text>
          <Text style={styles.guestText}>
            Sign in to access the offline Point of Sale system for your business
          </Text>
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            variant="primary"
            style={styles.guestButton}
          />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="outline"
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>POS System 🧾</Text>
        <Text style={styles.subtitle}>
          Offline Point of Sale for your business
        </Text>
        
        {/* POS Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📱 Offline Operation</Text>
            <Text style={styles.featureDescription}>
              Works without internet connection using AsyncStorage
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🛒 Product Scanning</Text>
            <Text style={styles.featureDescription}>
              Quick barcode scanning and manual product entry
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>💳 Multiple Payment Methods</Text>
            <Text style={styles.featureDescription}>
              Cash, digital payments, and credit options
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📊 Sales Reports</Text>
            <Text style={styles.featureDescription}>
              Daily, weekly, and monthly sales analytics
            </Text>
          </View>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            💼 POS System coming soon!
          </Text>
          <Text style={styles.featureList}>
            Features to implement:{'\n'}
            • Product catalog{'\n'}
            • Cart management{'\n'}
            • Receipt generation{'\n'}
            • Inventory sync{'\n'}
            • Offline data storage
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  guestText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  guestButton: {
    width: '100%',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  placeholder: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default POSScreen;
