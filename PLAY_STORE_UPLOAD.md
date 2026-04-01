# 📱 Liverlytics - Play Store Upload Files

## ✅ Ready to Build!

Your app is configured and ready for Play Store upload.

---

## 🚀 Quick Build (Choose One)

### Option 1: AAB File (For Google Play Store) ⭐ RECOMMENDED
```bash
./build-play-store.sh
```
**Output:** `android/app/build/outputs/bundle/release/app-release.aab`
- ✅ Required format for Google Play Console
- ✅ Smaller download size for users
- ✅ App signing by Google

### Option 2: APK File (For Testing/Distribution)
```bash
./build-apk.sh
```
**Output:** `android/app/build/outputs/apk/release/app-release.apk`
- For direct installation on devices
- For testing outside Play Store

---

## 📤 Upload to Play Store

1. **Build the AAB file:**
   ```bash
   ./build-play-store.sh
   ```

2. **Upload to Google Play Console:**
   - Go to: https://play.google.com/console
   - Select your "Liverlytics" app
   - Navigate to **Production** track
   - Click **Create new release**
   - Upload: `android/app/build/outputs/bundle/release/app-release.aab`
   - Complete release process

---

## 📋 What Was Configured

✅ **Signing Configuration Updated:**
- Keystore: `android/app/liverlytics.keystore`
- Key alias: `liverlytics-key-alias`
- All credentials in `gradle.properties`

✅ **Build Scripts Created:**
- `build-play-store.sh` - Generates AAB for Play Store
- `build-apk.sh` - Generates APK for testing

✅ **Documentation:**
- `PLAY_STORE_BUILD_GUIDE.md` - Complete guide with troubleshooting

---

## 🔐 Important: Backup Your Keystore!

**CRITICAL:** Keep this file safe:
```
android/app/liverlytics.keystore
```

Without it, you cannot update your app on Play Store!

**Backup locations:**
- External hard drive
- Cloud storage (encrypted)
- Password manager
- Safe deposit box

---

## 📊 Version Management

Before each release, update version in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2        // Increment by 1 for each release
    versionName "1.0.1"  // Update as needed
}
```

---

## 💡 Tips

- First build may take 5-10 minutes
- Ensure stable internet connection
- Need at least 5GB free disk space
- Run builds from project root directory

---

## ❓ Troubleshooting

If build fails:
1. Check error message in terminal
2. Run with more details: `./gradlew bundleRelease --stacktrace`
3. See full guide: `PLAY_STORE_BUILD_GUIDE.md`

---

## 📞 Need Help?

Read the complete guide: **[PLAY_STORE_BUILD_GUIDE.md](./PLAY_STORE_BUILD_GUIDE.md)**

Good luck with your release! 🎉
