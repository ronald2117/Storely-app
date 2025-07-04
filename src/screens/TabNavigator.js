import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import tab screens
import ExploreScreen from './tabs/ExploreScreen';
import FavoritesScreen from './tabs/FavoritesScreen';
import MyStoreScreen from './tabs/MyStoreScreen';
import POSScreen from './tabs/POSScreen';
import SettingsScreen from './tabs/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Explore') {
            iconName = focused ? 'compass' : 'compass-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'MyStore') {
            iconName = focused ? 'storefront' : 'storefront-outline';
          } else if (route.name === 'POS') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          borderTopWidth: 1,
          paddingBottom: Math.max(insets.bottom, 4),
          paddingTop: 4,
          height: 60 + Math.max(insets.bottom, 0),
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomColor: '#e5e7eb',
          borderBottomWidth: 1,
        },
        headerTitleStyle: {
          color: '#111827',
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: '#374151',
      })}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen}
        options={{
          title: 'Explore',
          headerTitle: 'Explore Nearby',
        }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{
          title: 'Favorites',
          headerTitle: 'My Favorites',
        }}
      />
      <Tab.Screen 
        name="MyStore" 
        component={MyStoreScreen}
        options={{
          title: 'My Store',
          headerTitle: 'Store Management',
        }}
      />
      <Tab.Screen 
        name="POS" 
        component={POSScreen}
        options={{
          title: 'POS',
          headerTitle: 'Point of Sale',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerTitle: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
