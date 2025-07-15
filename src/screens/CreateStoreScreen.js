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
  ActivityIndicator,
  Modal,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContextSimple';
import Input from '../components/Input';
import Button from '../components/Button';
import Dropdown from '../components/Dropdown';
import locationService from '../services/locationService';
import { uploadImageToCloudinary } from '../services/cloudinaryService';
import { createStore } from '../services/storeService';

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
    profileImage: null, // Added profile image
    operatingHours: {
      monday: { isOpen: true, open: '08:00', close: '18:00' },
      tuesday: { isOpen: true, open: '08:00', close: '18:00' },
      wednesday: { isOpen: true, open: '08:00', close: '18:00' },
      thursday: { isOpen: true, open: '08:00', close: '18:00' },
      friday: { isOpen: true, open: '08:00', close: '18:00' },
      saturday: { isOpen: true, open: '08:00', close: '18:00' },
      sunday: { isOpen: false, open: '08:00', close: '18:00' },
    }
  });

  const [showHoursModal, setShowHoursModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const handleImagePick = async (imageType = 'cover') => {
    try {
      console.log('🎨 Starting image pick for:', imageType);
      
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('📱 Permission result:', permissionResult);
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      console.log('🖼️ Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fixed: was MediaType.Images
        allowsEditing: true,
        aspect: imageType === 'profile' ? [1, 1] : [16, 9], // Square for profile, 16:9 for cover
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      console.log('📸 Image picker result:', result);

      if (result.canceled) {
        console.log('❌ User canceled image selection');
        return;
      }

      if (!result.assets || result.assets.length === 0) {
        console.error('❌ No assets in result');
        Alert.alert('Error', 'No image was selected. Please try again.');
        return;
      }

      const imageUri = result.assets[0].uri;
      console.log('✅ Selected image URI:', imageUri);
      
      // Show loading state
      setUploadingImage(true);
      
      try {
        console.log('☁️ Uploading to Cloudinary...');
        // Upload to Cloudinary
        const uploadResult = await uploadImageToCloudinary(imageUri);
        console.log('☁️ Upload result:', uploadResult);
        
        if (uploadResult.success) {
          setStoreData(prev => ({
            ...prev,
            [imageType === 'profile' ? 'profileImage' : 'coverImage']: uploadResult.url
          }));
          Alert.alert('Success', `${imageType === 'profile' ? 'Profile' : 'Cover'} image uploaded successfully!`);
        } else {
          console.warn('⚠️ Cloudinary upload failed, using local image');
          Alert.alert('Info', `Image selected! Using local storage since cloud upload failed: ${uploadResult.error || 'Unknown error'}`);
          // Fallback to local storage for development
          setStoreData(prev => ({
            ...prev,
            [imageType === 'profile' ? 'profileImage' : 'coverImage']: imageUri
          }));
        }
      } catch (uploadError) {
        console.error('💥 Upload error:', uploadError);
        Alert.alert('Info', 'Image selected! Using local storage (cloud upload failed).');
        // Fallback to local storage
        setStoreData(prev => ({
          ...prev,
          [imageType === 'profile' ? 'profileImage' : 'coverImage']: imageUri
        }));
      }
    } catch (error) {
      console.error('💥 Image picker error:', error);
      Alert.alert('Error', `Failed to pick image: ${error.message || 'Unknown error'}`);
    } finally {
      setUploadingImage(false);
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
    if (!storeData.profileImage) {
      Alert.alert('Validation Error', 'Please add a profile picture for your store');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare store data for Firebase
      const storeDataToSave = {
        ...storeData,
        ownerId: user?.uid || 'guest', // Use actual user ID
        ownerEmail: user?.email || storeData.email,
        status: 'active',
      };

      // Create store in Firebase
      const result = await createStore(storeDataToSave);
      
      if (result.success) {
        console.log('✅ Store created successfully:', result.storeId);
        
        Alert.alert(
          'Store Created!',
          'Your store has been successfully created. You can now start adding products.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to HomeTabs and then to MyStore tab
                navigation.reset({
                  index: 0,
                  routes: [
                    { 
                      name: 'HomeTabs',
                      state: {
                        routes: [
                          { name: 'Explore' },
                          { name: 'Favorites' },
                          { name: 'MyStore' },
                          { name: 'Chat' },
                          { name: 'Settings' }
                        ],
                        index: 2, // This will select MyStore tab (index 2)
                      }
                    }
                  ],
                });
              }
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Failed to create store');
      }
    } catch (error) {
      console.error('Store creation error:', error);
      Alert.alert('Error', error.message || 'Failed to create store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Map and location helpers
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setTempLocation({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (tempLocation) {
      setStoreData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: tempLocation
        }
      }));
      setTempLocation(null);
    }
    setShowMapModal(false);
  };

  // Operating hours helpers
  const updateOperatingHours = (day, field, value) => {
    setStoreData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getOperatingHoursSummary = () => {
    const openDays = Object.entries(storeData.operatingHours)
      .filter(([_, hours]) => hours.isOpen)
      .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1));
    
    if (openDays.length === 0) return 'Closed all days';
    if (openDays.length === 7) return 'Open daily';
    
    // Group consecutive days
    const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const openDayIndices = openDays.map(day => dayOrder.indexOf(day.toLowerCase()));
    
    if (openDayIndices.length <= 3) {
      return openDays.join(', ');
    }
    
    return `${openDays[0]} - ${openDays[openDays.length - 1]}`;
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
          <TouchableOpacity 
            style={styles.imagePicker} 
            onPress={() => handleImagePick('cover')}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text style={styles.imageText}>Uploading...</Text>
              </View>
            ) : storeData.coverImage ? (
              <Image source={{ uri: storeData.coverImage }} style={styles.coverImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={32} color="#9ca3af" />
                <Text style={styles.imageText}>Add Cover Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Store Profile Image */}
        <View style={styles.section}>
          <Text style={styles.label}>Store Profile Picture *</Text>
          <TouchableOpacity 
            style={styles.profileImagePicker} 
            onPress={() => handleImagePick('profile')}
            disabled={uploadingImage}
          >
            {uploadingImage ? (
              <View style={styles.profileImagePlaceholder}>
                <ActivityIndicator size="small" color="#2563eb" />
              </View>
            ) : storeData.profileImage ? (
              <Image source={{ uri: storeData.profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={32} color="#9ca3af" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.profileImageHint}>Square image recommended (1:1 ratio)</Text>
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
          <TouchableOpacity 
            style={styles.hoursButton}
            onPress={() => setShowHoursModal(true)}
          >
            <View style={styles.hoursButtonContent}>
              <Ionicons name="time" size={20} color="#2563eb" />
              <View style={styles.hoursInfo}>
                <Text style={styles.hoursTitle}>Set Business Hours</Text>
                <Text style={styles.hoursSubtitle}>{getOperatingHoursSummary()}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#6b7280" />
            </View>
          </TouchableOpacity>
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

      {/* Operating Hours Modal */}
      <Modal
        visible={showHoursModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Operating Hours</Text>
              <TouchableOpacity onPress={() => setShowHoursModal(false)}>
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.hoursModalContent}>
              {Object.entries(storeData.operatingHours).map(([day, hours]) => (
                <View key={day} style={styles.dayRow}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Text>
                    <Switch
                      value={hours.isOpen}
                      onValueChange={(value) => updateOperatingHours(day, 'isOpen', value)}
                      trackColor={{ false: '#f3f4f6', true: '#2563eb' }}
                      thumbColor={hours.isOpen ? '#ffffff' : '#d1d5db'}
                    />
                  </View>
                  
                  {hours.isOpen && (
                    <View style={styles.timeRow}>
                      <View style={styles.timePickerContainer}>
                        <Text style={styles.timeLabel}>Open</Text>
                        <TouchableOpacity style={styles.timePicker}>
                          <Text style={styles.timePickerText}>{formatTime(hours.open)}</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <View style={styles.timePickerContainer}>
                        <Text style={styles.timeLabel}>Close</Text>
                        <TouchableOpacity style={styles.timePicker}>
                          <Text style={styles.timePickerText}>{formatTime(hours.close)}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={() => setShowHoursModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Save Hours</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  profileImagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: '#f9fafb',
  },
  profileImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImageHint: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
  },
  // Operating hours styles
  hoursButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  hoursButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hoursInfo: {
    flex: 1,
    marginLeft: 12,
  },
  hoursTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  hoursSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hoursModalContent: {
    maxHeight: 400,
  },
  dayRow: {
    marginBottom: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timePickerContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  timePicker: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
  },
  timePickerText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  saveButtonText: {
    color: '#ffffff',
  },
});

export default CreateStoreScreen;
