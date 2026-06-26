import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput as RNTextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface ProfileFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  onChangeText?: (text: string) => void;
  onEditPress?: () => void;
  icon?: string;
  type?: 'text' | 'email' | 'phone' | 'date' | 'select';
  selectOptions?: string[];
  error?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  placeholder,
  editable = false,
  multiline = false,
  numberOfLines = 1,
  onChangeText,
  onEditPress,
  icon,
  type = 'text',
  selectOptions,
  error,
}) => {
  const getInputType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const renderInput = () => {
    if (editable && onChangeText) {
      return (
        <RNTextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            error && styles.inputError,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={getInputType()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      );
    }

    if (type === 'select' && selectOptions) {
      return (
        <TouchableOpacity 
          style={[styles.selectInput, error && styles.inputError]} 
          onPress={onEditPress}
        >
          <Text style={[styles.selectText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Icon name="chevron-down" size={20} color="#9ca3af" />
        </TouchableOpacity>
      );
    }

    if (type === 'date') {
      return (
        <TouchableOpacity 
          style={[styles.selectInput, error && styles.inputError]} 
          onPress={onEditPress}
        >
          <Text style={[styles.selectText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
          <Icon name="calendar-outline" size={20} color="#9ca3af" />
        </TouchableOpacity>
      );
    }

    return (
      <View style={[styles.readonlyInput, error && styles.inputError]}>
        <Text style={[styles.readonlyText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        {icon && <Icon name={icon} size={20} color="#6b7280" />}
        <Text style={styles.label}>{label}</Text>
        {onEditPress && !editable && (
          <TouchableOpacity onPress={onEditPress} style={styles.editIcon}>
            <Icon name="create-outline" size={20} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>
      {renderInput()}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  editIcon: {
    marginLeft: 'auto',
  },
  input: {
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  readonlyInput: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  readonlyText: {
    fontSize: 15,
    color: '#1f2937',
  },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  selectText: {
    fontSize: 15,
    color: '#1f2937',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
    marginLeft: 28,
  },
});

export default ProfileField;