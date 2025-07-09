import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContextSimple';
import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';

const ProductsScreen = ({ navigation }) => {
  const { isGuest, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [showPublicOnly, setShowPublicOnly] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
    isAvailable: true,
    isPublic: false,
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Books',
    'Sports',
    'Health & Beauty',
    'Other',
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory, showAvailableOnly, showPublicOnly]);

  const loadProducts = async () => {
    try {
      // TODO: Replace with actual API call to Firebase
      // For now, using mock data stored in AsyncStorage
      const mockProducts = [
        {
          id: '1',
          name: 'Sample Product 1',
          description: 'This is a sample product',
          category: 'Electronics',
          price: 99.99,
          quantity: 10,
          imageUrl: '',
          isAvailable: true,
          isPublic: true,
        },
        {
          id: '2',
          name: 'Sample Product 2',
          description: 'Another sample product',
          category: 'Clothing',
          price: 49.99,
          quantity: 5,
          imageUrl: '',
          isAvailable: false,
          isPublic: false,
        },
      ];
      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (showAvailableOnly) {
      filtered = filtered.filter((product) => product.isAvailable);
    }

    if (showPublicOnly) {
      filtered = filtered.filter((product) => product.isPublic);
    }

    setFilteredProducts(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      quantity: '',
      imageUrl: '',
      isAvailable: true,
      isPublic: false,
    });
    setEditingProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      imageUrl: product.imageUrl,
      isAvailable: product.isAvailable,
      isPublic: product.isPublic,
    });
    setEditingProduct(product);
    setIsModalVisible(true);
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        id: editingProduct ? editingProduct.id : Date.now().toString(),
      };

      if (editingProduct) {
        // Update existing product
        setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)));
      } else {
        // Add new product
        setProducts([productData, ...products]);
      }

      setIsModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to save product');
    }
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
            setProducts(products.filter((p) => p.id !== productId));
          },
        },
      ]
    );
  };

  const toggleAvailability = (productId) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p
      )
    );
  };

  const toggleVisibility = (productId) => {
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isPublic: !p.isPublic } : p
      )
    );
  };

  if (isGuest) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.guestContainer}>
          <Text style={styles.title}>My Products 📦</Text>
          <Text style={styles.guestText}>
            Sign in to manage your product inventory and make them available to customers
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
      <View style={styles.header}>
        <Text style={styles.title}>My Products 📦</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.filtersRow}>
          <Dropdown
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            placeholder="Category"
            options={[{ label: 'All Categories', value: '' }, ...categories.map(cat => ({ label: cat, value: cat }))]}
            style={styles.categoryDropdown}
          />
          
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Available</Text>
            <Switch
              value={showAvailableOnly}
              onValueChange={setShowAvailableOnly}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={showAvailableOnly ? '#ffffff' : '#f3f4f6'}
            />
          </View>
          
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Public</Text>
            <Switch
              value={showPublicOnly}
              onValueChange={setShowPublicOnly}
              trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
              thumbColor={showPublicOnly ? '#ffffff' : '#f3f4f6'}
            />
          </View>
        </View>
      </View>

      {/* Products List */}
      <ScrollView style={styles.productsList} showsVerticalScrollIndicator={false}>
        {filteredProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyDescription}>
              {products.length === 0
                ? 'Start by adding your first product'
                : 'Try adjusting your search or filters'}
            </Text>
          </View>
        ) : (
          filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openEditModal(product)}
                  >
                    <Ionicons name="pencil" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteProduct(product.id)}
                  >
                    <Ionicons name="trash" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
              
              {product.description ? (
                <Text style={styles.productDescription}>{product.description}</Text>
              ) : null}
              
              <View style={styles.productDetails}>
                <Text style={styles.productPrice}>₱{product.price.toFixed(2)}</Text>
                <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
              </View>
              
              <View style={styles.productStatus}>
                <View style={styles.statusBadges}>
                  <View style={[styles.badge, product.isAvailable ? styles.availableBadge : styles.unavailableBadge]}>
                    <Text style={[styles.badgeText, product.isAvailable ? styles.availableText : styles.unavailableText]}>
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                  </View>
                  <View style={[styles.badge, product.isPublic ? styles.publicBadge : styles.privateBadge]}>
                    <Text style={[styles.badgeText, product.isPublic ? styles.publicText : styles.privateText]}>
                      {product.isPublic ? 'Public' : 'Private'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => toggleAvailability(product.id)}
                  >
                    <Ionicons
                      name={product.isAvailable ? 'pause' : 'play'}
                      size={16}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => toggleVisibility(product.id)}
                  >
                    <Ionicons
                      name={product.isPublic ? 'eye' : 'eye-off'}
                      size={16}
                      color="#6b7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Product Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </Text>
            <TouchableOpacity onPress={saveProduct}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Product Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(value) => setFormData({ ...formData, name: value })}
                placeholder="Enter product name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category *</Text>
              <Dropdown
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                placeholder="Select category"
                options={categories.map(cat => ({ label: cat, value: cat }))}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={formData.description}
                onChangeText={(value) => setFormData({ ...formData, description: value })}
                placeholder="Enter product description"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Price *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.price}
                  onChangeText={(value) => setFormData({ ...formData, price: value })}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.formLabel}>Quantity *</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.quantity}
                  onChangeText={(value) => setFormData({ ...formData, quantity: value })}
                  placeholder="0"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Image URL</Text>
              <TextInput
                style={styles.formInput}
                value={formData.imageUrl}
                onChangeText={(value) => setFormData({ ...formData, imageUrl: value })}
                placeholder="https://example.com/image.jpg"
              />
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.formLabel}>Available for sale</Text>
                <Switch
                  value={formData.isAvailable}
                  onValueChange={(value) => setFormData({ ...formData, isAvailable: value })}
                  trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                  thumbColor={formData.isAvailable ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <Text style={styles.formLabel}>Visible to public</Text>
                <Switch
                  value={formData.isPublic}
                  onValueChange={(value) => setFormData({ ...formData, isPublic: value })}
                  trackColor={{ false: '#e5e7eb', true: '#3b82f6' }}
                  thumbColor={formData.isPublic ? '#ffffff' : '#f3f4f6'}
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  guestText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  guestButton: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#111827',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryDropdown: {
    flex: 1,
    marginRight: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  toggleLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 4,
  },
  productsList: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 18,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  productQuantity: {
    fontSize: 14,
    color: '#6b7280',
  },
  productStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadges: {
    flexDirection: 'row',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  availableBadge: {
    backgroundColor: '#d1fae5',
  },
  unavailableBadge: {
    backgroundColor: '#fee2e2',
  },
  availableText: {
    color: '#059669',
  },
  unavailableText: {
    color: '#dc2626',
  },
  publicBadge: {
    backgroundColor: '#dbeafe',
  },
  privateBadge: {
    backgroundColor: '#f3f4f6',
  },
  publicText: {
    color: '#2563eb',
  },
  privateText: {
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
  },
  quickActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  saveButton: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
    marginRight: 8,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ProductsScreen;
