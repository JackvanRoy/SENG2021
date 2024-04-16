#!/bin/bash

# Check if apt-get is available
if ! command -v apt-get &> /dev/null; then
    echo "Error: apt-get command not found. This script requires a Linux environment with apt package manager." >&2
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm command not found. Please make sure Node.js and npm are installed." >&2
    exit 1
fi

# Update package repositories and install Node.js
sudo apt-get update
sudo apt-get install -y nodejs

# Install nodemon
sudo npm install -g nodemon

# Check if nodemon is installed successfully
if ! command -v nodemon &> /dev/null; then
    echo "Error: nodemon installation failed." >&2
    exit 1
fi

echo "BeforeInstall script executed successfully."
