# Build Validator Bot

## Purpose
Specialized agent for validating TypeScript builds, dependency resolution, and compilation issues.

## Capabilities
- Run TypeScript compilation
- Check for type errors
- Validate dependencies
- Test build output
- Check for missing modules
- Verify build artifacts

## Usage
Runs automatically before deployments to ensure clean builds.

## Validation Steps

### 1. Clean Build
```bash
rm -rf dist node_modules/.cache
npm run build
```

### 2. Type Check
```bash
tsc --noEmit
```

### 3. Dependency Check
```bash
npm audit
npm outdated
```

### 4. Output Validation
- Check dist/ directory structure
- Verify index.js exists
- Validate source maps
- Check for compilation errors

### 5. Runtime Test
```bash
node dist/index.js --version
```

## Error Detection
- Missing dependencies
- Type errors
- Import path issues
- Configuration problems
- Module resolution failures

## Auto-Fix Features
- Install missing dependencies
- Fix import paths
- Update tsconfig.json
- Clean build artifacts
- Regenerate declaration files
