// Cloudinary configuration
// To use this service:
// 1. Sign up for a free Cloudinary account at https://cloudinary.com/
// 2. Get your cloud name from the dashboard
// 3. Create an upload preset in Settings > Upload > Add upload preset
// 4. Set the upload preset to "Unsigned" for client-side uploads
// 5. Replace the values below with your actual Cloudinary credentials

export const CLOUDINARY_CONFIG = {
  // Replace with your actual Cloudinary cloud name
  CLOUD_NAME: 'dtt8pyj8o',
  
  // Replace with your upload preset name
  UPLOAD_PRESET: 'storely',
  
  // Optional: Folder to organize uploads
  FOLDER: 'storely/stores',
};

// For development/testing, you can use these demo values:
// CLOUD_NAME: 'demo'
// UPLOAD_PRESET: 'ml_default'
// But uploads will be deleted after some time

export default CLOUDINARY_CONFIG;
