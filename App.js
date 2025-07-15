import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContextSimple';

// Import screens
import StartScreen from './src/screens/StartScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import CreateStoreScreen from './src/screens/CreateStoreScreen';
import TabNavigator from './src/screens/TabNavigator';
import LoadingScreen from './src/components/LoadingScreen';
import ConversationScreen from './src/screens/ConversationScreen';

const Stack = createNativeStackNavigator();

// Main navigation component that handles auth state
function AppNavigator() {
  const { user, isGuest, loading, firebaseError } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // If there's a Firebase error, show a simple error screen with option to continue as guest
  if (firebaseError) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 20, 
        backgroundColor: '#f9fafb' 
      }}>
        <Text style={{ 
          fontSize: 18, 
          fontWeight: 'bold', 
          color: '#dc2626', 
          marginBottom: 10, 
          textAlign: 'center' 
        }}>
          Firebase Connection Issue
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: '#6b7280', 
          textAlign: 'center', 
          marginBottom: 20 
        }}>
          {firebaseError}
        </Text>
        <Text style={{ 
          fontSize: 12, 
          color: '#9ca3af', 
          textAlign: 'center',
          marginBottom: 20
        }}>
          You can still browse the app as a guest. Authentication features will be unavailable.
        </Text>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start">
            <Stack.Screen name="Start" component={StartScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user || isGuest ? "HomeTabs" : "Start"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen 
          name="Start" 
          component={StartScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{
            headerShown: true,
            title: '',
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#374151',
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{
            headerShown: true,
            title: '',
            headerBackTitleVisible: false,
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#374151',
          }}
        />
        
        {/* Store Management Flow */}
        <Stack.Screen 
          name="CreateStore" 
          component={CreateStoreScreen}
          options={{ headerShown: false }}
        />
        
        {/* Chat Flow */}
        <Stack.Screen 
          name="Conversation" 
          component={ConversationScreen}
          options={{ headerShown: false }}
        />
        
        {/* Main App Flow */}
        <Stack.Screen 
          name="HomeTabs" 
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
