#! /bin/bash
set -e
set -o xtrace

source ~/.nvm/nvm.sh

nvm install $NODE_VERSION
nvm use $NODE_VERSION
sudo apt-get update
sudo apt-get -y install gettext-base
curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod u+x ./kubectl
sudo mv kubectl /usr/local/bin/
