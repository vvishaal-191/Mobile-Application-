const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ status: res.statusCode });
    }).on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  const r1 = await check('http://localhost:3000/index.html');
  console.log('http://localhost:3000/index.html:', r1);
  const r2 = await check('http://localhost:3000/preview_app.html');
  console.log('http://localhost:3000/preview_app.html:', r2);
}

run();
