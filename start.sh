# this was need before between builds when aoe2/aoe4 dataset import was done via babel alias
#rm -rf $TMPDIR/metro-cache

export TMPDIR=/tmp/metro-cache-$GAME
mkdir -p $TMPDIR

if [ "$1" = "web" ]; then
    expo start -c --dev-client -p 8081 --web
else
    expo start -c --dev-client -p 8081
fi
