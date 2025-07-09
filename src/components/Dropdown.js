import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Dropdown = ({ 
  label, 
  value, 
  onSelect, 
  options = [], 
  placeholder = 'Select an option',
  required = false,
  loading = false,
  disabled = false,
  searchable = false,
  style 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const selectedOption = options.find(option => option.value === value);

  // Filter options based on search text
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchText.trim()) {
      return options;
    }
    return options.filter(option => 
      option.label.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText, searchable]);

  const handleSelect = (option) => {
    onSelect(option.value);
    setIsVisible(false);
    setSearchText(''); // Clear search when closing
  };

  const handlePress = () => {
    if (disabled || loading) return;
    setIsVisible(true);
  };

  const handleClose = () => {
    setIsVisible(false);
    setSearchText(''); // Clear search when closing
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.dropdown, 
          value && styles.dropdownSelected,
          (disabled || loading) && styles.dropdownDisabled
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        <Text style={[
          styles.dropdownText, 
          !value && styles.placeholderText,
          (disabled || loading) && styles.disabledText
        ]}>
          {loading ? 'Loading...' : (selectedOption ? selectedOption.label : placeholder)}
        </Text>
        {loading ? (
          <ActivityIndicator size="small" color="#6b7280" />
        ) : (
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={value ? "#111827" : "#6b7280"} 
          />
        )}
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select Option'}</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            {searchable && (
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  value={searchText}
                  onChangeText={setSearchText}
                  autoFocus={false}
                />
                {searchText.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearIcon}>
                    <Ionicons name="close-circle" size={20} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <ScrollView style={styles.optionsList}>
              {filteredOptions.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>
                    {searchText ? 'No results found' : 'No options available'}
                  </Text>
                </View>
              ) : (
                filteredOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      value === option.value && styles.selectedOption
                    ]}
                    onPress={() => handleSelect(option)}
                  >
                    <Text style={[
                      styles.optionText,
                      value === option.value && styles.selectedOptionText
                    ]}>
                      {option.label}
                    </Text>
                    {value === option.value && (
                      <Ionicons name="checkmark" size={20} color="#2563eb" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#dc2626',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  dropdownSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  dropdownDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    opacity: 0.6,
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  selectedOptionText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  disabledText: {
    color: '#9ca3af',
  },
});

export default Dropdown;
