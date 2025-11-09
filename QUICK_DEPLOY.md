# Quick Railway Deployment Guide

## Issues Fixed ✅

1. **Removed prisma.config.ts** - Was causing DATABASE_URL environment variable issues
2. **Simplified nixpacks.toml** - Removed debug echo commands that interfered with startup
3. **Created deployment test suite** - `backend/scripts/test-deployment.sh`
4. **Created debugging bots** - 5 specialized agents for troubleshooting
5. **Created slash commands** - Quick access to debugging tools

## All Tests Passing ✅

```
Passed: 25
Failed: 0
```

## Deploy Now

### Option 1: Quick Deploy (Recommended)
```bash
cd /Users/brandonin/drl/backend

# Deploy to Railway (this will trigger build and deployment)
railway up

# Watch the logs
railway logs
```

### Option 2: Commit First, Then Deploy
```bash
cd /Users/brandonin/drl

# Stage all changes
git add .

# Commit fixes
git commit -m "Fix Railway deployment: remove prisma.config.ts, simplify nixpacks, add debug tools"

# Push to git (optional)
git push

# Deploy to Railway
cd backend
railway up
```

## After Deployment

### 1. Check Health Endpoint
```bash
# Get your Railway URL
railway status

# Test health endpoint
curl https://dealertrade-production-XXXX.up.railway.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-11-09T..."}
```

### 2. Run Migrations (if needed)
```bash
railway run npx prisma migrate deploy
```

### 3. Check Service Status
```bash
railway logs
```

## Debugging Tools Available

### Slash Commands
- `/railway-debug` - Full Railway diagnostics
- `/db-migrate` - Database migration management
- `/build-validate` - TypeScript build validation
- `/env-validate` - Environment variable checks
- `/health-check` - Service health monitoring

### Test Scripts
```bash
# Run full deployment test suite
cd backend
./scripts/test-deployment.sh
```

### Manual Checks
```bash
# Check Railway status
railway status

# View environment variables
railway variables

# Check logs
railway logs

# Run commands in Railway environment
railway run <command>
```

## Key Configuration Files

### backend/railway.json
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfigPath": "nixpacks.toml"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### backend/nixpacks.toml
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

## Environment Variables (All Set ✅)

- ✅ `DATABASE_URL` - PostgreSQL connection
- ✅ `PORT` - 3000
- ✅ `NODE_ENV` - production
- ✅ `JWT_SECRET` - Configured
- ✅ `AUTO_DEV_API_KEY` - Configured
- ✅ `FRONTEND_URL` - Placeholder (update after frontend deploys)

## Troubleshooting

### If deployment fails:

1. **Check logs first**:
   ```bash
   railway logs
   ```

2. **Verify environment variables**:
   ```bash
   railway variables
   ```

3. **Test locally**:
   ```bash
   npm run build
   npm start
   ```

4. **Use debug commands**:
   ```bash
   /railway-debug
   ```

### Common Issues:

**Build fails**:
- Run `npm run build` locally to check for TypeScript errors
- Check `railway logs` for specific error messages

**Migration fails**:
- Ensure DATABASE_URL is set: `railway variables | grep DATABASE_URL`
- Run `/db-migrate` command for guided troubleshooting

**Service won't start**:
- Check PORT is set to 3000
- Verify dist/index.js exists after build
- Check for missing environment variables

**Can't connect to database**:
- Ensure PostgreSQL service is provisioned in Railway
- DATABASE_URL should be auto-set by Railway
- Wait 2-3 minutes for database to be fully ready

## Support

If you encounter issues:

1. Run the test suite: `./backend/scripts/test-deployment.sh`
2. Use the debugging slash commands listed above
3. Check DEPLOYMENT_FIXES.md for detailed issue analysis
4. Review Railway logs for error messages

## Next Steps After Successful Deployment

1. ✅ Backend deployed
2. ⏳ Deploy frontend service
3. ⏳ Update FRONTEND_URL in backend variables
4. ⏳ Configure custom domain (optional)
5. ⏳ Set up monitoring and alerts

---

**Ready to deploy! 🚀**

All tests passed and configuration is validated. Run `railway up` to deploy.
