# tg-gh-cli

Update all pull requests for a `username/repository` with master branch.

Requires `GITHUB_TOKEN` to be set at described here: https://github.com/todgru/tg-gh-lib.

## Install

```
npm install -g tg-gh-cli
```


## Usage

List pull requests:
```
tg-gh-prs username/my-repo
```

Update pull request branches with master:
```
tg-gh-prs-update username/my-repo
```
