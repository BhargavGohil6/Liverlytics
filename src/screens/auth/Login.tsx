import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import CommonButton from '../../components/CommonButton';
import CommonTextInput from '../../components/CommonTextInput';
import responsive from '../../theme/responsive';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './slices/authSlice';
import Toast from 'react-native-toast-message';
import { AppDispatch, RootState } from '../../redux/store';

export default function Login({ navigation }: { navigation: any }) {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
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
      
      Toast.show({
        type: 'success',
        text1: 'Login Success',
        text2: 'Welcome back!',
      });
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
      style={{ flex: 1, backgroundColor: '#fff' }}
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
        placeholder="Enter your Email"
        label={'Email'}
        value={email}
        onChangeText={setEmail}
      />
      <CommonTextInput
        placeholder="Enter your Password"
        label={'Password'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.forgetPasswordButton} onPress={() => navigation.navigate('ForgotPassword')}>
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
    marginTop: responsive.margin(-20),
  },
  forgetPasswordButton: {
      alignItems:'flex-end',alignSelf:'flex-end'
  },
  forgetPasswordText: {
      borderBottomWidth: 1,color:'#4A5568',fontSize:responsive.fontSize(15)
  }
});
