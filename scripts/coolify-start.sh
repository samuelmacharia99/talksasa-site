#!/bin/sh
set -e
# Runtime only — never npm install here (causes ENOTEMPTY + restart loops).
if [ ! -d ".next" ]; then
  echo "ERROR: .next missing. Build the app in Coolify build phase or use the Dockerfile build pack."
  exit 1
fi
exec npm start
