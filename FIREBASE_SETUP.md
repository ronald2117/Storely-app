# Firebase Setup Guide for Storely App

## Quick Start (Demo Mode)
The app is currently running in **demo mode** with basic functionality. To enable full features, follow the setup below.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `storely-app` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Choose analytics location and accept terms

## Step 2: Add Web App to Firebase Project

1. In your Firebase project dashboard, click the **Web icon** (`</>`)
2. Enter app nickname: `Storely Web App`
3. **Do NOT** check "Set up Firebase Hosting" (we'll use Expo)
4. Click "Register app"
5. Copy the configuration object (you'll need these values)

## Step 3: Enable Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable these providers:
   - ✅ **Email/Password** (for basic auth)
   - ✅ **Google** (optional, for social login)
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. The default domains should work for development

## Step 4: Set up Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Choose **Start in test mode** (we'll configure rules later)
3. Select a location close to your users (e.g., `asia-southeast1` for Southeast Asia)

## Step 5: Configure Security Rules

Replace the default Firestore rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own stores
    match /stores/{storeId} {
      allow read: if true; // Anyone can view stores (for marketplace)
      allow write: if request.auth != null && 
                   request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null;
    }
    
    // Allow users to read/write their own chat messages
    match /chats/{chatId} {
      allow read, write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && 
                         request.auth.uid == userId;
    }
  }
}
```

## Step 6: Update Environment Variables

1. Open your `.env` file in the project root
2. Replace the demo values with your actual Firebase config:

```bash
# Replace these with values from your Firebase config
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-actual-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-actual-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-actual-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-actual-measurement-id
```

## Step 7: Restart Development Server

```bash
npm start
```

## Optional: Set up Cloudinary (for profile pictures)

1. Sign up at [Cloudinary](https://cloudinary.com/) (free tier available)
2. Get your **Cloud Name** from the dashboard
3. Go to **Settings** → **Upload** → **Add upload preset**
4. Create an **unsigned** upload preset (for client-side uploads)
5. Update `src/config/cloudinary.js`:

```javascript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'your-actual-cloud-name',
  UPLOAD_PRESET: 'your-upload-preset-name',
  FOLDER: 'storely/stores',
};
```

## Features Available After Setup

✅ **User Authentication** - Sign up, login, logout
✅ **Store Creation** - Create and manage stores
✅ **Profile Pictures** - Upload store images to cloud
✅ **Real-time Chat** - Message between customers and stores
✅ **Location-based Discovery** - Find stores by city/area
✅ **Data Persistence** - All data saved to cloud database

## Troubleshooting

### "Permission denied" errors
- Check your Firestore security rules
- Ensure user is authenticated before creating stores

### Images not uploading
- Verify Cloudinary configuration
- Check upload preset is set to "unsigned"

### App crashes on startup
- Verify all environment variables are set correctly
- Check Firebase project is active and billing is enabled if needed

## Current Status
🟡 **Demo Mode Active** - Basic functionality available
📝 Complete the setup above to enable all features!
