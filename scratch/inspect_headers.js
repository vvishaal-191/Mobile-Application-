const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<div class="header">')) {
    console.log(`Line ${i + 1}: ${l.slice(0, 100)}`);
  }
});
