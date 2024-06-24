#!/bin/bash

sudo apt install npm nodejs

# node does not work well in the /google/src/.
pushd "$HOME"
npm i puppeteer --save
popd
