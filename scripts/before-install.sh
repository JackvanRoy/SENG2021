#!/bin/bash


# Install EPEL repository (for CentOS, Amazon Linux)
sudo yum install -y epel-release
    
# Install Node.js from EPEL repository
sudo yum install -y nodejs npm


# Install nodemon and ts-node globally
sudo npm install -g nodemon ts-node
sudo npm install

# Check if nodemon and ts-node are installed successfully
if ! command -v nodemon &> /dev/null || ! command -v ts-node &> /dev/null; then
    echo "Error: nodemon or ts-node installation failed." >&2
    exit 1
fi

echo "BeforeInstall script executed successfully."
