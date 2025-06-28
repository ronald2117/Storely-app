# 📱 Storely - Barangay Commerce App

A modern mobile-first app for barangay commerce in the Philippines. Guests can browse stores/products, and logged-in users can manage their store, products, and use an offline POS.

## 🔧 Tech Stack

- **React Native** (Expo, JavaScript)
- **Firebase Auth** (Email + Google Sign-In)
- **AsyncStorage** for offline data
- **react-native-maps** for map view
- **Nativewind/Tailwind CSS** for styling (dark mode support)

## 🧱 Screen Flow

- ✅ **StartScreen** → Guest Mode or Login/Register
- 🚧 **HomeTabs**: [Map], [Search], [Favorites], [My Store], [POS]
- ✅ Guest can browse (limited features)
- ✅ Seller can log in and access full features

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or later)
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio or Xcode (for simulators)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd storely
   npm install
   ```

2. **Set up Firebase**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication with Email/Password and Google providers
   - Enable Firestore Database
   - Copy `.env.example` to `.env` and update with your Firebase config:
     ```bash
     cp .env.example .env
     ```
   - Update the values in `.env` with your Firebase project configuration

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Device/Simulator**
   - Download Expo Go app on your phone
   - Scan the QR code from the terminal
   - OR use `npm run android` / `npm run ios` for simulators

## ✨ Features Implemented

### Authentication
- ✅ Start screen with Guest/Login/Register options
- ✅ Email/Password authentication
- ✅ User registration with validation
- ✅ Guest mode for browsing
- 🚧 Google Sign-In (placeholder)
- 🚧 Password reset

### UI/UX
- ✅ Modern, clean design with Tailwind CSS
- ✅ Dark mode support
- ✅ Responsive layouts
- ✅ Form validation and error handling
- ✅ Loading states

### Navigation
- ✅ Stack navigation with proper auth flow
- ✅ Context-based authentication state management

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js       # Custom button component
│   └── Input.js        # Custom input component
├── context/            # React Context providers
│   └── AuthContext.js  # Authentication state management
├── screens/            # App screens
│   ├── StartScreen.js  # Welcome/landing screen
│   ├── LoginScreen.js  # User login
│   ├── RegisterScreen.js # User registration
│   └── HomeTabsScreen.js # Main app (placeholder)
└── services/           # External services
    └── firebase.js     # Firebase configuration
```

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication → Sign-in methods → Email/Password
4. Create a Firestore database
5. Get your config from Project Settings → General → Your apps
6. Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

Your `.env` file should look like this:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

⚠️ **Important**: Never commit your `.env` file to version control. It's already added to `.gitignore`.

## 🎨 Styling

This app uses **Nativewind** (Tailwind CSS for React Native) for styling:

- **Colors**: Primary blue theme with dark mode support
- **Typography**: Consistent font sizes and weights
- **Spacing**: Tailwind's spacing system
- **Components**: Reusable Button and Input components

## 🚧 Next Steps

### Immediate (Phase 1)
- [ ] Complete Firebase configuration
- [ ] Implement Google Sign-In
- [ ] Add password reset functionality
- [ ] Create bottom tab navigation

### Core Features (Phase 2)
- [ ] Map screen with store pins
- [ ] Store profile screens
- [ ] Product search and filters
- [ ] User favorites system

### Advanced Features (Phase 3)
- [ ] Seller dashboard
- [ ] Product management
- [ ] Offline POS system
- [ ] Order management

## 📱 Screenshots

### Start Screen
- Clean welcome screen with app branding
- Three clear options: Guest, Login, Register
- Filipino community messaging

### Authentication
- Modern login/register forms
- Proper validation and error handling
- Social login preparation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Made for Filipino barangay communities 🇵🇭**
