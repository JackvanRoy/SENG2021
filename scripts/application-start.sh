#!/bin/bash
cd /var/www/app

pkill -f "nohup npm start"

# Execute npm start in the background and detach it from the terminal
nohup npm start > /dev/null 2>&1 &