#!/bin/bash

unzip nw-centos.zip

chmod u+x nw-centos/nw.bin
chmod u+x nw-centos/nw
chmod u+x runner.sh

cd mockGenerator
npm install
