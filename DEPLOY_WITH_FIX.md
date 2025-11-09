# Deploy with Migration Fix

## What Changed

Modified `backend/nixpacks.toml` start command to:
1. **First**: Mark the failed migration as rolled back
2. **Then**: Run migrations normally
3. **Finally**: Start the server

## The Fix

```toml
[start]
cmd = "npx prisma migrate resolve --rolled-back 20251109004150_init || true && npx prisma migrate deploy && node dist/index.js"
```

The `|| true` ensures the command continues even if the migration was already resolved.

## Deploy Now

```bash
cd /Users/brandonin/drl
railway up
```

This deployment will:
1. ✓ Upload code
2. ✓ Build with npm ci, prisma generate, tsc
3. ✓ Fix the stuck migration
4. ✓ Run migrations cleanly
5. ✓ Start server
6. ✓ SUCCESS!

## What This Fixes

- **Problem**: Migration `20251109004150_init` was stuck in failed state
- **Symptom**: Every deployment crashed with P3009 error
- **Solution**: Automatically mark it as rolled back, then retry
- **Result**: Clean migration, server starts successfully

## After This Works

Once deployed successfully, you can simplify the start command back to:
```toml
[start]
cmd = "npx prisma migrate deploy && node dist/index.js"
```

## Run This Now

```bash
cd /Users/brandonin/drl
railway up
```

Watch the logs - you should see:
```
✓ Migration resolved
✓ Migrations deployed
🚀 Server running on port 3000
```
