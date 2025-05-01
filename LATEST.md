## 2.3.0 - 2025-05-01

**elecord v2.3.0** is a feature release, brining with it elecord's first landmark feature, Rich Presence (RPC). 🎉.

Rich Presence lets your friends see what you're playing in real time. When enabled, elecord will show your current game to your friends (also displayed under your profile picture).

To enable Rich Presence, head over to the RPC settings tab and follow the guide.

### 🚀 Features

- *(rpc)* Add user rpc icon
- *(rpc)* Send user rpc state event
- *(rpc)* Auto reconnect erpc websocket bridge
- *(rpc)* Find routes to dm rooms
- *(rpc)* Display rpc activity in room tiles
- *(rpc)* Sanitize incoming rpc state events
- *(rpc)* Monitor dm rooms for rpc changes
- *(rpc)* Send and format activity status
- *(rpc)* Send activity expire timestamp
- *(rpc)* Periodically re-fetch room rpc manually
- *(rpc)* Create settings tab
- *(rpc)* Link user rpc icon to settings tab


### 🐛 Bug Fixes

- *(rpc)* User rpc icon shown when null
- *(rpc)* Wrong import path for moved files


### 🔧 Refactor

- *(rpc)* Replace sendrpc static roomids with routerpc
- *(rpc)* Deduplicate parseroomrpc event handling


### ⚙️ Miscellaneous

- *(rpc)* Remove elapsed time
- *(rpc)* Clean-up parseroomrpc script
- *(rpc)* Move scripts to elecord/rpc
- *(rpc)* Improve parseroomrpc logic
- *(rpc)* Async and logging improvements
- *(rpc)* Remove unused elapsedtimerpc script
- *(rpc)* Rewrite comments for clarity


### 🏗️ Build

- Update compound-design-tokens to v4.0.2


### 🗃️ Pull Requests

- Merge pull request #46 from elecordapp/rpc
- Merge pull request #47 from elecordapp/rpc-settings


