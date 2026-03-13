module.exports = {
  dependencies: {
    'react-native-health': {
      platforms: {
        ios: {
          podspecPath: require('path').resolve(__dirname, 'node_modules/react-native-health/RNAppleHealthKit.podspec'),
        },
      },
    },
  },
};
