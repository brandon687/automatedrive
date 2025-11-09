# Testing Quick Start

Quick reference for running Playwright tests on DealerTrade frontend.

## One-Line Commands

```bash
# Run all tests
npm test

# Run smoke tests only (fast - 5 seconds)
npm run test:smoke

# Test mobile devices
npm run test:mobile

# View test results
npm run test:report

# Interactive test mode
npm run test:ui

# Test deployed app
TEST_URL=https://your-app.com npm run test:smoke
```

## Test a Deployment

```bash
# Option 1: Use the script
npm run test:deployment https://your-app.com

# Option 2: Direct command
TEST_URL=https://your-app.com npm run test:smoke
```

## Common Scenarios

### Before Deploying
```bash
npm run build
npm run preview
TEST_URL=http://localhost:4173 npm run test:smoke
```

### After Deploying to Railway
```bash
npm run test:deployment https://your-app.railway.app
```

### After Deploying to Vercel
```bash
TEST_URL=https://your-app.vercel.app npm run test:smoke
```

### Debug a Failing Test
```bash
npx playwright test --debug
```

### Update Test Snapshots
```bash
npx playwright test --update-snapshots
```

## Test Files

- `e2e/deployment-smoke.spec.ts` - Quick deployment verification (12 tests)
- `e2e/functionality.spec.ts` - User workflows
- `e2e/mobile-responsiveness.spec.ts` - Mobile/tablet testing
- `e2e/accessibility.spec.ts` - A11y compliance
- `e2e/api-integration.spec.ts` - API testing
- `e2e/license-plate-lookup.spec.ts` - License plate feature

## Test Results Location

- HTML Report: `playwright-report/index.html`
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/*/video.webm`
- Traces: `test-results/*/trace.zip`

## Pass Criteria

All smoke tests should pass:
- ✓ Homepage loads (< 3 seconds)
- ✓ No console errors
- ✓ UI elements visible
- ✓ Forms interactive
- ✓ Navigation works
- ✓ Mobile responsive

## What to Do If Tests Fail

1. Check the HTML report: `npm run test:report`
2. Look at screenshots in `test-results/screenshots/`
3. Check deployment logs
4. Verify environment variables
5. Test locally first: `TEST_URL=http://localhost:3001 npm run test:smoke`

## CI/CD Integration

```yaml
# GitHub Actions
- name: Run tests
  run: cd frontend && npm test

- name: Upload report
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: frontend/playwright-report/
```

## Help

- Full guide: See `TEST-GUIDE.md`
- Deployment info: See `DEPLOYMENT-RECOMMENDATIONS.md`
- Playwright docs: https://playwright.dev
