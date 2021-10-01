# Github local cache action

[![build-test](https://github.com/jor-rit/local-cache-action/actions/workflows/test.yml/badge.svg)](https://github.com/jor-rit/local-cache-action/actions/workflows/test.yml)

For use on self-hosted runners. This action allows caching by just writing to a local directory.
Unlike [actions/cache](https://github.com/actions/cache), 
which compresses and uploads the cache to a http service hosted by github. 
Which can be a bit slow on a self-hosted runner and is also limited to 5 GB.


## Usage

Point `cache-dir` to a directory writeable by (all) runners 
(this could be a shared network directory like NFS).

Works similar to action/cache@v1, with currently some limitation:
 - Single `path` and no glob'ing
 - No fancy expiration logic, just quick check of directory's ctime stamp


Example action step:

```yaml
      - uses: OdysseyMomentumExperience/local-cache-action@v1
        env:
          cache-name: build
        with:
          path: Library
          key: Library-WebGL-${{ env.cache-name }}-${{ hashFiles('.cache-base') }}-${{ hashFiles('.cache-version') }}
          restore-keys: |
            Library-WebGL-${{ env.cache-name }}-${{ hashFiles('.cache-base') }}-
          cache-dir: /tmp/foo
```

### Inputs

| Name | Description | Default |
| --- | --- | --- |
| `path` | Projects path to cache between builds | |
| `key` | Key to use for storage | |
| `restore-key` | Key used to lookup existing cache entries (string prefix match) | |
| `cache-dir` | Local directory on the self-hosted runner | |



## Development

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests :heavy_check_mark:
```bash
$ npm test
```

### Publish to a distribution branch

Actions are run from GitHub repos so we will checkin the packed dist folder. 
There is a 'moving' v1 style tag. 
And for now, we keep the dist folder outside the main branch, so it's only commited in the release branches.

Then run [ncc](https://github.com/zeit/ncc) and push the results:
```bash
$ git checkout -b releases/v1
$ git merge main
$ npm run package
$ git add dist
$ git commit -a -m "Update dist for release"
$ git tag -s "vX.Y.Z"
$ git tag -s -f "v1"
$ git push
$ git pugh -f --tags
```

Your action is now published! :rocket: 

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

