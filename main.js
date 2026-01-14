// main.js - Electron entry + tiny static HTTP server (fixed port)
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');

let mainWindow;
let server;
const SERVER_PORT = 17653; // 👈 fixed port so localStorage persists

function createStaticServer() {
  return new Promise((resolve, reject) => {
    const rootDir = __dirname;

    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.ico': 'image/x-icon',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    };

    const srv = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/' || urlPath === '') {
        urlPath = '/MCGI Notes&Viewer.html';
      }

      const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
      const filePath = path.join(rootDir, decodeURIComponent(safePath));

      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const type = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': type });
        fs.createReadStream(filePath).pipe(res);
      });
    });

    srv.on('error', reject);

    // 🔒 fixed port instead of random
    srv.listen(SERVER_PORT, 'localhost', () => {
      resolve(srv);
    });
  });
}

async function createWindow() {
  server = await createStaticServer();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const url = `http://localhost:${SERVER_PORT}/`;
  await mainWindow.loadURL(url);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow).catch(err => {
  console.error('Failed to start app:', err);
  app.quit();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (server) server.close();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow().catch(err => console.error(err));
  }
});
