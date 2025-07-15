import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

// Create a new store
export const createStore = async (storeData) => {
  try {
    console.log('🏪 Creating store...');
    
    // Get Firebase db instance
    const db = await getFirebaseDb();
    
    // Check if Firebase is properly configured
    if (!db) {
      console.warn('Firebase not configured, using mock store creation');
      return {
        success: true,
        storeId: 'mock-store-' + Date.now(),
        message: 'Store created locally (Firebase not configured)',
      };
    }

    // Simplified store data for faster creation
    const storeDoc = {
      ...storeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };

    const docRef = await addDoc(collection(db, 'stores'), storeDoc);
    
    console.log('✅ Store created with ID:', docRef.id);
    
    return {
      success: true,
      storeId: docRef.id,
      message: 'Store created successfully'
    };
  } catch (error) {
    console.error('🚨 Error creating store:', error);
    
    // Fallback for demo mode
    if (error.code === 'permission-denied' || error.message.includes('demo')) {
      return {
        success: true,
        storeId: 'demo-store-' + Date.now(),
        message: 'Store created in demo mode',
      };
    }
    
    return {
      success: false,
      error: error.message,
      message: 'Failed to create store'
    };
  }
};

// Update store data
export const updateStore = async (storeId, updateData) => {
  try {
    const db = await getFirebaseDb();
    
    if (!db) {
      console.warn('Firebase not configured, cannot update store');
      return {
        success: false,
        error: 'Firebase not configured',
      };
    }

    const storeRef = doc(db, 'stores', storeId);
    await updateDoc(storeRef, {
      ...updateData,
      updatedAt: new Date(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating store:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get store by ID
export const getStore = async (storeId) => {
  try {
    const db = await getFirebaseDb();
    
    if (!db) {
      console.warn('Firebase not configured, cannot get store');
      return {
        success: false,
        error: 'Firebase not configured',
      };
    }

    const storeRef = doc(db, 'stores', storeId);
    const storeDoc = await getDoc(storeRef);
    
    if (storeDoc.exists()) {
      return {
        success: true,
        store: { id: storeDoc.id, ...storeDoc.data() },
      };
    } else {
      return {
        success: false,
        error: 'Store not found',
      };
    }
  } catch (error) {
    console.error('Error getting store:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get stores by owner
export const getStoresByOwner = async (ownerId) => {
  try {
    console.log('🔍 Getting stores for owner:', ownerId);
    
    const db = await getFirebaseDb();
    
    if (!db) {
      console.log('🔧 Demo mode: Returning demo store data');
      return {
        success: true,
        stores: [{
          id: 'demo-store-1',
          name: 'Lola Maria\'s Sari-Sari Store',
          description: 'Your neighborhood store for daily essentials',
          category: 'sari-sari',
          location: {
            region: 'Region IV-A',
            province: 'Batangas',
            city: 'Tanauan City',
            barangay: 'Poblacion',
            streetAddress: '123 Rizal Street'
          },
          contactNumber: '+63 912 345 6789',
          email: 'demo@storely.app',
          coverImage: null,
          profileImage: null,
          operatingHours: {
            monday: { isOpen: true, open: '08:00', close: '18:00' },
            tuesday: { isOpen: true, open: '08:00', close: '18:00' },
            wednesday: { isOpen: true, open: '08:00', close: '18:00' },
            thursday: { isOpen: true, open: '08:00', close: '18:00' },
            friday: { isOpen: true, open: '08:00', close: '18:00' },
            saturday: { isOpen: true, open: '08:00', close: '18:00' },
            sunday: { isOpen: false, open: '08:00', close: '18:00' },
          },
          products: [
            {
              id: '1',
              name: 'Coca Cola 355ml',
              category: 'Beverages',
              description: 'Ice cold Coca Cola in can',
              price: 25.00,
              stock: 50,
              image: null
            },
            {
              id: '2',
              name: 'Lucky Me Pancit Canton',
              category: 'Instant Noodles',
              description: 'Original flavor instant noodles',
              price: 18.00,
              stock: 100,
              image: null
            }
          ],
          ownerId: ownerId,
          status: 'active',
          totalSales: 2500.00,
          totalOrders: 45,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]
      };
    }

    if (!ownerId || ownerId === 'guest') {
      console.log('ℹ️ No valid owner ID provided');
      return {
        success: true,
        stores: []
      };
    }

    const storesQuery = query(
      collection(db, 'stores'),
      where('ownerId', '==', ownerId)
    );
    
    const querySnapshot = await getDocs(storesQuery);
    const stores = [];
    
    querySnapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${stores.length} store(s) for owner ${ownerId}`);
    
    return {
      success: true,
      stores,
    };
  } catch (error) {
    console.error('Error getting stores by owner:', error);
    
    // Fallback for demo mode with more specific error handling
    if (error.message.includes('Expected first argument to collection()') || 
        error.code === 'permission-denied' || 
        error.message.includes('demo')) {
      console.warn('Returning demo store data due to Firebase error');
      return {
        success: true,
        stores: [
          {
            id: 'demo-store-fallback',
            name: 'Demo Store (Fallback)',
            description: 'Firebase connection failed, showing demo data',
            category: 'sari-sari',
            location: {
              region: 'NCR',
              province: 'Metro Manila',
              city: 'Quezon City',
              barangay: 'Diliman',
              streetAddress: '123 Demo Street',
            },
            contactNumber: '09XX XXX XXXX',
            email: 'demo@store.com',
            profileImage: null,
            coverImage: null,
            ownerId: ownerId,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        ],
      };
    }
    
    return {
      success: false,
      error: error.message,
    };
  }
};

// Get stores by location
export const getStoresByLocation = async (city, province) => {
  try {
    const db = await getFirebaseDb();
    
    if (!db) {
      console.warn('Firebase not configured, returning empty stores array');
      return {
        success: true,
        stores: [],
      };
    }

    const storesQuery = query(
      collection(db, 'stores'),
      where('location.city', '==', city),
      where('location.province', '==', province)
    );
    
    const querySnapshot = await getDocs(storesQuery);
    const stores = [];
    
    querySnapshot.forEach((doc) => {
      stores.push({ id: doc.id, ...doc.data() });
    });
    
    return {
      success: true,
      stores,
    };
  } catch (error) {
    console.error('Error getting stores by location:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Product Management Functions

// Add product to store
export const addProduct = async (storeId, productData) => {
  try {
    console.log('🛒 Adding product to store:', storeId, productData);
    
    const db = await getFirebaseDb();
    
    if (!db || storeId.startsWith('demo-')) {
      console.log('🔧 Demo mode: Product addition simulated');
      return {
        success: true,
        productId: 'demo-product-' + Date.now(),
        message: 'Product added successfully (demo mode)'
      };
    }

    // Add product to products collection
    const productRef = await addDoc(collection(db, 'products'), {
      ...productData,
      storeId: storeId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    });

    console.log('✅ Product added successfully with ID:', productRef.id);
    
    return {
      success: true,
      productId: productRef.id,
      message: 'Product added successfully'
    };

  } catch (error) {
    console.error('🚨 Error adding product:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to add product',
      message: 'Failed to add product. Please try again.'
    };
  }
};

// Get products for a store
export const getStoreProducts = async (storeId) => {
  try {
    console.log('🛒 Getting products for store:', storeId);
    
    const db = await getFirebaseDb();
    
    if (!db || storeId.startsWith('demo-')) {
      console.log('🔧 Demo mode: Returning demo products');
      return {
        success: true,
        products: [
          {
            id: 'demo-product-1',
            name: 'Coca Cola 355ml',
            category: 'Beverages',
            description: 'Ice cold Coca Cola in can',
            price: 25.00,
            stock: 50,
            image: null,
            storeId: storeId,
            status: 'active'
          },
          {
            id: 'demo-product-2',
            name: 'Lucky Me Pancit Canton',
            category: 'Instant Noodles',
            description: 'Original flavor instant noodles',
            price: 18.00,
            stock: 100,
            image: null,
            storeId: storeId,
            status: 'active'
          }
        ]
      };
    }

    const productsQuery = query(
      collection(db, 'products'),
      where('storeId', '==', storeId),
      where('status', '==', 'active')
    );
    
    const querySnapshot = await getDocs(productsQuery);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });

    console.log(`✅ Found ${products.length} product(s) for store ${storeId}`);
    
    return {
      success: true,
      products: products
    };

  } catch (error) {
    console.error('🚨 Error getting store products:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
      products: []
    };
  }
};

// Update product
export const updateProduct = async (productId, updateData) => {
  try {
    console.log('📝 Updating product:', productId, updateData);
    
    const db = await getFirebaseDb();
    
    if (!db || productId.startsWith('demo-')) {
      console.log('🔧 Demo mode: Product update simulated');
      return {
        success: true,
        message: 'Product updated successfully (demo mode)'
      };
    }

    const productRef = doc(db, 'products', productId);
    const updateDataWithTimestamp = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await updateDoc(productRef, updateDataWithTimestamp);
    
    console.log('✅ Product updated successfully');
    
    return {
      success: true,
      message: 'Product updated successfully'
    };

  } catch (error) {
    console.error('🚨 Error updating product:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to update product',
      message: 'Failed to update product. Please try again.'
    };
  }
};

// Delete product
export const deleteProduct = async (productId) => {
  try {
    console.log('🗑️ Deleting product:', productId);
    
    const db = await getFirebaseDb();
    
    if (!db || productId.startsWith('demo-')) {
      console.log('🔧 Demo mode: Product deletion simulated');
      return {
        success: true,
        message: 'Product deleted successfully (demo mode)'
      };
    }

    // Soft delete - mark as inactive instead of deleting
    await updateDoc(doc(db, 'products', productId), {
      status: 'deleted',
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Product deleted successfully');
    
    return {
      success: true,
      message: 'Product deleted successfully'
    };

  } catch (error) {
    console.error('🚨 Error deleting product:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to delete product',
      message: 'Failed to delete product. Please try again.'
    };
  }
};

// Search products across all stores
export const searchProducts = async (searchQuery, filters = {}) => {
  try {
    console.log('🔍 Searching products:', searchQuery, filters);
    
    const db = await getFirebaseDb();
    
    if (!db) {
      console.log('🔧 Demo mode: Returning demo search results');
      return {
        success: true,
        products: [
          {
            id: 'demo-product-1',
            name: 'Coca Cola 355ml',
            category: 'Beverages',
            price: 25.00,
            storeId: 'demo-store-1',
            storeName: 'Demo Store',
            image: null
          }
        ]
      };
    }

    // For now, return all active products
    // TODO: Implement text search when Firestore supports it better
    let q = query(
      collection(db, 'products'),
      where('status', '==', 'active')
    );
    
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    const querySnapshot = await getDocs(q);
    const products = [];
    
    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      // Simple text search on name (client-side filtering)
      if (!searchQuery || 
          productData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          productData.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
        products.push({ id: doc.id, ...productData });
      }
    });

    console.log(`✅ Found ${products.length} product(s) matching search`);
    
    return {
      success: true,
      products: products
    };

  } catch (error) {
    console.error('🚨 Error searching products:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to search products',
      products: []
    };
  }
};

export default {
  createStore,
  updateStore,
  getStore,
  getStoresByOwner,
  getStoresByLocation,
  addProduct,
  getStoreProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
};
