#!/bin/sh
# Build inside a resource-limited container (/app).
# Installs devDependencies, builds, then prunes back to production deps.
set -e

cd "$(dirname "$0")/.."

echo "→ Cleaning old artifacts..."
rm -rf .next node_modules

echo "→ Installing dependencies (including dev, required for build)..."
npm ci --include=dev

echo "→ Building Next.js (low-memory mode)..."
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1024}"
export NEXT_TELEMETRY_DISABLED=1
npm run build

echo "→ Pruning dev dependencies for runtime..."
npm prune --omit=dev

echo "✓ Build complete. Start with: npm start"
