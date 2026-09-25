const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const regexes = [
  /status-dot/gi,
  /status-pill/gi,
  /status-badge/gi,
  /emp-status/gi,
  /attendance-status/gi,
  /check-in/gi,
  /checked-in/gi,
  /active-dot/gi,
  /dot/gi
];

regexes.forEach(r => {
  const matches = content.match(r);
  console.log(r.source, 'matches count:', matches ? matches.length : 0);
});
