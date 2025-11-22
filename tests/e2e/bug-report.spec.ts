import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

test.describe('Bug Report Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for and click the "Found a bug?" button to open the dialog
    await page.locator('[data-testid="button-bug-report-open"]').click();
    // Wait for dialog to be visible
    await page.waitForTimeout(500);
  });

  test('should display bug report form in dialog', async ({ page }) => {
    // Verify form elements are visible in the dialog
    await expect(page.locator('[data-testid="input-bug-name"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="input-bug-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-bug-module"]')).toBeVisible();
    await expect(page.locator('[data-testid="textarea-bug-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-bug-submit"]')).toBeVisible();
  });

  test('should successfully submit bug report without screenshot', async ({ page }) => {
    // Fill in required fields
    await page.locator('[data-testid="textarea-bug-description"]').fill('When I click the login button, nothing happens. Expected: Should navigate to login page.');
    
    // Select affected module
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=Authentication').click();
    
    // Submit form
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    // Verify success message
    await expect(page.locator('text=/thanks.*bug report/i')).toBeVisible({ timeout: 10000 });
  });

  test('should successfully submit bug report with screenshot', async ({ page }) => {
    // Create a test image file
    const testImagePath = path.join(__dirname, '../fixtures/test-screenshot.png');
    const testImageDir = path.dirname(testImagePath);
    
    // Ensure fixtures directory exists
    if (!fs.existsSync(testImageDir)) {
      fs.mkdirSync(testImageDir, { recursive: true });
    }
    
    // Create a simple PNG image (1x1 red pixel)
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(testImagePath, pngBuffer);
    
    // Fill in required fields
    await page.locator('[data-testid="textarea-bug-description"]').fill('The navigation menu is misaligned on mobile screens. See screenshot for details.');
    
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=UI/UX').click();
    
    // Upload screenshot
    const fileInput = page.locator('[data-testid="input-bug-screenshot"]');
    await fileInput.setInputFiles(testImagePath);
    
    // Submit form
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    // Verify success message
    await expect(page.locator('text=/thanks.*bug report/i')).toBeVisible({ timeout: 15000 });
    
    // Cleanup test file
    fs.unlinkSync(testImagePath);
  });

  test('should show validation error for missing required field (description)', async ({ page }) => {
    // Select module but don't fill description
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=Authentication').click();
    
    // Try to submit without description
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    // Form should show browser validation (HTML5 required attribute)
    // The form won't submit, so dialog should still be open
    await expect(page.locator('[data-testid="textarea-bug-description"]')).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.locator('[data-testid="textarea-bug-description"]').fill('Bug description here');
    
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=Authentication').click();
    
    await page.locator('[data-testid="input-bug-email"]').fill('invalid-email');
    
    // Try to submit
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    // Browser validation should prevent submission (HTML5 email validation)
    // Dialog should still be open
    await expect(page.locator('[data-testid="input-bug-email"]')).toBeVisible();
  });

  test('should disable submit button while submitting', async ({ page }) => {
    await page.locator('[data-testid="textarea-bug-description"]').fill('Testing loading state');
    
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=Authentication').click();
    
    const submitButton = page.locator('[data-testid="button-bug-submit"]');
    await submitButton.click();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });

  test('should show contact consent checkbox', async ({ page }) => {
    // Verify consent checkbox is visible
    await expect(page.locator('[data-testid="checkbox-bug-consent"]')).toBeVisible();
  });
});
