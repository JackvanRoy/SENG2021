#!/bin/bash
cd /var/www/app

# Stop the currently running npm start process
pkill -f "npm start"

# Wait for the process to be killed
sleep 1

# Execute npm start in the background and detach it from the terminal
nohup npm start > /dev/null 2>&1 &
