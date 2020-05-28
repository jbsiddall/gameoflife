#!/usr/bin/env bash

set -eu
export IMAGE=eu.gcr.io/helloworld-278017/hello-world-server

docker build --tag ${IMAGE} .
docker push ${IMAGE}

kubectl apply -f deployment.yaml
