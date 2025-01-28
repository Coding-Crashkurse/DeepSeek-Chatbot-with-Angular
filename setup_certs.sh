#!/usr/bin/env bash
set -e

echo "Installing snapd..."
sudo apt-get update
sudo apt-get install snapd -y

echo "Removing any old certbot..."
sudo apt-get remove certbot || true

echo "Installing certbot from snap..."
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

echo "Done installing Certbot. You can now run, for example:"
echo "  sudo certbot certonly --nginx"
echo "or"
echo "  sudo certbot certonly --webroot -w /usr/share/nginx/html -d yourdomain.com"
