#!/usr/bin/env bash

DOCKER_PATH=$PWD/*.yml
MANIFESTS=' '

for dockerfile in $DOCKER_PATH
do
    MANIFESTS="${MANIFESTS} -f $dockerfile"
done

#MANIFESTS="${MANIFESTS} -p $PROJECT_NAME"
#echo $MANIFESTS

docker-compose $MANIFESTS up -d --remove-orphans
