const fs = require('fs');
const path = require('path');

function findFiles(dir, ext) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(findFiles(fullPath, ext));
      }
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  return results;
}

const rnScreens = findFiles('EmergereApp/EmergereApp/src/screens', '.jsx');

rnScreens.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('<ScrollView')) {
      console.log(`${f}:${idx + 1}: ${line.trim()}`);
    }
  });
});
