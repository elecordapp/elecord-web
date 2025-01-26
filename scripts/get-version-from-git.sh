#!/usr/bin/env bash

# Echoes a version based on the git hashes of the element-web, react-sdk & js-sdk checkouts, for the case where
# these dependencies are git checkouts.

set -e

# Since the deps are fetched from git, we can rev-parse
JSSDK_SHA=$(git -C node_modules/matrix-js-sdk rev-parse --short=7 HEAD)
#VECTOR_SHA=$(git rev-parse --short=7 HEAD) # use the ACTUAL SHA rather than assume develop
#echo $VECTOR_SHA-js-$JSSDK_SHA
echo "${COMMIT_SHA:0:7}-js-$JSSDK_SHA"
