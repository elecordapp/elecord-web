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

    > Use elecord file
    > - CHANGELOG.md
    > - README.md

    > Use upstream/master
    > - yarn.lock

1. Run the build locally

1. Commit the yarn lock ('chore: update yarn.lock')

1. Commit any required regression fixes

    > [!NOTE]  
    > Any commits made to this branch won't be included in the changelog

1. Publish the branch

1. Create a pull request ('Element v1.XX.XX')

1. Test the app

1. Merge (don’t squash)

> [!IMPORTANT]  
> elecord-desktop will also need to be updated
