import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { exec } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import fs from 'node:fs';
import { execFile } from 'node:child_process';
import { once } from 'node:events';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png')
  : path.join(__dirname, '../public/favicon.png')


const createWindow = () => {
  const win = new BrowserWindow({
    fullscreen: true,
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      zoomFactor: 0.9
    }
  });


  if (isDev) {
    const devServerURL = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    win.loadURL(devServerURL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    // In packaged apps, files live inside app.asar; use app.getAppPath() to resolve dist.
    const basePath = app.getAppPath();
    const indexPath = path.join(basePath, 'dist', 'index.html');
    win.loadFile(indexPath);
  }
};

ipcMain.handle('get-printers', async (event) => {
  const printers = await event.sender.getPrintersAsync();
  return printers || [];
});

ipcMain.handle('print-raw', async (event, { content, printerName }) => {
  if (process.platform !== 'win32') {
    throw new Error('Direct raw printing is supported on Windows only.');
  }

  if (!content) {
    throw new Error('No content provided for printing.');
  }

  const printers = await event.sender.getPrintersAsync();
  const targetPrinter = printerName || printers?.[0]?.name;

  if (!targetPrinter) {
    throw new Error('No printer available. Please install or select a printer.');
  }

  const tempPath = path.join(os.tmpdir(), `halifax-print-${Date.now()}.txt`);
  await fs.promises.writeFile(tempPath, content, { encoding: 'binary' });

  return new Promise((resolve, reject) => {
    // Use PowerShell PrintTo for better handling of names with spaces/special chars.
    const psCommand = [
      'Start-Process',
      '-FilePath', `"${tempPath}"`,
      '-Verb', 'PrintTo',
      '-ArgumentList', `"\"${targetPrinter}\""`
    ].join(' ');

    execFile('powershell.exe', ['-NoProfile', '-Command', psCommand], { windowsHide: true }, (error, stdout, stderr) => {
      fs.promises.unlink(tempPath).catch(() => {});

      if (error) {
        // Fallback to legacy print command with quoting
        const printerArg = `/D:${targetPrinter.includes(' ') ? `"${targetPrinter}"` : targetPrinter}`;
        execFile('print', [printerArg, tempPath], { windowsHide: true }, (legacyErr, legacyStdout, legacyStderr) => {
          if (legacyErr) {
            reject(new Error(legacyStderr?.trim() || legacyErr.message || stderr?.trim() || 'Failed to send print job.'));
            return;
          }
          resolve(legacyStdout?.trim() || 'Print job sent (legacy).');
        });
        return;
      }

      resolve(stdout?.trim() || 'Print job sent.');
    });
  });
});

ipcMain.handle('print-current', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  return new Promise((resolve, reject) => {
    win.webContents.print(
      {
        silent: options?.silent ?? false,
        printBackground: true,
        deviceName: options?.printerName || undefined
      },
      (success, errorType) => {
        if (!success) return reject(new Error(errorType || 'Print failed'));
        resolve(true);
      }
    );
  });
});

ipcMain.handle("print-temp-file", async (_, { content }) => {
  return new Promise((resolve, reject) => {
    const tempPath = path.join(process.env.TEMP, `print_${Date.now()}.txt`);

    fs.writeFile(tempPath, content, "utf8", (err) => {
      if (err) return reject(err);

      // Windows native print verb
      const cmd = `powershell -command "Start-Process -FilePath '${tempPath}' -Verb Print -WindowStyle Hidden"`;

      exec(cmd, (err) => {
        if (err) return reject("Failed to print file: " + err.message);
        
        // optional: auto-delete file after a delay
        // setTimeout(() => {
        //   fs.unlink(tempPath, () => {});
        // }, 2000);

        resolve(true);
      });
    });
  });
});

ipcMain.handle('print-pdf', async (_event, { filePath, printerName }) => {
  if (!filePath) {
    throw new Error('No PDF path provided for printing.');
  }
  const resolvedPath = path.resolve(filePath);
  const exists = await fs.promises
    .access(resolvedPath, fs.constants.R_OK)
    .then(() => true)
    .catch(() => false);
  if (!exists) {
    throw new Error(`PDF file not found: ${resolvedPath}`);
  }



  const printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      sandbox: false
    }
  });

  await printWindow.loadFile(resolvedPath);
  await once(printWindow.webContents, 'did-finish-load');

  return new Promise((resolve, reject) => {
    const options = {
      silent: Boolean(printerName),
      printBackground: true
    };
    if (printerName) options.deviceName = printerName;

    printWindow.webContents.print(options, (success, errorType) => {
      printWindow.destroy();
      if (!success) {
        reject(new Error(errorType || 'Failed to print PDF.'));
        return;
      }
      resolve('PDF print job sent.');
    });
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
