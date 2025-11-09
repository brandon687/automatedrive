import { test, expect } from '@playwright/test';

test.describe('License Plate Lookup Feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');
  });

  test('should show VIN and License Plate tabs', async ({ page }) => {
    // Check both tabs are visible
    const vinTab = page.getByRole('button', { name: 'VIN Number' });
    const plateTab = page.getByRole('button', { name: 'License Plate' });

    await expect(vinTab).toBeVisible();
    await expect(plateTab).toBeVisible();
  });

  test('should switch between VIN and License Plate input methods', async ({ page }) => {
    // Initially VIN tab should be active
    const vinInput = page.locator('input[placeholder*="1HGBH41JXMN109186"]');
    await expect(vinInput).toBeVisible();

    // Click License Plate tab
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Should show license plate inputs
    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    const stateSelect = page.locator('select').first();

    await expect(plateInput).toBeVisible();
    await expect(stateSelect).toBeVisible();

    // Switch back to VIN
    await page.getByRole('button', { name: 'VIN Number' }).click();
    await expect(vinInput).toBeVisible();
  });

  test('should have all US states in dropdown', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    const stateSelect = page.locator('select').first();
    const options = await stateSelect.locator('option').allTextContents();

    // Should have at least 50 states + DC + default option
    expect(options.length).toBeGreaterThanOrEqual(51);

    // Check for some key states
    expect(options.join(',')).toContain('California');
    expect(options.join(',')).toContain('Texas');
    expect(options.join(',')).toContain('New York');
    expect(options.join(',')).toContain('Florida');
  });

  test('should show error when submitting empty license plate', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Click continue without entering data
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should show error message
    const errorMessage = page.locator('text=/Please enter license plate/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should show error when license plate selected but no state chosen', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Enter plate but no state
    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await plateInput.fill('ABC1234');

    await page.getByRole('button', { name: 'Continue' }).click();

    // Should show error message
    const errorMessage = page.locator('text=/select state/i');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('should attempt license plate lookup with valid input', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Enter license plate and state
    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await plateInput.fill('7MGU382');

    const stateSelect = page.locator('select').first();
    await stateSelect.selectOption('CA');

    // Click continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should show loading state
    await expect(page.getByRole('button', { name: /Looking up plate/i })).toBeVisible({ timeout: 2000 });

    // Wait for response (either success or error)
    await page.waitForTimeout(3000);

    // Either should move to step 2 OR show an error message
    const step2Visible = await page.locator('text=/Vehicle Details/i').isVisible();
    const errorVisible = await page.locator('text=/not found/i').isVisible();

    expect(step2Visible || errorVisible).toBeTruthy();
  });

  test('should convert input to uppercase', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await plateInput.fill('abc123');

    // Should be converted to uppercase
    const value = await plateInput.inputValue();
    expect(value).toBe('ABC123');
  });

  test('should show help text for license plate lookup', async ({ page }) => {
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Should show helper text
    const helperText = page.locator('text=/automatically look up your VIN/i');
    await expect(helperText).toBeVisible();
  });

  test('should work on mobile devices', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is only for mobile');

    // Check tabs are visible and tappable
    const plateTab = page.getByRole('button', { name: 'License Plate' });
    await expect(plateTab).toBeVisible();

    await plateTab.tap();

    // Should show inputs
    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await expect(plateInput).toBeVisible();

    // Check touch targets are large enough (44x44px minimum)
    const box = await plateTab.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
  });
});

test.describe('License Plate API Integration', () => {
  test('should make API call to license-plate endpoint', async ({ page }) => {
    let apiCalled = false;

    page.on('request', request => {
      if (request.url().includes('/api/license-plate/lookup')) {
        apiCalled = true;
      }
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'License Plate' }).click();

    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await plateInput.fill('TEST123');

    const stateSelect = page.locator('select').first();
    await stateSelect.selectOption('CA');

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(2000);

    expect(apiCalled).toBeTruthy();
  });

  test('should load US states from API', async ({ page }) => {
    let statesApiCalled = false;

    page.on('request', request => {
      if (request.url().includes('/api/license-plate/states')) {
        statesApiCalled = true;
      }
    });

    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    // States should be loaded on mount
    expect(statesApiCalled).toBeTruthy();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'License Plate' }).click();

    // Enter invalid plate
    const plateInput = page.locator('input[placeholder*="ABC1234"]');
    await plateInput.fill('INVALID');

    const stateSelect = page.locator('select').first();
    await stateSelect.selectOption('CA');

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.waitForTimeout(3000);

    // Should show error message
    const errorBox = page.locator('[class*="bg-red"]');
    await expect(errorBox).toBeVisible({ timeout: 5000 });
  });
});

test.describe('VIN Input (Existing Functionality)', () => {
  test('should still work with VIN input', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // VIN should be default
    const vinInput = page.locator('input[placeholder*="1HGBH41JXMN109186"]');
    await expect(vinInput).toBeVisible();

    // Enter valid VIN
    await vinInput.fill('1HGBH41JXMN109186');

    await page.getByRole('button', { name: 'Continue' }).click();

    // Should decode and move to step 2
    await expect(page.locator('text=/Vehicle Details/i')).toBeVisible({ timeout: 10000 });
  });

  test('should validate VIN length', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const vinInput = page.locator('input[placeholder*="1HGBH41JXMN109186"]');
    await vinInput.fill('TOOSHORT');

    await page.getByRole('button', { name: 'Continue' }).click();

    // Should show validation error
    const errorText = page.locator('text=/17 characters/i');
    await expect(errorText).toBeVisible();
  });
});
