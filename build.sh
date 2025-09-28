#!/bin/bash
# Script to build the webapp locally on Linux

set -e

# check if the 'webapp' folder exists and remove it
WEBAPP_PATH="$(pwd)/webapp"
if [ -d "$WEBAPP_PATH" ]; then
    rm -rf "$WEBAPP_PATH"
    echo "Deleted existing webapp folder."
fi

# install dependencies using Yarn
yarn install
echo "Yarn install completed."

# build the app
yarn build

# copy LATEST.md to webapp
cp "$(pwd)/LATEST.md" "$WEBAPP_PATH/LATEST.md"
echo "Yarn build completed."

# start a Python HTTP server to serve webapp/index.html
echo "Running Python HTTP server..."
python3 -m http.server 8000 --directory "$WEBAPP_PATH"
