const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let errors = [];
while ((match = scriptRegex.exec(content)) !== null) {
  count++;
  try {
    new Function(match[1]);
  } catch (e) {
    errors.push({ script: count, error: e.message });
  }
}

if (errors.length === 0) {
  console.log(`SUCCESS: All ${count} scripts in index.html parsed without syntax errors!`);
} else {
  console.log(`FAILED: Found errors:`, errors);
}
