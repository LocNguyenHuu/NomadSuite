# E2E Testing Guide

## Running Tests

### Install Playwright Browsers (First Time Only)
```bash
npx playwright install chromium
```

### Run All Tests
```bash
npx playwright test
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/waitlist.spec.ts
npx playwright test tests/e2e/bug-report.spec.ts
```

### View Test Report
```bash
npx playwright show-report
```

## Test Coverage

### Waitlist Form Tests
- ✅ Form element visibility
- ✅ Successful submission with all fields
- ✅ Successful submission with only required fields
- ✅ Email validation
- ✅ Required field validation
- ✅ Loading state during submission

### Bug Report Form Tests
- ✅ Form element visibility
- ✅ Successful submission without screenshot
- ✅ Successful submission with screenshot upload
- ✅ Required field validation
- ✅ Email validation
- ✅ Invalid file type rejection
- ✅ Loading state during submission
- ✅ Contact consent checkbox visibility

## Airtable Verification

To verify data reaches Airtable:
1. Run the tests
2. Check your Airtable base for new records
3. Records should include all submitted form data
4. Screenshots (if uploaded) should be stored as URLs in Airtable

## Environment Variables

The tests use the same environment variables as the application:
- `AIRTABLE_BASE_ID` - Your Airtable base ID
- `AIRTABLE_TOKEN` - Your Airtable API token

If these are not set, submissions will be stored in the database only (Airtable sync will be skipped gracefully).
