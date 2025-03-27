// login-helper.js
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const COOKIE_PATH = path.resolve(__dirname, 'cookies.json');

module.exports = async function loginHelper(force = false) {
  let cookiesValid = false;

  if (!force && fs.existsSync(COOKIE_PATH)) {
    try {
      const cookies = JSON.parse(fs.readFileSync(COOKIE_PATH, 'utf8'));

      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.setCookie(...cookies);

      await page.goto('https://drivers.uber.com/', { waitUntil: 'networkidle2' });

      // Try to detect login state
      const loggedIn = await page.evaluate(() => {
        return document.body.innerText.includes('Earnings') || document.querySelector('[href*="logout"]');
      });

      if (loggedIn) {
        cookiesValid = true;
        console.log('✅ Existing session is still valid.');
      } else {
        console.warn('⚠️ Cookies found but session is no longer valid.');
      }
      await browser.close();
    } catch (err) {
      console.error('Error loading cookies:', err);
    }
  }

  if (!cookiesValid) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://drivers.uber.com/', { waitUntil: 'networkidle2' });
    console.log('🔑 Please log in manually.');

    // Wait for login to finish
    await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 });

    const cookies = await page.cookies();
    fs.writeFileSync(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Session saved to cookies.json');

    await browser.close();
  }
};
