#!/bin/bash
set -e

export CAPROVER_APP=fructosedb
export CAPROVER_TAR_FILE=./caprover_deployment.tar

yarn build
export TESTRUN=TRUE
yarn start

# TODO: Potentially make --exclude-vcs-ignores work.
echo "Creating archive out of repo and build artifacts..."
tar -cf ./caprover_deployment.tar --exclude=.git --exclude=.idea --exclude=coverage/* --exclude=node_modules/* .

echo "Deploying to machine 01..."
export CAPROVER_URL=$CAPROVER_MACHINE_01
caprover deploy > /dev/null

#echo "Deploying to machine 02..."
#export CAPROVER_URL=$CAPROVER_MACHINE_02
#caprover deploy > /dev/null

rm caprover_deployment.tar
