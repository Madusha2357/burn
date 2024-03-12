#!/bin/bash

# Docker image variables
APP_VERSION="0.0.1"
DOCKER_NGINX="damen-nginx"
DOCKER_NEST="damen-nest"
DOCKER_NETWORK="ubuntu_damen-network"

# Colors
RED='\033[0;31m'
NOCOLOR='\033[0m'

# Clear the terminal
clear

echo "${RED}-----------------------------------"
echo "Build frontend"
echo "-----------------------------------${NOCOLOR}"
nx build

echo "${RED}-----------------------------------"
echo "Remove assets from build"
echo "-----------------------------------${NOCOLOR}"
rm -rf dist/apps/quize/assets/
echo "Done"

echo "${RED}-----------------------------------"
echo "Copy anguarl app to nginx"
echo "-----------------------------------${NOCOLOR}"
tar -cJf docker/nginx/quize.tar.xz -C dist/apps/quize .
echo "Done"

echo "${RED}-----------------------------------"
echo "Building backend"
echo "-----------------------------------${NOCOLOR}"
nx run api:build:production
cp package.json docker/api/
tar -cJf docker/api/build.tar.xz -C dist/apps/api .

echo "${RED}-----------------------------------"
echo "Connecting docker demon @ 161.35.149.160"
echo "-----------------------------------${NOCOLOR}"
export DOCKER_HOST="ssh://root@161.35.149.160"
docker -v

echo "${RED}-----------------------------------"
echo 'Building nginx'
echo "-----------------------------------${NOCOLOR}"
cd docker/nginx
docker build -f Dockerfile -t $DOCKER_NGINX:$APP_VERSION .

echo "${RED}-----------------------------------"
echo 'Building Nest API'
echo "-----------------------------------${NOCOLOR}"
cd ../api
docker build -f Dockerfile -t $DOCKER_NEST:$APP_VERSION .

echo "${RED}-----------------------------------"
echo 'Removing old containers'
echo "-----------------------------------${NOCOLOR}"
docker container rm -f $DOCKER_NGINX || true
docker container rm -f $DOCKER_NEST || true

echo "${RED}-----------------------------------"
echo 'Running new containers'
echo "-----------------------------------${NOCOLOR}"
docker container run --name $DOCKER_NEST --restart always -d --network=$DOCKER_NETWORK $DOCKER_NEST:$APP_VERSION 
docker container run --name $DOCKER_NGINX --restart always -p 80:80 -p 443:443 -d --network=$DOCKER_NETWORK $DOCKER_NGINX:$APP_VERSION

# add to intersport network for tempary minio connections
sleep 2
docker network connect intersport_campaign-network damen-nginx
sleep 2
docker restart damen-nginx
sleep 2
docker network connect intersport_campaign-network damen-nest
sleep 2
docker restart damen-nest