#!/bin/bash
# UtilityClock Server Deployment Script
set -e

echo "=================================================="
echo "  Deploying UtilityClock Production Build"
echo "=================================================="

# Pull latest verified commits from origin main
echo "📥 Pulling latest commits from GitHub..."
git pull origin main

# Build production assets (4,283 static pages)
echo "🏗️ Building Next.js production pages..."
npm run build

# Restart web service (PM2 or systemd)
if command -v pm2 >/dev/null 2>&1; then
  echo "🔄 Reloading PM2 process..."
  pm2 reload utilityclock || pm2 restart utilityclock || pm2 reload all || pm2 restart all
elif systemctl is-active --quiet utilityclock 2>/dev/null; then
  echo "🔄 Restarting systemd service..."
  systemctl restart utilityclock
elif systemctl is-active --quiet nextjs 2>/dev/null; then
  echo "🔄 Restarting nextjs service..."
  systemctl restart nextjs
else
  echo "ℹ️ Note: Please reload your background Node/Next.js runner (e.g. pm2 or systemd)."
fi

echo "=================================================="
echo "✅ UtilityClock deployment complete!"
echo "=================================================="
