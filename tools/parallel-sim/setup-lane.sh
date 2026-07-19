#!/bin/bash
# Create a git worktree for a lane's feature and record the mapping.
#   setup-lane.sh <a|b> <branch-name>
# e.g. setup-lane.sh a feat/leaderboard-filters
source "$(dirname "$0")/lib.sh"
require_lane "${1:-}"
lane="$1"; branch="${2:?usage: setup-lane.sh <a|b> <branch-name>}"
wt="$MAIN_REPO/.claude/worktrees/lane-$lane-$(echo "$branch" | tr '/ ' '--')"

if [ -d "$wt" ]; then
  log "worktree already exists: $wt"
else
  log "creating worktree for lane[$lane]: $branch"
  ( cd "$MAIN_REPO" && git worktree add -b "$branch" "$wt" main )
fi

# Worktrees don't get node_modules (gitignored). Symlink the main repo's so both
# Metro bundling and typecheck work without a multi-GB duplicate install.
if [ ! -e "$wt/node_modules" ]; then
  log "symlinking node_modules -> main repo"
  ln -s "$MAIN_REPO/node_modules" "$wt/node_modules"
fi

# persist mapping
lane_uc="$(printf '%s' "$lane" | tr 'a-z' 'A-Z')"
touch "$RUN_DIR/lanes.env"
grep -v "^LANE_${lane_uc}_WORKTREE=" "$RUN_DIR/lanes.env" > "$RUN_DIR/lanes.env.tmp" 2>/dev/null || true
echo "LANE_${lane_uc}_WORKTREE=\"$wt\"" >> "$RUN_DIR/lanes.env.tmp"
mv "$RUN_DIR/lanes.env.tmp" "$RUN_DIR/lanes.env"
log "lane[$lane] -> $wt"
log "metro port $(lane_metro_port "$lane") | ios '$(lane_ios_name "$lane")' | android '$(lane_android_avd "$lane")'"
