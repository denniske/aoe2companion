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

# we need to set that on the cli with export GAME=aoe2, so that eas submit also knows which app to submit to
if [ -z $GAME ]
then
  echo 'GAME is not set.'
  exit 1
fi

NAME="build-$(date "+%Y-%m-%d-%H-%M")-${GAME}-internal.${EXT}"

echo "Game: ${GAME}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"

# https://github.com/expo/expo/issues/39782
export EAS_SKIP_AUTO_FINGERPRINT=1

echo "📦 Building ${PLATFORM} app for ${GAME}..."
eas build --profile "internal-${GAME}" --platform $PLATFORM --local --non-interactive --output "$NAME"

echo "✅ ${PLATFORM} app for ${GAME} built successfully!"
