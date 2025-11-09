#!/bin/bash
set -e

echo "=== Railway Startup Script ==="
echo "PORT: ${PORT}"
echo "NODE_ENV: ${NODE_ENV}"
echo "PWD: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Verify dist exists
if [ ! -d "dist" ]; then
  echo "ERROR: dist directory not found!"
  ls -la
  exit 1
fi

echo "Contents of dist:"
ls -la dist/

# Start serve with explicit port binding
# Use 0.0.0.0 to listen on all interfaces
echo "Starting serve on 0.0.0.0:${PORT}..."
exec npx serve -s dist -l "tcp://0.0.0.0:${PORT}"
