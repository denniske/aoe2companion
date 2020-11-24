#! /bin/bash
set -e
set -o xtrace

ls -al

COMMIT_SHA1=$TRAVIS_COMMIT

# We must export it so it's available for envsubst
export COMMIT_SHA1=$COMMIT_SHA1

export SERVICE_NAME=$(node deploy/script/service-name-from-tag.js $TRAVIS_BRANCH)
echo $SERVICE_NAME

#############################
# BUILD
#############################

#npm i -g nx
#npm i
#nx build graph
#docker build -f graph/deploy/Dockerfile -t denniske/aoe2companion-$SERVICE_NAME:$TRAVIS_COMMIT .
#echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
#docker push denniske/aoe2companion-$SERVICE_NAME:$TRAVIS_COMMIT

#############################
# DEPLOY
#############################

cd graph/deploy

echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt

# Since the only way for envsubst to work on files is using input/output redirection,
# it's not possible to do in-place substitution, so we need to save the output to another file
# and overwrite the original with that one.
envsubst <./kube/deployment.yml >./kube/deployment.yml.out
mv ./kube/deployment.yml.out ./kube/deployment.yml
envsubst <./kube/ingress.yml >./kube/ingress.yml.out
mv ./kube/ingress.yml.out ./kube/ingress.yml
envsubst <./kube/service.yml >./kube/service.yml.out
mv ./kube/service.yml.out ./kube/service.yml

kubectl \
  --kubeconfig=/dev/null \
  --server=$KUBERNETES_SERVER \
  --certificate-authority=cert.crt \
  --token=$KUBERNETES_TOKEN \
  apply -f ./kube
