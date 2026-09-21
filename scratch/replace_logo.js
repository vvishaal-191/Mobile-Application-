const fs = require('fs');
const path = require('path');

const newLogoPath = 'C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/632b9082-b01e-47b7-889e-446477304aba/.user_uploaded/media_1789964004869.png';
const newLogoBuf = fs.readFileSync(newLogoPath);
const newLogoBase64 = newLogoBuf.toString('base64');

console.log('New logo size:', newLogoBuf.length, 'bytes');
console.log('New logo base64 length:', newLogoBase64.length);

// 1. Update EmergereApp/EmergereApp/assets/emergere-logo.png
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png', newLogoBuf);
console.log('Updated: EmergereApp/EmergereApp/assets/emergere-logo.png');

// 2. Ensure root assets directory exists and copy emergere-logo.png
if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}
fs.writeFileSync('assets/emergere-logo.png', newLogoBuf);
console.log('Updated: assets/emergere-logo.png');

// 3. Update favicons
fs.writeFileSync('EmergereApp/EmergereApp/favicon.ico', newLogoBuf);
console.log('Updated: EmergereApp/EmergereApp/favicon.ico');
fs.writeFileSync('favicon.ico', newLogoBuf);
console.log('Updated: favicon.ico');

// 4. Update the 4 HTML files
const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

// Extract old base64 from preview_app.html
const sampleContent = fs.readFileSync('preview_app.html', 'utf8');
const oldB64Match = sampleContent.match(/data:image\/png;base64,([A-Za-z0-9+/=]+)/);
if (!oldB64Match) {
  console.error('Could not find old base64 in preview_app.html!');
  process.exit(1);
}
const oldB64 = oldB64Match[1];
console.log('Old base64 length:', oldB64.length);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  let pos = 0;
  while ((pos = content.indexOf(oldB64, pos)) !== -1) {
    count++;
    pos += oldB64.length;
  }
  console.log(`Replacing ${count} occurrences in ${file}...`);
  content = content.split(oldB64).join(newLogoBase64);
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});

console.log('\nAll logo replacements completed successfully!');
