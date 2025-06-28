import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';

const MyStoreScreen = ({ navigation }) => {
  const { isGuest, user } = useAuth();

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.title}>My Store 🏪</Text>
          <Text style={styles.guestText}>
            Create an account to set up your own store and start selling in your barangay
          </Text>
          <Button
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
            variant="primary"
            style={styles.guestButton}
          />
          <Button
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
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
        <Text style={styles.title}>My Store 🏪</Text>
        <Text style={styles.subtitle}>
          Manage your business and products
        </Text>
        
        {/* Store Setup Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Started</Text>
          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>📝 Set up store profile</Text>
            <Text style={styles.optionDescription}>
              Add your store name, description, and contact info
            </Text>
          </View>
          
          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>📦 Add products</Text>
            <Text style={styles.optionDescription}>
              Upload photos and details of items you want to sell
            </Text>
          </View>
          
          <View style={styles.optionCard}>
            <Text style={styles.optionTitle}>💰 Set up payments</Text>
            <Text style={styles.optionDescription}>
              Configure payment methods and pricing
            </Text>
          </View>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            🚀 Store management coming soon!
          </Text>
          <Text style={styles.featureList}>
            Features to implement:{'\n'}
            • Store profile setup{'\n'}
            • Product management{'\n'}
            • Inventory tracking{'\n'}
            • Order management{'\n'}
            • Sales analytics
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
  optionCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  optionDescription: {
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

export default MyStoreScreen;
