const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.toLowerCase().includes('restrict') || l.toLowerCase().includes('not authorized') || l.toLowerCase().includes('denied') || l.toLowerCase().includes('permission to access')) {
    console.log((i+1) + ': ' + l);
  }
});
