// Development/Demo services for testing without Firebase
export const mockStoreService = {
  createStore: async (storeData) => {
    console.log('📝 Mock: Creating store', storeData.name);
    return {
      success: true,
      storeId: 'demo-store-' + Date.now(),
      message: 'Store created in demo mode'
    };
  },

  getStoresByOwner: async (ownerId) => {
    console.log('📝 Mock: Getting stores for owner', ownerId);
    return {
      success: true,
      stores: [
        {
          id: 'demo-store-1',
          name: 'Demo Sari-Sari Store',
          category: 'groceries',
          location: {
            city: 'Tanauan City',
            province: 'Batangas'
          },
          profileImage: 'https://via.placeholder.com/150',
          coverImage: 'https://via.placeholder.com/400x200'
        }
      ]
    };
  },

  getStoresByLocation: async (city, province) => {
    console.log('📝 Mock: Getting stores in', city, province);
    return {
      success: true,
      stores: [
        {
          id: 'demo-store-1',
          name: 'Lola Maria\'s Store',
          category: 'groceries',
          location: { city, province },
          profileImage: 'https://via.placeholder.com/150'
        },
        {
          id: 'demo-store-2',
          name: 'Kuya Jun\'s Electronics',
          category: 'electronics',
          location: { city, province },
          profileImage: 'https://via.placeholder.com/150'
        }
      ]
    };
  }
};

export const mockCloudinaryService = {
  uploadImageToCloudinary: async (imageUri) => {
    console.log('📝 Mock: Uploading image', imageUri);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      url: imageUri, // Return the local URI for demo
      publicId: 'demo-' + Date.now()
    };
  }
};

export default {
  mockStoreService,
  mockCloudinaryService
};
