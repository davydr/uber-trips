const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    gatherUrls: (month, year) => ipcRenderer.send('gather-urls', month, year),
    saveTrips: (urls) => ipcRenderer.send('save-trips', urls),
  });
  

