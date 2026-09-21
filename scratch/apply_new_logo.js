const fs = require('fs');

const newLogoPath = 'C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/632b9082-b01e-47b7-889e-446477304aba/.user_uploaded/media_1789964564009.png';
const newLogoBuf = fs.readFileSync(newLogoPath);
const newLogoBase64 = newLogoBuf.toString('base64');

console.log('New logo size:', newLogoBuf.length, 'bytes');
console.log('New logo base64 length:', newLogoBase64.length);

// 1. Update asset files
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png', newLogoBuf);
console.log('Updated: EmergereApp/EmergereApp/assets/emergere-logo.png');

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}
fs.writeFileSync('assets/emergere-logo.png', newLogoBuf);
console.log('Updated: assets/emergere-logo.png');

// 2. Update favicons
fs.writeFileSync('EmergereApp/EmergereApp/favicon.ico', newLogoBuf);
console.log('Updated: EmergereApp/EmergereApp/favicon.ico');
fs.writeFileSync('favicon.ico', newLogoBuf);
console.log('Updated: favicon.ico');

// 3. Update HTML files
const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

const sampleContent = fs.readFileSync('preview_app.html', 'utf8');
const curB64Match = sampleContent.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
if (!curB64Match) {
  console.error('Could not find current base64 in preview_app.html!');
  process.exit(1);
}
const curB64 = curB64Match[1];
console.log('Current base64 length:', curB64.length);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  let pos = 0;
  while ((pos = content.indexOf(curB64, pos)) !== -1) {
    count++;
    pos += curB64.length;
  }
  console.log(`Replacing ${count} occurrences in ${file}...`);
  content = content.split(curB64).join(newLogoBase64);
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});

console.log('\nAll logo replacements completed successfully!');
