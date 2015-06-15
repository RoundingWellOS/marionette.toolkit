#!/bin/bash
set -o pipefail

#Function to Publish packages to NPM
publish_to_npm () {
  cd "$(dirname "$1")"
  npm publish
}

export -f publish_to_npm

#Find all Publishable package.json files and call `publish_to_npm`
find . -name "package.json" ! -path "./node_modules/*" -exec dirname {} \; -exec bash -c  "publish_to_npm {$1}" \;
