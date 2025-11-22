import { test, expect } from '@playwright/test';

test.describe('Airtable Integration - Waitlist', () => {
  test('should submit waitlist form and sync to Airtable', async ({ page }) => {
    await page.goto('/');
    
    // Scroll to waitlist section
    await page.getByTestId('button-join-waitlist').click();
    
    // Fill waitlist form
    await page.getByTestId('input-name').fill('Test User E2E');
    await page.getByTestId('input-email').fill(`test-e2e-${Date.now()}@example.com`);
    await page.getByTestId('select-role').click();
    await page.getByRole('option', { name: 'Digital Nomad' }).click();
    await page.getByTestId('input-country').fill('United States');
    await page.getByTestId('textarea-usecase').fill('Testing E2E integration with Airtable');
    await page.getByTestId('checkbox-email-consent').check();
    
    // Submit form
    await page.getByTestId('button-submit-waitlist').click();
    
    // Verify success message
    await expect(page.getByText(/successfully joined/i)).toBeVisible({ timeout: 5000 });
  });

  test('should handle waitlist submission with minimal fields', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-join-waitlist').click();
    
    // Fill only required fields
    await page.getByTestId('input-name').fill('Minimal User');
    await page.getByTestId('input-email').fill(`minimal-${Date.now()}@example.com`);
    await page.getByTestId('select-role').click();
    await page.getByRole('option', { name: 'Freelancer' }).click();
    
    await page.getByTestId('button-submit-waitlist').click();
    await expect(page.getByText(/successfully joined/i)).toBeVisible({ timeout: 5000 });
  });

  test('should submit waitlist with referral code', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-join-waitlist').click();
    
    await page.getByTestId('input-name').fill('Referral User');
    await page.getByTestId('input-email').fill(`referral-${Date.now()}@example.com`);
    await page.getByTestId('select-role').click();
    await page.getByRole('option', { name: 'Agency/Team' }).click();
    await page.getByTestId('input-country').fill('Canada');
    await page.getByTestId('input-referral-code').fill('FRIEND123');
    await page.getByTestId('checkbox-email-consent').check();
    
    await page.getByTestId('button-submit-waitlist').click();
    await expect(page.getByText(/successfully joined/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Airtable Integration - Bug Reports', () => {
  test('should submit bug report with full details', async ({ page }) => {
    await page.goto('/');
    
    // Find and click bug report button
    await page.getByTestId('button-report-bug').click();
    
    // Fill bug report form
    await page.getByTestId('input-bug-name').fill('E2E Tester');
    await page.getByTestId('input-bug-email').fill(`bug-e2e-${Date.now()}@example.com`);
    await page.getByTestId('textarea-bug-description').fill('E2E Test: Found a UI issue in the navigation menu. The dropdown doesn\'t close on mobile devices.');
    await page.getByTestId('checkbox-contact-consent').check();
    
    // Submit form
    await page.getByTestId('button-submit-bug').click();
    
    // Verify success
    await expect(page.getByText(/bug report submitted/i)).toBeVisible({ timeout: 5000 });
  });

  test('should submit anonymous bug report', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-report-bug').click();
    
    // Submit without name/email (anonymous)
    await page.getByTestId('textarea-bug-description').fill('Anonymous E2E Test: The footer links are not working on Safari browser.');
    
    await page.getByTestId('button-submit-bug').click();
    await expect(page.getByText(/bug report submitted/i)).toBeVisible({ timeout: 5000 });
  });

  test('should submit bug report without contact consent', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-report-bug').click();
    
    await page.getByTestId('input-bug-name').fill('Private Reporter');
    await page.getByTestId('textarea-bug-description').fill('E2E Test: Performance issue when loading large datasets.');
    // Don't check contact consent checkbox
    
    await page.getByTestId('button-submit-bug').click();
    await expect(page.getByText(/bug report submitted/i)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Airtable Integration - Validation', () => {
  test('should show validation errors for empty waitlist form', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-join-waitlist').click();
    
    // Try to submit without filling anything
    await page.getByTestId('button-submit-waitlist').click();
    
    // Check for validation errors
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });

  test('should show validation errors for invalid email in waitlist', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-join-waitlist').click();
    
    await page.getByTestId('input-name').fill('Test User');
    await page.getByTestId('input-email').fill('invalid-email');
    await page.getByTestId('select-role').click();
    await page.getByRole('option', { name: 'Digital Nomad' }).click();
    
    await page.getByTestId('button-submit-waitlist').click();
    await expect(page.getByText(/invalid.*email/i)).toBeVisible();
  });

  test('should show validation errors for empty bug description', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('button-report-bug').click();
    
    // Try to submit without description
    await page.getByTestId('button-submit-bug').click();
    
    await expect(page.getByText(/required/i).first()).toBeVisible();
  });
});
