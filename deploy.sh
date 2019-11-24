#!/bin/bash
set -e

export CAPROVER_APP=fructosedb
export CAPROVER_TAR_FILE=./caprover_deployment.tar

if [[ -z "${TRAVIS}" ]]; then
    yarn build
fi

yarn build
export TESTRUN=TRUE
yarn start

# TODO: Potentially make --exclude-vcs-ignores work.
tar -cvf ./caprover_deployment.tar --exclude=.git --exclude=.idea --exclude=coverage/* --exclude=node_modules/* .

export CAPROVER_URL=$CAPROVER_MACHINE_01
caprover deploy

export CAPROVER_URL=$CAPROVER_MACHINE_02
caprover deploy

rm caprover_deployment.tar
