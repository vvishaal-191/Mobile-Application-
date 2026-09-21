const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const targetLines = [7062, 8387, 9011, 9943, 10646];

targetLines.forEach(ln => {
  console.log(`\n=== Header at line ${ln} ===`);
  for (let i = ln - 1; i < ln + 15 && i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('base64')) {
      line = line.replace(/data:image\/[^;]+;base64,[^"]+/, 'data:image/...[BASE64]...');
    }
    console.log(`${i + 1}: ${line}`);
  }
});
