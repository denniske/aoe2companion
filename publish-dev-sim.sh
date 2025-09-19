#!/bin/bash
set -e

trap 'echo "❌ Error occurred at line $LINENO. Exiting..."' ERR

if [[ "$PLATFORM" == "ios" ]]; then
  EXT="tar.gz"
elif [[ "$PLATFORM" == "android" ]]; then
  EXT="apk"
else
  echo "❌ Unsupported platform: $PLATFORM"
  exit 1
fi

APP="aoe2"
NAME="build-$(date "+%Y-%m-%d-%H-%M")-${APP}-dev.${EXT}"

echo "App: ${APP}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"


echo "📦 Building ${PLATFORM} app for ${APP}..."
#eas build --profile "development-simulator-${APP}" --platform $PLATFORM --local --output "$NAME"
#eas build --profile "development-simulator-${APP}" --platform $PLATFORM --local --non-interactive --output "$NAME"
eas build --profile "development-simulator-${APP}" --platform $PLATFORM --local --non-interactive

# unpack .tar.gz with the unarchiver if ios
if [[ "$PLATFORM" == "ios" ]]; then
  mkdir -p output
  mv *.tar.gz output/
  cd output
  tar -xvzf *.tar.gz
  rm *.tar.gz
  echo "Unpacked .tar.gz file to output/ directory."
fi


echo "✅ ${PLATFORM} app for ${APP} built successfully!"
