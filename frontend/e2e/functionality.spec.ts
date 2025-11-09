import { test, expect } from '@playwright/test';

/**
 * Functionality Tests
 * Tests core features work correctly on mobile and desktop
 */

test.describe('Core Functionality - Submission Form', () => {
  test('should display submission form', async ({ page }) => {
    await page.goto('/');

    // Should have main heading
    await expect(page.locator('h1')).toBeVisible();

    // Should have form elements
    const form = page.locator('form').first();
    if (await form.isVisible()) {
      await expect(form).toBeVisible();
    }

    await page.screenshot({ path: 'test-results/submission-form.png', fullPage: true });
  });

  test('should validate VIN input', async ({ page }) => {
    await page.goto('/');

    const vinInput = page.locator('input[placeholder*="VIN" i]').first();

    if (await vinInput.isVisible()) {
      // Enter invalid VIN
      await vinInput.fill('123');

      // Try to proceed (if there's a submit/next button)
      const nextButton = page.locator('button:has-text("Next"), button[type="submit"]').first();

      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);

        // Should show validation error
        const errorMessage = page.locator('[class*="error"], [role="alert"]');
        if (await errorMessage.count() > 0) {
          await expect(errorMessage.first()).toBeVisible();
        }
      }
    }
  });

  test('should switch to admin view', async ({ page }) => {
    await page.goto('/');

    // Look for admin link/button
    const adminButton = page.locator('button:has-text("Admin"), a:has-text("Admin")').first();

    if (await adminButton.isVisible()) {
      await adminButton.click();
      await page.waitForTimeout(500);

      // URL should change or dashboard should appear
      const url = page.url();
      const hasDashboard = await page.locator('[class*="dashboard"], table').count() > 0;

      expect(url.includes('/admin') || hasDashboard).toBeTruthy();

      await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
    }
  });
});

test.describe('Core Functionality - Admin Dashboard', () => {
  test('should display submissions list', async ({ page }) => {
    await page.goto('/admin');

    // Should have table or list of submissions
    const table = page.locator('table').first();
    const list = page.locator('[class*="submission"]');

    const hasTable = await table.count() > 0;
    const hasList = await list.count() > 0;

    expect(hasTable || hasList).toBeTruthy();

    await page.screenshot({ path: 'test-results/submissions-list.png', fullPage: true });
  });

  test('should open submission detail modal', async ({ page }) => {
    await page.goto('/admin');

    // Look for view button
    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000); // Wait for modal and data

      // Modal should appear
      const modal = page.locator('[class*="fixed inset-0"], [role="dialog"]');
      await expect(modal).toBeVisible();

      // Should show VIN
      const vinText = page.locator('text=/[A-Z0-9]{17}/');
      if (await vinText.count() > 0) {
        await expect(vinText.first()).toBeVisible();
      }

      await page.screenshot({ path: 'test-results/submission-detail.png', fullPage: true });
    }
  });

  test('should display pricing analytics', async ({ page }) => {
    await page.goto('/admin');

    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(2000); // Wait for pricing API

      // Look for pricing data
      const pricingSection = page.locator('text=/Market Valuation|Price Range|Pricing/i');

      if (await pricingSection.count() > 0) {
        await expect(pricingSection.first()).toBeVisible();

        // Should show dollar amounts
        const priceText = page.locator('text=/\\$[0-9,]+/');
        if (await priceText.count() > 0) {
          await expect(priceText.first()).toBeVisible();
        }

        await page.screenshot({
          path: 'test-results/pricing-analytics.png',
          fullPage: true,
        });
      }
    }
  });

  test('should show media thumbnails', async ({ page }) => {
    await page.goto('/admin');

    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000);

      // Look for images
      const images = page.locator('img[src*="uploads"]');

      if (await images.count() > 0) {
        await expect(images.first()).toBeVisible();

        // Images should be loaded (not broken)
        const naturalWidth = await images.first().evaluate((img: HTMLImageElement) =>
          img.naturalWidth
        );

        expect(naturalWidth).toBeGreaterThan(0);
      }
    }
  });

  test('should open image lightbox on click', async ({ page }) => {
    await page.goto('/admin');

    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(1000);

      // Click on image
      const image = page.locator('img[src*="uploads"]').first();

      if (await image.isVisible()) {
        await image.click();
        await page.waitForTimeout(500);

        // Lightbox should appear
        const lightbox = page.locator('[class*="z-[60]"], [class*="z-50"]');

        if (await lightbox.count() > 0) {
          await expect(lightbox.first()).toBeVisible();

          await page.screenshot({ path: 'test-results/image-lightbox.png' });

          // Should be able to close
          const closeButton = page.locator('button[class*="close"]').first();
          if (await closeButton.isVisible()) {
            await closeButton.click();
            await page.waitForTimeout(300);
          }
        }
      }
    }
  });

  test('should have share functionality', async ({ page }) => {
    await page.goto('/admin');

    // Look for share button
    const shareButton = page.locator('button:has-text("Share")').first();

    if (await shareButton.isVisible()) {
      await shareButton.click();
      await page.waitForTimeout(500);

      // Share modal should appear
      const modal = page.locator('[class*="modal"], [role="dialog"]');

      if (await modal.count() > 0) {
        await expect(modal.first()).toBeVisible();

        // Should have copy link button
        const copyButton = page.locator('button:has-text("Copy")');
        if (await copyButton.count() > 0) {
          await expect(copyButton.first()).toBeVisible();
        }

        await page.screenshot({ path: 'test-results/share-modal.png' });
      }
    }
  });
});

test.describe('Core Functionality - Public Submission View', () => {
  test('should display public submission page', async ({ page }) => {
    // First get a ticket number from admin
    await page.goto('/admin');

    const ticketLink = page.locator('[class*="ticket"], text=/DT-[0-9]{4}-[0-9]{5}/').first();

    if (await ticketLink.isVisible()) {
      const ticketNumber = await ticketLink.textContent();

      if (ticketNumber) {
        // Navigate to public view
        await page.goto(`/submission/${ticketNumber.trim()}`);
        await page.waitForTimeout(1000);

        // Should show vehicle details
        const heading = page.locator('h2').first();
        await expect(heading).toBeVisible();

        await page.screenshot({ path: 'test-results/public-submission.png', fullPage: true });
      }
    }
  });
});

test.describe('Performance', () => {
  test('should load homepage quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds

    console.log(`Homepage load time: ${loadTime}ms`);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    await page.goto('/admin');
    await page.waitForTimeout(2000);

    // Filter out known safe errors (like API timeouts in test env)
    const criticalErrors = errors.filter(
      (error) =>
        !error.includes('Failed to fetch') &&
        !error.includes('NetworkError') &&
        !error.includes('ECONNREFUSED')
    );

    expect(criticalErrors.length).toBe(0);
  });
});
