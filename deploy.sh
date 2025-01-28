#!/usr/bin/env bash
set -e

read -p "Enter your domain (e.g. example.com): " DOMAIN

echo "Replacing 'yourdomain.com' in default.conf.production with '$DOMAIN'..."
sed -i "s/yourdomain.com/$DOMAIN/g" nginx/default.conf.production

echo "Starting Docker Compose in production mode..."
docker compose -f docker-compose.production.yaml up -d --build

echo "Done! Visit https://$DOMAIN"
