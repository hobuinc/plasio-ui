#!/bin/sh
# development script

echo ":: This script uses a node package to manage running processes, install will be done locally, which means a node_modules/ directory will show up.  You can safely ignore this directory."

npm install concurrently node-sass

exec ./node_modules/.bin/concurrently --kill-others \
        --names "fgwl,scss" \
        "lein clean && lein figwheel" \
        "./node_modules/.bin/node-sass --watch scss --output resources/public/css"

