#!/usr/bin/env bash

set -ex

# index.html
index_file="./src/vector/index.html"
# config.json
config_file="./config.json"

# check index.html exists
if [[ -f "$index_file" ]]; then
    # switch to dev icons
    sed -i 's/vector-icons/vector-icons-dev/g' "$index_file"
    echo "Postfix '-dev' added to all occurrences of 'vector-icons' in $index_file"
    # switch to dev title
    sed -i 's/<title>elecord/<title>elecord-dev/g' "$index_file"
    echo "Postfix '-dev' added to <title> in $index_file"
else
    echo "Error: File $index_file does not exist"
    exit 1
fi

# check config.json exists
if [[ -f "$config_file" ]]; then
    # switch to dev title
    sed -i 's/"elecord"/"elecord-dev"/g' "$config_file"
    echo "Postfix '-dev' added to brand name in $config_file"
else
    echo "Error: File $config_file does not exist"
    exit 1
fi
