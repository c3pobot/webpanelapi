#!/bin/bash
tag=$1

echo "building ghcr.io/${tag}:latest"
docker build -t "ghcr.io/${tag}:latest" .
docker push "ghcr.io/${tag}:latest"
