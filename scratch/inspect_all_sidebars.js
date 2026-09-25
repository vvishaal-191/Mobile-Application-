const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function searchAllFiles(dir, regex) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git') {
        searchAllFiles(fullPath, regex);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.html') || entry.name.endsWith('.js') || entry.name.endsWith('.jsx') || entry.name.endsWith('.css'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (regex.test(content)) {
        console.log(`Matched in: ${path.relative(ROOT, fullPath)}`);
      }
    }
  }
}

console.log('Searching for sidebar-drawer:');
searchAllFiles(ROOT, /sidebar-drawer/);

console.log('\nSearching in index.html for which templates contain sidebar-drawer:');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tplRegex = /<template[^>]+id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/template>/g;
let m;
while ((m = tplRegex.exec(indexHtml)) !== null) {
  if (m[2].includes('sidebar-drawer')) {
    console.log(`Template with sidebar-drawer: ${m[1]}`);
  }
}
