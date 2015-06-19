#!/bin/sh

CWD=`pwd`
TARGET_DIR="$CWD/resources/public"

cp ../plasio.js/dist/plasio-renderer.js "$TARGET_DIR/js"

if [ ! -d "$TARGET_DIR/lib/dist" ] ; then
    mkdir -p "$TARGET_DIR/lib/dist"
fi

if [ ! -d "$TARGET_DIR/workers" ] ; then
    mkdir -p "$TARGET_DIR/workers"
fi

cp ../plasio.js/dist/lib/dist/laz-perf.js "$TARGET_DIR/lib/dist/"
cp ../plasio.js/dist/lib/dist/plasio-lib.js "$TARGET_DIR/lib/dist/"
cp ../plasio.js/dist/workers/decompress.js "$TARGET_DIR/workers/"
