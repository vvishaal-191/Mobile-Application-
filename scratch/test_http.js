const http = require('http');

http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('GET / Status:', res.statusCode);
    console.log('Contains Holiday Calendar in QA:', data.includes('<div class="qa-title">Holiday Calendar</div>'));
    console.log('Contains Holiday Calendar tab:', data.includes('Holiday Calendar</span>'));
    console.log('Contains 140px perm padding:', data.includes('padding-bottom: 140px;'));
    console.log('Contains perm submit btn margin 20px:', data.includes('margin-top: 20px;'));
  });
}).on('error', (err) => {
  console.error('HTTP Error:', err.message);
});
