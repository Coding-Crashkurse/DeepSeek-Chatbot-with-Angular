#!/usr/bin/env bash
set -e

read -p "Enter your domain (e.g. example.com): " DOMAIN

echo "Replacing 'yourdomain.com' in default.conf.production with '$DOMAIN'..."
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/default.conf.production

echo "Starting Docker Compose in production mode..."
docker compose -f docker-compose.production.yaml up -d --build

echo "Requesting certificate with certbot..."
docker compose -f docker-compose.production.yaml run --rm certbot \
  certonly --webroot -w /usr/share/nginx/html \
  -d "$DOMAIN"

echo "Restarting Nginx to load certificate..."
docker compose -f docker-compose.production.yaml restart nginx

echo "Done! Visit https://$DOMAIN"
