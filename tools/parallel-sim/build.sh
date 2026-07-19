#!/bin/bash
# One-time native dev-client build per platform (the CPU-heavy step).
# The resulting artifact is feature-independent: every lane installs the SAME
# build and just points at a different Metro bundler. Only rebuild if a feature
# changes NATIVE code (new native dep / config-plugin / app.config native keys).
#
#   build.sh ios       -> builds/ios/<app>.app
#   build.sh android   -> builds/android/<apk>.apk
#   build.sh both
source "$(dirname "$0")/lib.sh"

build_ios() {
  log "building iOS simulator dev client (GAME=$GAME) — this is the slow part"
  local tmp; tmp="$(mktemp -d)"
  ( cd "$MAIN_REPO" && GAME="$GAME" TMPDIR="/tmp/metro-cache-$GAME" \
      eas build --profile "development-simulator-$GAME" --platform ios --local \
      --non-interactive --output "$tmp/ios.tar.gz" )
  rm -f "$HARNESS_DIR"/builds/ios/*.app 2>/dev/null || true
  tar -xzf "$tmp/ios.tar.gz" -C "$HARNESS_DIR/builds/ios"
  rm -rf "$tmp"
  log "iOS build ready: $(ios_app_path)"
}
build_android() {
  log "building Android dev client APK (GAME=$GAME) — this is the slow part"
  rm -f "$HARNESS_DIR"/builds/android/*.apk 2>/dev/null || true
  ( cd "$MAIN_REPO" && GAME="$GAME" TMPDIR="/tmp/metro-cache-$GAME" \
      eas build --profile "development-simulator-$GAME" --platform android --local \
      --non-interactive --output "$HARNESS_DIR/builds/android/app.apk" )
  log "Android build ready: $(android_apk_path)"
}

case "${1:-both}" in
  ios) build_ios;;
  android) build_android;;
  both) build_ios; build_android;;
  *) err "usage: build.sh <ios|android|both>"; exit 2;;
esac
