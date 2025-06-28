import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';

const FavoritesScreen = ({ navigation }) => {
  const { isGuest } = useAuth();

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.title}>Favorites ❤️</Text>
          <Text style={styles.guestText}>
            Sign in to save your favorite stores and products
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
        <Text style={styles.title}>Your Favorites ❤️</Text>
        <Text style={styles.subtitle}>
          Your saved stores and products
        </Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            💝 No favorites yet!
          </Text>
          <Text style={styles.featureList}>
            Features to implement:{'\n'}
            • Save favorite stores{'\n'}
            • Bookmark products{'\n'}
            • Wishlist management{'\n'}
            • Price drop alerts{'\n'}
            • Quick reorder
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

export default FavoritesScreen;
