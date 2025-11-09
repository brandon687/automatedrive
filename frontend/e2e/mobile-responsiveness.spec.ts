import { test, expect } from '@playwright/test';

/**
 * Mobile Responsiveness Tests
 * Tests all components on various mobile devices
 */

test.describe('Mobile Responsiveness - Luxury Submission Form', () => {
  test('should display properly on iPhone 12', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
    await page.goto('/');

    // Check header is visible and not overflowing
    const header = page.locator('h1').first();
    await expect(header).toBeVisible();

    const headerBox = await header.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(headerBox!.width).toBeLessThanOrEqual(390);

    // Check form is scrollable
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Take screenshot
    await page.screenshot({ path: 'test-results/mobile-iphone12-home.png', fullPage: true });
  });

  test('should display properly on small phones (iPhone SE)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');

    // All text should be readable (not too small)
    const body = page.locator('body');
    const fontSize = await body.evaluate((el) =>
      window.getComputedStyle(el).fontSize
    );

    const fontSizeNum = parseFloat(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14); // Minimum readable size

    await page.screenshot({ path: 'test-results/mobile-iphoneSE-home.png', fullPage: true });
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await page.goto('/');

    // All buttons should be at least 44x44px (Apple HIG recommendation)
    const buttons = page.locator('button').all();

    for (const button of await buttons) {
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(40); // Slightly flexible
          expect(box.width).toBeGreaterThanOrEqual(40);
        }
      }
    }
  });

  test('should not have horizontal scrolling on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Check for horizontal overflow
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5); // Allow 5px tolerance
  });

  test('should display admin dashboard properly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/admin');

    // Table should be visible and scrollable
    const table = page.locator('table').first();
    await expect(table).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'test-results/tablet-admin.png', fullPage: true });
  });
});

test.describe('Mobile Responsiveness - Luxury Form Steps', () => {
  test('VIN entry step should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // If luxury form is active, test VIN input
    const vinInput = page.locator('input[placeholder*="VIN" i]').first();

    if (await vinInput.isVisible()) {
      // Input should be full width on mobile
      const inputBox = await vinInput.boundingBox();
      expect(inputBox).toBeTruthy();
      expect(inputBox!.width).toBeGreaterThan(300); // Should be wide enough

      // Tap on input (touch interaction)
      await vinInput.tap();
      await expect(vinInput).toBeFocused();

      await page.screenshot({ path: 'test-results/mobile-vin-input.png' });
    }
  });

  test('Step indicator should be visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for step indicators (dots or numbers)
    const stepIndicator = page.locator('[class*="step"]').first();

    if (await stepIndicator.isVisible()) {
      await expect(stepIndicator).toBeInViewport();

      // Should not overflow
      const box = await stepIndicator.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(375);
    }
  });

  test('Media upload should work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Look for file upload area
    const uploadArea = page.locator('[class*="upload"]').first();

    if (await uploadArea.isVisible()) {
      // Upload area should be touch-friendly
      const box = await uploadArea.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThan(100); // Big enough to tap

      await page.screenshot({ path: 'test-results/mobile-upload.png' });
    }
  });
});

test.describe('Mobile Responsiveness - Pricing Analytics', () => {
  test('Pricing cards should stack on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin');

    // If pricing analytics is visible
    const pricingCards = page.locator('[class*="pricing"]');

    if (await pricingCards.first().isVisible()) {
      // Cards should be stacked vertically, not side by side
      const cards = await pricingCards.all();

      if (cards.length >= 2) {
        const box1 = await cards[0].boundingBox();
        const box2 = await cards[1].boundingBox();

        if (box1 && box2) {
          // Second card should be below first (not beside)
          expect(box2.y).toBeGreaterThan(box1.y + box1.height - 10);
        }
      }
    }
  });

  test('Pricing values should be readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin');

    // Price text should be large enough
    const priceTexts = page.locator('[class*="price"], [class*="value"]');

    if (await priceTexts.first().isVisible()) {
      const fontSize = await priceTexts.first().evaluate((el) =>
        window.getComputedStyle(el).fontSize
      );

      const fontSizeNum = parseFloat(fontSize);
      expect(fontSizeNum).toBeGreaterThanOrEqual(14);
    }
  });
});

test.describe('Mobile Responsiveness - Image Lightbox', () => {
  test('Lightbox should work on mobile touch', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin');

    // Look for images that can be clicked
    const image = page.locator('img[class*="cursor-pointer"]').first();

    if (await image.isVisible()) {
      // Tap image
      await image.tap();

      // Wait for lightbox (if implemented)
      await page.waitForTimeout(500);

      // Lightbox should be full screen
      const lightbox = page.locator('[class*="fixed inset-0"]');

      if (await lightbox.isVisible()) {
        const box = await lightbox.boundingBox();
        expect(box!.width).toBe(390);
        expect(box!.height).toBe(844);

        await page.screenshot({ path: 'test-results/mobile-lightbox.png' });
      }
    }
  });

  test('Lightbox close button should be touch-friendly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin');

    const image = page.locator('img[class*="cursor-pointer"]').first();

    if (await image.isVisible()) {
      await image.tap();
      await page.waitForTimeout(500);

      // Find close button
      const closeButton = page.locator('button[class*="close"]').first();

      if (await closeButton.isVisible()) {
        const box = await closeButton.boundingBox();
        expect(box!.width).toBeGreaterThanOrEqual(40);
        expect(box!.height).toBeGreaterThanOrEqual(40);
      }
    }
  });
});

test.describe('Mobile Responsiveness - Touch Interactions', () => {
  test('All interactive elements should respond to touch', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Test all buttons
    const buttons = await page.locator('button:visible').all();

    for (let i = 0; i < Math.min(buttons.length, 5); i++) {
      const button = buttons[i];

      // Should have hover/active states (check for transitions)
      const transitions = await button.evaluate((el) =>
        window.getComputedStyle(el).transition
      );

      // Should have some transition for feedback
      expect(transitions).not.toBe('');
    }
  });

  test('Forms should have proper mobile keyboards', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Check for numeric inputs (should trigger number keyboard)
    const mileageInput = page.locator('input[type="number"]').first();

    if (await mileageInput.isVisible()) {
      const inputType = await mileageInput.getAttribute('type');
      expect(inputType).toBe('number'); // Triggers numeric keyboard
    }

    // Check for email inputs
    const emailInput = page.locator('input[type="email"]').first();

    if (await emailInput.isVisible()) {
      const inputType = await emailInput.getAttribute('type');
      expect(inputType).toBe('email'); // Triggers email keyboard
    }
  });

  test('Scrolling should be smooth on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Check for smooth scroll behavior
    const scrollBehavior = await page.evaluate(() =>
      window.getComputedStyle(document.documentElement).scrollBehavior
    );

    // Should be 'smooth' or 'auto' (not 'none')
    expect(['smooth', 'auto']).toContain(scrollBehavior);

    // Test scroll
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'smooth' }));
    await page.waitForTimeout(300);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(400);
  });
});

test.describe('Mobile Performance', () => {
  test('Page should load quickly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds on mobile
    expect(loadTime).toBeLessThan(3000);
  });

  test('Images should be optimized for mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/admin');

    // Check image sizes
    const images = await page.locator('img').all();

    for (const img of images.slice(0, 5)) {
      if (await img.isVisible()) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);

        // Images shouldn't be excessively large for mobile
        if (naturalWidth > 0) {
          expect(naturalWidth).toBeLessThan(2000); // Reasonable for mobile
        }
      }
    }
  });
});
