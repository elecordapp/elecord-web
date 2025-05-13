# Merge upstream `element-web` into `master`

## Pre-requisites

1. Review changes in [element-web releases](https://github.com/element-hq/element-web/releases)

1. Review any changes to the app's [config.json file](https://github.com/element-hq/element-web/blob/master/element.io/app/config.json)

1. Sync js-sdk fork [elecordapp/matrix-js-sdk](https://github.com/elecordapp/matrix-js-sdk)

    > [!NOTE]
    > Create a [backup branch](https://github.com/elecordapp/matrix-js-sdk/branches) before syncing the upstream 

## Merge

1. Create a new branch named `element-v1.xx.xx`

    > [!IMPORTANT]
    > Run `gitrm.sh` to ensure elecord hasn't added back any upstream files

1. Merge the upstream master branch

    > [!TIP]
    > Using GitHub Desktop
    > - Select `Choose a branch to merge into element-v1.xx.xx`
    > - Select `upstream/master`
    > - Select `Create a merge commit`

1. Resolve merge conflicts

    > [!IMPORTANT]
    > Run `gitrm.sh` to discount previously removed upstream files

    > [!TIP]
    > Always use the branch file for...
    > - CHANGELOG.md
    > - README.md
    > <br><br>
    >
    > Always use the upstream file for...
    > - yarn.lock

    > [!WARNING]
    > Don't use the `package.json` branch file, instead resolve merge conflicts as there might be unseen changes

1. Complete the merge process

## Review

1. Check for any new files added or unwanted changes

    > [!NOTE]
    > You can amend the merge commit as needed

1. Build the app locally and test

1. Commit the yarn.lock file `chore: update yarn.lock`

    > [!WARNING]
    > Only include additions, no local paths or minified package locks

1. Commit any required regression fixes

    > [!NOTE]
    > Any commits made to this branch won't be included in the changelog

1. Publish the branch

## Pull Request

1. Create a pull request named `Element v1.xx.xx`

    > Merge upstream Element-web v1.11.xx-yy.
    > - Bundles new feature A
    > - Adds important feature B

1. Test the app

1. Merge (don’t squash)

<br>

> [!CAUTION]  
> `elecord-desktop` will also need to be updated, simply repeat these steps
