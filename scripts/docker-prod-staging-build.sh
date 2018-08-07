#!/bin/bash
# stages build for speck.ly using docker build

echo ":: starting build using docker ..."
docker run \
    -v $(pwd):/app \
    clojure:lein-2.8.1-alpine \
    /bin/sh -c "cd /app &&  /bin/sh scripts/prod-staging-build.sh"
