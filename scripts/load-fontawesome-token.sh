# Exports FONTAWESOME_NPM_AUTH_TOKEN. Source this before the first yarn call:
#
#   source ./scripts/load-fontawesome-token.sh
#
# .yarnrc.yml interpolates the token for the fontawesome registry, so *every*
# yarn command fails without it -- and it fails as a usage error from yarn, so
# whatever the caller was doing reports its own failure instead. That is what
# makes a missing token look like a failing react compiler check.
#
# The token is not in doppler and cannot be checked in, so .env (gitignored) is
# the source. An already exported value wins, which is what lets a shell
# profile or CI provide it without a .env file at all.

if [ -z "${FONTAWESOME_NPM_AUTH_TOKEN:-}" ] && [ -f .env ]; then
  export FONTAWESOME_NPM_AUTH_TOKEN=$(grep '^FONTAWESOME_NPM_AUTH_TOKEN' .env | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
fi

if [ -z "${FONTAWESOME_NPM_AUTH_TOKEN:-}" ]; then
  echo "❌ FONTAWESOME_NPM_AUTH_TOKEN is not set and not in .env."
  echo "   Every yarn command needs it (see .yarnrc.yml). Add it to .env or export it."
  exit 1
fi
