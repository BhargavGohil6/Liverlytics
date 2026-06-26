import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text, TouchableOpacity, KeyboardType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import responsive from '../theme/responsive';

const CommonTextInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  borderColor = '#E2E8F0',
  radius = 12,
  style,
  suffixText
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url' | 'number-pad' | 'decimal-pad';
  borderColor?: string;
  radius?: number;
  style?: any;
  suffixText?: string;
}) => {

  const [hide, setHide] = useState(secureTextEntry);

  return (
    <View style={{ marginBottom: responsive.height(15), width: '100%' }}>
      
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input + Eye icon container */}
      <View
        style={[
          styles.inputContainer,
          { borderColor, borderRadius: responsive.borderRadius(radius) },
          style
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={hide}
          keyboardType={keyboardType}
        />
        
        {suffixText && <Text style={styles.suffixText}>{suffixText}</Text>}

        {/* 👁️ Eye Icon */}
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHide(!hide)} style={styles.eyeIcon}>
            <Icon
              name={hide ? 'eye-off-outline' : 'eye-outline'}
              size={responsive.fontSize(22)}
              color="#718096"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: responsive.height(6),
    fontSize: responsive.fontSize(14),
    color: '#4A5568',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: responsive.height(52),
    paddingHorizontal: responsive.padding(14),
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: responsive.fontSize(16),
    color: '#2D3748',
    paddingVertical: 0, 
  },
  suffixText: {
    fontSize: responsive.fontSize(16),
    color: '#718096',
    marginLeft: responsive.width(8),
    fontWeight: '500',
  },
  eyeIcon: {
    padding: responsive.padding(4),
  }
});

export default CommonTextInput;
