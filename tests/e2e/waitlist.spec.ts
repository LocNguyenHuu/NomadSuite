import { test, expect } from '@playwright/test';

test.describe('Waitlist Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display waitlist form on landing page', async ({ page }) => {
    // Verify form elements are visible
    await expect(page.locator('[data-testid="input-waitlist-name"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="input-waitlist-email"]')).toBeVisible();
    await expect(page.locator('[data-testid="select-waitlist-role"]')).toBeVisible();
    await expect(page.locator('[data-testid="button-waitlist-submit"]')).toBeVisible();
  });

  test('should successfully submit waitlist form with all fields', async ({ page }) => {
    // Fill in required fields
    await page.locator('[data-testid="input-waitlist-name"]').fill('John Doe');
    await page.locator('[data-testid="input-waitlist-email"]').fill(`test-${Date.now()}@example.com`);
    
    // Select role
    await page.locator('[data-testid="select-waitlist-role"]').click();
    await page.locator('text=Digital Nomad').click();
    
    // Fill in optional fields
    await page.locator('[data-testid="input-waitlist-country"]').fill('United States');
    await page.locator('[data-testid="textarea-waitlist-usecase"]').fill('Managing my freelance business while traveling');
    await page.locator('[data-testid="input-waitlist-referral"]').fill('FRIEND2024');
    
    // Submit form
    await page.locator('[data-testid="button-waitlist-submit"]').click();
    
    // Verify success message appears
    await expect(page.locator('text=/thanks for joining/i')).toBeVisible({ timeout: 10000 });
  });

  test('should successfully submit waitlist form with only required fields', async ({ page }) => {
    
    await page.locator('[data-testid="input-waitlist-name"]').fill('Jane Smith');
    await page.locator('[data-testid="input-waitlist-email"]').fill(`minimal-${Date.now()}@example.com`);
    
    await page.locator('[data-testid="select-waitlist-role"]').click();
    await page.locator('text=Freelancer').click();
    
    await page.locator('[data-testid="button-waitlist-submit"]').click();
    
    await expect(page.locator('text=/thanks for joining/i')).toBeVisible({ timeout: 10000 });
  });

  test('should show validation error for invalid email', async ({ page }) => {
    
    await page.locator('[data-testid="input-waitlist-name"]').fill('Test User');
    await page.locator('[data-testid="input-waitlist-email"]').fill('invalid-email');
    
    await page.locator('[data-testid="select-waitlist-role"]').click();
    await page.locator('text=Digital Nomad').click();
    
    await page.locator('[data-testid="button-waitlist-submit"]').click();
    
    // Should show validation error
    await expect(page.locator('text=/invalid email/i')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error when required fields are missing', async ({ page }) => {
    
    // Try to submit without filling required fields
    await page.locator('[data-testid="button-waitlist-submit"]').click();
    
    // Should show validation errors
    await expect(page.locator('text=/name.*required/i').or(page.locator('text=/required/i'))).toBeVisible({ timeout: 5000 });
  });

  test('should disable submit button while submitting', async ({ page }) => {
    
    await page.locator('[data-testid="input-waitlist-name"]').fill('Loading Test');
    await page.locator('[data-testid="input-waitlist-email"]').fill(`loading-${Date.now()}@example.com`);
    
    await page.locator('[data-testid="select-waitlist-role"]').click();
    await page.locator('text=Digital Nomad').click();
    
    const submitButton = page.locator('[data-testid="button-waitlist-submit"]');
    await submitButton.click();
    
    // Button should be disabled during submission
    await expect(submitButton).toBeDisabled();
  });
});
