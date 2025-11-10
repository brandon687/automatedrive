#!/bin/bash
# Railway startup script with explicit serve configuration

echo "Starting serve with explicit configuration..."
echo "PORT: $PORT"
echo "NODE_ENV: $NODE_ENV"
echo "PWD: $(pwd)"
echo "Contents of dist:"
ls -la dist/

# Use serve with explicit host and port binding
# The -l flag accepts: [host:]port
exec npx serve -s dist -l "0.0.0.0:${PORT}"
