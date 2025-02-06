## 2.1.0 - 2025-02-06

### Bug Fixes

- fix(config): allow 3pid logins (#22)
- fix(github): dev icons script not executable
- fix(github): remove sample config from build
- fix(settings): remove static version number
- fix(webpack.config): switch domain to elecord
- fix(authfooter): don't use a prefix for versioning
- fix(github): use latest commit sha
- fix(github): commit sha using wrong variable
- fix(empty state): update background blur to blue
- fix(auth page): reduce background blue intensity
- fix(release): remove cliffignore duplicates
- fix(release): create an annotated git tag

### Documentation

- docs(readme): add copyright and license texts

### Features

- feat(leftpanel): hide explore button
- feat(roomtile): rounded rooms styling
- feat(icons): add dev env icons
- feat(authfooter): dynamically display app version
- feat(appversion): add version number button
- feat(appversion): style version number button
- feat(appversion): display 'dev' for dev builds
- feat(event tile): reduce e2ee icon visibility
- feat(auth page): use static background colour
- feat(room list header): hide plus button

### Miscellaneous Tasks

- chore(github): build with dev env icons
- chore(github): switch app title on dev
- chore: remove element's ./test directory
- chore: remove element's ./playwright directory
- chore: remove element's ./element.io directory
- chore: remove element's ./docs directory
- chore: remove element's ./docker directory
- chore: remove element's ./debian directory
- chore: remove element's ./__mocks__ directory
- chore: remove element's ./.husky directory
- chore(contribute): update details to elecord
- chore: remove unnecessary element support files
- chore(gitignore): add removed files/dirs
- chore: remove ./knip.ts config
- chore(readme): replace banner image
- chore(credits): update legal texts
- chore(package.json): change values to elecord
- chore(scripts): shorten git version to match github
- chore(scripts): on release use standard version
- chore(cliff): filter tag pattern for changelog
- chore(scripts): automate release prep process
- chore(cliff): add cliffignore file
- chore(github): manage branches on release
- chore(github): generate draft github release
- chore(release): add latest.md changelog
- chore(release): add command to push git changes

### Other (unconventional)

- Revert "fix(config): enable presence on matrix.org (#20)"

### Pull Requests

- Merge pull request #23 from elecordapp/room-navigation-styling
- Merge pull request #24 from elecordapp/dev-environment-icon
- Merge pull request #25 from elecordapp/element-files-cleanup
- Merge pull request #26 from elecordapp/license-text
- Merge pull request #27 from elecordapp/versioning-refactor
- Merge pull request #29 from elecordapp/versioning-refactor
- Merge pull request #28 from elecordapp/release-automation
- Merge pull request #30 from elecordapp/revert-20-matrix-org-presence
- Merge pull request #31 from elecordapp/app-version-button
- Merge pull request #32 from elecordapp/base-styling-changes

