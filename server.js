const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Route aliases for preview
  if (reqUrl === '/' || reqUrl === '/preview' || reqUrl === '/preview.html' || reqUrl === '/preview_app') {
    reqUrl = '/preview_app.html';
  }

  // Graceful favicon handling
  if (reqUrl === '/favicon.ico') {
    const icoPath = path.join(ROOT, 'favicon.ico');
    const logoFallback = path.join(ROOT, 'EmergereApp', 'EmergereApp', 'assets', 'emergere-logo.png');
    const targetPath = fs.existsSync(icoPath) ? icoPath : (fs.existsSync(logoFallback) ? logoFallback : null);

    if (targetPath) {
      res.writeHead(200, {
        'Content-Type': path.extname(targetPath) === '.png' ? 'image/png' : 'image/x-icon',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(targetPath).pipe(res);
      return;
    } else {
      res.writeHead(204); // No content, prevents browser 404 console error
      res.end();
      return;
    }
  }

  let filePath = path.join(ROOT, decodeURIComponent(reqUrl));

  // Support clean URLs by appending .html if exact match isn't found
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.warn(`⚠️ [404 Not Found] ${req.method} ${req.url} (looked in ${filePath})`);
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

const localIp = getLocalIp();
let currentPort = Number(PORT);

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(` Mobile Application Server Started!`);
    console.log(` 🚀 On Computer Browser: http://localhost:${port}`);
    console.log(` 📱 On Mobile Phone Browser: http://${localIp}:${port}`);
    console.log(`==================================================\n`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️  Port ${currentPort} is already in use. Trying port ${currentPort + 1}...`);
    currentPort += 1;
    setTimeout(() => {
      startServer(currentPort);
    }, 200);
  } else {
    console.error('Server error:', err);
  }
});

startServer(currentPort);

