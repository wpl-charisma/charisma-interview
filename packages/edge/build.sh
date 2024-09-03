#!/bin/bash

DENO_DIR=$HOME/.cache/deno-build

rm -rf $DENO_DIR

CURRENT_DIR=$(pwd)
PACKAGES_DIR=$(dirname $CURRENT_DIR)
PROJECT_DIR=$(dirname $PACKAGES_DIR)

DENO_DIR=$DENO_DIR deno run \
    --allow-env=DENO_DIR,XDG_CACHE_HOME,HOME,DENO_AUTH_TOKENS,XDG_DATA_HOME \
    --allow-read=$HOME/.cache/deno-build,$PROJECT_DIR,$HOME/.local/share/deno-wasmbuild \
    --allow-write=$PROJECT_DIR,$HOME/.cache/deno-build \
    --allow-net=deno.land:443,jsr.io:443 \
    --allow-run=npm,yarn \
    --no-prompt \
    ./scripts/build-types.ts
