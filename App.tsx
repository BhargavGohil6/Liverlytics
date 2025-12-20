import React from 'react';
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
import VitalsOverviewScreen from './src/screens/dashboard/VitalsOverviewScreen';
import ProfileMainScreen from './src/screens/newscreens/ProfileMainScreen'

function MainApp() {
  // const isLoggedIn = EncryptedStorage.getItem('user_sid');
  // useSelector((state: any) => state);
  // console.log('isLoggedIn', isLoggedIn);
  // AsyncStorage.clear();
  const isLoggedIn = useSelector((state: any) => state.auth);
  console.log('isLoggedIn', isLoggedIn.login);

  return (
    <NavigationContainer>
      {isLoggedIn.login ? <StackNavigation /> : <AuthNavigation />}
    </NavigationContainer>
    // <AIChate/> 
  );
}

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
      <Toast />
    </Provider>
    // <ProfileMainScreen/>
  );
};

export default App;
