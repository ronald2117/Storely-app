import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { uploadImageToCloudinary } from '../../services/cloudinaryService';

const MyStoreScreen = ({ navigation }) => {
  const { isGuest, user } = useAuth();
  const [hasStore, setHasStore] = useState(false); 
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Store data state
  const [storeData, setStoreData] = useState({
    id: '1',
    name: 'Lola Maria\'s Sari-Sari Store',
    description: 'Fresh goods and daily essentials for the community',
    category: 'sari-sari',
    coverImage: null,
    profileImage: null,
    location: {
      region: 'Region IV-A',
      province: 'Batangas',
      city: 'Tanauan City',
      barangay: 'Barangay 1',
      streetAddress: '123 Main Street',
    },
    contactNumber: '09123456789',
    email: 'lolamaria@gmail.com',
    status: 'active',
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

  // Products state
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Coca Cola 1.5L',
      price: 65,
      stock: 50,
      category: 'Beverages',
      image: null,
      description: 'Refreshing cola drink'
    },
    {
      id: '2', 
      name: 'Lucky Me Pancit Canton',
      price: 15,
      stock: 100,
      category: 'Instant Noodles',
      image: null,
      description: 'Original flavor instant noodles'
    },
    {
      id: '3',
      name: 'Surf Powder 35g',
      price: 8,
      stock: 75,
      category: 'Detergent',
      image: null,
      description: 'Laundry detergent powder'
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null
  });

  useEffect(() => {
    // TODO: Check if user has a store and load store data
    // For now, we'll simulate having a store after creation
    checkUserStore();
  }, []);

  const checkUserStore = async () => {
    // TODO: Implement actual store checking logic
    // For demo purposes, we'll assume user has a store
    setHasStore(true);
  };

  const handleImagePick = async (imageType = 'cover') => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: imageType === 'profile' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadingImage(true);
        const imageUri = result.assets[0].uri;
        
        try {
          const uploadResult = await uploadImageToCloudinary(imageUri);
          
          if (uploadResult.success) {
            setStoreData(prev => ({
              ...prev,
              [imageType === 'profile' ? 'profileImage' : 'coverImage']: uploadResult.url
            }));
            Alert.alert('Success', 'Image updated successfully!');
          } else {
            setStoreData(prev => ({
              ...prev,
              [imageType === 'profile' ? 'profileImage' : 'coverImage']: imageUri
            }));
            Alert.alert('Info', 'Image updated locally (cloud upload failed)');
          }
        } catch (error) {
          setStoreData(prev => ({
            ...prev,
            [imageType === 'profile' ? 'profileImage' : 'coverImage']: imageUri
          }));
          Alert.alert('Info', 'Image updated locally');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploadingImage(false);
    }
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
    };

    setProducts(prev => [...prev, product]);
    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
    setShowProductModal(false);
    Alert.alert('Success', 'Product added successfully!');
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      image: product.image
    });
    setShowProductModal(true);
  };

  const updateProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...newProduct, id: editingProduct.id, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) }
        : p
    ));
    
    setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
    setEditingProduct(null);
    setShowProductModal(false);
    Alert.alert('Success', 'Product updated successfully!');
  };

  const deleteProduct = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setProducts(prev => prev.filter(p => p.id !== productId));
            Alert.alert('Success', 'Product deleted successfully!');
          }
        }
      ]
    );
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
            <Text style={styles.sectionTitle}>Why start a store?</Text>
            <View style={styles.benefitsList}>
              <View style={styles.benefit}>
                <Ionicons name="people" size={24} color="#2563eb" />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Reach Local Customers</Text>
                  <Text style={styles.benefitDescription}>
                    Connect with neighbors and community members
                  </Text>
                </View>
              </View>
              
              <View style={styles.benefit}>
                <Ionicons name="trending-up" size={24} color="#2563eb" />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Grow Your Business</Text>
                  <Text style={styles.benefitDescription}>
                    Manage inventory, track sales, and expand your reach
                  </Text>
                </View>
              </View>
              
              <View style={styles.benefit}>
                <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Secure Platform</Text>
                  <Text style={styles.benefitDescription}>
                    Safe transactions and reliable customer communication
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Create Store Button */}
          <View style={styles.createButtonContainer}>
            <Button
              title="Create My Store"
              onPress={() => navigation.navigate('CreateStore')}
              variant="primary"
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Store Management Interface
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.tabContent}>
            {/* Store Header */}
            <View style={styles.storeHeader}>
              <TouchableOpacity 
                style={styles.coverImageContainer}
                onPress={() => handleImagePick('cover')}
              >
                {uploadingImage ? (
                  <View style={styles.coverImagePlaceholder}>
                    <ActivityIndicator size="large" color="#2563eb" />
                  </View>
                ) : storeData.coverImage ? (
                  <Image source={{ uri: storeData.coverImage }} style={styles.coverImage} />
                ) : (
                  <View style={styles.coverImagePlaceholder}>
                    <Ionicons name="camera" size={32} color="#9ca3af" />
                    <Text style={styles.imageText}>Add Cover Photo</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={styles.storeInfo}>
                <TouchableOpacity 
                  style={styles.profileImageContainer}
                  onPress={() => handleImagePick('profile')}
                >
                  {storeData.profileImage ? (
                    <Image source={{ uri: storeData.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <Ionicons name="storefront" size={24} color="#9ca3af" />
                    </View>
                  )}
                </TouchableOpacity>
                
                <View style={styles.storeDetails}>
                  <Text style={styles.storeName}>{storeData.name}</Text>
                  <Text style={styles.storeLocation}>
                    {storeData.location.barangay}, {storeData.location.city}
                  </Text>
                  <View style={styles.storeStatus}>
                    <View style={[styles.statusDot, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{products.length}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Orders Today</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>₱0</Text>
                <Text style={styles.statLabel}>Sales Today</Text>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setShowProductModal(true)}
                >
                  <Ionicons name="add-circle" size={32} color="#2563eb" />
                  <Text style={styles.actionText}>Add Product</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('products')}
                >
                  <Ionicons name="cube" size={32} color="#2563eb" />
                  <Text style={styles.actionText}>Manage Products</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionCard}>
                  <Ionicons name="stats-chart" size={32} color="#2563eb" />
                  <Text style={styles.actionText}>View Analytics</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => setActiveTab('settings')}
                >
                  <Ionicons name="settings" size={32} color="#2563eb" />
                  <Text style={styles.actionText}>Store Settings</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recent Products */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Products</Text>
                <TouchableOpacity onPress={() => setActiveTab('products')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              
              {products.slice(0, 3).map(product => (
                <View key={product.id} style={styles.productItem}>
                  <View style={styles.productImageContainer}>
                    {product.image ? (
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                    ) : (
                      <View style={styles.productImagePlaceholder}>
                        <Ionicons name="cube" size={20} color="#9ca3af" />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productCategory}>{product.category}</Text>
                    <Text style={styles.productPrice}>₱{product.price}</Text>
                  </View>
                  
                  <View style={styles.productStock}>
                    <Text style={styles.stockText}>{product.stock} in stock</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        );

      case 'products':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.productsHeader}>
              <Text style={styles.sectionTitle}>All Products ({products.length})</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowProductModal(true)}
              >
                <Ionicons name="add" size={20} color="#ffffff" />
                <Text style={styles.addButtonText}>Add Product</Text>
              </TouchableOpacity>
            </View>

            {products.map(product => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImageContainer}>
                  {product.image ? (
                    <Image source={{ uri: product.image }} style={styles.productImage} />
                  ) : (
                    <View style={styles.productImagePlaceholder}>
                      <Ionicons name="cube" size={24} color="#9ca3af" />
                    </View>
                  )}
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productDescription}>{product.description}</Text>
                  <View style={styles.productMeta}>
                    <Text style={styles.productPrice}>₱{product.price}</Text>
                    <Text style={styles.stockText}>{product.stock} in stock</Text>
                  </View>
                </View>
                
                <View style={styles.productActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => editProduct(product)}
                  >
                    <Ionicons name="create" size={16} color="#2563eb" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => deleteProduct(product.id)}
                  >
                    <Ionicons name="trash" size={16} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {products.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>No Products Yet</Text>
                <Text style={styles.emptyDescription}>
                  Start by adding your first product to your store
                </Text>
                <Button
                  title="Add Your First Product"
                  onPress={() => setShowProductModal(true)}
                  variant="primary"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </ScrollView>
        );

      case 'settings':
        return (
          <ScrollView style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Store Information</Text>
              
              <Input
                label="Store Name"
                value={storeData.name}
                onChangeText={(text) => setStoreData(prev => ({ ...prev, name: text }))}
              />
              
              <Input
                label="Description"
                value={storeData.description}
                onChangeText={(text) => setStoreData(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={3}
              />
              
              <Input
                label="Contact Number"
                value={storeData.contactNumber}
                onChangeText={(text) => setStoreData(prev => ({ ...prev, contactNumber: text }))}
                keyboardType="phone-pad"
              />
              
              <Input
                label="Email"
                value={storeData.email}
                onChangeText={(text) => setStoreData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Operating Hours</Text>
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
                      <Text style={styles.timeText}>
                        {formatTime(hours.open)} - {formatTime(hours.close)}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Button
                title="Save Changes"
                onPress={() => Alert.alert('Success', 'Store settings updated!')}
                variant="primary"
              />
            </View>
          </ScrollView>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Store</Text>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Ionicons 
            name={activeTab === 'overview' ? 'home' : 'home-outline'} 
            size={20} 
            color={activeTab === 'overview' ? '#2563eb' : '#6b7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Ionicons 
            name={activeTab === 'products' ? 'cube' : 'cube-outline'} 
            size={20} 
            color={activeTab === 'products' ? '#2563eb' : '#6b7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>
            Products
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Ionicons 
            name={activeTab === 'settings' ? 'settings' : 'settings-outline'} 
            size={20} 
            color={activeTab === 'settings' ? '#2563eb' : '#6b7280'} 
          />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Add/Edit Product Modal */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
                }}
              >
                <Ionicons name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Input
                label="Product Name *"
                value={newProduct.name}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
                placeholder="e.g., Coca Cola 1.5L"
              />
              
              <Input
                label="Price *"
                value={newProduct.price}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
                placeholder="0.00"
                keyboardType="numeric"
              />
              
              <Input
                label="Stock Quantity *"
                value={newProduct.stock}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, stock: text }))}
                placeholder="0"
                keyboardType="numeric"
              />
              
              <Input
                label="Category"
                value={newProduct.category}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, category: text }))}
                placeholder="e.g., Beverages"
              />
              
              <Input
                label="Description"
                value={newProduct.description}
                onChangeText={(text) => setNewProduct(prev => ({ ...prev, description: text }))}
                placeholder="Product description..."
                multiline
                numberOfLines={3}
              />
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  setNewProduct({ name: '', price: '', stock: '', category: '', description: '', image: null });
                }}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={editingProduct ? updateProduct : addProduct}
              >
                <Text style={[styles.modalButtonText, styles.saveButtonText]}>
                  {editingProduct ? 'Update' : 'Add Product'}
                </Text>
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
  // Guest State Styles
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  guestText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  guestButton: {
    marginBottom: 16,
    width: '100%',
  },
  
  // No Store State Styles
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  benefitText: {
    flex: 1,
    marginLeft: 12,
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
  createButtonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  createButton: {
    width: '100%',
  },

  // Store Management Styles
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
  headerAction: {
    padding: 8,
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#2563eb',
  },

  // Tab Content
  tabContent: {
    flex: 1,
    padding: 16,
  },

  // Store Header
  storeHeader: {
    marginBottom: 24,
  },
  coverImageContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  imageText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  storeLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  storeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },

  // Stats Container
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },

  // Product Item
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  productStock: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Products Tab
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },

  // Settings Tab
  dayRow: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  timeRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  timeText: {
    fontSize: 14,
    color: '#6b7280',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalBody: {
    flex: 1,
    padding: 16,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#374151',
  },
  saveButtonText: {
    color: '#ffffff',
  },
});

export default MyStoreScreen;
