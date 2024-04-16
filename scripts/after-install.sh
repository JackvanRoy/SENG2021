#!/bin/bash

# Clear npm cache
npm cache clean --force

# Remove node_modules directory and package-lock.json
rm -rf node_modules
rm package-lock.json

# Reinstall dependencies
npm install
