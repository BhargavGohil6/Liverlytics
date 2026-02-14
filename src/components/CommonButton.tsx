import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import responsive  from '../theme/responsive.js';

interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  title: any;
  onPress: any;
  bgColor?: string;
  textColor?: string;
  radius?: number;
  paddingVertical?: number;
  fontSize?: number;
  style?: {};
  disabled?: boolean;
}

const CommonButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  bgColor = '#52ab3c',
  textColor = '#fff',
  radius = 10,
  paddingVertical = 8,
  fontSize = 16,
  style = {},
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { 
          backgroundColor: disabled ? '#ccc' : bgColor, 
          borderRadius: radius, 
          paddingVertical 
        },
        style
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: disabled ? '#666' : textColor, fontSize }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
  }
});

export default CommonButton;
