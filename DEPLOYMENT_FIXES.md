# Railway Deployment Fixes

## Issues Identified

### 1. **CRITICAL: prisma.config.ts file causing DATABASE_URL issues**
- **Problem**: The `backend/prisma.config.ts` file is interfering with environment variable loading
- **Impact**: Migrations fail with "Can't reach database server" error
- **Solution**: Remove or rename this file - Prisma doesn't need it for Railway deployments

### 2. **Railway Configuration Mismatch**
- **Root railway.json**: Has generic start command
- **Backend railway.json**: Properly configured with nixpacks
- **Problem**: Railway may be using root config instead of backend config
- **Solution**: Ensure Railway is deploying from `/backend` subdirectory

### 3. **Start Command Issues**
- **nixpacks.toml**: Has debug echo commands that may interfere
- **Solution**: Use clean start command without debug output

### 4. **Migration Files Deleted**
- Git shows deleted migration files:
  - `backend/prisma/migrations/20251105071249_init/migration.sql`
  - `backend/prisma/migrations/20251109065521_add_market_valuation/migration.sql`
- **Current migration**: `20251109004150_init`
- **Impact**: Migration history mismatch can cause deployment failures

## Immediate Actions Required

### Step 1: Fix prisma.config.ts Issue
```bash
cd /Users/brandonin/drl/backend
mv prisma.config.ts prisma.config.ts.backup
```

### Step 2: Clean Up Railway Configuration
Use only the backend railway.json and ensure Railway deploys from backend directory.

### Step 3: Simplify nixpacks.toml Start Command
Remove debug echo commands and use clean start command.

### Step 4: Deploy to Railway
```bash
cd /Users/brandonin/drl/backend
railway up
```

### Step 5: Run Migrations
```bash
railway run npx prisma migrate deploy
```

### Step 6: Test Deployment
```bash
# Get your Railway URL from dashboard
curl https://your-backend-url.railway.app/health
```

## Configuration Files to Update

### backend/nixpacks.toml (Simplified)
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

### backend/railway.json (Current - Already Good)
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

## Environment Variables Verified ✅
All required variables are set in Railway:
- ✅ DATABASE_URL (auto-set by PostgreSQL service)
- ✅ PORT (3000)
- ✅ NODE_ENV (production)
- ✅ JWT_SECRET (configured)
- ✅ AUTO_DEV_API_KEY (configured)
- ✅ FRONTEND_URL (placeholder set)

## Database Status
- PostgreSQL database is provisioned
- DATABASE_URL is correctly set
- Migration needs to run after fixing prisma.config.ts

## Build Status
- ✅ Backend builds successfully locally
- ✅ TypeScript compiles without errors
- ✅ All dependencies are installed
- ✅ dist/index.js exists

## Next Steps

1. **Remove prisma.config.ts** (CRITICAL)
2. **Simplify nixpacks.toml start command**
3. **Ensure Railway deploys from /backend directory**
4. **Trigger new deployment**
5. **Run migrations after deployment**
6. **Test health endpoint**

## Available Debug Commands

Use these slash commands to debug:
- `/railway-debug` - Run full Railway diagnostics
- `/db-migrate` - Handle database migrations
- `/build-validate` - Validate TypeScript build
- `/env-validate` - Check environment variables
- `/health-check` - Test deployed endpoints

## Support Agents Available

The following specialized agents are now available:
1. **Railway Debug Bot** - Deployment troubleshooting
2. **Database Migration Bot** - Migration management
3. **Build Validator Bot** - Build verification
4. **Environment Validator Bot** - Config validation
5. **Health Check Bot** - Service monitoring
