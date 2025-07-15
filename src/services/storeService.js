import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';

// Create a new store
export const createStore = async (storeData) => {
  try {
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

    const docRef = await addDoc(collection(db, 'stores'), {
      ...storeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    return {
      success: true,
      storeId: docRef.id,
    };
  } catch (error) {
    console.error('Error creating store:', error);
    
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
    const db = await getFirebaseDb();
    
    if (!db) {
      console.warn('Firebase not configured, returning demo store data');
      // Return demo data for development
      return {
        success: true,
        stores: [
          {
            id: 'demo-store-1',
            name: 'Demo Store',
            description: 'This is a demo store (Firebase not configured)',
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

    const storesQuery = query(
      collection(db, 'stores'),
      where('ownerId', '==', ownerId)
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

export default {
  createStore,
  updateStore,
  getStore,
  getStoresByOwner,
  getStoresByLocation,
};
