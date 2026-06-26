#!/bin/bash
cd /home/theapiartist/work/agentsecrets-website
"/mnt/c/Program Files/nodejs/node.exe" ./node_modules/typescript/bin/tsc --noEmit 2>&1 | tail -40