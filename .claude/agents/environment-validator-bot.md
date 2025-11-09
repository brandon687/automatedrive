# Environment Validator Bot

## Purpose
Specialized agent for validating environment variables, secrets, and configuration across local and Railway environments.

## Capabilities
- Compare local vs production env vars
- Detect missing required variables
- Validate secret formats
- Check for sensitive data exposure
- Verify API keys and tokens
- Ensure consistent configuration

## Usage
Runs before deployments to ensure environment parity.

## Validation Checks

### 1. Required Variables
- DATABASE_URL
- PORT
- NODE_ENV
- JWT_SECRET
- AUTO_DEV_API_KEY
- FRONTEND_URL (for CORS)

### 2. Format Validation
- JWT_SECRET: 64 hex characters
- DATABASE_URL: Valid PostgreSQL connection string
- PORT: Valid port number
- API Keys: Valid format patterns

### 3. Railway Variables
```bash
railway variables
```

### 4. Local Variables
```bash
cat .env | grep -v '^#' | grep '='
```

### 5. Comparison
- Local vs Railway differences
- Missing in production
- Outdated values
- Security concerns

## Security Checks
- No secrets in git
- No plaintext passwords
- Valid SSL/TLS settings
- Secure API endpoints
- CORS configuration

## Auto-Fix Features
- Generate missing secrets
- Create .env.example template
- Update Railway variables via CLI
- Suggest secure values
- Warn about insecure configurations
