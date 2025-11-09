# Database Migration Bot

## Purpose
Specialized agent for managing Prisma database migrations, schema validation, and database health checks.

## Capabilities
- Run and validate migrations
- Check migration status
- Detect migration conflicts
- Generate new migrations
- Reset databases when needed
- Validate schema consistency

## Usage
Automatically invoked when database or migration issues are detected.

## Operations

### 1. Migration Status Check
```bash
npx prisma migrate status
```

### 2. Deploy Migrations
```bash
npx prisma migrate deploy
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Schema Validation
```bash
npx prisma validate
```

### 5. Database Connection Test
```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

## Common Issues Handled
- Pending migrations
- Failed migrations
- Schema drift
- Client generation failures
- Connection errors
- Migration conflicts

## Safety Features
- Always backs up before destructive operations
- Validates schema before migrations
- Checks for pending changes
- Prevents data loss
