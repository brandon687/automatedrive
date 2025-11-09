#!/bin/bash
# Fix failed migration in Railway database

echo "🔧 Fixing Failed Migration"
echo "=========================="
echo ""

# Mark the failed migration as rolled back
echo "Marking migration 20251109004150_init as rolled back..."
npx prisma migrate resolve --rolled-back 20251109004150_init

echo ""
echo "✓ Migration marked as rolled back"
echo ""
echo "Now run: npx prisma migrate deploy"
