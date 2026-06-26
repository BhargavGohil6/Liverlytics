import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import responsive from "../theme/responsive";
import Icon from 'react-native-vector-icons/Feather';

const CustomCheckbox = ({ label, checked, onPress }) => (
    <TouchableOpacity 
        style={checkboxStyles.container} 
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={[checkboxStyles.box, checked && checkboxStyles.boxChecked]}>
            {checked && <Icon name="check" size={responsive.fontSize(16)} color="#fff" />}
        </View>
        <Text style={checkboxStyles.label}>{label}</Text>
    </TouchableOpacity>
);


export default CustomCheckbox;

const checkboxStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    box: {
        width: responsive.width(24),
        height: responsive.width(24),
        borderRadius: responsive.width(6),
        borderWidth: 2,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: responsive.width(15),
    },
    boxChecked: {
        backgroundColor: '#4CAF50',
    },
    label: {
        fontSize: responsive.fontSize(16),
        color: '#333',
    }
});


