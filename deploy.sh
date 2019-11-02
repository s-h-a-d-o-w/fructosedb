#!/bin/bash

COMMIT_SHA=`git rev-parse HEAD`

# http://dokku.viewdocs.io/dokku/deployment/methods/images/#deploying-an-image-from-ci

# Note: The image must be tagged `dokku/<app-name>:<version>`
docker build -t dokku/fructosedb:$COMMIT_SHA .

docker save dokku/fructosedb:$COMMIT_SHA | ssh any.dokku.letit.run "docker load | dokku tags:deploy fructosedb $COMMIT_SHA"
