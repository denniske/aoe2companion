# Parallel headless simulator harness

Run **two features side by side** across **iOS + Android** simulators, fully
headless — no simulator windows open, nothing steals focus while you keep using
the Mac. Your own Metro on **:8081 is never touched**; lanes use **:8082 / :8083**.

## Model

| Lane | Feature (branch) | Metro | iOS sim   | Android AVD              |
|------|------------------|-------|-----------|--------------------------|
| a    | worktree A       | 8082  | aoe-sim-a | Pixel_7_Pro_API_34       |
| b    | worktree B       | 8083  | aoe-sim-b | Pixel_7_Pro_API_34_b     |

One dev-client build **per platform** is shared by both lanes. Each device's dev
client is pointed at its lane's Metro via a deep link, so the same binary runs
feature A's JS on lane a and feature B's JS on lane b. **JS/TS changes need no
rebuild** — just reload. Rebuild only if a feature changes native code.

## One-time setup

```bash
cd tools/parallel-sim
./clone-avd.sh                       # 2nd Android emulator (done)
./setup-lane.sh a feat/<feature-a>   # worktree + branch for lane a
./setup-lane.sh b feat/<feature-b>   # worktree + branch for lane b
./build.sh both                      # HEAVY: iOS + Android dev clients (~15-30m/ea)
```

## Daily use

```bash
./ctl.sh up a          # metro + boot iOS&Android + install + route, headless
./ctl.sh up b
./ctl.sh shot a        # screenshot both platforms of lane a -> run/*.png
./ctl.sh shot b ios out.png
./ctl.sh status
./ctl.sh down all      # shut everything down
```

Sub-commands (all take a lane + optional `ios|android|both`):
`boot`, `install`, `route`, `metro <a|b> [start|stop]`, `shot`.

## How headless works

- **iOS** — `simctl boot` runs the sim with no Simulator.app window. Interaction
  and capture via `simctl` (`openurl`, `io … screenshot`).
- **Android** — `emulator -no-window`; drive with `adb` (`reverse` maps the
  device's localhost to the host so `localhost:PORT` reaches Metro), capture with
  `adb exec-out screencap`.

## Notes

- `run/` holds pid files, logs, screenshots, and `lanes.env` (lane→worktree map).
- Resource cost: 2 emulators + 2 Metro bundlers is heavy but idle-quiet; if the
  Mac struggles, run one lane at a time — the harness is per-lane.
- Rebuild a lane's native code:  re-run `./build.sh <platform>` then
  `./ctl.sh install <lane>`.

## Known limitation — 2nd Android emulator adb auth

`clone-avd.sh` clones the Play-Store AVD with a fresh userdata, so the second
emulator (`emulator-5556`) can come up **`unauthorized`** in `adb` (the Play
image requires the host adb key pre-seeded in userdata, which a cold clone
lacks). Until fixed, either:
- run the two features on **one** Android device by re-routing it to the other
  lane's Metro (`adb -s emulator-5554 reverse tcp:8083 tcp:8083` + open the
  dev-client URL for 8083), or
- create the second AVD from a **google_apis** (non-Play-Store) system image,
  which auto-authorizes headless adb.

iOS has no such issue — both sims run fully parallel. Headless iOS **input**
needs `idb` (`brew install facebook/fb/idb-companion` + `pipx install --python
python3.12 fb-idb`); tap/swipe/text via `idb ui ...`.
