import { chromium } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://recognized-psi-dean-es.trycloudflare.com/';
const TIMEOUT = 60000;

async function runTest(filePath, expectedText, description) {
    console.log(`📤 Uploading ${path.basename(filePath)} for ${description}`);
    const uploadInput = page.locator('input[type="file"]');
    await uploadInput.setInputFiles(filePath);

    try {
        console.log(`🕒 Waiting for "${expectedText}"...`);
        await page.waitForSelector(`text="${expectedText}"`, { timeout: 10000 });
        console.log(`✅ ${description} verified`);
    } catch (error) {
        console.error(`❌ ${description} FAILED`);
        const screenshotPath = `test-results/${description.replace(/\s+/g, '_').toLowerCase()}_error.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.error(`🖼 Screenshot saved: ${screenshotPath}`);
        process.exit(1);
    }
}

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

// 伪装 webdriver
await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
});

// 确保 test-results 目录存在
fs.mkdirSync('test-results', { recursive: true });

console.log(`🌐 Navigating to ${BASE_URL}`);
await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: TIMEOUT });

const uploadInput = page.locator('input[type="file"]');
await uploadInput.waitFor({ timeout: 10000 });

// ✅ Scenario 1: Successful Upload
const successFile = path.resolve(__dirname, 'test_files/success_file.mp4');
await runTest(successFile, 'Upload Successful', 'Successful Upload');

console.log('🕒 Waiting 5 seconds before next test...');
await page.waitForTimeout(5000);

// ✅ Scenario 2: File Size Exceeds Limit
const largeFile = path.resolve(__dirname, 'test_files/large_file.mov');
await runTest(largeFile, 'File Size Exceeds Limit (Max 10MB)', 'File Size Exceeds Limit');

console.log('✅ All tests passed');
await page.waitForTimeout(3000);
await browser.close();