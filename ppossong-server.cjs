const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = 'C:\\Users\\HKEDU\\Downloads';
const PORT = 5174;

const DEFAULT_FILES = {
  '/': 'ppossong-v2.html',
  '/dashboard': 'kepco-dashboard.html',
  '/ppossong': 'ppossong-toegueen.html',
};

http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  const fileName = DEFAULT_FILES[urlPath] || path.basename(urlPath);
  const filePath = path.join(ROOT, fileName);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found: ' + fileName); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
