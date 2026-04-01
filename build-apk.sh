#!/bin/bash

# Liverlytics Release APK Build Script
# This script generates a signed release APK for testing/distribution

echo "🚀 Building Release APK..."
echo ""

cd "$(dirname "$0")/android" || exit

echo "📦 Building Release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ APK Build Successful!"
    echo ""
    echo "📍 Output file:"
    echo "   app/build/outputs/apk/release/app-release.apk"
    
    APK_FILE="app/build/outputs/apk/release/app-release.apk"
    if [ -f "$APK_FILE" ]; then
        FILE_SIZE=$(du -h "$APK_FILE" | cut -f1)
        echo "📊 File size: $FILE_SIZE"
    fi
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
