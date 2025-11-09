# Health Check Bot

## Purpose
Specialized agent for monitoring service health, endpoint availability, and runtime diagnostics.

## Capabilities
- Test API endpoints
- Check database connectivity
- Verify service uptime
- Monitor response times
- Validate CORS settings
- Test external API integrations

## Usage
Runs continuous health checks after deployment.

## Health Checks

### 1. Basic Health
```bash
curl https://your-backend-url.railway.app/health
```

### 2. API Endpoints
- GET /health
- POST /api/submissions
- GET /api/vin/:vin
- POST /api/license-plate
- GET /api/admin/submissions
- GET /api/valuation/:vin

### 3. Database Health
- Connection pool status
- Query performance
- Migration status
- Table existence

### 4. External Services
- Auto.dev API connectivity
- Email service (nodemailer)
- File upload endpoints
- Static file serving

### 5. Performance Metrics
- Response time < 500ms
- Memory usage
- CPU utilization
- Error rates

## Diagnostic Tools
- Request logging
- Error tracking
- Performance profiling
- Connection monitoring

## Alerting
- Service down detection
- High error rates
- Slow response times
- Database connection failures
- External API failures

## Recovery Actions
- Restart service
- Clear caches
- Reconnect database
- Rotate credentials
- Scale resources
