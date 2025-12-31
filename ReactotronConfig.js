import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = __DEV__
  ? Reactotron
      .setAsyncStorageHandler(AsyncStorage)
      .configure({
        name: 'Liverlytics App',
        // host: '192.168.x.x', // Uncomment and set your computer's IP if connecting from physical device
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
