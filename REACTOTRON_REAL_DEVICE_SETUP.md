# Reactotron Real Device Connection Guide

## Problem
Android real device cannot connect to Reactotron desktop app.

## Solution Steps

### Step 1: Find Your Computer's IP Address
Open Terminal and run:
```bash
# For WiFi connection
ipconfig getifaddr en0

# For Ethernet connection  
ipconfig getifaddr en1
```
Your IP will look like: `192.168.1.100` or `10.0.0.x`

### Step 2: Update network_security_config.xml
Edit file: `android/app/src/main/res/xml/network_security_config.xml`

Replace `YOUR_COMPUTER_IP_HERE` with your actual IP from Step 1:
```xml
<domain includeSubdomains="true">192.168.1.100</domain>
```

### Step 3: Update ReactotronConfig.js
Edit file: `ReactotronConfig.js`

Replace `YOUR_COMPUTER_IP_HERE` with your actual IP from Step 1:
```javascript
host: '192.168.1.100',
```

### Step 4: Ensure Same Network
- Make sure your computer and Android device are on the **same WiFi network**
- This is critical for the connection to work

### Step 5: Rebuild and Run
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# Run on device
npx react-native run-android
```

### Step 6: Start Reactotron Desktop App
- Open Reactotron desktop app BEFORE running your app
- You should see your device connect in the Reactotron interface

## Alternative: Using ADB Reverse (USB Only)

If you prefer USB connection, you can use ADB reverse:

```bash
# Connect device via USB
adb reverse tcp:9090 tcp:9090

# Then use localhost in ReactotronConfig.js
host: 'localhost'
```

Note: ADB reverse only works for debugging over USB, not WiFi.

## Troubleshooting

### Device still not connecting?
1. ✅ Verify computer and device are on same WiFi network
2. ✅ Check firewall settings on your computer (allow port 9090)
3. ✅ Try disabling firewall temporarily to test
4. ✅ Restart Reactotron desktop app
5. ✅ Clear Metro cache: `npx react-native start --reset-cache`
6. ✅ Reinstall app on device

### Check if device can reach computer
On your Android device, open Chrome and try:
```
http://YOUR_COMPUTER_IP:9090
```
If it doesn't load, there's a network/firewall issue.

### Firewall Setup (macOS)
```bash
# Allow Reactotron through firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /Applications/Reactotron.app
```

## Port Information
- Reactotron default port: **9090**
- Make sure this port is not blocked by firewall
