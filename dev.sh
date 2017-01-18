#!/bin/sh
# development script

echo ":: This script uses a node package to manage running processes, install will be done locally, which means a node_modules/ directory will show up.  You can safely ignore this directory."

npm install foreman
./node_modules/.bin/nf start

