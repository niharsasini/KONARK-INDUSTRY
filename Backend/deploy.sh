#!/bin/bash
set -e

echo "=== Konark Industry Deploy ==="
cd /var/www/konark

echo "Pulling latest code..."
git fetch origin
git reset --hard origin/main

echo "Installing backend dependencies..."
cd Backend
source venv/bin/activate
pip install -r requirements.txt -q

echo "Restarting backend..."
systemctl restart konark-backend
sleep 5

echo "Health check..."
curl -s http://localhost:8001/api/health
echo ""
echo "=== DEPLOY COMPLETE ==="
