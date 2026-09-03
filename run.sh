
export TMPDIR=/tmp/metro-cache-$GAME
mkdir -p $TMPDIR

# expo itself auto-loads .env, but only once it starts -- too late for the
# --device flag below, which bash has to substitute before invoking expo. Load
# it here too so DEVICE_ID_IOS is already in the shell's own environment.
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

PLATFORM=${1:-ios}

# Native projects are baked by expo prebuild for one game's scheme/bundle id/app
# group. Running the wrong one leaves those mismatched -- the app boots but reads
# e.g. group.com.aoe2companion while the installed shell only registered
# group.com.aoe4companion, throwing "Cannot read property 'uri' of undefined".
# iOS gets its own Xcode project directory per game (AoEIICompanion vs
# AoEIVCompanion, named from app.config.ts's "name" with spaces stripped), so
# presence/absence tells them apart. Android reuses one "android" directory for
# both games, so its build.gradle applicationId is checked instead.
if [ "$GAME" = "aoe2" ]; then
    EXPECTED_XCODE_DIR="AoEIICompanion"
    EXPECTED_APPLICATION_ID="com.aoe2companion"
else
    EXPECTED_XCODE_DIR="AoEIVCompanion"
    EXPECTED_APPLICATION_ID="com.aoe4companion"
fi

if [ "$PLATFORM" = "android" ]; then
    if [ -d android ] && ! grep -q "applicationId '$EXPECTED_APPLICATION_ID'" android/app/build.gradle; then
        echo "android/ was built for the other game (expected applicationId $EXPECTED_APPLICATION_ID) -- deleting and re-running prebuild for GAME=$GAME"
        rm -rf android
    fi
    if [ ! -d android ]; then
        bash prebuild.sh
    fi
    npx expo run:android
else
    if [ -d ios ] && [ ! -d "ios/$EXPECTED_XCODE_DIR" ]; then
        echo "ios/ was built for the other game (expected ios/$EXPECTED_XCODE_DIR) -- deleting and re-running prebuild for GAME=$GAME"
        rm -rf ios
    fi
    if [ ! -d ios ]; then
        bash prebuild.sh
    fi
    npx expo run:ios --device $DEVICE_ID_IOS
fi
