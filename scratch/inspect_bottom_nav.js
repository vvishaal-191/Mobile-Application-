const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const tplRegex = /<template\s+id="([^"]+)">([\s\S]*?)<\/template>/g;
let match;
while ((match = tplRegex.exec(html)) !== null) {
  const tplId = match[1];
  const tplContent = match[2];
  
  // Find bottom nav elements
  const navMatches = tplContent.match(/class="[^"]*(?:bottom-nav|nav-bar|tab-bar|nav-bottom)[^"]*"[\s\S]*?<\/div>/);
  // Also search for "Calendar" or "History" in tabs
  const tabLines = [];
  tplContent.split('\n').forEach((l, idx) => {
    if ((l.includes('Calendar') || l.includes('History') || l.includes('tab-item') || l.includes('nav-tab')) && 
        (l.includes('onclick') || l.includes('span') || l.includes('tab') || l.includes('id='))) {
      tabLines.push(`L${idx+1}: ${l.trim().slice(0, 140)}`);
    }
  });

  if (tabLines.length > 0) {
    console.log(`\n=== Template: ${tplId} ===`);
    tabLines.slice(0, 12).forEach(x => console.log('  ' + x));
  }
}
