#!/bin/sh
set -e
# Coolify / Nixpacks build — clean install avoids ENOTEMPTY on redeploy.
rm -rf node_modules .next
npm ci
npm run build
