const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const cookiesPath = path.join(__dirname, "user-data", "cookies.json");
const chromePath = require("./chrome-path.js")();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const urlArg = process.argv[2];
  if (!urlArg) {
    console.error("❌ No URLs provided.");
    process.exit(1);
  }

  const urls = [...new Set(urlArg.split(",").filter(u => u.includes("/earnings/trips/")))];
  console.log(`🔗 Found ${urls.length} trip URLs`);

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: chromePath,
    userDataDir: path.join(__dirname, "user-data"),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, "utf-8"));
    await page.setCookie(...cookies);
    console.log("🍪 Cookies loaded");
  } else {
    console.warn("⚠️ No cookies found.");
  }

  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  for (const url of urls) {
    try {
      console.log(`📄 Visiting: ${url}`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      // Delay 3–7 seconds between trips to avoid detection
      const delay = Math.floor(Math.random() * 4000) + 3000;
      console.log(`⏳ Waiting ${delay}ms`);
      await sleep(delay);

      const tripId = url.split("/").pop();
      const filename = path.join(outputDir, `uber-trip-${tripId}.pdf`);

      await page.pdf({ path: filename, format: "A4" });
      console.log(`✅ Saved: ${filename}`);
    } catch (err) {
      console.error(`❌ Failed to process ${url}:`, err.message);
    }
  }

  await browser.close();
  console.log("🎉 All PDFs generated.");
})();
