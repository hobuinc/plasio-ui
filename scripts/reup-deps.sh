#!/bin/sh

CWD=`pwd`
TARGET_DIR="$CWD/resources/public"

if [ ! -d "$TARGET_DIR/lib/dist" ] ; then
    mkdir -p "$TARGET_DIR/lib/dist"
fi

if [ ! -d "$TARGET_DIR/workers" ] ; then
    mkdir -p "$TARGET_DIR/workers"
fi

cp ../plasio.js/lib/dist/laz-perf.js "$TARGET_DIR/lib/dist/"
cp ../plasio.js/lib/dist/plasio-lib.js "$TARGET_DIR/lib/dist/"
cp ../plasio.js/workers/decompress.js "$TARGET_DIR/workers/"
