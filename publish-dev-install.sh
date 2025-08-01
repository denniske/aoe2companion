#!/bin/bash
set -e

trap 'echo "❌ Error occurred at line $LINENO. Exiting..."' ERR

if [[ "$PLATFORM" == "ios" ]]; then
  EXT="ipa"
elif [[ "$PLATFORM" == "android" ]]; then
  EXT="apk"
else
  echo "❌ Unsupported platform: $PLATFORM"
  exit 1
fi

APP="aoe2"
NAME=$(ls -t *aoe2-dev.$EXT | head -n 1)
DEVICE=45161JEKB06496
PACKAGE_NAME="com.${APP}companion"


echo "App: ${APP}"
echo "PACKAGE_NAME: ${PACKAGE_NAME}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"
echo "Device: ${DEVICE}"


echo ""
echo "Looking for ${DEVICE}"
adb devices | awk -v dev="$DEVICE" '$1 == dev && $2 == "device"'

if adb devices | awk -v dev="$DEVICE" '$1 == dev && $2 == "device"' | grep -q .; then
  echo "Device is connected."
else
  echo "Device $DEVICE not found. Exiting..."
  exit 1
fi

echo ""


echo "Uninstalling $PACKAGE_NAME from device..."
adb -s $DEVICE uninstall $PACKAGE_NAME || echo "App not found on device, skipping uninstall."

echo ""

echo "📦 Installing ${PLATFORM} app for ${APP}..."

adb -s $DEVICE install -r $NAME

echo "✅ ${PLATFORM} app for ${APP} installed successfully!"
