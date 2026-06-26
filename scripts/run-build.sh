#!/bin/bash
cd /home/theapiartist/work/agentsecrets-website
"/mnt/c/Program Files/nodejs/node.exe" ./node_modules/next/dist/bin/next build 2>&1 | tail -60