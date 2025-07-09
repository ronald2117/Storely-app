import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';

const MyStoreScreen = ({ navigation }) => {
  const { isGuest, user } = useAuth();
  const [hasStore, setHasStore] = useState(false); // TODO: Check if user already has a store

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

  // If user doesn't have a store yet, show store creation interface
  if (!hasStore) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Start Your Store 🏪</Text>
          <Text style={styles.subtitle}>
            Join the local marketplace and start selling to your barangay
          </Text>
          
          {/* Benefits Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why create a store?</Text>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="people" size={20} color="#2563eb" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Reach Local Customers</Text>
                <Text style={styles.benefitDescription}>
                  Connect with neighbors and customers in your area
                </Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="phone-portrait" size={20} color="#2563eb" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Easy Management</Text>
                <Text style={styles.benefitDescription}>
                  Manage inventory and product visibility from your phone
                </Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="eye" size={20} color="#2563eb" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Control Visibility</Text>
                <Text style={styles.benefitDescription}>
                  Choose which products are public or keep them private
                </Text>
              </View>
            </View>
            
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Ionicons name="analytics" size={20} color="#2563eb" />
              </View>
              <View style={styles.benefitText}>
                <Text style={styles.benefitTitle}>Track Your Inventory</Text>
                <Text style={styles.benefitDescription}>
                  Get insights on product availability and customer interest
                </Text>
              </View>
            </View>
          </View>

          {/* Getting Started Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Started</Text>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Create Store Profile</Text>
                <Text style={styles.stepDescription}>
                  Add your store name, description, and contact details
                </Text>
              </View>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Add Products</Text>
                <Text style={styles.stepDescription}>
                  Upload photos and details of items you want to sell
                </Text>
              </View>
            </View>
            
            <View style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Manage Inventory</Text>
                <Text style={styles.stepDescription}>
                  Set availability and visibility for your products
                </Text>
              </View>
            </View>
          </View>

          {/* Create Store Button */}
          <View style={styles.createStoreContainer}>
            <Button
              title="Create My Store"
              onPress={() => navigation.navigate('CreateStore')}
              variant="primary"
              style={styles.createStoreButton}
            />
            <Text style={styles.freeText}>Free to start • No setup fees</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // If user has a store, show store management interface
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
        
        {/* Store Management Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Products')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="cube" size={24} color="#2563eb" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Products</Text>
              <Text style={styles.actionDescription}>
                Add, edit, and organize your inventory
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="eye" size={24} color="#16a34a" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Product Visibility</Text>
              <Text style={styles.actionDescription}>
                Manage which products are public or private
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <Ionicons name="analytics" size={24} color="#dc2626" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Inventory Reports</Text>
              <Text style={styles.actionDescription}>
                View your product statistics and availability
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            � Product Management Hub
          </Text>
          <Text style={styles.featureList}>
            Available features:{'\n'}
            • Add and edit products{'\n'}
            • Set availability status{'\n'}
            • Control public/private visibility{'\n'}
            • Search and filter products{'\n'}
            • Quick product actions
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
  // New styles for store creation flow
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  createStoreContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  createStoreButton: {
    width: '100%',
    marginBottom: 12,
  },
  freeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default MyStoreScreen;
