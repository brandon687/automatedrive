#!/bin/sh
# Railway startup script for Vite preview server
# This script ensures proper PORT variable expansion

echo "Starting Vite preview server on port ${PORT:-4173}"
exec npm run preview -- --host 0.0.0.0 --port "${PORT:-4173}"
