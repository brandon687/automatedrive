# Create Fresh Railway Project - Complete Guide

## THE PROBLEM
The current Railway database has corrupted migration records that cannot be fixed. We need a completely fresh start.

## SOLUTION: Fresh Railway Project

### Step 1: Create New Railway Project (Via Dashboard - 2 minutes)

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Empty Project"**
4. Name it: `dealertrade-fresh`

### Step 2: Add PostgreSQL Database

1. In your new project, click **"+ New"**
2. Select **"Database"**
3. Choose **"PostgreSQL"**
4. Railway will automatically provision the database

### Step 3: Add Backend Service

1. Click **"+ New"** again
2. Select **"Empty Service"**
3. Name it: `backend`
4. Go to **Settings** tab
5. Under **"Source"**, set:
   - **Root Directory**: `backend`
6. Under **"Deploy"**, configure:
   - **Build Command**: (leave default)
   - **Start Command**: (leave default - will use nixpacks.toml)

### Step 4: Connect Database to Backend

1. In the backend service, go to **Variables** tab
2. Click **"+ New Variable"** → **"Add Reference"**
3. Select your PostgreSQL database
4. Choose `DATABASE_URL`
5. This auto-connects the backend to the database

### Step 5: Add Required Environment Variables

Still in **Variables** tab of backend service, add these:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
AUTO_DEV_API_KEY=your-autodev-api-key
FRONTEND_URL=http://localhost:5173
```

### Step 6: Link Local Project to New Railway Project

Run from project root:

```bash
cd /Users/brandonin/drl
railway link
```

When prompted:
- Select your workspace
- Select `dealertrade-fresh` project
- Select `backend` service

### Step 7: Deploy

```bash
railway up --service backend
```

This will:
- Upload your code
- Build using nixpacks.toml configuration
- Run fresh database migrations
- Start your server

### Step 8: Get Your New URL

```bash
railway domain --service backend
```

This creates a public URL like: `https://backend-production-xxxx.up.railway.app`

## WHAT'S DIFFERENT / BETTER

### Clean Migration State
✅ No corrupted migration records
✅ Fresh `_prisma_migrations` table
✅ Clean database schema deployment

### Proper Configuration
✅ Root Directory set to `backend` in Railway UI
✅ Clean nixpacks.toml without workarounds
✅ All environment variables properly configured

### Updated nixpacks.toml (Already Configured)
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "openssl"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npx prisma generate", "npm run build"]

[start]
cmd = "npx prisma migrate deploy && node dist/index.js"
```

### Clean Migrations (Already Configured)
Only one clean migration exists:
- `20251109111653_init` - Fresh, clean SQL with no corruption

## VERIFICATION CHECKLIST

After deployment, verify:

- [ ] `railway logs --service backend` shows "Server running on port 3000"
- [ ] No migration errors (P3008, P3009, P3018)
- [ ] `curl https://your-new-url/health` returns `{"status":"ok"}`
- [ ] `curl https://your-new-url/` returns welcome JSON with API endpoints

## IF YOU ENCOUNTER ISSUES

### Issue: "Could not find project"
**Fix**: Run `railway link` again and select the correct project

### Issue: Migration errors
**Fix**: The migrations should work clean now, but if issues persist:
```bash
railway run --service backend -- npx prisma migrate reset --force
railway up --service backend
```

### Issue: Build fails
**Fix**: Check build logs in Railway dashboard
```bash
# View logs
railway logs --service backend
```

## OLD vs NEW PROJECT

| Aspect | Old Project | New Project |
|--------|-------------|-------------|
| Project ID | 4ed977a7-234c-453a-8ad9-c373e81e82bb | (new ID) |
| Database State | Corrupted migrations | Fresh, clean |
| Migration Issues | P3008, P3009, P3018 | None |
| Configuration | Root deployment with cd commands | Proper Root Directory setting |
| Deployment Status | Crash loop | Should work immediately |

## ESTIMATED TIME

- Dashboard setup: 3 minutes
- Linking & deploying: 2 minutes
- **Total: 5 minutes to working deployment**

## BENEFITS OF FRESH START

1. **No Migration Baggage**: Zero corrupted migration records
2. **Clean Database**: No stuck failed migrations in `_prisma_migrations` table
3. **Proper Setup**: Using Railway's recommended Root Directory approach
4. **Fresh Environment**: All new service IDs, no cached build issues
5. **Welcome Route Ready**: Your API documentation route will work immediately

## NEXT STEPS AFTER SUCCESSFUL DEPLOYMENT

1. Test all API endpoints
2. Verify welcome route shows API structure
3. Update frontend with new backend URL
4. Archive old Railway project (don't delete yet, just in case)
5. Celebrate working deployment! 🎉

---

**Need Help?** The Railway dashboard is intuitive, but if you get stuck:
- Railway Docs: https://docs.railway.app/
- All agents and commands are still available
- I'm here to help with any issues
