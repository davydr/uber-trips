function start() {
  const raw = document.getElementById("urls").value;
  const urls = raw
  .split(/\r?\n/)              // Split by new lines
  .map(u => u.trim())          // Remove extra spaces
  .filter(u => u.length > 0);  // Remove blanks


  window.electronAPI.saveTrips(urls); // send to preload
  document.getElementById("log").textContent = "Sent to backend!";
}


