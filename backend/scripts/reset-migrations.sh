#!/bin/bash
# Reset Railway database migrations table

echo "🔄 Resetting Railway database migrations..."

# Drop all tables and recreate from scratch
railway run --service dealertrade -- npx prisma migrate reset --force --skip-seed

echo "✅ Database reset complete!"
echo "📋 Now deploy with: railway up --service dealertrade"
