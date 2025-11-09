# Railway Deployment Guide

## Overview
This frontend application is deployed to Railway using a custom Express server for production reliability.

## Architecture

### Production Server
- **File**: `server.js`
- **Type**: Express.js static file server
- **Purpose**: Serve built Vite application with proper SPA routing

### Key Features
1. **Static File Serving**: Serves files from `dist/` directory
2. **SPA Routing**: All routes fall back to `index.html` for client-side routing
3. **Health Check**: `/health` endpoint for Railway's health checks
4. **Graceful Shutdown**: Handles SIGTERM and SIGINT signals
5. **Error Handling**: Proper startup error handling and logging

## Configuration Files

### 1. railway.json
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm ci && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100
  }
}
```

### 2. nixpacks.toml
```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

### 3. package.json
- Added `"start": "node server.js"` script
- Added `express` as a production dependency

## Environment Variables

### Required
- `PORT` - Set automatically by Railway (default: 4173 for local dev)

### Optional
- `NODE_ENV` - Set to "production" by Railway

## Deployment Process

### Automatic Deployment
1. Push changes to the connected Git branch
2. Railway automatically:
   - Detects changes
   - Runs `npm ci` to install dependencies
   - Runs `npm run build` to build the Vite app
   - Starts server with `npm start`
   - Performs health check on `/health` endpoint

### Manual Deployment
```bash
# From frontend directory
npm run build        # Build the app
npm start           # Start the server locally
```

## Local Testing

### Test the production server locally:
```bash
cd frontend
npm install          # Install dependencies
npm run build       # Build the application
PORT=8080 npm start # Start server on port 8080
```

### Test health check:
```bash
curl http://localhost:8080/health
# Expected: {"status":"ok","timestamp":"2025-11-09T..."}
```

### Test SPA routing:
```bash
curl http://localhost:8080/
curl http://localhost:8080/any-route
# Both should return the index.html content
```

## Troubleshooting

### 502 Bad Gateway
**Symptoms**: Railway shows 502 error, app not accessible

**Causes**:
1. Server not binding to `0.0.0.0` (Railway requires this)
2. Server not listening on Railway's `PORT` variable
3. Server takes too long to start (health check timeout)
4. Build artifacts missing (dist/ directory empty)

**Solution**: This implementation fixes all these issues:
- Explicitly binds to `0.0.0.0`
- Reads `PORT` from environment
- Fast startup with health check
- Proper error handling

### Build Failures
**Check**:
1. Node version compatibility (requires >=22.0.0)
2. TypeScript compilation errors
3. Vite build errors

**Debug**:
```bash
npm run build
# Review error output
```

### Runtime Errors
**Check Railway logs**:
1. Server startup messages
2. Port binding confirmation
3. Error stack traces

**Key log indicators**:
- "Server running on http://0.0.0.0:XXXX" = Success
- "Failed to start server" = Error (process exits)

## Why Express Instead of Vite Preview?

### Vite Preview Limitations
1. Designed for local development, not production
2. May not properly bind to 0.0.0.0 on all platforms
3. Less reliable health check support
4. More complex to debug

### Express Server Benefits
1. Battle-tested for production deployments
2. Explicit control over host binding
3. Built-in health check endpoint
4. Better error handling and logging
5. Railway's recommended approach
6. Graceful shutdown support

## Architecture Decisions

### Why Not Use Vite's Built-in Server?
Vite's preview server (`vite preview`) is excellent for local development but has limitations in production environments like Railway:
- PORT binding issues
- Health check reliability
- Startup time variability

### Why Express?
- Minimal overhead (just static file serving)
- Proven reliability on Railway
- Easy to extend (add API routes, middleware, etc.)
- Standard Node.js patterns

## Future Enhancements

Potential improvements:
1. Add compression middleware for better performance
2. Add custom caching headers
3. Add request logging
4. Add security headers (helmet)
5. Add rate limiting

Example with compression:
```javascript
import compression from 'compression';
app.use(compression());
```

## Support

For issues:
1. Check Railway deployment logs
2. Verify environment variables
3. Test locally with same PORT
4. Check health endpoint response
