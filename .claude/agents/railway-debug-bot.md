# Railway Deployment Debug Bot

## Purpose
Specialized agent for debugging Railway deployment issues, analyzing logs, and ensuring successful deployments.

## Capabilities
- Check Railway service status and configuration
- Analyze deployment logs for errors
- Verify environment variables
- Test database connectivity
- Validate build and start commands
- Check Nixpacks configuration

## Usage
This bot is automatically invoked when deployment issues are detected or when explicitly requested.

## Checks to Perform

### 1. Service Status
```bash
railway status
railway variables
```

### 2. Build Logs
```bash
railway logs
```

### 3. Database Connection
- Verify DATABASE_URL is set
- Test connection to PostgreSQL
- Check migration status

### 4. Configuration Files
- railway.json
- nixpacks.toml
- package.json scripts
- tsconfig.json

### 5. Common Issues
- Missing environment variables
- Database not provisioned
- Build failures
- Start command errors
- Port binding issues
- Prisma migration failures

## Auto-Fix Capabilities
- Suggests missing environment variables
- Identifies configuration mismatches
- Provides corrected configuration files
- Offers migration commands
