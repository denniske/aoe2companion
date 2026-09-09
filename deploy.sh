# Build once, push once, deploy the web front end.
#
#   yarn deploy            # aoe2
#   yarn deploy aoe4
#   GAME=aoe4 yarn deploy
#
# Replaces the dokku deploy: same result (one image, kamal-proxy in front of it), but kamal owns the
# build, the container swap and the proxy handover. The old script is kept at backup/deploy.sh.dokku.
#
# The react-compiler check and `expo export -p web` now run from .kamal/hooks/pre-build, so they
# happen inside `kamal deploy` rather than ahead of it -- a failing compiler check still aborts the
# deploy before anything is built or pushed.
#
# The image is built on the remote host (builder.remote in config/deploy.yml), not locally. That is
# the point of the move: the old `docker buildx build --platform linux/amd64` emulated amd64 inside
# colima on this arm Mac, which is what wedged the machine mid-deploy.

[ -n "$1" ] && GAME="$1"
GAME=${GAME:-aoe2}
export GAME
set -eo pipefail

echo "---------------------------------"
echo "GAME:    $GAME"
echo "SERVICE: web"
echo "---------------------------------"

# Kamal derives the image tag from the git sha, and appends a RANDOM suffix when the tree is dirty
# -- so a dirty tree means build and deploy cannot agree on a tag. Build and deploy happen in the
# one invocation below, which is fine either way, but warn because it also makes the deploy
# unreproducible.
if [ -n "$(git status --porcelain)" ]; then
  echo "WARNING: uncommitted changes -- the image tag gets a random suffix and is not reproducible."
  echo
fi

./bin/kamal deploy

echo "Finished deploying web for ${GAME}"
