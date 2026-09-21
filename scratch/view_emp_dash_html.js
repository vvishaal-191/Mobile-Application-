const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

for (let i = 1020; i < 2000; i++) {
  if (lines[i].includes('<div class="screen">') || lines[i].includes('class="dash-top"')) {
    console.log(`Found on line ${i + 1}:`);
    for (let k = i; k < i + 30; k++) {
      let l = lines[k];
      if (l.includes('base64')) l = l.replace(/data:image\/[^;]+;base64,[^"]+/, '[BASE64]');
      console.log(`${k + 1}: ${l}`);
    }
    break;
  }
}
