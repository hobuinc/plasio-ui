#!/bin/sh

CWD=`pwd`
TARGET_DIR="$CWD/resources/public"

if [ ! -d "$TARGET_DIR/lib/dist" ] ; then
    mkdir -p "$TARGET_DIR/lib/dist"
fi

cp ../plasio.js/dist/plasio.js "$TARGET_DIR/lib/dist/"
