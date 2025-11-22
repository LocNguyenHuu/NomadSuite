import { test, expect } from '@playwright/test';

/**
 * Optional Airtable Verification Tests
 * 
 * These tests verify that submitted data reaches Airtable.
 * They require AIRTABLE_BASE_ID and AIRTABLE_TOKEN to be set.
 * 
 * To run: npx playwright test tests/e2e/airtable-verification.spec.ts
 */

test.describe('Airtable Integration Verification', () => {
  const hasAirtableConfig = process.env.AIRTABLE_BASE_ID && process.env.AIRTABLE_TOKEN;

  test.skip(!hasAirtableConfig, 'Skipping Airtable tests - credentials not configured');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should sync waitlist submission to Airtable', async ({ page, request }) => {
    const uniqueEmail = `airtable-test-${Date.now()}@example.com`;
    
    // Submit waitlist form
    await page.locator('[data-testid="waitlist-section"]').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="input-waitlist-name"]').fill('Airtable Test User');
    await page.locator('[data-testid="input-waitlist-email"]').fill(uniqueEmail);
    
    await page.locator('[data-testid="select-waitlist-role"]').click();
    await page.locator('text=Digital Nomad').click();
    
    await page.locator('[data-testid="input-waitlist-country"]').fill('Test Country');
    await page.locator('[data-testid="button-waitlist-submit"]').click();
    
    await expect(page.locator('text=/thanks for joining/i')).toBeVisible({ timeout: 10000 });
    
    // Wait a bit for Airtable sync
    await page.waitForTimeout(3000);
    
    // Verify in Airtable using API
    const airtableResponse = await request.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Waitlist?filterByFormula={Email}="${uniqueEmail}"`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    );
    
    expect(airtableResponse.ok()).toBeTruthy();
    const airtableData = await airtableResponse.json();
    
    expect(airtableData.records).toHaveLength(1);
    expect(airtableData.records[0].fields.Email).toBe(uniqueEmail);
    expect(airtableData.records[0].fields.Name).toBe('Airtable Test User');
    expect(airtableData.records[0].fields.Role).toBe('Digital Nomad');
    expect(airtableData.records[0].fields.Country).toBe('Test Country');
  });

  test('should sync bug report to Airtable', async ({ page, request }) => {
    const uniqueEmail = `airtable-bug-${Date.now()}@example.com`;
    const bugTitle = `Test Bug Report ${Date.now()}`;
    
    // Submit bug report form
    await page.locator('[data-testid="bug-report-section"]').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="input-bug-title"]').fill(bugTitle);
    await page.locator('[data-testid="textarea-bug-description"]').fill('This is a test bug report for Airtable verification');
    
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=Authentication').click();
    
    await page.locator('[data-testid="input-bug-email"]').fill(uniqueEmail);
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    await expect(page.locator('text=/thanks.*bug report/i')).toBeVisible({ timeout: 10000 });
    
    // Wait for Airtable sync
    await page.waitForTimeout(3000);
    
    // Verify in Airtable using API
    const airtableResponse = await request.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/BugReports?filterByFormula={Email}="${uniqueEmail}"`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    );
    
    expect(airtableResponse.ok()).toBeTruthy();
    const airtableData = await airtableResponse.json();
    
    expect(airtableData.records).toHaveLength(1);
    expect(airtableData.records[0].fields.Title).toBe(bugTitle);
    expect(airtableData.records[0].fields.Email).toBe(uniqueEmail);
    expect(airtableData.records[0].fields.AffectedModule).toBe('Authentication');
  });

  test('should include screenshot URL in Airtable when uploaded', async ({ page, request }) => {
    const uniqueEmail = `bug-with-screenshot-${Date.now()}@example.com`;
    
    // Create test image
    const fs = await import('fs');
    const path = await import('path');
    const testImagePath = path.join(__dirname, '../fixtures/airtable-test.png');
    const testImageDir = path.dirname(testImagePath);
    
    if (!fs.existsSync(testImageDir)) {
      fs.mkdirSync(testImageDir, { recursive: true });
    }
    
    const pngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
      'base64'
    );
    fs.writeFileSync(testImagePath, pngBuffer);
    
    // Submit form with screenshot
    await page.locator('[data-testid="bug-report-section"]').scrollIntoViewIfNeeded();
    await page.locator('[data-testid="input-bug-title"]').fill('Bug with Screenshot');
    await page.locator('[data-testid="textarea-bug-description"]').fill('Testing screenshot upload to Airtable');
    
    await page.locator('[data-testid="select-bug-module"]').click();
    await page.locator('text=UI/UX').click();
    
    await page.locator('[data-testid="input-bug-email"]').fill(uniqueEmail);
    
    const fileInput = page.locator('[data-testid="input-bug-screenshot"]');
    await fileInput.setInputFiles(testImagePath);
    
    await page.locator('[data-testid="button-bug-submit"]').click();
    
    await expect(page.locator('text=/thanks.*bug report/i')).toBeVisible({ timeout: 15000 });
    
    // Wait for upload and sync
    await page.waitForTimeout(5000);
    
    // Verify screenshot URL in Airtable
    const airtableResponse = await request.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/BugReports?filterByFormula={Email}="${uniqueEmail}"`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    );
    
    expect(airtableResponse.ok()).toBeTruthy();
    const airtableData = await airtableResponse.json();
    
    expect(airtableData.records).toHaveLength(1);
    expect(airtableData.records[0].fields.ScreenshotURL).toBeTruthy();
    expect(airtableData.records[0].fields.ScreenshotURL).toContain('storage.googleapis.com');
    
    // Cleanup
    fs.unlinkSync(testImagePath);
  });
});
