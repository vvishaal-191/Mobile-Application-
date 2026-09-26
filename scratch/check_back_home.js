const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tplRegex = /<template\s+id="([^"]+)">([\s\S]*?)<\/template>/g;
let match;
while ((match = tplRegex.exec(html)) !== null) {
  const tplId = match[1];
  const tplContent = match[2];
  
  const backOrHome = [];
  const lines = tplContent.split('\n');
  lines.forEach((l, idx) => {
    const lower = l.toLowerCase();
    if (lower.includes('back') || lower.includes('home') || lower.includes('nav-item') || lower.includes('dashboard')) {
      if (l.includes('onclick') || l.includes('loadScreen') || l.includes('parent.') || l.includes('goBack') || l.includes('handleBack')) {
        backOrHome.push(`L${idx+1}: ${l.trim().slice(0, 150)}`);
      }
    }
  });

  if (backOrHome.length > 0) {
    console.log(`\n=== Template: ${tplId} ===`);
    backOrHome.slice(0, 10).forEach(x => console.log('  ' + x));
  }
}
