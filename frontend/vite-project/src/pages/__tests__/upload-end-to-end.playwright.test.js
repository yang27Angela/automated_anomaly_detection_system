import { test, expect } from '@playwright/test';

// Scenario: Successful Upload
test('Successful Upload', async({ page }) => {
    await page.goto('${API_BASE_URL}/api/alerts/upload');
    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.uploadFile('./test_files/success_file.mp4');
    await expect(page.locator('text="Upload Successful"')).toBeVisible();
});

// Scenario: File Size Exceeds Limit
test('File Size Exceeds Limit', async({ page }) => {
    await page.goto('${API_BASE_URL}/api/alerts/upload');
    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.uploadFile('./test_files/large_file.mov');
    await expect(page.locator('text="File Size Exceeds Limit"')).toBeVisible();
});