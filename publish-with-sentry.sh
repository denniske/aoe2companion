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

source ./scripts/load-fontawesome-token.sh

echo "🔍 Checking components with react compiler..."
if ! yarn lint:compiler --strict --failures-only; then
  echo "❌ React compiler check failed. Aborting build."
  exit 1
fi
echo "✅ React compiler check passed."

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
export EAS_GRADLE_CACHE=1

# rm -rf node_modules && yarn cache clean && yarn && watchman watch-del-all && rm -fr $TMPDIR/haste-map-* || rm -rf $TMPDIR/metro-cache

rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache

#export GRADLE_USER_HOME=~/.gradle-$GAME
#export ANDROID_BUILD_CACHE_DIR=~/.android-build-cache-$GAME
#export TMPDIR=/tmp/metro-cache-$GAME
#mkdir -p $TMPDIR

echo "📦 Building ${PLATFORM} app for ${GAME}..."
eas build --profile "production-${GAME}" --platform $PLATFORM --local --non-interactive --output "$NAME"

echo "🚀 Submitting ${PLATFORM} app for ${GAME}..."
eas submit --profile "production-${GAME}" -p $PLATFORM --no-wait --non-interactive --path "$NAME"

echo "✅ ${PLATFORM} app for ${GAME} submitted successfully!"

# Tell Sentry which commits went into this build.
#
# The @sentry/react-native expo plugin already created the release during the build and uploaded
# its sourcemaps; what it does not do is attach the commit history. That is what makes "Fixes
# AOE2COMPANION-123" in a commit message resolve the issue, and what lets Sentry blame a stack
# frame on a specific change. Sentry only acts on such a reference once it has seen the commit,
# and it only sees commits attached to a release.
#
# The release name has to match the one the app reports byte for byte, or set-commits silently
# creates a second, empty release instead. It is <bundle id>@<version>+<build>, where the build
# differs per platform -- ios uses the build number, android the version code -- so both are read
# back out of the resolved expo config rather than reconstructed here.
#
# Non-fatal: the build is already submitted by this point.
echo "🔗 Associating commits with the Sentry release..."
SENTRY_RELEASE=$(GAME=$GAME npx expo config --json --type public 2>/dev/null | PLATFORM=$PLATFORM node -e "
const config = JSON.parse(require('fs').readFileSync(0, 'utf8'));
const platform = process.env.PLATFORM === 'ios' ? config.ios : config.android;
const name = platform.bundleIdentifier || platform.package;
const build = platform.buildNumber || platform.versionCode;
console.log(name + '@' + config.version + '+' + build);
")

if [[ -z "$SENTRY_RELEASE" ]]; then
    echo "⚠️  Could not determine the Sentry release name -- skipping commit association."
else
    (
        set +e
        # Same project mapping as app.config.ts: aoe2 -> aoe2companion, aoe4 -> aoe4companion.
        SENTRY_CLI="./node_modules/.bin/sentry-cli releases -o aoe2companion -p ${GAME}companion"
        $SENTRY_CLI set-commits "$SENTRY_RELEASE" --commit "denniske/aoe2companion@$(git rev-parse HEAD)" &&
        echo "✅ Commits associated with $SENTRY_RELEASE" ||
        echo "⚠️  Could not associate commits with $SENTRY_RELEASE -- the build itself is fine."
    )
fi
