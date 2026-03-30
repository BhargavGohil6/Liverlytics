import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = __DEV__
  ? Reactotron
      .setAsyncStorageHandler(AsyncStorage)
      .configure({
        name: 'Liverlytics App',
        host: '192.168.29.53', // Your computer's IP address for device connection
      })
      .useReactNative({
        networking: {
          ignoreUrls: /symbolicate/,
        },
      })
      .use(reactotronRedux())
      .connect()
  : console.tron;

export default reactotron;
