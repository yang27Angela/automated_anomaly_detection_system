import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://recognized-psi-dean-es.trycloudflare.com/';
const TIMEOUT = 60000;

(async() => {
    const browser = await chromium.launch({
        headless: false,
        args: ['--no-sandbox'],
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        locale: 'en-US',
    });

    const page = await context.newPage();

    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.waitFor({ timeout: 10000 });

    // ✅ Scenario 1: Successful Upload
    const successFile = path.resolve(__dirname, 'test_files/success_file.mp4');
    console.log('📤 Uploading success_file.mp4');
    await uploadInput.setInputFiles(successFile);

    console.log('🕒 Waiting for "Upload Successful" message...');
    await page.waitForSelector('text="Upload Successful"', { timeout: 10000 });
    console.log('✅ Upload Successful verified');

    console.log('🕒 Waiting 5 seconds before next test...');
    await page.waitForTimeout(7000);

    // ✅ Scenario 2: File Size Exceeds Limit
    const largeFile = path.resolve(__dirname, 'test_files/large_file.mov');
    console.log('📤 Uploading large_file.mov');
    await uploadInput.setInputFiles(largeFile);

    console.log('🕒 Waiting for "File Size Exceeds Limit" message...');
    await page.waitForSelector('text="File Size Exceeds Limit (Max 10MB)"', { timeout: 10000 });
    console.log('✅ File Size Exceeds Limit verified');
    await page.waitForTimeout(3000);
    await browser.close();
})();