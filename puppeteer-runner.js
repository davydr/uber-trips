const fs = require("fs");
const path = require("path");
const { getBrowser } = require("./login-helper");

const delay = ms => new Promise(res => setTimeout(res, ms));

async function saveTrips(urls) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  for (const url of urls) {
    if (!url.includes("/trip")) continue; // filter bad urls

    try {
      await page.goto(url, { waitUntil: "networkidle2" });

      const id = url.split("/").pop();
      const filename = path.join(__dirname, "output", `${id}.pdf`);

      await page.pdf({ path: filename, format: "A4" });
      console.log(`✅ Saved PDF for: ${url}`);

      // random delay 2–4 seconds
      const wait = 2000 + Math.random() * 2000;
      await delay(wait);
    } catch (err) {
      console.error(`❌ Error on ${url}:`, err.message);
    }
  }

  await browser.close();
}

module.exports = saveTrips;


