# Merge upstream `element-web` into `master`

Pre-requisites
- Review [element-web releases](https://github.com/element-hq/element-web/releases)
- Sync fork [elecordapp/matrix-js-sdk](https://github.com/elecordapp/matrix-js-sdk) 

---

1. Create a branch named 'element-v1.xx.xx'

1. Merge the upstream master branch

    > On GitHub desktop: 
    > - Select 'Choose a branch to merge into element-v1.xx.xx'
    > - Select 'upstream/master'
    > - Select 'Create a merge commit'

1. Resolve merge conflicts

    > Use branch file
    > - CHANGELOG.md
    > - README.md

    > Use upstream/master
    > - yarn.lock

    > Run gitrm.sh
    > `git rm --cached -r docs\config.md`
    > `git rm --cached -r playwright`

    > Do not use the `package.json` branch file, resolve merge conflicts as there might be unseen changes

1. Check for any new files added or unwanted changes

1. Run the build locally

1. Commit the yarn lock 'chore: update yarn.lock'

    > Only include additions, no local paths or minified package locks

1. Commit any required regression fixes

    > Note, any commits made to this branch won't be included in the changelog

1. Publish the branch

1. Create a pull request ('Element v1.XX.XX')

1. Test the app

1. Merge (don’t squash)

> [!IMPORTANT]  
> elecord-desktop will also need to be updated
