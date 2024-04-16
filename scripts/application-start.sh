#!/bin/bash
cd /var/www/app
nohup npm start > /dev/null 2>&1 &
