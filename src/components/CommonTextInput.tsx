import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CommonTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  borderColor = '#ccc',
  radius = 10,
  padding = 12,
  style
}) => {

  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: 15, width: '100%' }}>
      
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input + Eye icon container */}
      <View
        style={[
          styles.inputContainer,
          { borderColor, borderRadius: radius, paddingHorizontal: 10 },
          style
        ]}
      >
        <TextInput
          style={[styles.input]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hide}
          keyboardType={keyboardType}
        />

        {/* 👁️ Eye Icon */}
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHide(!hide)}>
            <Icon
              name={hide ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    // paddingVertical: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default CommonTextInput;
