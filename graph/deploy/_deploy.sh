#! /bin/bash
set -e
set -o xtrace

ls -al

COMMIT_SHA1=$TRAVIS_COMMIT

# We must export it so it's available for envsubst
export COMMIT_SHA1=$COMMIT_SHA1

#############################
# BUILD
#############################

npm i -g nx
npm i
nx build graph
docker build -f graph/deploy/Dockerfile -t denniske/aoe2companion-$SERVICE_NAME:$TRAVIS_COMMIT .
echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
docker push denniske/aoe2companion-$SERVICE_NAME:$TRAVIS_COMMIT

echo "$KUBERNETES_CLUSTER_CERTIFICATE" | base64 --decode > cert.crt

#############################
# DEPLOY
#############################

cd graph/deploy

# Since the only way for envsubst to work on files is using input/output redirection,
# it's not possible to do in-place substitution, so we need to save the output to another file
# and overwrite the original with that one.
envsubst <./deployment.yml >./deployment.yml.out
mv ./deployment.yml.out ./deployment.yml
envsubst <./ingress.yml >./ingress.yml.out
mv ./ingress.yml.out ./ingress.yml
envsubst <./service.yml >./service.yml.out
mv ./service.yml.out ./service.yml

kubectl \
  --kubeconfig=/dev/null \
  --server=$KUBERNETES_SERVER \
  --certificate-authority=cert.crt \
  --token=$KUBERNETES_TOKEN \
  apply -f .