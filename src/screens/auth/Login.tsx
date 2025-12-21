import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import CommonButton from '../../components/CommonButton';
import CommonTextInput from '../../components/CommonTextInput';
import responsive from '../../theme/responsive';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './slices/authSlice';
import Toast from 'react-native-toast-message';
import { AppDispatch, RootState } from '../../redux/store';
export default function Login({ navigation }) {

const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, login } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.trim() || !password.trim()) {
    // Alert.alert('Error', 'Please fill all fields');
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please fill all fields',
    })
    return;
  }else if (!password) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Please enter a password',
    });
    return;
  }

  if (!emailRegex.test(email.trim())) {
    Toast.show({
      type: 'error',
      text1: 'Invalid Email',
      text2: 'Please enter a valid email address',
    });
    return;
  }

  try {
    await dispatch(loginUser({ email: email.trim(), password })).unwrap();
    
    // Check if login was successful
    if (login) {
      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: 'Welcome back!',
      });
      // Navigate to dashboard after successful login
      navigation.navigate('Dashboard');
    } else {
      // Login failed, show error message
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error || 'Invalid credentials',
      });
    }
  } catch (err: any) {
    Toast.show({
      type: 'error',
      text1: 'Login Failed',
      text2: err || 'Invalid credentials',
    });
  }
};


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        
      <Image
        source={require('../../assets/Transparent 1.png')}
        style={styles.image}
      />
      <Text style={styles.text}>
        Track your liver health with confidence
      </Text>
      <CommonTextInput
        placeholder="Email"
        label={'Email'}
        style={styles.textInput}
        value={email}
        onChangeText={setEmail}
      />
      <CommonTextInput
        placeholder="Password"
        label={'Password'}
        secureTextEntry
        style={styles.textInput}
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.forgetPasswordButton}>
        <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <CommonButton 
        title={loading ? "Logging in..." : "Login"}
        fontSize={22} 
        style={styles.button} 
        onPress={handleLogin} 
        disabled={loading}
      />
      <TouchableOpacity style={{flexDirection:'row'}} onPress={() => navigation.navigate('SinUp')}>
        <Text >Don't have an account? </Text>
        <Text style={{color:'#52ab3c',fontWeight:'bold'}}>Sign Up</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsive.padding(30),
  },
  button: {
    marginTop: responsive.margin(20),
    marginBottom: responsive.margin(20),
  },
  textInput: {
    padding: responsive.padding(10),
    alignSelf: 'center',
  },
  image:{
    width: responsive.width(200),
    height: responsive.height(100),
  },
  text: {
    fontSize: responsive.fontSize(18),
    marginBottom: responsive.margin(20),
    alignSelf: 'center',
    textAlign: 'center',
    color: 'gray',
    width: responsive.width(200),
  },
  forgetPasswordButton: {
      alignItems:'flex-end',alignSelf:'flex-end'
  },
  forgetPasswordText: {
      borderBottomWidth: 1,color:'#4A5568',fontSize:responsive.fontSize(15)
  }
});
