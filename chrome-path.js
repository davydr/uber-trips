const os = require('os');
function getChromePath() {
  const platform = os.platform();
  if (platform === 'win32') return 'C:/Program Files/Google/Chrome/Application/chrome.exe';
  if (platform === 'darwin') return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  throw new Error('Unsupported OS');
}
// chrome-path.js
module.exports = () => {
  return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
};

