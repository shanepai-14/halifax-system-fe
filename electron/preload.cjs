// CommonJS preload to avoid ESM require issues in Electron
const { contextBridge, ipcRenderer } = require('electron');

console.log('[preload] exposing electronBridge (CJS)');

contextBridge.exposeInMainWorld('electronBridge', {
  env: process.env.NODE_ENV || (process.defaultApp ? 'development' : 'production'),
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printRaw: (payload) => ipcRenderer.invoke('print-raw', payload),
  printHTML: (payload) => ipcRenderer.invoke('print-html', payload),
  printPDF: (payload) => ipcRenderer.invoke('print-pdf', payload),
  printCurrent: (payload) => ipcRenderer.invoke('print-current', payload),
  printTempFile: (payload) => ipcRenderer.invoke("print-temp-file", payload)
});
