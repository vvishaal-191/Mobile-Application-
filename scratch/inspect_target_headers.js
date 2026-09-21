const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const targetLines = [7062, 8387, 9011, 9943, 10646];

targetLines.forEach(lineNum => {
  let templateName = 'unknown';
  for (let i = lineNum - 1; i >= 0; i--) {
    if (lines[i].includes('<template id="')) {
      templateName = lines[i];
      break;
    }
  }
  console.log(`\n--- Line ${lineNum} (Template: ${templateName.trim()}) ---`);
  for (let i = lineNum - 2; i <= lineNum + 8; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
});
