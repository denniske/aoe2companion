#! /bin/bash
# exit script when any command ran here returns with non-zero exit code
set -e

COMMIT_SHA1=$TRAVIS_COMMIT

# We must export it so it's available for envsubst
export COMMIT_SHA1=$COMMIT_SHA1

# Since the only way for envsubst to work on files is using input/output redirection,
# it's not possible to do in-place substitution, so we need to save the output to another file
# and overwrite the original with that one.
envsubst <./docker-compose.yml >./docker-compose.yml.out
mv ./docker-compose.yml.out ./docker-compose.yml
