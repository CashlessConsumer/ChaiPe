/**
 * End-to-End Tests with Playwright
 * Tests complete user journeys in real browser environments
 */

import { test, expect } from '@playwright/test';

test.describe('ChaiPe E2E Payment Journey', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to demo page
    await page.goto('/demo/index-new.html');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load demo page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/ChaiPe/);
  });

  test('should display payment modal on button click', async ({ page }) => {
    // Click the "Show Payment Modal" button
    await page.click('button:has-text("Show Payment Modal")');
    
    // Wait for modal to appear
    await page.waitForSelector('.ChaiPe-modal', { state: 'visible' });
    
    // Verify modal is visible
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });

  test('should display all preset amount buttons', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Check for amount buttons
    const amountButtons = page.locator('.ChaiPe-amount');
    await expect(amountButtons).toHaveCount(4);
    
    // Verify amounts
    await expect(page.locator('.ChaiPe-amount').first()).toContainText('₹10');
    await expect(page.locator('.ChaiPe-amount').nth(1)).toContainText('₹25');
    await expect(page.locator('.ChaiPe-amount').nth(2)).toContainText('₹50');
    await expect(page.locator('.ChaiPe-amount').nth(3)).toContainText('₹100');
  });

  test('should select amount when clicking preset button', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Click on ₹50 button
    await page.click('.ChaiPe-amount:nth-child(3)');
    
    // Verify it's selected
    const selectedButton = page.locator('.ChaiPe-amount.selected');
    await expect(selectedButton).toContainText('₹50');
  });

  test('should accept custom amount input', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Enter custom amount
    await page.fill('#ChaiPe-custom', '75');
    
    // Verify no preset is selected
    const selectedButtons = page.locator('.ChaiPe-amount.selected');
    await expect(selectedButtons).toHaveCount(0);
  });

  test('should close modal when clicking overlay', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Click on overlay
    await page.click('.ChaiPe-overlay');
    
    // Wait for modal to disappear
    await page.waitForSelector('.ChaiPe-modal', { state: 'hidden', timeout: 500 });
    
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).not.toBeVisible();
  });

  test('should close modal when clicking close button', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Click close button
    await page.click('.ChaiPe-close');
    
    // Wait for modal to disappear
    await page.waitForSelector('.ChaiPe-modal', { state: 'hidden', timeout: 500 });
    
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).not.toBeVisible();
  });

  test('should show QR code on desktop', async ({ page, isMobile }) => {
    if (isMobile) {
      test.skip();
      return;
    }
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Select amount
    await page.click('.ChaiPe-amount:nth-child(2)');
    
    // Click pay button
    await page.click('#ChaiPe-pay');
    
    // Wait for QR code to appear
    await page.waitForSelector('.ChaiPe-qr-container img', { state: 'visible' });
    
    // Verify QR code is visible
    const qrImage = page.locator('.ChaiPe-qr-container img');
    await expect(qrImage).toBeVisible();
    
    // Verify it's a data URL
    const src = await qrImage.getAttribute('src');
    expect(src).toMatch(/^data:image\/svg\+xml;base64,/);
  });

  test('should display correct payment message', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Verify message
    const message = page.locator('.ChaiPe-title');
    await expect(message).toContainText('Enjoying the content?');
  });

  test('should display creator name', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Verify creator name
    const subtitle = page.locator('.ChaiPe-subtitle');
    await expect(subtitle).toContainText('ChaiPe');
  });

  test('should show success message after payment confirmation', async ({ page }) => {
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Select amount
    await page.click('.ChaiPe-amount:nth-child(2)');
    
    // Click pay button
    await page.click('#ChaiPe-pay');
    
    // Wait for confirmation (desktop) or mobile confirmation
    await page.waitForTimeout(500);
    
    // Click confirm payment button
    const confirmButton = page.locator('.ChaiPe-btn-confirm').first();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
    
    // Wait for success message
    await page.waitForSelector('.ChaiPe-success', { state: 'visible', timeout: 5000 });
    
    // Verify success message
    const successTitle = page.locator('.ChaiPe-title');
    await expect(successTitle).toContainText('Thank You!');
  });
});

test.describe('ChaiPe Theme Tests', () => {
  test('should render minimal theme correctly', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Select minimal theme
    await page.selectOption('#theme-select', 'minimal');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal.theme-minimal');
    const modal = page.locator('.ChaiPe-modal.theme-minimal');
    await expect(modal).toBeVisible();
  });

  test('should render toast theme correctly', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Select toast theme
    await page.selectOption('#theme-select', 'toast');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal.theme-toast');
    const modal = page.locator('.ChaiPe-modal.theme-toast');
    await expect(modal).toBeVisible();
  });

  test('should render floating theme correctly', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Select floating theme
    await page.selectOption('#theme-select', 'floating');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal.theme-floating');
    const modal = page.locator('.ChaiPe-modal.theme-floating');
    await expect(modal).toBeVisible();
  });
});

test.describe('ChaiPe Data Collection Tests', () => {
  test('should show data collection fields when enabled', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Enable data collection
    await page.check('#collect-name');
    await page.check('#collect-email');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    
    // Verify data collection fields are present
    await expect(page.locator('#ChaiPe-name')).toBeVisible();
    await expect(page.locator('#ChaiPe-email')).toBeVisible();
  });

  test('should collect user data in form', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Enable data collection
    await page.check('#collect-name');
    await page.check('#collect-email');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    
    // Fill in form
    await page.fill('#ChaiPe-name', 'Test User');
    await page.fill('#ChaiPe-email', 'test@example.com');
    
    // Verify values
    await expect(page.locator('#ChaiPe-name')).toHaveValue('Test User');
    await expect(page.locator('#ChaiPe-email')).toHaveValue('test@example.com');
  });
});

test.describe('ChaiPe Responsive Tests', () => {
  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Verify modal fits on mobile
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
    
    const boundingBox = await modal.boundingBox();
    expect(boundingBox.width).toBeLessThanOrEqual(375);
  });

  test('should work on tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });
});

test.describe('ChaiPe Accessibility Tests', () => {
  test('should have proper button labels', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal');
    
    // Check close button
    const closeButton = page.locator('.ChaiPe-close');
    await expect(closeButton).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Enable data collection
    await page.check('#collect-name');
    await page.check('#collect-email');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    
    // Check form labels
    const nameLabel = page.locator('label:has-text("Your Name")');
    const emailLabel = page.locator('label:has-text("Email")');
    
    await expect(nameLabel).toBeVisible();
    await expect(emailLabel).toBeVisible();
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    // Navigate with Tab key
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    await page.waitForSelector('.ChaiPe-modal');
    
    // Navigate through modal with Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verify focus moves
    const focusedElement = await page.evaluate(() => document.activeElement.tagName);
    expect(['BUTTON', 'INPUT'].includes(focusedElement)).toBe(true);
  });
});

test.describe('ChaiPe Performance Tests', () => {
  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  });

  test('should show modal quickly after button click', async ({ page }) => {
    await page.goto('/demo/index-new.html');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    
    await page.click('button:has-text("Show Payment Modal")');
    await page.waitForSelector('.ChaiPe-modal', { state: 'visible' });
    
    const showTime = Date.now() - startTime;
    expect(showTime).toBeLessThan(500); // Should show in under 500ms
  });
});

test.describe('ChaiPe Cross-Browser Tests', () => {
  test('should work in Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium');
    
    await page.goto('/demo/index-new.html');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });

  test('should work in Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox');
    
    await page.goto('/demo/index-new.html');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });

  test('should work in Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit');
    
    await page.goto('/demo/index-new.html');
    await page.click('button:has-text("Show Payment Modal")');
    
    await page.waitForSelector('.ChaiPe-modal');
    const modal = page.locator('.ChaiPe-modal');
    await expect(modal).toBeVisible();
  });
});
