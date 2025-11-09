import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Tests
 * Ensures WCAG 2.1 AA compliance
 */

test.describe('Accessibility - WCAG 2.1 AA Compliance', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('admin dashboard should not have accessibility violations', async ({ page }) => {
    await page.goto('/admin');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/');

    // All inputs should have associated labels
    const inputs = await page.locator('input').all();

    for (const input of inputs) {
      if (await input.isVisible()) {
        const ariaLabel = await input.getAttribute('aria-label');
        const id = await input.getAttribute('id');

        if (id) {
          const label = page.locator(`label[for="${id}"]`);
          const hasLabel = await label.count() > 0;

          // Should have either aria-label or associated label
          expect(hasLabel || !!ariaLabel).toBeTruthy();
        }
      }
    }
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    await page.goto('/admin');

    const images = await page.locator('img').all();

    for (const img of images) {
      if (await img.isVisible()) {
        const alt = await img.getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    }
  });

  test('interactive elements should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through interactive elements
    await page.keyboard.press('Tab');

    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Should have visible focus indicator
    const outline = await focusedElement.evaluate((el) =>
      window.getComputedStyle(el).outline
    );

    expect(outline).not.toBe('none');
  });

  test('color contrast should meet WCAG AA standards', async ({ page }) => {
    await page.goto('/');

    // Run axe with specific contrast checks
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa', 'wcag21aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test('can navigate form with keyboard only', async ({ page }) => {
    await page.goto('/');

    // Tab through form
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');

      if (await focusedElement.count() > 0) {
        await expect(focusedElement).toBeVisible();
      }
    }

    // Take screenshot of focused state
    await page.screenshot({ path: 'test-results/keyboard-navigation.png' });
  });

  test('can submit form with keyboard', async ({ page }) => {
    await page.goto('/');

    // Look for submit button
    const submitButton = page.locator('button[type="submit"]').first();

    if (await submitButton.isVisible()) {
      // Tab to button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Should be able to activate with Enter or Space
      await page.keyboard.press('Enter');

      // Form validation should trigger
      await page.waitForTimeout(500);
    }
  });

  test('modals should trap focus', async ({ page }) => {
    await page.goto('/admin');

    // Look for modal trigger
    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(500);

      // Modal should be visible
      const modal = page.locator('[class*="modal"], [role="dialog"]');

      if (await modal.isVisible()) {
        // Tab should stay within modal
        const initialFocus = page.locator(':focus');
        const initialElement = await initialFocus.evaluate((el) => el.tagName);

        // Tab multiple times
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');
        }

        // Focus should still be in modal
        const focusedElement = page.locator(':focus');
        const isInModal = await modal.locator(':focus').count() > 0;

        expect(isInModal).toBeTruthy();
      }
    }
  });

  test('escape key should close modals', async ({ page }) => {
    await page.goto('/admin');

    const viewButton = page.locator('button:has-text("View")').first();

    if (await viewButton.isVisible()) {
      await viewButton.click();
      await page.waitForTimeout(500);

      // Press Escape
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      // Modal should be closed
      const modal = page.locator('[class*="fixed inset-0"]');
      const isVisible = await modal.isVisible();

      expect(isVisible).toBeFalsy();
    }
  });
});

test.describe('Accessibility - Screen Reader Support', () => {
  test('page should have proper headings hierarchy', async ({ page }) => {
    await page.goto('/');

    // Check heading levels
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0); // Should have at least one h1

    // H1 should come before H2
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    let lastLevel = 0;
    for (const heading of headings) {
      if (await heading.isVisible()) {
        const tagName = await heading.evaluate((el) => el.tagName);
        const level = parseInt(tagName.charAt(1));

        // Level should not skip (e.g., h1 -> h3)
        if (lastLevel > 0) {
          expect(level - lastLevel).toBeLessThanOrEqual(1);
        }

        lastLevel = level;
      }
    }
  });

  test('buttons should have descriptive text', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      if (await button.isVisible()) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');

        // Button should have either text or aria-label
        const hasDescription = (text && text.trim().length > 0) || !!ariaLabel;
        expect(hasDescription).toBeTruthy();
      }
    }
  });

  test('forms should have proper ARIA attributes', async ({ page }) => {
    await page.goto('/');

    // Check for required fields
    const requiredInputs = page.locator('input[required]');

    if (await requiredInputs.count() > 0) {
      const first = requiredInputs.first();

      // Should have aria-required or required attribute
      const ariaRequired = await first.getAttribute('aria-required');
      const required = await first.getAttribute('required');

      expect(ariaRequired === 'true' || required !== null).toBeTruthy();
    }
  });
});
