import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import responsive  from '../theme/responsive.js';


const CommonButton = ({
  title,
  onPress,
  bgColor = '#52ab3c',
  textColor = '#fff',
  radius = 10,
  paddingVertical = 8,
  fontSize = 16,
  style = {}
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: bgColor, borderRadius: radius, paddingVertical },
        style
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
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
