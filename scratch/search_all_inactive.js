const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '.gemini') {
        searchDir(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.css'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('Inactive')) {
        console.log('Found Inactive in:', fullPath);
        // check lines
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (line.includes('Inactive')) {
            console.log(`  Line ${idx+1}: ${line.trim()}`);
          }
        });
      }
    }
  }
}

searchDir('.');
