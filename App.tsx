import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Dimensions } from 'react-native';
import Login from './src/screens/auth/Login';
import AuthNavigation from './src/navigation/AuthNavigation';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store, persistor } from './src/redux/store';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import StackNavigation from './src/navigation/StackNavigation';
import EncryptedStorage from 'react-native-encrypted-storage';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileMainScreen from './src/screens/profile/ProfileMainScreen'

import './ReactotronConfig'; // Import Reactotron configuration

function MainApp() {
  const { login } = useSelector((state: any) => state.auth);
  const navigationRef = useRef<any>(null);
  console.log('isLoggedIn', login);

  // Handle logout - reset navigation to login screen
  useEffect(() => {
    if (!login && navigationRef.current) {
      // User logged out - reset navigation to login screen
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [login]);

  return (
    <NavigationContainer ref={navigationRef}>
      {login ? <StackNavigation /> : <AuthNavigation />}
    </NavigationContainer>
  );
}
const deviceHight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
         <SafeAreaView style={styles.SafeArea}>
        <MainApp />
        </SafeAreaView>
      </PersistGate>
      <Toast />
    </Provider>
    // <ProfileMainScreen/>
  );
};

export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    SafeArea: {
        // height: deviceHight,
        // width: deviceWidth,
        flex:1
    }
})
