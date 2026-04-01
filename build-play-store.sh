#!/bin/bash

# Liverlytics Play Store Build Script
# This script generates a signed release build for Google Play Store

echo "🚀 Starting Play Store Build for Liverlytics..."
echo ""

# Navigate to android directory
cd "$(dirname "$0")/android" || exit

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean

# Generate Release Bundle (AAB) - Recommended for Play Store
echo "📦 Building Release Bundle (AAB)..."
echo "   This may take 5-10 minutes on first build..."
echo ""

./gradlew bundleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build Successful!"
    echo ""
    echo "📍 Output file location:"
    echo "   app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "📤 Next Steps:"
    echo "   1. Go to Google Play Console"
    echo "   2. Upload: app/build/outputs/bundle/release/app-release.aab"
    echo "   3. Complete the release process"
    echo ""
    
    # Show file size
    AAB_FILE="app/build/outputs/bundle/release/app-release.aab"
    if [ -f "$AAB_FILE" ]; then
        FILE_SIZE=$(du -h "$AAB_FILE" | cut -f1)
        echo "📊 File size: $FILE_SIZE"
    fi
else
    echo ""
    echo "❌ Build failed! Check the error messages above."
    echo ""
    echo "💡 Tips:"
    echo "   - Make sure you have internet connection"
    echo "   - Ensure you have at least 5GB free disk space"
    echo "   - Try running: ./gradlew bundleRelease --stacktrace"
    exit 1
fi
