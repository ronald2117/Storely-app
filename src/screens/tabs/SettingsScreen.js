import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
  const { user, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent, showChevron = false }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#2563eb" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingRight}>
        {rightComponent}
        {showChevron && <Ionicons name="chevron-forward" size={20} color="#9ca3af" />}
      </View>
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        {user && (
          <SettingSection title="Profile">
            <SettingItem
              icon="person-circle"
              title={user.name || user.email || 'Guest User'}
              subtitle={user.email || 'guest@example.com'}
              onPress={() => {}}
              showChevron
            />
            <SettingItem
              icon="create"
              title="Edit Profile"
              subtitle="Update your personal information"
              onPress={() => {}}
              showChevron
            />
          </SettingSection>
        )}

        {/* App Preferences */}
        <SettingSection title="Preferences">
          <SettingItem
            icon="moon"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={darkMode ? '#ffffff' : '#ffffff'}
              />
            }
          />
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Receive updates about orders and promotions"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={notifications ? '#ffffff' : '#ffffff'}
              />
            }
          />
          <SettingItem
            icon="location"
            title="Location Services"
            subtitle="Allow location access for nearby stores"
            rightComponent={
              <Switch
                value={locationServices}
                onValueChange={setLocationServices}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={locationServices ? '#ffffff' : '#ffffff'}
              />
            }
          />
        </SettingSection>

        {/* Store Management (if user has a store) */}
        <SettingSection title="Store Management">
          <SettingItem
            icon="storefront"
            title="My Store Settings"
            subtitle="Manage your store information and settings"
            onPress={() => {}}
            showChevron
          />
          <SettingItem
            icon="analytics"
            title="Sales Analytics"
            subtitle="View your store performance and insights"
            onPress={() => {}}
            showChevron
          />
          <SettingItem
            icon="card"
            title="Payment Methods"
            subtitle="Manage accepted payment methods"
            onPress={() => {}}
            showChevron
          />
        </SettingSection>

        {/* Support & Legal */}
        <SettingSection title="Support & Legal">
          <SettingItem
            icon="help-circle"
            title="Help & FAQ"
            subtitle="Get answers to common questions"
            onPress={() => {}}
            showChevron
          />
          <SettingItem
            icon="chatbubbles"
            title="Contact Support"
            subtitle="Reach out to our customer service team"
            onPress={() => {}}
            showChevron
          />
          <SettingItem
            icon="document-text"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => {}}
            showChevron
          />
          <SettingItem
            icon="shield-checkmark"
            title="Privacy Policy"
            subtitle="Learn how we protect your data"
            onPress={() => {}}
            showChevron
          />
        </SettingSection>

        {/* App Information */}
        <SettingSection title="About">
          <SettingItem
            icon="information-circle"
            title="App Version"
            subtitle="1.0.0 (Build 1)"
            rightComponent={<Text style={styles.versionText}>Latest</Text>}
          />
          <SettingItem
            icon="star"
            title="Rate Storely"
            subtitle="Help us improve by leaving a review"
            onPress={() => {}}
            showChevron
          />
        </SettingSection>

        {/* Sign Out */}
        {user && (
          <View style={styles.signOutContainer}>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Ionicons name="log-out" size={20} color="#dc2626" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#059669',
    marginRight: 8,
  },
  signOutContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default SettingsScreen;
