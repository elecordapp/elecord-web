#!/usr/bin/env bash

set -ex

# index.html
file="./src/vector/index.html"

# check file exists
if [[ -f "$file" ]]; then
    # search for 'vector-icons' and append '-dev' to matches
    sed -i 's/vector-icons\(\b\)/vector-icons-dev\1/g' "$file"
    echo "Postfix '-dev' added to all occurrences of 'vector-icons' in $file."
else
    echo "Error: File $file does not exist."
    exit 1
fi
