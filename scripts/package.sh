#!/usr/bin/env bash

set -e

if [ -n "$DIST_VERSION" ]; then
    version=$DIST_VERSION
else
    version=`git describe --dirty --tags || echo unknown`
fi

yarn clean
VERSION=$version yarn build

# include the sample config in the tarball. Arguably this should be done by
# `yarn build`, but it's just too painful.
cp config.sample.json webapp/

# Copy any required files for deployment
cp .github/cfp_headers webapp/_headers

mkdir -p dist
cp -r webapp elecord-$version

# Just in case you have a local config, remove it before packaging
# rm elecord-$version/config.json || true

# GNU/BSD compatibility workaround
tar_perms=(--owner=0 --group=0) && [ "$(uname)" == "Darwin" ] && tar_perms=(--uid=0 --gid=0)
tar "${tar_perms[@]}" -chvzf dist/elecord-$version.tar.gz elecord-$version
rm -r elecord-$version

echo
echo "Packaged dist/elecord-$version.tar.gz"
