# Changelog

All notable changes to this project will be documented in this file.

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

## 2.0.1 - 2025-01-18

### Bug Fixes

- fix(config): enable presence on matrix.org (#20)

### Miscellaneous Tasks

- chore(github): build with js-sdk master (#19)

### Pull Requests

- Merge pull request #21 from elecordapp/element-v1.11.90

## 2.0.0 - 2024-12-20

### Bug Fixes

- fix(res): wrong favicon.ico
- fix(res): static opengraph image url
- fix(headers): caching requirements
- fix(mobile): remove blank ios app
- fix(login): remove icon styling
- fix(config): correct config values
- fix(i18n): shorten server description
- fix(credits): adjust wording of legal text
- fix(credits): remove element faq section
- fix(changelog): update to elecord
- fix(login): loading page icon not aligned
- fix(version): remove settings version v prefix
- fix(toast): container width too small

### Documentation

- docs(readme): update readme for elecord
- docs(readme): add element and matrix links
- docs(readme): add spacing below banner

### Features

- feat: add elecord naming
- feat: add elecord images
- feat(mobile): update names to elecord
- feat(mobile): hide client configuration steps
- feat(mobile): update mobile apps to element x
- feat(theme): disable dynamic meta theme colour
- feat(res): add monochromatic icon
- feat(login): add elecord icon on splash view
- feat(github): update cloudflare cache headers
- feat(github): switch to no-cache
- feat(index): tweak meta theme colour
- feat(config): update config values
- feat(backdrop): hide background profile blur
- feat(leftpanel): reduce default panel width
- feat(font): increase default font size
- feat(credits): update settings menu legal text
- feat(credits): add elecord mono icon
- feat(strings): reduce severity of unsupported browser
- feat(login): add elecord footer links
- feat(version): add static version number
- feat(leftpanel): add box shadow for contrast

### Miscellaneous Tasks

- chore(github): remove element issue templates
- chore(github): remove element repo files
- chore(github): remove element workflows
- chore(github): modify build workflow
- chore(build): rename build to elecord
- chore(build): create app config
- chore(build): include cloudflare headers
- chore(build): add permissions-policy header
- chore(github): create cloudflare deploy step
- chore(github): add cf pages command
- chore(github): fix webapp dist location
- chore(github): simplify deployment steps
- chore(github): print deploy urls
- chore(github): comment deploy url
- chore(github): fix pr comment
- chore(github): add comment reactions
- chore(github): change pages branch
- chore(github): add comments to workflow
- chore(github): remove element deploy workflow
- chore(github): rename pages prod env
- chore(github): fix preview url formatting
- chore(github): adjust headers
- chore(github): add screen-wake-lock permission
- chore(github): print deployment url to summary
- chore(github): refactor deployment url
- chore(github): temporarily disable non-pr builds
- chore(license): add elecord logo license
- chore(package): change to elecord
- chore(scripts): update to elecord
- chore(build): switch js-sdk to elecord fork
- chore(github): tidy comments
- chore(privacy): add elecord privacy policy

### Pull Requests

- Merge pull request #1 from elecordapp/github-actions
- Merge pull request #2 from elecordapp/github-actions
- Merge pull request #3 from elecordapp/build-config
- Merge pull request #4 from elecordapp/github-actions
- Merge pull request #5 from elecordapp/elecord-brand
- Merge pull request #7 from elecordapp/mobile-setup
- Merge pull request #8 from elecordapp/react-changes
- Merge pull request #10 from elecordapp/cache-test
- Merge pull request #11 from elecordapp/element-triage
- Merge pull request #12 from elecordapp/settings-credits
- Merge pull request #13 from elecordapp/build-dependencies
- Merge element-web v1.11.89
- Merge pull request #17 from elecordapp/misc-changes

### Refactor

- refactor(credits): move elecord legal text
- refactor(icons): remove wrapping div

<!-- generated by git-cliff -->
