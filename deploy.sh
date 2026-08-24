
# EXAMPLE:
# yarn deploy

source ./scripts/load-fontawesome-token.sh

echo "🔍 Checking components with react compiler..."
if ! yarn lint:compiler --strict --failures-only; then
  echo "❌ React compiler check failed. Aborting deploy."
  exit 1
fi
echo "✅ React compiler check passed."

# this was need before between builds when aoe2/aoe4 dataset import was done via babel alias
#rm -rf $TMPDIR/metro-cache

export TMPDIR=/tmp/metro-cache-$GAME
mkdir -p $TMPDIR

export SERVICE_NAME=web
export APP_NAME=${GAME}-${SERVICE_NAME}
export DOMAIN=${GAME}companion.com
export PLATFORM=linux/amd64
export IP=23.88.13.76

export COMMIT_SHA1=$(git rev-parse HEAD)

rm -rf $TMPDIR/haste-map-*
rm -rf $TMPDIR/metro-cache

npx expo export -p web --clear

docker buildx build \
  --secret id=FONTAWESOME_NPM_AUTH_TOKEN,src=<(printf '%s' "$FONTAWESOME_NPM_AUTH_TOKEN") \
  --platform $PLATFORM -f ./Dockerfile -t denniske/${GAME}companion-$SERVICE_NAME:$COMMIT_SHA1 .

# -p as well as -c: without it doppler falls back to a per-directory scope in
# ~/.doppler, which is not part of the repo and is missing on a fresh clone or
# after a doppler reset. It then fails with "You must specify a project" — and
# because these are command substitutions, the failure is silent here and only
# shows up later as "username is empty" from docker login.
export DOPPLER_PROJECT=aoecompanion

export DOCKERHUB_USERNAME=$(doppler secrets get DOCKERHUB_USERNAME -p $DOPPLER_PROJECT -c dev_${GAME} --plain)
export DOCKERHUB_PASSWORD=$(doppler secrets get DOCKERHUB_PASSWORD -p $DOPPLER_PROJECT -c dev_${GAME} --plain)

if [ -z "$DOCKERHUB_USERNAME" ] || [ -z "$DOCKERHUB_PASSWORD" ]; then
  echo "❌ Could not read docker hub credentials from doppler ($DOPPLER_PROJECT / dev_${GAME}). Aborting deploy."
  exit 1
fi

echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
docker push denniske/${GAME}companion-$SERVICE_NAME:$COMMIT_SHA1
export IMAGE_NAME=$(docker inspect --format='{{index .RepoDigests 0}}' denniske/${GAME}companion-$SERVICE_NAME:$COMMIT_SHA1)

ssh -o StrictHostKeyChecking=no root@$IP "dokku apps:exists $APP_NAME || dokku apps:create $APP_NAME"
ssh -o StrictHostKeyChecking=no root@$IP dokku proxy:set $APP_NAME caddy

doppler run -p $DOPPLER_PROJECT -c dev_${GAME} --command 'ssh -o StrictHostKeyChecking=no root@$IP dokku config:set --no-restart $APP_NAME \
                                                SERVICE_NAME=$SERVICE_NAME \
                                                GAME=$GAME'

ssh -o StrictHostKeyChecking=no root@$IP dokku domains:set $APP_NAME $DOMAIN www.$DOMAIN app.$DOMAIN

ssh -o StrictHostKeyChecking=no root@$IP dokku resource:limit --cpu 3 --memory 5000 $APP_NAME
ssh -o StrictHostKeyChecking=no root@$IP dokku git:from-image $APP_NAME $IMAGE_NAME

# Sentry release + commit association.
#
# One repo, two Sentry projects: a commit here can fix an aoe2companion issue or an aoe4companion
# one, so the release is created for both regardless of which GAME is being deployed. That is what
# makes "Fixes AOE2COMPANION-123" in a commit message resolve the issue -- Sentry only acts on the
# reference once it has seen the commit, and it only sees commits attached to a release.
#
# Note the web build itself reports nothing: src/helper/sentry.ts disables Sentry on web. The
# events in these two projects come from the mobile app, whose releases are created by the
# @sentry/react-native expo plugin during publish. This step is about giving Sentry the commit
# history, which is per-repo rather than per-platform.
#
# Non-fatal: bookkeeping must not fail a deploy that otherwise worked.
export SENTRY_AUTH_TOKEN=$(doppler secrets get SENTRY_AUTH_TOKEN -p $DOPPLER_PROJECT -c dev_${GAME} --plain)
export SENTRY_ORG=$(doppler secrets get SENTRY_ORG -p $DOPPLER_PROJECT -c dev_${GAME} --plain)

if [ -n "$SENTRY_AUTH_TOKEN" ]
then
  echo "Creating Sentry release $COMMIT_SHA1 for aoe2companion + aoe4companion"
  (
    set +e
    # sentry-cli comes from @sentry/react-native, already a dependency here.
    # -o/-p belong after the subcommand group, not before it.
    SENTRY_CLI="./node_modules/.bin/sentry-cli releases -o $SENTRY_ORG -p aoe2companion -p aoe4companion"
    $SENTRY_CLI new "$COMMIT_SHA1" &&
    $SENTRY_CLI set-commits "$COMMIT_SHA1" --commit "denniske/aoe2companion@$COMMIT_SHA1" &&
    $SENTRY_CLI finalize "$COMMIT_SHA1" ||
    echo "Sentry release failed -- deploy continues, commits for this build are not tracked"
  )
else
  echo "SENTRY_AUTH_TOKEN not found in doppler -- skipping Sentry release"
fi

echo "Finished building for ${GAME}"
