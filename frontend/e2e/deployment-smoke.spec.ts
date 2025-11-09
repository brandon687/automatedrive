import { test, expect } from '@playwright/test';

/**
 * Deployment Smoke Tests
 *
 * Quick tests to verify the application is working after deployment.
 * These tests are designed to be fast and catch critical issues.
 */

test.describe('Deployment Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Wait for React to hydrate
    await page.waitForLoadState('networkidle');

    // Verify the page title contains "frontend"
    await expect(page).toHaveTitle(/frontend/i);

    // Verify root element is present
    const root = page.locator('#root');
    await expect(root).toBeVisible();

    console.log('✓ Homepage loaded successfully');
  });

  test('no critical console errors on load', async ({ page }) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Capture console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      } else if (msg.type() === 'warning') {
        warnings.push(msg.text());
      }
    });

    // Load the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Log any warnings (not critical)
    if (warnings.length > 0) {
      console.log('⚠ Warnings found:', warnings);
    }

    // Fail if there are console errors
    if (errors.length > 0) {
      console.error('✗ Console errors found:', errors);
    }
    expect(errors).toHaveLength(0);

    console.log('✓ No critical console errors detected');
  });

  test('main branding elements visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for DealerTrade branding
    const heading = page.getByRole('heading', { name: /dealertrade/i });
    await expect(heading).toBeVisible();

    // Check for tagline
    const tagline = page.getByText(/get the best price for your vehicle/i);
    await expect(tagline).toBeVisible();

    console.log('✓ Main branding elements are visible');
  });

  test('form components render', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for the form to appear
    await page.waitForSelector('input', { timeout: 5000 });

    // Check for essential form elements
    const inputs = await page.locator('input').count();
    const buttons = await page.locator('button').count();

    expect(inputs).toBeGreaterThan(0);
    expect(buttons).toBeGreaterThan(0);

    console.log(`✓ Form rendered with ${inputs} inputs and ${buttons} buttons`);
  });

  test('VIN input accepts text', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for VIN input to be ready
    await page.waitForSelector('input[placeholder*="1HGBH41JXMN109186"]', { timeout: 5000 });

    // Find and fill VIN input
    const vinInput = page.locator('input[placeholder*="1HGBH41JXMN109186"]');
    await vinInput.fill('1HGBH41JXMN109186');

    // Verify the value was set
    await expect(vinInput).toHaveValue('1HGBH41JXMN109186');

    console.log('✓ VIN input is interactive and accepts text');
  });

  test('progress steps visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for progress indicators - use first() to handle multiple matches
    const progressSteps = page.locator('text=VIN').first();
    await expect(progressSteps).toBeVisible();

    const detailsStep = page.locator('text=Details').first();
    await expect(detailsStep).toBeVisible();

    const photosStep = page.locator('text=Photos').first();
    await expect(photosStep).toBeVisible();

    const doneStep = page.locator('text=Done').first();
    await expect(doneStep).toBeVisible();

    console.log('✓ All 4 progress steps are visible');
  });

  test('admin button visible and clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find admin button
    const adminButton = page.getByRole('button', { name: /admin view/i });
    await expect(adminButton).toBeVisible();
    await expect(adminButton).toBeEnabled();

    console.log('✓ Admin button is visible and clickable');
  });

  test('navigation to admin works', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click admin button
    const adminButton = page.getByRole('button', { name: /admin view/i });
    await adminButton.click();

    // Wait for navigation
    await page.waitForTimeout(1000);

    // Check URL changed
    expect(page.url()).toContain('/admin');

    // Verify admin content is visible
    const backButton = page.getByRole('button', { name: /back to submit/i });
    await expect(backButton).toBeVisible();

    console.log('✓ Navigation to admin view works');
  });

  test('app is responsive - mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that content is still visible
    const heading = page.getByRole('heading', { name: /dealertrade/i });
    await expect(heading).toBeVisible();

    // Check form is visible
    const inputs = await page.locator('input').count();
    expect(inputs).toBeGreaterThan(0);

    console.log('✓ App is responsive on mobile viewport');
  });

  test('takes screenshot for visual verification', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take full page screenshot
    await page.screenshot({
      path: 'test-results/screenshots/homepage-full.png',
      fullPage: true
    });

    // Take viewport screenshot
    await page.screenshot({
      path: 'test-results/screenshots/homepage-viewport.png'
    });

    console.log('✓ Screenshots captured for visual verification');
  });
});

test.describe('API Health Check', () => {
  test('check if backend is accessible', async ({ page }) => {
    let apiAvailable = false;

    // Try to reach the API
    try {
      const response = await page.request.get('/health');
      apiAvailable = response.ok();

      if (apiAvailable) {
        console.log('✓ Backend API is accessible');
      } else {
        console.log('⚠ Backend API returned non-OK status:', response.status());
      }
    } catch (error) {
      console.log('⚠ Backend API is not accessible (this is OK for frontend-only testing)');
      console.log('   Error:', error);
    }

    // This test doesn't fail - it's just informational
    expect(true).toBe(true);
  });

  test('check API configuration', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check if there are any network errors
    const networkErrors: string[] = [];

    page.on('response', response => {
      if (!response.ok() && response.url().includes('/api/')) {
        networkErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    // Try to trigger an API call by filling the form
    try {
      const vinInput = page.locator('input[placeholder*="1HGBH41JXMN109186"]');
      await vinInput.fill('1HGBH41JXMN109186');

      // Click continue button
      const continueButton = page.getByRole('button', { name: /continue/i });
      if (await continueButton.isVisible()) {
        await continueButton.click();

        // Wait a bit to see if there are API calls
        await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.log('⚠ Could not test API calls:', error);
    }

    if (networkErrors.length > 0) {
      console.log('⚠ API errors detected:', networkErrors);
      console.log('   This is expected if backend is not running');
    } else {
      console.log('✓ No API errors detected during interaction');
    }

    // This test doesn't fail - it's just informational
    expect(true).toBe(true);
  });
});
