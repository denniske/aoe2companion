# this was need before between builds when aoe2/aoe4 dataset import was done via babel alias
#rm -rf $TMPDIR/metro-cache

export TMPDIR=/tmp/metro-cache-$GAME
mkdir -p $TMPDIR

if [ "$1" = "web" ]; then
    expo start -c --dev-client -p 8081 --web
elif [ "$1" = "perf" ]; then
    # Serves the bundle the way a release build gets it -- __DEV__ off, minified,
    # no dev-only warnings or instrumentation -- which is what you want when
    # measuring performance. Still the dev client, so no rebuild is needed; just
    # reload the app from the dev menu after starting this.
    expo start -c --dev-client -p 8081 --no-dev --minify
else
    expo start -c --dev-client -p 8081
fi
