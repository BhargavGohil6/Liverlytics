/**
 * @format
 */



import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { performHealthSync } from './src/services/health/BackgroundSync';

if (__DEV__) {
  require("./ReactotronConfig");
}

let MyHeadlessTask = async (event) => {
  let taskId = event.taskId;
  console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
  await performHealthSync();
  BackgroundFetch.finish(taskId);
};

AppRegistry.registerComponent(appName, () => App);
BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
