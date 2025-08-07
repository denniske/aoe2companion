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

read -p "Upload Sentry sourcemaps for this version? (Y/n): " confirm
confirm=${confirm:-y}  # Default to 'y'

if [[ "$confirm" == "y" || "$confirm" == "Y" ]]; then
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
else
    echo "Skipping sentry sourcemap upload."
fi

echo "📦 Building ${PLATFORM} app for ${APP}..."
eas build --profile "production-${APP}" --platform $PLATFORM --local --non-interactive --output "$NAME"

#echo "🚀 Submitting ${PLATFORM} app for ${APP}..."
#eas submit --profile "production-${APP}" -p $PLATFORM --no-wait --non-interactive --path "$NAME"
#
#echo "✅ ${PLATFORM} app for ${APP} submitted successfully!"
