const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const gatherUrls = require('./gather-urls');

app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer.html');
}

app.whenReady().then(createWindow);

// Step 1: run login-helper once (if needed)
const loginHelper = require('./login-helper');
loginHelper().then(() => {
  console.log('✅ Login session loaded.');
}).catch(err => {
  console.error('❌ Login helper failed:', err);
});

ipcMain.on('save-trips', (event, urls) => {
  console.log("Got URLs:", urls);
  exec(`node puppeteer-runner.js "${urls.join(',')}"`, (err, stdout, stderr) => {
    if (err) console.error("Failed:", err);
    console.log(stdout || stderr);
  });
});
ipcMain.on('gather-urls', (event, month, year) => {
  console.log(`📆 Gathering URLs for: ${month}/${year}`);
  const command = `node gather-urls.js ${month} ${year}`;

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Failed to gather URLs:", err);
    } else {
      console.log(stdout || stderr);
    }
  });
});






