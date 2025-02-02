#!/usr/bin/env bash

set -e

# export GITHUB_TOKEN=""

GIT_URL=/repos/elecordapp/elecord-web
GH_HEADERS=(
    -H "Accept: application/vnd.github+json"
    -H "X-GitHub-Api-Version: 2022-11-28"
)

# get tag of latest github release
PREVIOUS_TAG=$(gh api \
    --method GET \
    "${GH_HEADERS[@]}" \
    $GIT_URL/releases/latest | jq -r '.tag_name')

echo "Current release version is '$PREVIOUS_TAG'"

# rename branch 'release' to include latest github release tag
gh api \
    --method POST \
    "${GH_HEADERS[@]}" \
    $GIT_URL/branches/release/rename \
    -f "new_name=release-$PREVIOUS_TAG" \
    >/dev/null

# check renamed branch now exists
ARCHIVED_BRANCH=$(gh api \
    --method GET \
    "${GH_HEADERS[@]}" \
    $GIT_URL/branches/release-"$PREVIOUS_TAG" | jq -r '.name')

if [ "$ARCHIVED_BRANCH" != "release-$PREVIOUS_TAG" ]; then
    echo "Archived branch '$ARCHIVED_BRANCH' does not exist"
    exit 1
else
    echo "Previous release '$ARCHIVED_BRANCH' archived successfully"
fi

# create new release branch (from master)
gh api \
    --method POST \
    "${GH_HEADERS[@]}" \
    $GIT_URL/git/refs \
    -f "ref=refs/heads/release" \
    -f "sha=$(gh api \
        --method GET \
        "${GH_HEADERS[@]}" \
        $GIT_URL/branches/master | jq -r '.commit.sha')" \
    >/dev/null
