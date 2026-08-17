
# EXAMPLE:
# yarn deploy

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
  --secret id=FONTAWESOME_NPM_AUTH_TOKEN,src=<(grep FONTAWESOME_NPM_AUTH_TOKEN .env | cut -d '=' -f2 | tr -d '"' | tr -d "'" | xargs) \
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

echo "Finished building for ${GAME}"
