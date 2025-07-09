import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContextSimple';
import Input from '../components/Input';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import locationService from '../services/locationService';

const CreateStoreScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    regions: [],
    provinces: [],
    cities: [],
    barangays: [],
    loadingRegions: true,
    loadingProvinces: false,
    loadingCities: false,
    loadingBarangays: false,
  });
  
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    category: '',
    location: {
      region: '',
      province: '',
      city: '',
      barangay: '',
      streetAddress: '',
      zipCode: '',
    },
    contactNumber: '',
    email: user?.email || '',
    coverImage: null,
    operatingHours: {
      open: '8:00 AM',
      close: '6:00 PM',
      daysOpen: 'Monday to Saturday'
    }
  });

  // Load regions on component mount
  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    try {
      setLocationData(prev => ({ ...prev, loadingRegions: true }));
      const regions = await locationService.getRegions();
      setLocationData(prev => ({ ...prev, regions, loadingRegions: false }));
    } catch (error) {
      console.error('Error loading regions:', error);
      Alert.alert('Error', 'Failed to load regions. Please check your internet connection.');
      setLocationData(prev => ({ ...prev, loadingRegions: false }));
    }
  };

  const loadProvinces = async (regionCode) => {
    try {
      setLocationData(prev => ({ ...prev, loadingProvinces: true, provinces: [], cities: [], barangays: [] }));
      const provinces = await locationService.getProvinces(regionCode);
      setLocationData(prev => ({ ...prev, provinces, loadingProvinces: false }));
    } catch (error) {
      console.error('Error loading provinces:', error);
      Alert.alert('Error', 'Failed to load provinces. Please try again.');
      setLocationData(prev => ({ ...prev, loadingProvinces: false }));
    }
  };

  const loadCities = async (provinceCode) => {
    try {
      setLocationData(prev => ({ ...prev, loadingCities: true, cities: [], barangays: [] }));
      const cities = await locationService.getCities(provinceCode);
      setLocationData(prev => ({ ...prev, cities, loadingCities: false }));
    } catch (error) {
      console.error('Error loading cities:', error);
      Alert.alert('Error', 'Failed to load cities. Please try again.');
      setLocationData(prev => ({ ...prev, loadingCities: false }));
    }
  };

  const loadBarangays = async (cityCode) => {
    try {
      setLocationData(prev => ({ ...prev, loadingBarangays: true, barangays: [] }));
      const barangays = await locationService.getBarangays(cityCode);
      setLocationData(prev => ({ ...prev, barangays, loadingBarangays: false }));
    } catch (error) {
      console.error('Error loading barangays:', error);
      Alert.alert('Error', 'Failed to load barangays. Please try again.');
      setLocationData(prev => ({ ...prev, loadingBarangays: false }));
    }
  };

  const storeCategories = [
    { id: 'sari-sari', name: 'Sari-Sari Store', icon: '🏪' },
    { id: 'food', name: 'Food & Restaurant', icon: '🍕' },
    { id: 'groceries', name: 'Groceries', icon: '🛒' },
    { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'services', name: 'Services', icon: '🔧' },
    { id: 'beauty', name: 'Beauty & Personal Care', icon: '💄' },
    { id: 'hardware', name: 'Hardware', icon: '🔨' },
    { id: 'other', name: 'Other', icon: '🏬' },
  ];

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setStoreData(prev => ({
          ...prev,
          coverImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Helper functions for location selection
  const getProvinceOptions = () => {
    return locationData.provinces;
  };

  const getCityOptions = () => {
    return locationData.cities;
  };

  const getBarangayOptions = () => {
    return locationData.barangays;
  };

  const handleLocationChange = (field, value) => {
    setStoreData(prev => {
      const newLocation = { ...prev.location, [field]: value };
      
      // Clear dependent fields and load new data when parent changes
      if (field === 'region') {
        newLocation.province = '';
        newLocation.city = '';
        newLocation.barangay = '';
        if (value) {
          loadProvinces(value);
        }
      } else if (field === 'province') {
        newLocation.city = '';
        newLocation.barangay = '';
        if (value) {
          loadCities(value);
        }
      } else if (field === 'city') {
        newLocation.barangay = '';
        if (value) {
          loadBarangays(value);
        }
      }
      
      return { ...prev, location: newLocation };
    });
  };

  const handleCreateStore = async () => {
    // Validation
    if (!storeData.name.trim()) {
      Alert.alert('Validation Error', 'Store name is required');
      return;
    }
    if (!storeData.category) {
      Alert.alert('Validation Error', 'Please select a store category');
      return;
    }
    if (!storeData.location.region) {
      Alert.alert('Validation Error', 'Please select a region');
      return;
    }
    if (!storeData.location.province) {
      Alert.alert('Validation Error', 'Please select a province');
      return;
    }
    if (!storeData.location.city) {
      Alert.alert('Validation Error', 'Please select a city');
      return;
    }
    if (!storeData.location.barangay) {
      Alert.alert('Validation Error', 'Please select a barangay');
      return;
    }
    if (!storeData.location.streetAddress.trim()) {
      Alert.alert('Validation Error', 'Street address is required');
      return;
    }
    if (!storeData.contactNumber.trim()) {
      Alert.alert('Validation Error', 'Contact number is required');
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Implement actual store creation with Firebase/backend
      // For now, simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Store Created!',
        'Your store has been successfully created. You can now start adding products.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('MyStore')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CategorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.label}>Store Category *</Text>
      <View style={styles.categoryGrid}>
        {storeCategories.map((category) => (
          <View key={category.id} style={styles.categoryItem}>
            <TouchableOpacity
              style={[
                styles.categoryCard,
                storeData.category === category.id && styles.categoryCardSelected
              ]}
              onPress={() => setStoreData(prev => ({ ...prev, category: category.id }))}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryText,
                storeData.category === category.id && styles.categoryTextSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Store</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Store Cover Image */}
        <View style={styles.section}>
          <Text style={styles.label}>Store Cover Photo</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
            {storeData.coverImage ? (
              <Image source={{ uri: storeData.coverImage }} style={styles.coverImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#9ca3af" />
                <Text style={styles.imageText}>Add Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Input
            label="Store Name *"
            value={storeData.name}
            onChangeText={(text) => setStoreData(prev => ({ ...prev, name: text }))}
            placeholder="e.g., Lola Maria's Sari-Sari Store"
          />
          
          <Input
            label="Description"
            value={storeData.description}
            onChangeText={(text) => setStoreData(prev => ({ ...prev, description: text }))}
            placeholder="Tell customers about your store..."
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </View>

        {/* Category Selection */}
        <CategorySelector />

        {/* Location & Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Location</Text>
          
          <Dropdown
            label="Region"
            value={storeData.location.region}
            onSelect={(value) => handleLocationChange('region', value)}
            options={locationData.regions}
            placeholder="Select region"
            required
            loading={locationData.loadingRegions}
            searchable={true}
          />
          
          <Dropdown
            label="Province"
            value={storeData.location.province}
            onSelect={(value) => handleLocationChange('province', value)}
            options={getProvinceOptions()}
            placeholder="Select province"
            required
            loading={locationData.loadingProvinces}
            disabled={!storeData.location.region}
            searchable={true}
          />
          
          <Dropdown
            label="City/Municipality"
            value={storeData.location.city}
            onSelect={(value) => handleLocationChange('city', value)}
            options={getCityOptions()}
            placeholder="Select city/municipality"
            required
            loading={locationData.loadingCities}
            disabled={!storeData.location.province}
            searchable={true}
          />
          
          <Dropdown
            label="Barangay"
            value={storeData.location.barangay}
            onSelect={(value) => handleLocationChange('barangay', value)}
            options={getBarangayOptions()}
            placeholder="Select barangay"
            required
            loading={locationData.loadingBarangays}
            disabled={!storeData.location.city}
            searchable={true}
          />
          
          <Input
            label="Street Address *"
            value={storeData.location.streetAddress}
            onChangeText={(text) => handleLocationChange('streetAddress', text)}
            placeholder="House/Building No., Street Name"
            multiline
            numberOfLines={2}
          />
          
          <Input
            label="ZIP Code"
            value={storeData.location.zipCode}
            onChangeText={(text) => handleLocationChange('zipCode', text)}
            placeholder="1234"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <Input
            label="Contact Number *"
            value={storeData.contactNumber}
            onChangeText={(text) => setStoreData(prev => ({ ...prev, contactNumber: text }))}
            placeholder="09XX XXX XXXX"
            keyboardType="phone-pad"
          />
          
          <Input
            label="Email"
            value={storeData.email}
            onChangeText={(text) => setStoreData(prev => ({ ...prev, email: text }))}
            placeholder="store@example.com"
            keyboardType="email-address"
          />
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operating Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hourRow}>
              <Text style={styles.hourLabel}>Open:</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{storeData.operatingHours.open}</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.hourLabel}>Close:</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Text style={styles.timeText}>{storeData.operatingHours.close}</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.daysText}>{storeData.operatingHours.daysOpen}</Text>
        </View>

        {/* Create Button */}
        <View style={styles.createButtonContainer}>
          <Button
            title={loading ? "Creating Store..." : "Create Store"}
            onPress={handleCreateStore}
            variant="primary"
            disabled={loading}
            style={styles.createButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    paddingHorizontal: 16,
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  imagePicker: {
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '50%',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryCardSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  categoryIcon: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  hoursContainer: {
    marginBottom: 12,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  hourLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
    color: '#111827',
    marginRight: 4,
  },
  daysText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  createButtonContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    width: '100%',
  },
  bottomSpacing: {
    height: 32,
  },
});

export default CreateStoreScreen;
