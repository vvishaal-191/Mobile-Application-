const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

['status-dot', 'status-pill', 'status-badge'].forEach(term => {
  let pos = 0;
  while ((pos = content.indexOf(term, pos)) !== -1) {
    console.log(`=== ${term} at pos ${pos} ===`);
    console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 250)));
    pos += term.length;
  }
});
