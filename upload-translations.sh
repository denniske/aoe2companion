# EXAMPLE:
# yarn upload:translations
# yarn upload:translations --dry-run
# yarn upload:translations --force
#
# Uploads assets/translations/*.json to the R2 bucket behind
# i18n.cdn.aoe2companion.com. The app fetches translations from that CDN at
# runtime — the files in this repo are only the bundled English seed plus a
# cache — so edits to assets/translations reach nobody until this script runs.
#
# By default the upload has to be purely additive: if it would remove or change
# a key that is already live, the script aborts and prints what would change.
# Pass --force when a removal or a wording change is actually intended.
#
# Only the files whose keys differ from what is live get uploaded — a file that
# is already equivalent on R2 is left untouched.

set -euo pipefail

DRY_RUN=false
FORCE=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --force) FORCE=true ;;
    *) echo "❌ Unknown argument: $arg (expected --dry-run or --force)"; exit 1 ;;
  esac
done

BUCKET=${BUCKET:-aoe2companion-i18n}
PREFIX=${PREFIX:-translations}
SOURCE_DIR=${SOURCE_DIR:-assets/translations}

# -p as well as -c: without it doppler falls back to a per-directory scope in
# ~/.doppler, which is not part of the repo and is missing on a fresh clone.
export DOPPLER_PROJECT=${DOPPLER_PROJECT:-aoecompanion}
DOPPLER_CONFIG=${DOPPLER_CONFIG:-dev_aoe2}

for cmd in doppler aws node; do
  command -v $cmd >/dev/null || { echo "❌ $cmd is not installed."; exit 1; }
done

# The R2 credentials are S3-compatible. CLOUDFLARE_API_TOKEN is deliberately not
# used here: it is read-only for R2 and a put fails with a 403.
export AWS_ACCESS_KEY_ID=$(doppler secrets get R2_ACCESS_KEY_ID -p $DOPPLER_PROJECT -c $DOPPLER_CONFIG --plain)
export AWS_SECRET_ACCESS_KEY=$(doppler secrets get R2_SECRET_ACCESS_KEY -p $DOPPLER_PROJECT -c $DOPPLER_CONFIG --plain)
export AWS_DEFAULT_REGION=$(doppler secrets get R2_REGION -p $DOPPLER_PROJECT -c $DOPPLER_CONFIG --plain)
R2_ENDPOINT=$(doppler secrets get R2_ENDPOINT -p $DOPPLER_PROJECT -c $DOPPLER_CONFIG --plain)

if [ -z "$AWS_ACCESS_KEY_ID" ] || [ -z "$AWS_SECRET_ACCESS_KEY" ] || [ -z "$R2_ENDPOINT" ]; then
  echo "❌ Could not read R2 credentials from doppler ($DOPPLER_PROJECT / $DOPPLER_CONFIG). Aborting."
  exit 1
fi

# R2 rejects the additional checksums the AWS CLI sends by default.
export AWS_REQUEST_CHECKSUM_CALCULATION=when_required
export AWS_RESPONSE_CHECKSUM_VALIDATION=when_required

s3() { aws s3 "$@" --endpoint-url "$R2_ENDPOINT"; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "🔍 Checking local translation files..."
node -e '
const fs = require("fs"), path = require("path");
const dir = process.argv[1];
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
if (!files.length) { console.error("no .json files in " + dir); process.exit(1); }
let bad = 0;
for (const f of files) {
  try {
    const d = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    if (!d || typeof d !== "object" || Array.isArray(d)) throw new Error("not a JSON object");
  } catch (e) { console.error(`  ${f}: ${e.message}`); bad++; }
}
if (bad) process.exit(1);
console.log(`  ${files.length} files parse cleanly.`);
' "$SOURCE_DIR"

echo "⬇️  Fetching what is currently live..."
mkdir -p "$TMP/current"
s3 cp "s3://$BUCKET/$PREFIX/" "$TMP/current/" --recursive --only-show-errors

cat > "$TMP/compare.js" <<'NODE'
const fs = require("fs"), path = require("path");
const [localDir, currentDir, force] = process.argv.slice(2);
// The human-readable report goes to stderr so stdout can carry just the list of
// files that need uploading, which the shell captures.
const log = (...a) => console.error(...a);
const read = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null);

let added = 0, removed = 0, changed = 0, destructive = false;
const toUpload = [];
for (const file of fs.readdirSync(localDir).filter((f) => f.endsWith(".json")).sort()) {
  const local = read(path.join(localDir, file));
  const live = read(path.join(currentDir, file));
  if (live === null) {
    added += Object.keys(local).length;
    log(`  ${file.replace(".json", "").padEnd(8)} new file, ${Object.keys(local).length} keys`);
    toUpload.push(file);
    continue;
  }
  const gone = Object.keys(live).filter((k) => !(k in local));
  const diff = Object.keys(live).filter((k) => k in local && live[k] !== local[k]);
  const fresh = Object.keys(local).filter((k) => !(k in live));
  added += fresh.length; removed += gone.length; changed += diff.length;
  if (gone.length || diff.length) destructive = true;
  if (fresh.length || gone.length || diff.length) toUpload.push(file);
  const flag = gone.length || diff.length ? "  <-- not additive" : "";
  log(
    `  ${file.replace(".json", "").padEnd(8)} live=${String(Object.keys(live).length).padStart(5)}` +
      ` -> ${String(Object.keys(local).length).padStart(5)} | +${String(fresh.length).padStart(3)} added,` +
      ` -${String(gone.length).padStart(3)} removed, ${String(diff.length).padStart(3)} changed${flag}`
  );
  if (gone.length) log(`      removed: ${gone.slice(0, 6).join(", ")}${gone.length > 6 ? " ..." : ""}`);
  if (diff.length) log(`      changed: ${diff.slice(0, 6).join(", ")}${diff.length > 6 ? " ..." : ""}`);
}
log(`\n  TOTAL: +${added} added, -${removed} removed, ${changed} changed`);
if (destructive && force !== "true") {
  console.error("\n❌ This upload would remove or change keys that are already live.");
  console.error("   Re-run with --force if that is intended.");
  process.exit(1);
}
if (!added && !removed && !changed) log("  Nothing to do — the CDN already matches.");
// Only the files whose keys actually differ; the rest are equivalent to what is
// live, so re-putting them would only churn the bucket.
console.log(toUpload.join("\n"));
NODE

echo "📋 Comparing with live..."
TO_UPLOAD=$(node "$TMP/compare.js" "$SOURCE_DIR" "$TMP/current" "$FORCE")

if [ "$DRY_RUN" = true ]; then
  echo "✅ Dry run — nothing uploaded."
  exit 0
fi

if [ -z "$TO_UPLOAD" ]; then
  echo "✅ Nothing to upload — every file on R2 is already equivalent."
  exit 0
fi

echo "⬆️  Uploading..."
while IFS= read -r file; do
  [ -n "$file" ] || continue
  lang=$(basename "$file" .json)
  s3 cp "$SOURCE_DIR/$file" "s3://$BUCKET/$PREFIX/$lang.json" --content-type application/json --only-show-errors
  echo "  uploaded $lang"
done <<< "$TO_UPLOAD"

echo "🔍 Verifying..."
mkdir -p "$TMP/after"
s3 cp "s3://$BUCKET/$PREFIX/" "$TMP/after/" --recursive --only-show-errors
node -e '
const fs = require("fs"), path = require("path");
const [localDir, afterDir] = process.argv.slice(1);
let bad = 0;
for (const f of fs.readdirSync(localDir).filter((x) => x.endsWith(".json")).sort()) {
  // Files that were skipped may differ in formatting while holding the same
  // keys, so compare the parsed content rather than the raw bytes.
  const a = JSON.parse(fs.readFileSync(path.join(localDir, f), "utf8"));
  const p = path.join(afterDir, f);
  const b = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : null;
  const keys = a && b ? Object.keys(a) : null;
  const same = b !== null && keys.length === Object.keys(b).length && keys.every((k) => a[k] === b[k]);
  if (!same) { console.error(`  MISMATCH ${f}`); bad++; }
}
if (bad) { console.error(`❌ ${bad} file(s) do not match what was uploaded.`); process.exit(1); }
console.log("  Every file on R2 matches the local copy.");
' "$SOURCE_DIR" "$TMP/after"

# The CDN serves these uncached (cf-cache-status: DYNAMIC), so no purge is
# needed; CLOUDFLARE_CACHE_PURGE_TOKEN / CLOUDFLARE_ZONE_ID in the same doppler
# config are there if that ever changes.
echo "✅ Translations are live on https://i18n.cdn.aoe2companion.com/$PREFIX/"
