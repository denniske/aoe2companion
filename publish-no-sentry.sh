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

# we need to set that on the cli with export GAME=aoe2, so that eas submit also knows which app to submit to
if [ -z $GAME ]
then
  echo 'GAME is not set.'
  exit 1
fi

NAME="$(date "+%Y-%m-%d-%H:%M:%S").${EXT}"

echo "Game: ${GAME}"
echo "Platform: ${PLATFORM}"
echo "Filename: ${NAME}"

#read -p "Upload Sentry sourcemaps for this version? (Y/n): " confirm
#confirm=${confirm:-y}  # Default to 'y'

#if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
    if [ -f .env ]; then
        export $(grep -E '^SENTRY_AUTH_TOKEN=' .env | xargs)

        if [[ -z "$SENTRY_AUTH_TOKEN" ]]; then
            echo "SENTRY_AUTH_TOKEN not found in .env file."
            exit 1
        fi

        echo "SENTRY_AUTH_TOKEN loaded."
    else
        echo ".env file not found."
        exit 1
    fi
#else
#    export SENTRY_DISABLE_AUTO_UPLOAD=true
#    echo "Skipping sentry sourcemap upload."
#fi

# https://github.com/expo/expo/issues/39782
export EAS_SKIP_AUTO_FINGERPRINT=1

echo "📦 Building ${PLATFORM} app for ${GAME}..."
eas build --profile "production-${GAME}" --platform $PLATFORM --local --non-interactive --output "$NAME"

echo "🚀 Submitting ${PLATFORM} app for ${GAME}..."
eas submit --profile "production-${GAME}" -p $PLATFORM --no-wait --non-interactive --path "$NAME"

echo "✅ ${PLATFORM} app for ${GAME} submitted successfully!"
