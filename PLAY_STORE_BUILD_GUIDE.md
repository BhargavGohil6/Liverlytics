# Play Store Release Build Guide - Liverlytics

## ✅ Configuration Already Set Up

Your app is already configured with:
- Keystore file: `liverlytics.keystore`
- Key alias: `liverlytics-key-alias`
- All signing credentials in `gradle.properties`

---

## 📦 Step 1: Build Release APK/AAB

### Option A: Generate Signed APK (For Testing & Distribution)

```bash
cd android
./gradlew assembleRelease
```

**Output location:** 
```
android/app/build/outputs/apk/release/app-release.apk
```

### Option B: Generate Android App Bundle (Recommended for Play Store) ⭐

```bash
cd android
./gradlew bundleRelease
```

**Output location:** 
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Note:** Google Play Store requires **AAB format** for new apps (not APK).

---

## 🔍 Step 2: Verify the Build

### Check APK signature:
```bash
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

### Check AAB:
```bash
jarsigner -verify -verbose -certs android/app/build/outputs/bundle/release/app-release.aab
```

You should see "jar verified" message.

---

## 📤 Step 3: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your "Liverlytics" app
3. Navigate to **Production** or **Internal Testing**
4. Click **Create new release**
5. Upload the **app-release.aab** file
6. Fill in release notes
7. Review and publish

---

## 🔧 Build Commands Summary

```bash
# Clean and build release APK
cd android && ./gradlew clean assembleRelease

# Clean and build release AAB (Recommended)
cd android && ./gradlew clean bundleRelease

# Build all variants
cd android && ./gradlew clean build
```

---

## ⚠️ Important Notes

### Version Management
Update version in `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 2        // Increment for each release
    versionName "1.0.1"  // User-visible version
}
```

### Build Success Tips
- Ensure you have enough disk space (at least 5GB free)
- Make sure all dependencies are downloaded
- Internet connection required for Gradle sync
- First build may take 5-10 minutes

### Common Issues & Solutions

**Issue: Build failed with memory error**
```bash
# Increase Gradle memory in gradle.properties
org.gradle.jvmargs=-Xmx4608m -XX:MaxMetaspaceSize=1024m
```

**Issue: Keystore not found**
- Ensure `liverlytics.keystore` exists in `android/app/` directory
- Check file permissions

**Issue: Signature verification failed**
- Verify keystore passwords in `gradle.properties`
- Ensure key alias is correct

---

## 🎯 Quick Start (Copy-Paste Commands)

### For First Time:
```bash
cd /Users/bhargav/Desktop/react-native/Liverlytics
cd android
./gradlew clean bundleRelease
```

### For Subsequent Builds:
```bash
cd android
./gradlew assembleRelease
```

---

## 📍 Build Output Locations

| Build Type | Command | Output File |
|------------|---------|-------------|
| Debug APK | `./gradlew assembleDebug` | `app/build/outputs/apk/debug/app-debug.apk` |
| Release APK | `./gradlew assembleRelease` | `app/build/outputs/apk/release/app-release.apk` |
| **Release AAB** | `./gradlew bundleRelease` | `app/build/outputs/bundle/release/app-release.aab` |

**✅ Use AAB for Play Store upload!**

---

## 🔐 Keep Safe

**IMPORTANT:** Backup your keystore file!
```
android/app/liverlytics.keystore
```

Without this file, you cannot update your app on Play Store. Store it in a secure location with backup copies.

---

## Need Help?

If you encounter any build errors, check:
1. `android/app/build/outputs/logs/` for build logs
2. Run with `--stacktrace` flag for detailed errors
3. Run with `--info` or `--debug` for more verbose output

Example:
```bash
./gradlew bundleRelease --stacktrace --info
```
