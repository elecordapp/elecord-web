#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
    echo "You must supply a version number (e.g. 2.3.14)"
    exit 1
fi

VERSION=$1

PACKAGE=package.json
CLIFFIGNORE=.cliffignore
CHANGELOG=CHANGELOG.md
LATEST=LATEST.md

main() {
    check_files
    update_version
    update_cliffignore
    generate_changelog
    commit_files
    exit 0
}

check_files() {
    # ensure all required files are present
    if [ ! -f "$PACKAGE" ]; then
        PACKAGE="../package.json"
        CLIFFIGNORE="../.cliffignore"
        CHANGELOG="../CHANGELOG.md"
        LATEST="../LATEST.md"
        if [ ! -f "$PACKAGE" ]; then
            echo "error: could not find the apps package.json file"
            exit 1
        fi
    fi
}

update_version() {
    # update package.json version number
    sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" $PACKAGE

    echo "(1/4) package.json updated"
}

update_cliffignore() {
    # find merge commits with specific criteria
    MERGE_COMMITS=$(git log 01304439eefb1af1bd169d74bbd745d335368cb8..HEAD --merges \
        --grep="^Merge remote-tracking branch 'upstream/master' into" \
        --grep="v1.11" --pretty=format:"%H" | sort -u)

    # loop through each merge commit
    for merge_commit in $MERGE_COMMITS; do
        # get commits introduced by the merge commit
        CHILD_COMMITS=$(git rev-list "$merge_commit"^1.."$merge_commit"^2 --not "$merge_commit"^1)
        # append each child commit sha to .cliffignore
        for child_commit in $CHILD_COMMITS; do
            echo "$child_commit" >> $CLIFFIGNORE
        done
    done

    # remove duplicates in .cliffignore
    awk '!seen[$0]++' "$CLIFFIGNORE" > .cliffignore_temp && mv .cliffignore_temp "$CLIFFIGNORE"

    echo "(2/4) .cliffignore updated"
}

generate_changelog() {
    # generate the full changelog
    git cliff 01304439eefb1af1bd169d74bbd745d335368cb8..HEAD --tag $VERSION -o CHANGELOG.md
    git cliff 01304439eefb1af1bd169d74bbd745d335368cb8..HEAD --tag $VERSION -o LATEST.md \
        --unreleased --strip all

    echo "(3/4) changelog generated"
}

commit_files() {
    # commit release preparations
    git add $PACKAGE $CHANGELOG $LATEST $CLIFFIGNORE
    git commit -m "chore(release): prepare for v$VERSION"
    git tag "v$VERSION"

    echo "(4/4) git commit created"
}

main
