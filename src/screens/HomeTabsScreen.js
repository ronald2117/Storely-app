import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContextSimple';

const HomeTabsScreen = ({ navigation }) => {
  const { user, isGuest, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.navigate('Start');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Welcome to Storely! 🎉
        </Text>
        
        {isGuest ? (
          <View style={styles.center}>
            <Text style={styles.subtitle}>
              You're browsing as a guest. Sign up to unlock all features!
            </Text>
            <Button
              title="Create Account"
              onPress={() => navigation.navigate('Register')}
              variant="primary"
              style={styles.buttonSpacing}
            />
            <Button
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
              variant="outline"
            />
          </View>
        ) : user ? (
          <View style={styles.center}>
            <Text style={styles.subtitle}>
              Logged in as: {user.email}
            </Text>
            <Text style={styles.comingSoon}>
              Tab navigation coming soon:{'\n'}
              Map • Search • Favorites • My Store • Products
            </Text>
            <Button
              title="Sign Out"
              onPress={handleLogout}
              variant="outline"
            />
          </View>
        ) : (
          <Text style={styles.subtitle}>
            Loading...
          </Text>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  center: {
    alignItems: 'center',
  },
  subtitle: {
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  comingSoon: {
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
  },
  buttonSpacing: {
    marginBottom: 16,
  },
});

export default HomeTabsScreen;
