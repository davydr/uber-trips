const { spawn } = require("child_process");

contextBridge.exposeInMainWorld("electronAPI", {
  saveTrips: (urls) => {
    const cmd = spawn("node", ["puppeteer-runner.js", urls.join(",")]);

    cmd.stdout.on("data", (data) => console.log(`[runner] ${data}`));
    cmd.stderr.on("data", (data) => console.error(`[runner err] ${data}`));
    cmd.on("close", (code) => console.log(`PDF generation finished with code ${code}`));
  }
});

  

