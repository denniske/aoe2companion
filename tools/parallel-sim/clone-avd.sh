#!/bin/bash
# Clone the existing Pixel_7_Pro_API_34 AVD into a second cold-boot AVD so two
# Android emulators can run at once. Cheap: reuses the already-installed
# android-34 system image, copies only the base disks.
source "$(dirname "$0")/lib.sh"

SRC="${1:-Pixel_7_Pro_API_34}"
DST="${2:-Pixel_7_Pro_API_34_b}"
AVDH="$HOME/.android/avd"

[ -d "$AVDH/$SRC.avd" ] || { err "source AVD $SRC not found"; exit 1; }
if [ -d "$AVDH/$DST.avd" ]; then log "$DST already exists — skipping"; exit 0; fi

log "cloning $SRC -> $DST"
mkdir -p "$AVDH/$DST.avd"
# copy only the base (non-volatile) disks + config; emulator regenerates the rest cold
for f in config.ini userdata.img sdcard.img; do
  [ -e "$AVDH/$SRC.avd/$f" ] && cp "$AVDH/$SRC.avd/$f" "$AVDH/$DST.avd/$f"
done

# top-level .ini
sed -e "s#/$SRC.avd#/$DST.avd#g" -e "s#avd/$SRC.avd#avd/$DST.avd#g" \
    "$AVDH/$SRC.ini" > "$AVDH/$DST.ini"

# config.ini: rename identity, drop backup skin path that points at absolute dir (kept: fine)
sed -i '' \
  -e "s/^AvdId *=.*/AvdId = $DST/" \
  -e "s/^avd.ini.displayname *=.*/avd.ini.displayname = ${DST//_/ }/" \
  "$AVDH/$DST.avd/config.ini"

log "done. AVDs now:"; emulator -list-avds
