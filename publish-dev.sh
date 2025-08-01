#!/bin/bash
set -e

trap 'echo "❌ Error occurred at line $LINENO. Exiting..."' ERR

if [[ "$PLATFORM" == "ios" ]]; then
  EXT="ipa"
elif [[ "$PLATFORM" == "android" ]]; then
  EXT="aab"
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
eas build --profile "development-${APP}" --platform $PLATFORM --local --non-interactive --output "$NAME"

echo "✅ ${PLATFORM} app for ${APP} built successfully!"
