import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Food & Drinks', emoji: '🍕' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Pharmacy', emoji: '💊' },
    { name: 'Clothing', emoji: '👕' },
    { name: 'Electronics', emoji: '📱' },
    { name: 'Services', emoji: '🔧' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Search & Discover 🔍</Text>
        <Text style={styles.subtitle}>
          Find products and services in your area
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for products, stores, or services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            title="Search"
            onPress={() => console.log('Search:', searchQuery)}
            variant="primary"
            size="small"
            style={styles.searchButton}
          />
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Popular Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
          ))}
        </View>

        {/* Placeholder */}
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            🚀 Search functionality coming soon!
          </Text>
          <Text style={styles.featureList}>
            Features to implement:{'\n'}
            • Product search{'\n'}
            • Store directory{'\n'}
            • Category filtering{'\n'}
            • Location-based results{'\n'}
            • Price comparison
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '30%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
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

export default SearchScreen;
