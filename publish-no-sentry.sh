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

NAME="$(date "+%Y-%m-%d-%H:%M:%S").${EXT}"
APP="aoe2"

echo "App: ${APP}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"


echo "📦 Building ${PLATFORM} app for ${APP}..."
eas build --profile "production-${APP}" --platform $PLATFORM --local --non-interactive --output "$NAME"

echo "🚀 Submitting ${PLATFORM} app for ${APP}..."
eas submit --profile "production-${APP}" -p $PLATFORM --no-wait --non-interactive --path "$NAME"

echo "✅ ${PLATFORM} app for ${APP} submitted successfully!"
