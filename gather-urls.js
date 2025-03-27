const puppeteer = require('puppeteer-core');
const fs = require('fs');
const chromePath = require('./chrome-path');
const cookiesPath = 'cookies.json';

(async () => {
  const month = parseInt(process.argv[2], 10);
  const year = parseInt(process.argv[3], 10);

  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized'],
  });

  const page = await browser.newPage();

  // Load cookies
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded');
  }

  await page.goto('https://drivers.uber.com/earnings/activities', { waitUntil: 'networkidle2' });

  // Wait for and click the calendar button
  await page.waitForSelector('[aria-label="Search by week"]');
  await page.click('[aria-label="Search by week"]');

  // Wait for the calendar to appear
  await page.waitForSelector('[aria-roledescription="calendar month"]');

  // Let’s grab all Monday buttons dynamically
  const mondays = await page.$$('[aria-label*="Monday"]');

  console.log(`📅 Found ${mondays.length} Mondays.`);

  for (const monday of mondays) {
    try {
      await monday.click();
      console.log('👉 Clicked a Monday');
      await page.waitForTimeout(3000); // let content load
    } catch (e) {
      console.error('❌ Failed to click Monday:', e);
    }
  }

  await browser.close();
})();

