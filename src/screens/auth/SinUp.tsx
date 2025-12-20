import React,{ useState} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import responsive from '../../theme/responsive';
import CommonButton from '../../components/CommonButton';
import CommonTextInput from '../../components/CommonTextInput';
import { useDispatch,useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import {registerUser} from './slices/authSlice'



export default function SinUp({ navigation }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const handleRegister = async () => {
    // Basic validation
    if (!form.full_name || !form.email || !form.password) {
      // Alert.alert('Error', 'Please fill all fields');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      })
      return;
    }
    const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
 if (!validateEmail(form.email)) {
   Toast.show({
     type: 'error',
     text1: 'Invalid Email',
     text2: 'Please enter a valid email address',
   })
    return;
  }
    if (form.password !== form.confirmPassword) {
      // Alert.alert('Error', 'Passwords do not match');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match',
      })
      return;
    }
    if (form.password.length < 6) {
      // Alert.alert('Error', 'Password must be at least 6 characters');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters',
      })
      return;
    }

    const result = await dispatch(
      registerUser({
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        password: form.password,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      // Success → directly home ya onboarding pe bhejo
       Toast.show({
            type: 'success',
            text1: 'Registration Success',
          });
          navigation.navigate('OnboardingSteps');
    } else {
      // Alert.alert('Registration Failed', result.payload || 'Something went wrong');
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: result.payload || 'Something went wrong',
      })
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/Transparent 1.png')}
        style={styles.image}
      />
      <Text style={styles.tital}>Create your account</Text>
      <Text style={styles.text}>Track your liver health smarter</Text>
      <CommonTextInput
        placeholder="Full Name"
        label={'Full Name'}
        onChangeText={(text) => setForm({ ...form, full_name: text })}
        style={styles.textInput}
      />
      <CommonTextInput
        placeholder="Email Address"
        label={'Email Address'}
        onChangeText={(text) => setForm({ ...form, email: text })}
        style={styles.textInput}
      />
      <CommonTextInput
        placeholder="Password"
        label={'Password'}
        onChangeText={(text) => setForm({ ...form, password: text })}
        style={styles.textInput}
        secureTextEntry
      />
      <CommonTextInput
        placeholder="Confirm Password"
        label={'Confirm Password'}
        onChangeText={(text) => setForm({ ...form, confirmPassword: text })}
        style={styles.textInput}
        secureTextEntry
      />
      <CommonButton
        title="Create Account"
        fontSize={22}
        style={styles.buttion}
        onPress={handleRegister}
      />
      <View style={styles.footer}>
        <Text>Already have an account ? </Text>
        <TouchableOpacity  onPress={() => navigation.navigate('Login')}>
          <Text style={{ color: '#52AB3C',fontWeight:'bold'}}>Login</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtext}>
        By continuing, you agree to the Terms & Privacy Policy
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: responsive.padding(30),
  },
  image: {
    width: responsive.width(200),
    height: responsive.height(100),
  },
  tital: {
    fontSize: responsive.fontSize(22),
    color: '#0F2740',
    fontWeight: '700',
  },
  text: {
    fontSize: responsive.fontSize(15),
    color: '#4A5568',
    marginBottom: responsive.margin(20),
  },
  textInput: {
    padding: responsive.padding(10),
    alignSelf: 'center',
  },
  buttion: {
    marginTop: responsive.margin(20),
    marginBottom: responsive.margin(20),
  },
  subtext: {
    fontSize: responsive.fontSize(12),
    marginTop: responsive.margin(10),
    color: '#4A5568',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
