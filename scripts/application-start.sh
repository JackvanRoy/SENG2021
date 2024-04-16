#!/bin/bash
cd /var/www/app
pkill -f "nohup npm start"
npm start
