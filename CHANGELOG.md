# Changelog

All notable changes to elecord-web will be documented in this file.

## 2.2.1 - 2025-03-19

### 🐛 Bug Fixes

- *(gitcliff)* Html comments rendered
- *(github)* Latest.md not in checkout


### 📖 Documentation

- Update element merge guide
- Add to element merge guide


### ⚙️ Miscellaneous

- *(gitcliff)* Fix merge commits filtered
- *(scripts)* Remove git from prepare-release


### 🗃️ Pull Requests

- Merge pull request #45 from elecordapp/element-v1.11.95


## 2.2.0 - 2025-03-06

### 🚀 Features

- *(appversion)* Add button hover styling
- *(auth page)* Add modal blur animation
- *(auth page)* Refine server picker styling
- *(auth page)* Add repeating background pattern
- *(changelog tab)* Create changelog settings page
- *(homepage)* Increase centre icon size
- *(labs)* Hide setting tab
- *(link preview)* Better link highlighting
- *(message composer)* Display dynamic placeholder
- *(message composer)* Add bubble styling
- *(onboarding)* Use elecord icon for header image
- *(room header)* Add greyscale to facepile
- *(search)* Style e2ee search warning
- *(security settings)* Change emojis to padlocks
- *(theme)* Change accent colours
- *(theme)* Add border to encryption badge
- *(theme)* Update fallback accent colours
- *(theme)* Update theme-color


### 🐛 Bug Fixes

- *(crypto panel)* Session info not aligned
- *(desktop link)* Still set as element.io
- *(desktop strings)* Not using correct capitalisation
- *(github)* Release version unknown
- *(github)* Wrangler uses elecord package.json
- *(members list)* Search box too low
- *(radio button)* Centre icon not aligned
- *(release)* Branch management errors
- *(search)* Icon has bad contrast
- *(search box)* Height changes on focus
- *(theme)* Revert to black on-solid-primary


### 📖 Documentation

- *(readme)* Add early development warning
- Create upstream merge guide


### ⚙️ Miscellaneous

- *(build)* Add local environment build script
- *(build)* Copy changelog in windows script
- *(config)* Add desktop app values
- *(desktop strings)* Adjust capitalisation
- *(gitcliff)* Update changelog config
- *(github)* Update yarn.lock
- *(github)* Update secrets definitions
- *(github)* Use app version for github release
- *(github)* Use full version on artifact files
- *(github)* Remove secrets definitions
- *(github)* Checkout repo for version check
- *(github)* Revert secret removal
- *(github)* Add concurrency config to build


### 🗃️ Pull Requests

- Merge pull request #35 from elecordapp/in-app-changelog
- Merge pull request #36 from elecordapp/desktop-build
- Merge pull request #38 from elecordapp/element-fixes
- Merge pull request #39 from elecordapp/misc-app-changes
- Merge pull request #40 from elecordapp/theme-colours
- Merge pull request #41 from elecordapp/auth-page
- Merge pull request #42 from elecordapp/chat-room-styling
- Merge pull request #44 from elecordapp/element-v1.11.94


## 2.1.0 - 2025-02-06

### 🚀 Features

- *(appversion)* Add version number button
- *(appversion)* Style version number button
- *(appversion)* Display 'dev' for dev builds
- *(auth page)* Use static background colour
- *(authfooter)* Dynamically display app version
- *(event tile)* Reduce e2ee icon visibility
- *(icons)* Add dev env icons
- *(leftpanel)* Hide explore button
- *(room list header)* Hide plus button
- *(roomtile)* Rounded rooms styling


### 🐛 Bug Fixes

- *(auth page)* Reduce background blue intensity
- *(authfooter)* Don't use a prefix for versioning
- *(config)* Allow 3pid logins (#22)
- *(empty state)* Update background blur to blue
- *(github)* Dev icons script not executable
- *(github)* Remove sample config from build
- *(github)* Use latest commit sha
- *(github)* Commit sha using wrong variable
- *(release)* Remove cliffignore duplicates
- *(release)* Create an annotated git tag
- *(settings)* Remove static version number
- *(webpack.config)* Switch domain to elecord


### 📖 Documentation

- *(readme)* Add copyright and license texts


### ⚙️ Miscellaneous

- *(cliff)* Filter tag pattern for changelog
- *(cliff)* Add cliffignore file
- *(contribute)* Update details to elecord
- *(credits)* Update legal texts
- *(github)* Build with dev env icons
- *(github)* Switch app title on dev
- *(github)* Manage branches on release
- *(github)* Generate draft github release
- *(gitignore)* Add removed files/dirs
- *(package.json)* Change values to elecord
- *(readme)* Replace banner image
- *(release)* Add latest.md changelog
- *(release)* Add command to push git changes
- *(scripts)* Shorten git version to match github
- *(scripts)* On release use standard version
- *(scripts)* Automate release prep process
- Remove element's ./test directory
- Remove element's ./playwright directory
- Remove element's ./element.io directory
- Remove element's ./docs directory
- Remove element's ./docker directory
- Remove element's ./debian directory
- Remove element's ./__mocks__ directory
- Remove element's ./.husky directory
- Remove unnecessary element support files
- Remove ./knip.ts config


### 🗃️ Pull Requests

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


### Other (unconventional)

- Revert "fix(config): enable presence on matrix.org (#20)"


## 2.0.1 - 2025-01-18

### 🐛 Bug Fixes

- *(config)* Enable presence on matrix.org (#20)


### ⚙️ Miscellaneous

- *(github)* Build with js-sdk master (#19)


### 🗃️ Pull Requests

- Merge pull request #21 from elecordapp/element-v1.11.90


## 2.0.0 - 2024-12-20

### 🚀 Features

- *(backdrop)* Hide background profile blur
- *(config)* Update config values
- *(credits)* Update settings menu legal text
- *(credits)* Add elecord mono icon
- *(font)* Increase default font size
- *(github)* Update cloudflare cache headers
- *(github)* Switch to no-cache
- *(index)* Tweak meta theme colour
- *(leftpanel)* Reduce default panel width
- *(leftpanel)* Add box shadow for contrast
- *(login)* Add elecord icon on splash view
- *(login)* Add elecord footer links
- *(mobile)* Update names to elecord
- *(mobile)* Hide client configuration steps
- *(mobile)* Update mobile apps to element x
- *(res)* Add monochromatic icon
- *(strings)* Reduce severity of unsupported browser
- *(theme)* Disable dynamic meta theme colour
- *(version)* Add static version number
- Add elecord naming
- Add elecord images


### 🐛 Bug Fixes

- *(changelog)* Update to elecord
- *(config)* Correct config values
- *(credits)* Adjust wording of legal text
- *(credits)* Remove element faq section
- *(headers)* Caching requirements
- *(i18n)* Shorten server description
- *(login)* Remove icon styling
- *(login)* Loading page icon not aligned
- *(mobile)* Remove blank ios app
- *(res)* Wrong favicon.ico
- *(res)* Static opengraph image url
- *(toast)* Container width too small
- *(version)* Remove settings version v prefix


### 🔧 Refactor

- *(credits)* Move elecord legal text
- *(icons)* Remove wrapping div


### 📖 Documentation

- *(readme)* Update readme for elecord
- *(readme)* Add element and matrix links
- *(readme)* Add spacing below banner


### ⚙️ Miscellaneous

- *(build)* Rename build to elecord
- *(build)* Create app config
- *(build)* Include cloudflare headers
- *(build)* Add permissions-policy header
- *(build)* Switch js-sdk to elecord fork
- *(github)* Remove element issue templates
- *(github)* Remove element repo files
- *(github)* Remove element workflows
- *(github)* Modify build workflow
- *(github)* Create cloudflare deploy step
- *(github)* Add cf pages command
- *(github)* Fix webapp dist location
- *(github)* Simplify deployment steps
- *(github)* Print deploy urls
- *(github)* Comment deploy url
- *(github)* Fix pr comment
- *(github)* Add comment reactions
- *(github)* Change pages branch
- *(github)* Add comments to workflow
- *(github)* Remove element deploy workflow
- *(github)* Rename pages prod env
- *(github)* Fix preview url formatting
- *(github)* Adjust headers
- *(github)* Add screen-wake-lock permission
- *(github)* Print deployment url to summary
- *(github)* Refactor deployment url
- *(github)* Temporarily disable non-pr builds
- *(github)* Tidy comments
- *(license)* Add elecord logo license
- *(package)* Change to elecord
- *(privacy)* Add elecord privacy policy
- *(scripts)* Update to elecord


### 🗃️ Pull Requests

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


<!-- generated by git-cliff -->
