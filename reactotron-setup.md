# Reactotron Setup Guide for Liverlytics

## Installation

1. Make sure you have the Reactotron desktop app installed:
   - Download from: https://github.com/infinitered/reactotron/releases
   - Or install via Homebrew: `brew install --cask reactotron`

## Running the App with Reactotron

1. **Start the Reactotron desktop app** first
2. **Run your React Native app**:
   ```bash
   # For iOS
   npx react-native run-ios
   
   # For Android
   npx react-native run-android
   ```
   
3. **Start Metro bundler** (if not already started):
   ```bash
   npx react-native start --reset-cache
   ```

## Troubleshooting

If you encounter any issues:

1. Make sure Reactotron desktop app is running before starting your React Native app
2. Clear all caches if you have import/module errors:
   ```bash
   # Clear Metro cache
   npx react-native start --reset-cache
   
   # Clear npm cache
   npm start -- --reset-cache
   ```

3. If modules still can't be found, reinstall node_modules:
   ```bash
   rm -rf node_modules
   npm install
   ```

## Features Available

- Redux state monitoring
- Console logs display
- Network requests monitoring
- AsyncStorage inspection
- Component hierarchy view
- Performance tracking