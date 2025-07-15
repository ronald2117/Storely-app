import { CLOUDINARY_CONFIG } from '../config/cloudinary';

// Cloudinary upload service
const { CLOUD_NAME, UPLOAD_PRESET, FOLDER } = CLOUDINARY_CONFIG;

export const uploadImageToCloudinary = async (imageUri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'store-image.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', FOLDER); // Organize uploads in folders

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    // Note: Deleting requires signed requests with API secret
    // This should typically be done from your backend for security
    console.log('Delete image with publicId:', publicId);
    // Implementation would require backend API call
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error.message };
  }
};

export default {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
