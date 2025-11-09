# Fix Railway "Could not find root directory: backend" Error

## Problem

Railway deployment failed with:
```
Could not find root directory: backend
```

This happens because Railway is deploying from the project root (`/Users/brandonin/drl`) but the backend code is in the `backend/` subdirectory.

## Solution: Configure Railway Root Directory

You need to tell Railway to use the `backend` folder as the root directory for builds.

### Option 1: Via Railway Dashboard (Recommended)

1. **Go to Railway Dashboard:**
   https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb

2. **Click on your `dealertrade` service**

3. **Go to Settings**

4. **Scroll to "Root Directory" or "Service Settings"**

5. **Set Root Directory:**
   ```
   backend
   ```
   (Just type `backend` - no slashes)

6. **Click "Deploy"** or the deployment will trigger automatically

### Option 2: Via Railway CLI

Since your Railway project is linked, you can also set this via environment variable:

```bash
cd /Users/brandonin/drl

# Set the RAILWAY_SERVICE_ROOT variable
railway variables --set RAILWAY_SERVICE_ROOT=backend
```

Or use the Railway CLI to configure:

```bash
# From project root
railway up --service dealertrade --rootDirectory backend
```

### Option 3: Move Files to Root (Not Recommended)

Alternatively, you could deploy from the root directory by running from `/Users/brandonin/drl` instead of `/Users/brandonin/drl/backend`, but this requires restructuring.

## Correct Deployment Process

Once the root directory is configured:

```bash
# Deploy from project root
cd /Users/brandonin/drl
railway up

# OR deploy from backend with proper config
cd /Users/brandonin/drl/backend
railway up
```

## What Railway Will See After Fix

After setting root directory to `backend`, Railway will:

1. Look for files in `backend/` folder
2. Find `backend/package.json` ✓
3. Find `backend/nixpacks.toml` ✓
4. Find `backend/railway.json` ✓
5. Find `backend/src/` ✓
6. Run build successfully ✓

## Expected Build Sequence

```
✓ Root directory set to: backend
✓ Found package.json
✓ Found nixpacks.toml
✓ Running npm ci...
✓ Running npx prisma generate...
✓ Running npm run build...
✓ Starting: npx prisma migrate deploy && node dist/index.js
✓ Server running on port 3000
```

## Quick Fix Steps

**Do this now:**

1. Open Railway dashboard: https://railway.com/project/4ed977a7-234c-453a-8ad9-c373e81e82bb

2. Click on the "dealertrade" service (the one that says "Failed")

3. Click "Settings" tab

4. Look for "Root Directory" or "Source" settings

5. Enter: `backend`

6. Save and redeploy

## Alternative: Deploy from Root with Root Directory Config

If the Railway dashboard doesn't have a root directory setting easily visible, try this:

```bash
cd /Users/brandonin/drl

# Deploy from root, Railway will find the backend folder
railway up
```

The `backend/railway.json` and `backend/nixpacks.toml` should be automatically detected.

## Verify Settings

After configuring, check your service settings show:
- ✓ Root Directory: `backend`
- ✓ Builder: NIXPACKS
- ✓ Nixpacks Config: `nixpacks.toml`

## Test After Fix

Once deployment succeeds:

```bash
# Get your Railway URL
railway status

# Test health endpoint
curl https://your-url.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-11-09T..."}
```

---

## Why This Happened

You ran `railway up` from the `/Users/brandonin/drl/backend` directory, but Railway deployed from the project root `/Users/brandonin/drl`. The nixpacks.toml file tried to reference the `backend` directory, but since Railway was already in the project root, it couldn't find a subdirectory called `backend`.

The fix is to either:
1. Tell Railway the root directory is `backend` (in service settings)
2. Deploy from project root: `cd /Users/brandonin/drl && railway up`

---

**Next Step:** Configure root directory in Railway dashboard, then redeploy.
