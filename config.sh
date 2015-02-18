#!/bin/bash

unzip nw-centos.zip

chmod u+x nw-centos/nw.bin
chmod u+x nw-centos/nw
chmod u+x runner.sh

cd mockGenerator
npm install

#to fix some issues with libs for node-webkit
su -c "ln -s /usr/lib64/libnotify.so.1 /usr/lib64/libnotify.so.4"

