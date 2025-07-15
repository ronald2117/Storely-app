# Store Profile Picture Setup Guide

## Overview
This feature allows store owners to upload profile pictures for their stores. Images are uploaded to Cloudinary (cloud storage) and the URLs are stored in Firebase Firestore.

## Setup Instructions

### 1. Cloudinary Setup (Free)

1. **Sign up for Cloudinary**
   - Go to [https://cloudinary.com/](https://cloudinary.com/)
   - Create a free account (provides 25GB storage)

2. **Get your Cloud Name**
   - After logging in, find your "Cloud name" on the dashboard
   - It's usually in the format: `your-account-name`

3. **Create Upload Preset**
   - Go to Settings → Upload → Upload presets
   - Click "Add upload preset"
   - Set the following:
     - Preset name: `storely_stores`
     - Signing mode: **Unsigned** (important for client uploads)
     - Folder: `storely/stores` (optional, for organization)
     - Transformations: You can add auto-optimization

4. **Update Configuration**
   - Open `src/config/cloudinary.js`
   - Replace the values:
   ```javascript
   export const CLOUDINARY_CONFIG = {
     CLOUD_NAME: 'your-actual-cloud-name',
     UPLOAD_PRESET: 'storely_stores',
     FOLDER: 'storely/stores',
   };
   ```

### 2. Firebase Setup

Your Firebase Firestore should already be configured. The store data will be saved with this structure:

```javascript
{
  id: 'auto-generated-id',
  name: 'Store Name',
  description: 'Store description',
  category: 'food',
  profileImage: 'https://res.cloudinary.com/your-cloud/image/upload/v123/storely/stores/abc123.jpg',
  coverImage: 'https://res.cloudinary.com/your-cloud/image/upload/v123/storely/stores/def456.jpg',
  location: {
    region: 'Region IV-A',
    province: 'Batangas',
    city: 'Tanauan',
    barangay: 'Poblacion',
    streetAddress: '123 Main St',
    zipCode: '4232'
  },
  contactNumber: '09171234567',
  email: 'store@example.com',
  operatingHours: {
    monday: { isOpen: true, open: '08:00', close: '18:00' },
    // ... other days
  },
  ownerId: 'firebase-user-id',
  ownerEmail: 'owner@example.com',
  status: 'active',
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## How It Works

### For Store Owners:
1. **Profile Picture** (Required):
   - Tap the circular profile picture area
   - Select image from gallery
   - Image is automatically uploaded to Cloudinary
   - Square format (1:1 ratio) recommended

2. **Cover Photo** (Optional):
   - Tap the cover photo area
   - Select image from gallery
   - Landscape format (16:9 ratio) recommended

3. **Upload Process**:
   - Images are uploaded to Cloudinary first
   - If successful, the Cloudinary URL is stored
   - If upload fails, local image is used as fallback
   - Loading indicator shows during upload

### For Customers:
- Store profile pictures will be displayed in:
  - Store listings
  - Chat conversations
  - Store detail pages
  - Search results

## Features

✅ **Automatic Image Upload**: Images are uploaded to Cloudinary cloud storage
✅ **Fallback Support**: If cloud upload fails, local images are used
✅ **Progress Indicators**: Shows loading state during upload
✅ **Image Validation**: Ensures profile picture is provided
✅ **Optimized Formats**: Different aspect ratios for profile vs cover images
✅ **Organized Storage**: Images are stored in organized folders in Cloudinary

## Security Notes

- Upload preset is set to "unsigned" for client-side uploads
- Images are uploaded directly from the app to Cloudinary
- Only image files are accepted
- File size limits are handled by Cloudinary (10MB max for free accounts)

## Testing

For testing without setting up Cloudinary:
- The app will fall back to storing local image URIs
- Upload will show error but continue with local storage
- You can test the full UI and flow

## Production Considerations

1. **Image Optimization**: Configure Cloudinary transformations for automatic optimization
2. **Security**: Consider implementing signed uploads for production
3. **Storage Limits**: Monitor usage in Cloudinary dashboard
4. **Backup**: Cloudinary provides automatic backups and CDN
5. **Performance**: Images are served from Cloudinary's global CDN

## Troubleshooting

**Upload Fails**: 
- Check your cloud name and upload preset
- Ensure upload preset is set to "unsigned"
- Check internet connection

**Images Don't Display**:
- Verify the Cloudinary URL is correctly stored in Firebase
- Check image URL accessibility

**Permissions Error**:
- App will request camera roll permissions automatically
- User must grant permission to select images
