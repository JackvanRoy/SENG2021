#!/bin/bash
cd /var/www/app
sudo chmod g+s /var/www/app
sudo chmod o-rwx /var/www/app
npm install
