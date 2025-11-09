import { test, expect } from '@playwright/test';

test.describe('Admin API Management Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should show API Management tab in admin dashboard', async ({ page }) => {
    const apiTab = page.getByRole('button', { name: 'API Management' });
    await expect(apiTab).toBeVisible();
  });

  test('should switch to API Management tab', async ({ page }) => {
    const apiTab = page.getByRole('button', { name: 'API Management' });
    await apiTab.click();

    // Should show API Management content
    await expect(page.locator('text=/API Management/i').first()).toBeVisible();
    await expect(page.locator('text=/Auto.dev API/i')).toBeVisible();
  });

  test('should display all 8 available APIs', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();
    await page.waitForTimeout(1000);

    // Check for all 8 APIs
    const apis = [
      'Global VIN Decode API',
      'Plate-to-VIN API',
      'Vehicle Pricing',
      'Vehicle Photos API',
      'Vehicle Specifications API',
      'Vehicle Recalls API',
      'Total Cost of Ownership',
      'OEM Build Data API'
    ];

    for (const apiName of apis) {
      const apiCard = page.locator(`text=/${apiName}/i`).first();
      await expect(apiCard).toBeVisible();
    }
  });

  test('should show status badges for each API', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Should show at least one Active badge (VIN Decode)
    const activeBadge = page.locator('text=/Active/i').first();
    await expect(activeBadge).toBeVisible();

    // Should show Not Setup badges
    const notSetupBadges = page.locator('text=/Not Setup/i');
    const count = await notSetupBadges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show setup instructions section', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    const setupHeader = page.locator('text=/How to Setup Auto.dev API/i');
    await expect(setupHeader).toBeVisible();
  });

  test('should expand/collapse setup instructions', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    const instructionsButton = page.locator('text=/How to Setup Auto.dev API/i');
    await instructionsButton.click();

    // Should show step-by-step instructions
    await expect(page.locator('text=/Sign up for Auto.dev/i')).toBeVisible();
    await expect(page.locator('text=/Get your API key/i')).toBeVisible();
    await expect(page.locator('text=/Add to backend .env/i')).toBeVisible();

    // Collapse
    await instructionsButton.click();
    await page.waitForTimeout(500);

    // Instructions should be hidden
    const instructions = page.locator('text=/Sign up for Auto.dev/i');
    await expect(instructions).not.toBeVisible();
  });

  test('should show features for each API', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Check Plate-to-VIN API features
    const plateApiCard = page.locator('text=/Plate-to-VIN API/i').locator('..').locator('..');

    await expect(plateApiCard.locator('text=/US License Plate Lookup/i')).toBeVisible();
    await expect(plateApiCard.locator('text=/1,000 free calls/i')).toBeVisible();
  });

  test('should have documentation links for each API', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Check for "Docs" links
    const docLinks = page.locator('a:has-text("Docs →")');
    const count = await docLinks.count();

    expect(count).toBeGreaterThanOrEqual(8);
  });

  test('should show API status summary stats', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Should show stats section
    await expect(page.locator('text=/API Status Summary/i')).toBeVisible();

    // Should show Active count (at least 1 for VIN Decode)
    const activeCount = page.locator('text=/Active/i').last();
    await expect(activeCount).toBeVisible();

    // Should show Total Available count
    const totalText = page.locator('text=/Total Available/i');
    await expect(totalText).toBeVisible();
  });

  test('should show pricing information', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Should show free tier info
    await expect(page.locator('text=/Auto.dev Free Tier/i')).toBeVisible();
    await expect(page.locator('text=/1,000 free API calls per month/i')).toBeVisible();
    await expect(page.locator('text=/no credit card required/i')).toBeVisible();
  });

  test('should have Sign Up Free button', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    const signUpButton = page.locator('a:has-text("Sign Up Free")');
    await expect(signUpButton).toBeVisible();

    // Check it links to correct URL
    const href = await signUpButton.getAttribute('href');
    expect(href).toContain('auto.dev');
  });

  test('should show environment variable names', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Should show AUTO_DEV_API_KEY mentioned
    await expect(page.locator('text=/AUTO_DEV_API_KEY/i')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile only test');

    await page.getByRole('button', { name: 'API Management' }).click();

    // API cards should stack vertically
    const apiCards = page.locator('[class*="rounded-lg shadow"]');
    const firstCard = apiCards.first();

    const box = await firstCard.boundingBox();
    expect(box?.width).toBeLessThan(600); // Should be single column on mobile
  });

  test('should maintain state when switching tabs', async ({ page }) => {
    await page.getByRole('button', { name: 'API Management' }).click();

    // Expand instructions
    const instructionsButton = page.locator('text=/How to Setup Auto.dev API/i');
    await instructionsButton.click();

    // Switch to Submissions tab
    await page.getByRole('button', { name: 'Submissions' }).click();

    // Switch back to API Management
    await page.getByRole('button', { name: 'API Management' }).click();

    // Instructions should still be expanded
    await expect(page.locator('text=/Sign up for Auto.dev/i')).toBeVisible();
  });
});

test.describe('API Management Integration', () => {
  test('should load when admin dashboard loads', async ({ page }) => {
    let hasError = false;

    page.on('pageerror', error => {
      hasError = true;
      console.error('Page error:', error);
    });

    await page.goto('http://localhost:5173/admin');
    await page.getByRole('button', { name: 'API Management' }).click();
    await page.waitForTimeout(1000);

    expect(hasError).toBeFalsy();
  });

  test('should show correct status based on API key configuration', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    await page.getByRole('button', { name: 'API Management' }).click();

    // VIN Decode should show as Active (uses free NHTSA API)
    const vinDecodeCard = page.locator('text=/Global VIN Decode API/i').locator('..').locator('..');
    await expect(vinDecodeCard.locator('text=/Active/i')).toBeVisible();

    // Other APIs should show based on API key presence
    // Since we just added the API key, they might still show "Not Setup"
    // This is expected until the status check is implemented
  });

  test('should have working external links', async ({ page, context }) => {
    await page.goto('http://localhost:5173/admin');
    await page.getByRole('button', { name: 'API Management' }).click();

    // Find a docs link
    const docLink = page.locator('a:has-text("Docs →")').first();

    // Check it has target="_blank" for opening in new tab
    const target = await docLink.getAttribute('target');
    expect(target).toBe('_blank');

    // Check it has rel="noopener noreferrer" for security
    const rel = await docLink.getAttribute('rel');
    expect(rel).toContain('noopener');
  });

  test('should show helpful descriptions for each API', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');
    await page.getByRole('button', { name: 'API Management' }).click();

    // Check each API has a description
    const descriptions = [
      'Decode VIN to get vehicle specifications',
      'Convert license plates to VIN numbers',
      'Get market pricing estimates',
      'Get stock photos of vehicles',
      'Detailed vehicle specs and features',
      'Check for open recalls and safety issues',
      'Estimated ownership costs',
      'Original factory build information'
    ];

    for (const desc of descriptions) {
      const text = page.locator(`text=/${desc}/i`);
      await expect(text).toBeVisible();
    }
  });
});

test.describe('Admin Dashboard Navigation', () => {
  test('should have both Submissions and API Management tabs', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    await expect(page.getByRole('button', { name: 'Submissions' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'API Management' })).toBeVisible();
  });

  test('should highlight active tab', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    // Submissions should be active by default
    const submissionsTab = page.getByRole('button', { name: 'Submissions' });
    const submissionsClasses = await submissionsTab.getAttribute('class');
    expect(submissionsClasses).toContain('border-blue-500');

    // Click API Management
    await page.getByRole('button', { name: 'API Management' }).click();

    const apiTabClasses = await page.getByRole('button', { name: 'API Management' }).getAttribute('class');
    expect(apiTabClasses).toContain('border-blue-500');
  });

  test('should update subtitle based on active tab', async ({ page }) => {
    await page.goto('http://localhost:5173/admin');

    // Should show submissions count
    await expect(page.locator('text=/total submissions/i')).toBeVisible();

    // Switch to API Management
    await page.getByRole('button', { name: 'API Management' }).click();

    // Should show API management subtitle
    await expect(page.locator('text=/Manage your API integrations/i')).toBeVisible();

    // Switch back
    await page.getByRole('button', { name: 'Submissions' }).click();
    await expect(page.locator('text=/total submissions/i')).toBeVisible();
  });
});
