#!/bin/bash
set -e

BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Konark Industry – Backend Deploy ==="
echo "Dir: $BACKEND_DIR"

cd "$BACKEND_DIR"

echo ">> Pulling latest code..."
git pull origin main

echo ">> Installing dependencies..."
pip install -r requirements.txt --quiet

echo ">> Restarting service..."
systemctl restart konark-api

echo ">> Waiting for startup..."
sleep 3

echo ">> Health check..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health)

if [ "$STATUS" = "200" ]; then
  echo "OK Deployment successful (HTTP $STATUS)"
else
  echo "FAIL Health check failed (HTTP $STATUS)"
  systemctl status konark-api --no-pager
  exit 1
fi
