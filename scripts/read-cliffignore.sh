#!/bin/bash

# script to check the commits added to .cliffignore are valid

CLIFFIGNORE=".cliffignore"

# check .cliffignore file exists
if [[ ! -f $CLIFFIGNORE ]]; then
    echo "Error: $CLIFFIGNORE does not exist."
    exit 1
fi

# read each SHA from .cliffignore and print the commit message
while IFS= read -r sha; do
    # ensure the SHA is not empty
    if [[ -n $sha ]]; then
        # get the commit message for the SHA
        commit_message=$(git log -1 --format=%s $sha)
        echo "Commit $sha: $commit_message"
    fi
done < $CLIFFIGNORE
