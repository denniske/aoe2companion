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

# we need to set that on the cli with export GAME=aoe2, so that eas submit also knows which app to submit to
if [ -z $GAME ]
then
  echo 'GAME is not set.'
  exit 1
fi

NAME="build-$(date "+%Y-%m-%d-%H-%M")-${GAME}-dev.${EXT}"

echo "Game: ${GAME}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"


echo "📦 Building ${PLATFORM} app for ${GAME}..."
#eas build --profile "development-simulator-${GAME}" --platform $PLATFORM --local --output "$NAME"
#eas build --profile "development-simulator-${GAME}" --platform $PLATFORM --local --non-interactive --output "$NAME"
eas build --profile "development-simulator-${GAME}" --platform $PLATFORM --local --non-interactive

# unpack .tar.gz with the unarchiver if ios
if [[ "$PLATFORM" == "ios" ]]; then
  mkdir -p output
  mv *.tar.gz output/
  cd output
  tar -xvzf *.tar.gz
  rm *.tar.gz
  echo "Unpacked .tar.gz file to output/ directory."
fi


echo "✅ ${PLATFORM} app for ${GAME} built successfully!"
