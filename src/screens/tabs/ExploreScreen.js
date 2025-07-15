import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';

const ExploreScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Tanauan City, Batangas');
  const [activeView, setActiveView] = useState('map'); // 'map' or 'list'

  const categories = [
    { name: 'Food & Drinks', emoji: '🍕', count: 15 },
    { name: 'Groceries', emoji: '🛒', count: 8 },
    { name: 'Pharmacy', emoji: '💊', count: 3 },
    { name: 'Clothing', emoji: '👕', count: 12 },
    { name: 'Electronics', emoji: '📱', count: 5 },
    { name: 'Services', emoji: '🔧', count: 7 },
  ];

  const nearbyStores = [
    { name: 'Lola Maria\'s Sari-Sari Store', category: 'Groceries', distance: '0.1 km', rating: 4.8, location: 'Tanauan City' },
    { name: 'Barangay Fresh Market', category: 'Food & Drinks', distance: '0.3 km', rating: 4.6, location: 'Tanauan City' },
    { name: 'TechHub Electronics', category: 'Electronics', distance: '0.5 km', rating: 4.9, location: 'Tanauan City' },
    { name: 'Kuya Jun\'s Repair Shop', category: 'Services', distance: '0.7 km', rating: 4.7, location: 'Tanauan City' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stores, products, or services..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#6b7280" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Location Selector */}
        <View style={styles.locationContainer}>
          <TouchableOpacity style={styles.locationSelector}>
            <Ionicons name="location" size={18} color="#2563eb" />
            <Text style={styles.locationText}>{selectedLocation}</Text>
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.locationSubtext}>Tap to change your location</Text>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, activeView === 'map' && styles.toggleButtonActive]}
            onPress={() => setActiveView('map')}
          >
            <Ionicons 
              name="map" 
              size={16} 
              color={activeView === 'map' ? '#ffffff' : '#6b7280'} 
            />
            <Text style={[styles.toggleText, activeView === 'map' && styles.toggleTextActive]}>
              Map View
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.toggleButton, activeView === 'list' && styles.toggleButtonActive]}
            onPress={() => setActiveView('list')}
          >
            <Ionicons 
              name="list" 
              size={16} 
              color={activeView === 'list' ? '#ffffff' : '#6b7280'} 
            />
            <Text style={[styles.toggleText, activeView === 'list' && styles.toggleTextActive]}>
              List View
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map/List Content */}
        {activeView === 'map' ? (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map" size={48} color="#6b7280" />
            <Text style={styles.placeholderTitle}>Interactive Map</Text>
            <Text style={styles.placeholderText}>
              📍 Map integration with react-native-maps coming soon!
            </Text>
            <Text style={styles.featureList}>
              Features to implement:{'\n'}
              • Interactive map view{'\n'}
              • Store location markers{'\n'}
              • GPS navigation{'\n'}
              • Real-time location{'\n'}
              • Cluster markers
            </Text>
          </View>
        ) : (
          <View style={styles.listView}>
            <Text style={styles.sectionTitle}>Nearby Stores</Text>
            {nearbyStores.map((store, index) => (
              <View key={index} style={styles.storeCard}>
                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{store.name}</Text>
                  <Text style={styles.storeCategory}>{store.category}</Text>
                  <View style={styles.storeDetails}>
                    <Text style={styles.storeDistance}>📍 {store.distance}</Text>
                    <Text style={styles.storeRating}>⭐ {store.rating}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Categories */}
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryCard}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} stores</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="location" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Find Nearest</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="time" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Open Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="star" size={24} color="#2563eb" />
            <Text style={styles.actionText}>Top Rated</Text>
          </TouchableOpacity>
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  viewToggle: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#2563eb',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  mapPlaceholder: {
    backgroundColor: '#f9fafb',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  listView: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  storeCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  storeDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  storeDistance: {
    fontSize: 12,
    color: '#6b7280',
  },
  storeRating: {
    fontSize: 12,
    color: '#6b7280',
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  locationContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  locationSubtext: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563eb',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ExploreScreen;
