#!/bin/bash
# Single entry point for the parallel headless sim harness.
#
#   ctl.sh up      <a|b>                 boot both platforms, start metro, install, route
#   ctl.sh down     <a|b|all>            tear a lane (or everything) down
#   ctl.sh boot     <a|b> [ios|android|both]
#   ctl.sh install  <a|b> [ios|android|both]
#   ctl.sh route    <a|b> [ios|android|both]   point dev client at the lane's Metro
#   ctl.sh metro    <a|b> [start|stop]
#   ctl.sh shot     <a|b> [ios|android|both] [outfile]
#   ctl.sh status
#
# Everything runs headless: iOS via `simctl boot` (no Simulator.app), Android via
# `emulator -no-window`. Nothing takes over the screen or steals focus.
source "$(dirname "$0")/lib.sh"

cmd="${1:-}"; shift || true

# ---------- Metro ----------
metro_start() {
  local lane="$1" port wt cache pidf logf
  port="$(lane_metro_port "$lane")"; wt="$(lane_worktree "$lane")"
  pidf="$RUN_DIR/metro-$lane.pid"; logf="$RUN_DIR/metro-$lane.log"
  cache="/tmp/metro-cache-${GAME}-${lane}"; mkdir -p "$cache"
  if [ -f "$pidf" ] && kill -0 "$(cat "$pidf")" 2>/dev/null; then log "metro[$lane] already up on $port"; return; fi
  [ -d "$wt" ] || { err "worktree missing: $wt (create the feature worktree first)"; return 1; }
  log "starting metro[$lane] on :$port  (cwd=$wt)"
  ( cd "$wt" && TMPDIR="$cache" GAME="$GAME" nohup npx expo start --dev-client -p "$port" \
      >"$logf" 2>&1 & echo $! >"$pidf" )
  log "  logs: $logf"
}
metro_stop() {
  local pidf="$RUN_DIR/metro-$1.pid"
  [ -f "$pidf" ] && { kill "$(cat "$pidf")" 2>/dev/null || true; rm -f "$pidf"; log "metro[$1] stopped"; }
}

# ---------- boot ----------
boot_ios() {
  local lane="$1" u; u="$(ios_ensure "$lane")"
  local state; state="$(xcrun simctl list devices | grep "$u" | grep -o "Booted" || true)"
  if [ "$state" = "Booted" ]; then log "ios[$lane] already booted ($u)"; return; fi
  log "booting ios[$lane] headless ($u)"; xcrun simctl boot "$u"
  xcrun simctl bootstatus "$u" -b >/dev/null 2>&1 || true
}
boot_android() {
  local lane="$1" avd port pidf logf; avd="$(lane_android_avd "$lane")"
  port="$(lane_android_port "$lane")"; pidf="$RUN_DIR/emu-$lane.pid"; logf="$RUN_DIR/emu-$lane.log"
  if adb devices | grep -q "$(lane_android_serial "$lane")"; then log "android[$lane] already up"; return; fi
  log "booting android[$lane] headless ($avd on console $port)"
  nohup emulator -avd "$avd" -port "$port" -no-window -no-boot-anim -no-snapshot \
      -gpu swiftshader_indirect >"$logf" 2>&1 &
  echo $! >"$pidf"
  log "  waiting for boot..."; adb -s "$(lane_android_serial "$lane")" wait-for-device
  until [ "$(adb -s "$(lane_android_serial "$lane")" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do sleep 2; done
  log "  android[$lane] booted"
}

# ---------- install ----------
install_ios() {
  local lane="$1" app; app="$(ios_app_path)"
  [ -n "$app" ] || { err "no iOS .app in builds/ios — run the build first"; return 1; }
  log "installing $(basename "$app") on ios[$lane]"; xcrun simctl install "$(ios_udid "$lane")" "$app"
}
install_android() {
  local lane="$1" apk; apk="$(android_apk_path)"
  [ -n "$apk" ] || { err "no APK in builds/android — run the build first"; return 1; }
  log "installing $(basename "$apk") on android[$lane]"; adb -s "$(lane_android_serial "$lane")" install -r "$apk"
}

# ---------- route (point dev client at this lane's Metro) ----------
route_ios() {
  local lane="$1" url; url="$(devclient_url "$(lane_metro_port "$lane")")"
  log "routing ios[$lane] -> $url"; xcrun simctl openurl "$(ios_udid "$lane")" "$url"
}
route_android() {
  local lane="$1" serial port url; serial="$(lane_android_serial "$lane")"
  port="$(lane_metro_port "$lane")"; url="$(devclient_url "$port")"
  adb -s "$serial" reverse "tcp:$port" "tcp:$port"   # device localhost:PORT -> host
  log "routing android[$lane] -> $url"
  adb -s "$serial" shell am start -a android.intent.action.VIEW -d "$url" >/dev/null
}

# ---------- screenshot ----------
shot_ios() {
  local lane="$1" out="${2:-$RUN_DIR/ios-$lane-$(date +%H%M%S).png}"
  xcrun simctl io "$(ios_udid "$lane")" screenshot "$out" && log "wrote $out"
}
shot_android() {
  local lane="$1" out="${2:-$RUN_DIR/android-$lane-$(date +%H%M%S).png}"
  adb -s "$(lane_android_serial "$lane")" exec-out screencap -p >"$out" && log "wrote $out"
}

# ---------- dispatch ----------
for_platform() {  # for_platform <plat-arg> <fn_ios> <fn_android> <lane> [extra]
  local plat="${1:-both}" fi="$2" fa="$3" lane="$4"; shift 4
  case "$plat" in
    ios) "$fi" "$lane" "$@";;
    android) "$fa" "$lane" "$@";;
    both|"") "$fi" "$lane" "$@"; "$fa" "$lane" "$@";;
    *) err "platform must be ios|android|both"; exit 2;;
  esac
}

case "$cmd" in
  metro)   require_lane "${1:-}"; [ "${2:-start}" = stop ] && metro_stop "$1" || metro_start "$1";;
  boot)    require_lane "${1:-}"; for_platform "${2:-both}" boot_ios boot_android "$1";;
  install) require_lane "${1:-}"; for_platform "${2:-both}" install_ios install_android "$1";;
  route)   require_lane "${1:-}"; for_platform "${2:-both}" route_ios route_android "$1";;
  shot)    require_lane "${1:-}"; for_platform "${2:-both}" shot_ios shot_android "$1" "${3:-}";;
  up)
    require_lane "${1:-}"; lane="$1"
    metro_start "$lane"
    boot_ios "$lane"; boot_android "$lane"
    install_ios "$lane"; install_android "$lane"
    sleep 2; route_ios "$lane"; route_android "$lane"
    log "lane[$lane] up. screenshot with:  ctl.sh shot $lane"
    ;;
  down)
    target="${1:-all}"
    for lane in a b; do
      [ "$target" = all ] || [ "$target" = "$lane" ] || continue
      metro_stop "$lane"
      u="$(ios_udid "$lane")"; [ -n "$u" ] && xcrun simctl shutdown "$u" 2>/dev/null || true
      adb -s "$(lane_android_serial "$lane")" emu kill 2>/dev/null || true
      rm -f "$RUN_DIR/emu-$lane.pid"
      log "lane[$lane] down"
    done
    ;;
  status)
    echo "== iOS sims =="; xcrun simctl list devices | grep -E "aoe-sim-(a|b)" || echo "  (none created)"
    echo "== Android =="; adb devices | grep emulator || echo "  (none running)"
    echo "== Metro =="; for l in a b; do p="$RUN_DIR/metro-$l.pid";
      [ -f "$p" ] && kill -0 "$(cat "$p")" 2>/dev/null && echo "  lane $l: up on $(lane_metro_port "$l") (pid $(cat "$p"))" || echo "  lane $l: down"; done
    echo "== Builds =="; echo "  ios: $(ios_app_path || echo none)"; echo "  apk: $(android_apk_path || echo none)"
    ;;
  *) grep -E '^#( |$)' "$0" | sed 's/^# \{0,1\}//'; exit 2;;
esac
