#!/usr/bin/env bash
set -e

read -p "Which model do you want to pull? e.g. deepseek-r1:7b: " MODEL_NAME

echo "Pulling '$MODEL_NAME' into the ollama_server container..."
docker compose -f docker-compose.production.yaml exec ollama ollama pull "$MODEL_NAME"

echo "Done pulling the '$MODEL_NAME' model!"
