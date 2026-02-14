import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import responsive from '../theme/responsive';

interface CommonDropdownProps {
  label: string;
  placeholder: string;
  value: string;
  options: { label: string; value: string }[];
  onValueChange: (value: string) => void;
  data?: { label: string; value: string }[];
  onSelect?: (value: string) => void;
  selectedValue?: string;
  style?: any;
}

const CommonDropdown = ({
  label,
  placeholder,
  value,
  options,
  onValueChange,
  data,
  onSelect,
  selectedValue,
  style,
}: CommonDropdownProps) => {
  const [isVisible, setIsVisible] = useState(false);

  // Use either value/onChange or selectedValue/onSelect
  const currentValue = selectedValue !== undefined ? selectedValue : value;
  const handleChange = onSelect || onValueChange;

  const selectedOption = (data || options).find(option => option.value === currentValue);

  const handleSelect = (option: { label: string; value: string }) => {
    handleChange(option.value);
    setIsVisible(false);
  };

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity style={styles.dropdown} onPress={() => setIsVisible(true)}>
        <Text style={styles.selectedText}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.dropdownIcon}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={data || options}
              keyExtractor={(item) => item.value}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.option, index === (data || options).length - 1 && styles.lastOption]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: responsive.height(15),
    width: '100%',
  },
  label: {
    marginBottom: responsive.height(6),
    fontSize: responsive.fontSize(14),
    color: '#4A5568',
    fontWeight: '600',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: responsive.borderRadius(12),
    paddingHorizontal: responsive.padding(14),
    height: responsive.height(52),
    backgroundColor: '#fff',
  },
  selectedText: {
    fontSize: responsive.fontSize(16),
    color: '#2D3748',
  },
  dropdownIcon: {
    fontSize: responsive.fontSize(14),
    color: '#718096',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: responsive.borderRadius(16),
    maxHeight: responsive.height(250),
    width: '85%',
    paddingVertical: responsive.padding(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  option: {
    padding: responsive.padding(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F7FAFC',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: responsive.fontSize(16),
    color: '#2D3748',
  },
});

export default CommonDropdown;