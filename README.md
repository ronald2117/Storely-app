# 📱 Storely - Barangay Commerce App

A modern mobile-first app for barangay commerce in the Philippines. Guests can browse stores/products, and logged-in users can manage their store and product inventory with full CRUD functionality.

## 🔧 Tech Stack

- **React Native** (Expo, JavaScript)
- **Firebase Auth** (Email + Google Sign-In)
- **AsyncStorage** for offline data
- **react-native-maps** for map view
- **Nativewind/Tailwind CSS** for styling (dark mode support)

## 🧱 Screen Flow

- ✅ **StartScreen** → Guest Mode or Login/Register
- 🚧 **HomeTabs**: [Map], [Search], [Favorites], [My Store], [Products]
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

### Product Management
- ✅ Complete CRUD functionality for products
- ✅ Product search and filtering by category
- ✅ Availability toggle (Available/Unavailable)
- ✅ Visibility control (Public/Private)
- ✅ Product categories and descriptions
- ✅ Price and quantity management
- ✅ Image URL support
- ✅ Responsive product cards with quick actions

## 📦 Product Management Features

The **Products** tab provides comprehensive inventory management for store owners:

### Core Functionality
- **Create Products**: Add new products with name, description, category, price, and quantity
- **Edit Products**: Update existing product information with inline editing
- **Delete Products**: Remove products from inventory with confirmation dialogs
- **Search & Filter**: Real-time search by name/description and filter by category
- **Quick Actions**: Toggle availability and visibility with single taps

### Product Properties
- **Basic Info**: Name, description, category, price, quantity
- **Availability**: Mark products as available/unavailable for sale
- **Visibility**: Set products as public (visible to customers) or private
- **Categories**: Electronics, Clothing, Food & Beverages, Home & Garden, Books, Sports, Health & Beauty, Other
- **Image Support**: Add product images via URL

### User Experience
- **Guest Mode**: Prompts users to sign in to access product management
- **Responsive Design**: Clean, mobile-first interface with card-based layout
- **Status Badges**: Visual indicators for availability and visibility status
- **Modal Forms**: Full-screen forms for adding/editing products with validation
- **Empty States**: Helpful messaging when no products are found

### Technical Implementation
- **Local Storage**: Products stored in AsyncStorage for offline functionality
- **State Management**: React hooks for form state and product management
- **Validation**: Required field validation and numeric input handling
- **Performance**: Efficient filtering and search with useEffect optimization

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js       # Custom button component
│   ├── Input.js        # Custom input component
│   ├── Dropdown.js     # Custom dropdown component
│   └── LoadingScreen.js # Loading state component
├── context/            # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── AuthContextSimple.js # Simplified auth context
├── screens/            # App screens
│   ├── StartScreen.js  # Welcome/landing screen
│   ├── LoginScreen.js  # User login
│   ├── RegisterScreen.js # User registration
│   ├── CreateStoreScreen.js # Store creation
│   ├── HomeTabsScreen.js # Main app (placeholder)
│   ├── TabNavigator.js # Bottom tab navigation
│   └── tabs/          # Tab screens
│       ├── ExploreScreen.js   # Browse stores and products
│       ├── FavoritesScreen.js # User favorites
│       ├── MapScreen.js       # Map with store locations
│       ├── MyStoreScreen.js   # Store management
│       ├── ProductsScreen.js  # Product CRUD management
│       ├── SearchScreen.js    # Search functionality
│       └── SettingsScreen.js  # User settings
├── services/           # External services
│   ├── firebase.js     # Firebase configuration
│   └── locationService.js # Location services
└── data/              # Static data
    └── philippinesLocations.js # Philippines location data
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
- [x] Product management with full CRUD functionality
- [x] Product search and filtering capabilities
- [ ] Map screen with store pins
- [ ] Store profile screens
- [ ] User favorites system

### Advanced Features (Phase 3)
- [x] Product management with CRUD functionality
- [x] Product availability and visibility controls
- [ ] Seller dashboard analytics
- [ ] Advanced search and filtering
- [ ] Order management system

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
