#!/bin/bash
# Shared config + helpers for the parallel headless simulator harness.
# Two "lanes" (A and B) run two features side by side across iOS + Android,
# entirely headless (no visible windows, no focus stealing).
#
# Source this from the other scripts:  source "$(dirname "$0")/lib.sh"

set -euo pipefail

# ---- environment -----------------------------------------------------------
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

HARNESS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_REPO="$(cd "$HARNESS_DIR/../.." && pwd)"
RUN_DIR="$HARNESS_DIR/run"          # pid files, udid files, logs
mkdir -p "$RUN_DIR"

# App identity (GAME=aoe2 -> aoe2companion)
GAME="${GAME:-aoe2}"
SCHEME="${GAME}companion"           # dev-client deep-link scheme, e.g. aoe2companion

# ---- lanes -----------------------------------------------------------------
# Each lane = one feature. Everything is keyed by lane letter (a|b).
# NOTE: port 8081 is intentionally avoided — that's the user's own Metro.
lane_metro_port() { case "$1" in a) echo 8082;; b) echo 8083;; esac; }
lane_ios_name()   { case "$1" in a) echo "aoe-sim-a";; b) echo "aoe-sim-b";; esac; }
lane_android_avd(){ case "$1" in a) echo "Pixel_7_Pro_API_34";; b) echo "Pixel_7_Pro_API_34_b";; esac; }
lane_android_port(){ case "$1" in a) echo 5554;; b) echo 5556;; esac; }   # console port; adb serial = emulator-<port>
lane_android_serial(){ echo "emulator-$(lane_android_port "$1")"; }
[ -f "$RUN_DIR/lanes.env" ] && source "$RUN_DIR/lanes.env"                  # sets LANE_A_WORKTREE / LANE_B_WORKTREE
lane_worktree()   { local u v val; u="$(printf '%s' "$1" | tr 'a-z' 'A-Z')"; v="LANE_${u}_WORKTREE"; val="${!v:-}"; echo "${val:-$MAIN_REPO/.claude/worktrees/feat-$1}"; }

# iOS runtime/device to create sims on (stable, not the 26.x betas)
IOS_RUNTIME="${IOS_RUNTIME:-com.apple.CoreSimulator.SimRuntime.iOS-18-4}"
IOS_DEVICETYPE_PREF=("iPhone 16 Pro" "iPhone 16" "iPhone 15 Pro" "iPhone 15")

# Build artifacts (populated by the build step; see build-ios.sh / build-android.sh)
ios_app_path()  { ls -dt "$HARNESS_DIR"/builds/ios/*.app 2>/dev/null | head -1; }
android_apk_path() { ls -t "$HARNESS_DIR"/builds/android/*.apk 2>/dev/null | head -1; }

# dev-client deep link that points a device at a given Metro bundler
devclient_url() { echo "${SCHEME}://expo-development-client/?url=http://localhost:$1"; }

log() { printf '\033[1;36m[harness]\033[0m %s\n' "$*"; }
err() { printf '\033[1;31m[harness]\033[0m %s\n' "$*" >&2; }

require_lane() { case "${1:-}" in a|b) : ;; *) err "usage: $0 <a|b> [...]"; exit 2;; esac; }

# ---- iOS sim helpers -------------------------------------------------------
ios_udid() {  # echo udid of the lane's sim, empty if it doesn't exist
  xcrun simctl list devices -j 2>/dev/null \
    | /usr/bin/python3 -c "import json,sys;d=json.load(sys.stdin);\
print(next((x['udid'] for r in d['devices'].values() for x in r if x['name']=='$(lane_ios_name "$1")'), ''))"
}
ios_pick_devicetype() {
  local avail; avail="$(xcrun simctl list devicetypes)"
  for n in "${IOS_DEVICETYPE_PREF[@]}"; do
    if grep -qF "$n (" <<<"$avail"; then echo "$n"; return; fi
  done
  echo "iPhone 15"
}
ios_ensure() {  # create the lane's sim if missing; echo udid
  local u; u="$(ios_udid "$1")"
  if [ -z "$u" ]; then
    local dt; dt="$(ios_pick_devicetype)"
    log "creating iOS sim '$(lane_ios_name "$1")' ($dt, $IOS_RUNTIME)" >&2
    u="$(xcrun simctl create "$(lane_ios_name "$1")" "$dt" "$IOS_RUNTIME")"
  fi
  echo "$u"
}

