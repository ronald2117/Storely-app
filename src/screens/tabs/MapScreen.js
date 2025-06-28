import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MapScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Map View 🗺️</Text>
        <Text style={styles.subtitle}>
          Find nearby stores and businesses in your barangay
        </Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            📍 Map integration with react-native-maps coming soon!
          </Text>
          <Text style={styles.featureList}>
            Features to implement:{'\n'}
            • Interactive map view{'\n'}
            • Store location markers{'\n'}
            • GPS navigation{'\n'}
            • Filter by category{'\n'}
            • Search nearby
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 24,
  },
  placeholder: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureList: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MapScreen;
