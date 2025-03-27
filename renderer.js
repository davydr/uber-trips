function start() {
  const raw = document.getElementById("urls").value;
  const urls = urlInput
  .split(/\r?\n/)              // Split by new lines
  .map(u => u.trim())          // Remove extra spaces
  .filter(u => u.length > 0);  // Remove blanks


  window.electronAPI.saveTrips(urls); // send to preload
  document.getElementById("log").textContent = "Sent to backend!";
}

function gatherUrls() {
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  console.log('🟡 gatherUrls button clicked');
  const currentYear = new Date().getFullYear();

  if (!month || !year || month < 1 || month > 12 || year < 2014 || year > currentYear) {
    alert(`Please enter a valid month (1–12) and year (2014–${currentYear}).`);
    return;
  }

  window.electron.ipcRenderer.send("gather-urls", month, year);
}

document.getElementById("year").max = new Date().getFullYear();


