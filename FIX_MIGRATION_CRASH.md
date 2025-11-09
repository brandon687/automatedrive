# Fix Railway Migration Crash Loop

## Problem
Railway deployment is stuck in a loop failing on migration:
```
Error: P3009
The `20251109004150_init` migration started at 2025-11-09 17:27:22.383452 UTC failed
```

## Root Cause
A previous migration attempt failed and left the database in a bad state. Prisma won't run new migrations until the failed one is resolved.

## Solution: Reset the Failed Migration

### Option 1: Mark Migration as Rolled Back (RECOMMENDED)

Connect to Railway database and mark the migration as rolled back:

```bash
# Connect to Railway and run this command
railway run npx prisma migrate resolve --rolled-back 20251109004150_init
```

This tells Prisma the migration failed and can be retried.

### Option 2: Mark Migration as Applied (if tables exist)

If the tables were actually created:

```bash
railway run npx prisma migrate resolve --applied 20251109004150_init
```

### Option 3: Reset Database (NUCLEAR OPTION)

**WARNING: This deletes all data!**

```bash
railway run npx prisma migrate reset --force
```

## Quick Fix Steps

1. **Check what's in the database:**
```bash
railway run npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

2. **If tables don't exist, mark as rolled back:**
```bash
railway run npx prisma migrate resolve --rolled-back 20251109004150_init
```

3. **Redeploy:**
```bash
cd /Users/brandonin/drl
railway up
```

## Alternative: Skip Migration in Start Command

Temporarily skip migration to get app running, then fix DB later.

Edit `backend/nixpacks.toml`:
```toml
[start]
cmd = "node dist/index.js"
```

Then redeploy. Fix database separately:
```bash
railway run npx prisma migrate resolve --rolled-back 20251109004150_init
railway run npx prisma migrate deploy
```

## Run This Now

```bash
# From project root
cd /Users/brandonin/drl/backend

# Mark migration as rolled back
railway run npx prisma migrate resolve --rolled-back 20251109004150_init

# Redeploy from root
cd /Users/brandonin/drl
railway up
```
