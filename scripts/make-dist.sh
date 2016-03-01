#!/bin/bash
# deploy.sh
# Setup a deploy directory for the build
#

die () {
    echo $*
    exit 1
}

echo ":: checking tree ..."
LATEST_COMMIT=`git rev-parse HEAD 2>/dev/null`
LATEST_TAG=`git describe --abbrev=0 --tags 2>/dev/null`
CWD=`pwd`


validate() {
    if [[ "$LATEST_TAG" = "" ]] ; then
        die "ERROR: You don't have any annotated tags setup, cannot proceed.  Annotate tag and try again."
    fi

    LATEST_TAG_COMMIT=`git rev-list -n 1 $LATEST_TAG`

    if [[ "$LATEST_TAG_COMMIT" != "$LATEST_COMMIT" ]] ; then
        die "ERROR: The branch head($LATEST_COMMIT) is different from the latest tag($LATEST_TAG, $LATEST_TAG_COMMIT), will not proceed. Create a new annotated tag."
    fi
}

if [[ "$1" == "HEAD" ]] ; then
    LATEST_TAG="HEAD"
else
    validate
fi

# print some information for the user
echo ":: the latest ANNOTATED tag is: $LATEST_TAG, which points to commit: $LATEST_COMMIT, which is the current head."
echo
echo ":: going to build release: $LATEST_TAG"
echo ":: OK to proceed... press a key"

read

TEMP_DIR=`mktemp -d`
echo ":: checking out code to $TEMP_DIR ... "
git --work-tree=$TEMP_DIR checkout $LATEST_TAG -- .

echo ":: building ... may take a moment."
cd $TEMP_DIR && \
    lein deps >/dev/null 2>&1 && \
    lein cljsbuild once min >build.log 2>&1

if [ $? -eq 0 ] ; then
    echo ":: build succeeded"
else
    echo ":: build failed, check $TEMP_DIR/build.log"
fi

cd $CWD

echo ":: staging release $LATEST_TAG in $CWD/releases ..."

# Make the needed directories
OUT_DIR=$CWD/releases/$LATEST_TAG
LATEST_DIR=$CWD/releases/latest
DIST_DIR=$CWD/dist

mkdir -p $OUT_DIR
mkdir -p $OUT_DIR/css
mkdir -p $OUT_DIR/js
mkdir -p $OUT_DIR/workers
mkdir -p $OUT_DIR/img

sass --scss -t compressed "$TEMP_DIR/scss/style.scss" "$OUT_DIR/css/style.css"
cp "$TEMP_DIR/resources/public/js/compiled/plasio_ui.js" "$OUT_DIR/plasio-ui.js"
cp "$TEMP_DIR/resources/public/js/plasio-renderer.js" "$OUT_DIR/js/plasio-renderer.js"
cp "$TEMP_DIR/resources/public/lib/dist/plasio-lib.js" "$OUT_DIR/js/plasio-lib.js"
cp "$TEMP_DIR/resources/public/lib/dist/laz-perf.js" "$OUT_DIR/js/laz-perf.js"
cp "$TEMP_DIR/resources/public/workers/decompress.js" "$OUT_DIR/workers/decompress.js"
cp "$TEMP_DIR/resources/public/img/entwine.png" "$OUT_DIR/img/entwine.png"


# overwrite latest with the most recent build
if [ -d "$LATEST_DIR" ] ; then
    rm -rf "$LATEST_DIR"
fi

cp -r $OUT_DIR $LATEST_DIR

echo ":: cleaning up."
rm -rf $TEMP_DIR

echo ":: building dist archive."
OUTPUTARCHIVE=$DIST_DIR/plasio-ui-$LATEST_TAG.zip

cd $OUT_DIR && zip -r $OUTPUTARCHIVE *

echo ":: done"

