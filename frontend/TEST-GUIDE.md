# Playwright Test Guide for DealerTrade Frontend

This guide explains how to run the comprehensive Playwright test suite for the DealerTrade frontend application.

## Test Suite Overview

The test suite includes:

1. **Deployment Smoke Tests** (`e2e/deployment-smoke.spec.ts`) - Quick verification tests
2. **Mobile Responsiveness Tests** (`e2e/mobile-responsiveness.spec.ts`) - Device-specific testing
3. **Accessibility Tests** (`e2e/accessibility.spec.ts`) - A11y compliance
4. **Functionality Tests** (`e2e/functionality.spec.ts`) - User workflows
5. **API Integration Tests** (`e2e/api-integration.spec.ts`) - Backend connectivity
6. **API Management Tests** (`e2e/api-management.spec.ts`) - API URL configuration
7. **License Plate Lookup Tests** (`e2e/license-plate-lookup.spec.ts`) - Plate lookup feature

## Quick Start

### Run All Tests (Local Development)

```bash
npm test
```

This will:
- Start the Vite dev server automatically
- Run all tests across all configured devices
- Generate an HTML report

### Run Smoke Tests Only (Fast)

```bash
npx playwright test e2e/deployment-smoke.spec.ts --project=chromium
```

This runs the essential deployment verification tests in ~5 seconds.

### Run Mobile Tests Only

```bash
npm run test:mobile
```

This tests on Mobile Chrome, Mobile Safari, iPhone, and Android devices.

## Testing Deployed Applications

You can test your deployed application without starting a local server:

### Test on Railway

```bash
TEST_URL=https://your-app.railway.app npx playwright test e2e/deployment-smoke.spec.ts
```

### Test on Vercel

```bash
TEST_URL=https://your-app.vercel.app npx playwright test e2e/deployment-smoke.spec.ts
```

### Test Local Production Build

```bash
# Start your production server
npm run start  # or npm run preview

# In another terminal
TEST_URL=http://localhost:3001 npx playwright test e2e/deployment-smoke.spec.ts
```

## View Test Results

### Open HTML Report

```bash
npm run test:report
# or
npx playwright show-report
```

This opens an interactive HTML report in your browser showing:
- Test results
- Screenshots
- Videos of failures
- Trace files for debugging

### View Screenshots

Screenshots are saved to `test-results/screenshots/`:

```bash
open test-results/screenshots/homepage-full.png
open test-results/screenshots/homepage-viewport.png
```

## Interactive Test Development

### UI Mode (Recommended for Development)

```bash
npm run test:ui
```

This opens the Playwright Test UI where you can:
- Run individual tests
- See tests update live as you edit code
- Debug with time-travel
- Inspect locators visually

### Debug Mode

```bash
npx playwright test --debug
```

Opens Playwright Inspector for step-by-step debugging.

## Test Configuration

The configuration is in `playwright.config.ts`. Key settings:

### Environment Variables

- `TEST_URL` - Override the base URL for tests (default: http://localhost:5173)
- `CI` - Set to enable CI-specific behavior (retries, workers, etc.)

### Browser Projects

Tests run on:
- Desktop Chrome (chromium)
- Desktop Safari (webkit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12, iPhone 13 Pro, iPhone SE)
- iPad and iPad Pro
- Samsung Galaxy S21

### Timeouts

- Action timeout: 15 seconds
- Navigation timeout: 30 seconds
- Test timeout: 30 seconds (default)

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install dependencies
  run: cd frontend && npm ci

- name: Install Playwright Browsers
  run: cd frontend && npx playwright install --with-deps

- name: Run tests
  run: cd frontend && npm test

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: frontend/playwright-report/
```

### Railway/Vercel Deployment Testing

After deployment, run smoke tests:

```bash
# In your CI pipeline after deployment
TEST_URL=$DEPLOYMENT_URL npx playwright test e2e/deployment-smoke.spec.ts
```

## Test Writing Guidelines

### Smoke Test Checklist

When writing smoke tests, ensure they:
- Complete in under 10 seconds
- Test critical user paths only
- Don't require backend (or handle gracefully)
- Take screenshots for visual verification
- Use clear, descriptive test names

### Example Smoke Test

```typescript
test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveTitle(/frontend/i);

  const root = page.locator('#root');
  await expect(root).toBeVisible();

  console.log('✓ Homepage loaded successfully');
});
```

## Troubleshooting

### Tests Fail with "Target Closed"

Server crashed or timed out. Check:
- Server is running and accessible
- No port conflicts
- Sufficient memory available

### Tests Timeout

Increase timeouts in `playwright.config.ts`:

```typescript
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
}
```

### Screenshots Not Captured

Ensure directory exists:

```bash
mkdir -p test-results/screenshots
```

### Backend API Not Available

Smoke tests handle this gracefully. The API health check tests are informational only and won't fail if backend is unavailable.

## Test Results Summary

### Latest Run (Local Development)

```
✓ 12 tests passed
  - Homepage loads successfully
  - No critical console errors
  - Main branding elements visible
  - Form components render
  - VIN input accepts text
  - Progress steps visible
  - Admin button visible and clickable
  - Navigation to admin works
  - App responsive on mobile
  - Screenshots captured
  - Backend API accessible
  - No API errors detected
```

**Total duration:** ~4 seconds
**Screenshots captured:** 2
**Devices tested:** Desktop Chrome

## Next Steps

1. Run full test suite: `npm test`
2. Test on mobile: `npm run test:mobile`
3. View HTML report: `npm run test:report`
4. Test deployed app: `TEST_URL=https://your-url npx playwright test e2e/deployment-smoke.spec.ts`

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Guide](https://playwright.dev/docs/ci)
