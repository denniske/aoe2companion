
# EXAMPLE:
# yarn deploy api aoe2

export SERVICE_NAME=web
export APP_NAME=${GAME}-${SERVICE_NAME}
export DOMAIN=${GAME}companion.com
export PLATFORM=linux/amd64
export IP=23.88.13.76

export COMMIT_SHA1=$(git rev-parse HEAD)

npx expo export -p web --clear

docker buildx build --platform $PLATFORM -f ./Dockerfile -t denniske/aoe2companion-$SERVICE_NAME:$COMMIT_SHA1 .

export DOCKERHUB_USERNAME=$(doppler secrets get DOCKERHUB_USERNAME -c dev_${GAME} --plain)
export DOCKERHUB_PASSWORD=$(doppler secrets get DOCKERHUB_PASSWORD -c dev_${GAME} --plain)

echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
docker push denniske/aoe2companion-$SERVICE_NAME:$COMMIT_SHA1
export IMAGE_NAME=$(docker inspect --format='{{index .RepoDigests 0}}' denniske/aoe2companion-$SERVICE_NAME:$COMMIT_SHA1)

ssh -o StrictHostKeyChecking=no root@$IP "dokku apps:exists $APP_NAME || dokku apps:create $APP_NAME"
ssh -o StrictHostKeyChecking=no root@$IP dokku proxy:set $APP_NAME caddy

doppler run -c dev_${GAME} --command 'ssh -o StrictHostKeyChecking=no root@$IP dokku config:set --no-restart $APP_NAME \
                                                SERVICE_NAME=$SERVICE_NAME'

# Unlimited restarts for proxy
#ssh -o StrictHostKeyChecking=no root@$IP dokku ps:set $APP_NAME restart-policy on-failure
#ssh -o StrictHostKeyChecking=no root@$IP dokku logs:set $APP_NAME max-size 200m

ssh -o StrictHostKeyChecking=no root@$IP dokku domains:set $APP_NAME $SERVICE_NAME.$DOMAIN

ssh -o StrictHostKeyChecking=no root@$IP dokku resource:limit --cpu 3 --memory 5000 $APP_NAME
ssh -o StrictHostKeyChecking=no root@$IP dokku git:from-image $APP_NAME $IMAGE_NAME
