const fs = require('fs');
const puppeteer = require('puppeteer');
const { getChromePath } = require('./chrome-path');

(async () => {
  const url = process.argv[2];
  if (!url) {
    console.error('No URL provided');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: getChromePath(),
    userDataDir: './user-data', // persists session like login-helper
    headless: 'new'
  });

  const page = await browser.newPage();

  // Load cookies if available
  if (fs.existsSync('cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));
    await page.setCookie(...cookies);
    await page.waitForTimeout(1000); // allow cookies to settle
  } else {
    console.warn('⚠️ cookies.json not found. Are you logged in?');
  }

  await page.goto(url, { waitUntil: 'networkidle2' });

  const filename = `output/uber-trip-${new Date().toISOString().replace(/[:]/g, '-')}.pdf`;
  await page.pdf({ path: filename, format: 'A4' });

  console.log(`✅ Saved PDF: ${filename}`);
  await browser.close();
})();


