const fs = require('fs');

const originalLogoPath = 'C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/632b9082-b01e-47b7-889e-446477304aba/.user_uploaded/media_1789964904573.png';
const originalLogoBuf = fs.readFileSync(originalLogoPath);
console.log('Original 1024x973 logo size:', originalLogoBuf.length, 'bytes');

const logo512Buf = fs.readFileSync('scratch/logo_512.png');
const logo256Buf = fs.readFileSync('scratch/logo_256.png');
const logo512Base64 = logo512Buf.toString('base64');
console.log('512x486 logo base64 length:', logo512Base64.length);

// 1. Update asset files with full resolution original
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png', originalLogoBuf);
console.log('Updated: EmergereApp/EmergereApp/assets/emergere-logo.png');

if (!fs.existsSync('assets')) {
  fs.mkdirSync('assets');
}
fs.writeFileSync('assets/emergere-logo.png', originalLogoBuf);
console.log('Updated: assets/emergere-logo.png');

// 2. Update favicons with crisp 256x243 logo
fs.writeFileSync('EmergereApp/EmergereApp/favicon.ico', logo256Buf);
console.log('Updated: EmergereApp/EmergereApp/favicon.ico');
fs.writeFileSync('favicon.ico', logo256Buf);
console.log('Updated: favicon.ico');

// 3. Update preview/base.css
let baseCss = fs.readFileSync('EmergereApp/EmergereApp/preview/base.css', 'utf8');
baseCss = baseCss.replace(
  /\.mini-logo\s*\{[^}]*\}/,
  '.mini-logo{width:26px; height:26px; object-fit:contain; flex-shrink:0;}'
);
baseCss = baseCss.replace(
  /\.header\s*\.mini-logo\s*\{[^}]*\}/,
  '.header .mini-logo{width:26px; height:26px; object-fit:contain; margin-top:2px; flex-shrink:0;}'
);
fs.writeFileSync('EmergereApp/EmergereApp/preview/base.css', baseCss, 'utf8');
console.log('Updated: EmergereApp/EmergereApp/preview/base.css');

// 4. Update the 4 HTML files
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
console.log('Current base64 length in HTML:', curB64.length);

htmlFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  let pos = 0;
  while ((pos = content.indexOf(curB64, pos)) !== -1) {
    count++;
    pos += curB64.length;
  }
  console.log(`Replacing ${count} occurrences in ${file}...`);
  content = content.split(curB64).join(logo512Base64);

  // Also ensure logo styling is polished in logoGlobalStyle
  const oldLogoStyleTarget = `.mini-logo, .brand img, .dash-top .brand img, .login-logo {
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
              -webkit-tap-highlight-color: transparent !important;
            }
            .mini-logo:hover, .brand img:hover, .dash-top .brand img:hover, .login-logo:hover {
              transform: scale(1.12) !important;
              opacity: 0.9 !important;
            }
            .mini-logo:active, .brand img:active, .dash-top .brand img:active, .login-logo:active {
              transform: scale(0.92) !important;
            }`;

  const newLogoStyleReplacement = `.mini-logo, .brand img, .dash-top .brand img, .login-logo, .nav-logo {
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
              -webkit-tap-highlight-color: transparent !important;
              object-fit: contain !important;
              flex-shrink: 0 !important;
            }
            .mini-logo:hover, .brand img:hover, .dash-top .brand img:hover, .login-logo:hover, .nav-logo:hover {
              transform: scale(1.08) !important;
              opacity: 0.9 !important;
            }
            .mini-logo:active, .brand img:active, .dash-top .brand img:active, .login-logo:active, .nav-logo:active {
              transform: scale(0.94) !important;
            }
            .header .mini-logo {
              width: 26px !important;
              height: 26px !important;
              margin-top: 2px !important;
              flex-shrink: 0 !important;
            }
            .brand .mini-logo, .dash-top .brand img {
              width: 26px !important;
              height: 26px !important;
              margin-top: 0 !important;
              flex-shrink: 0 !important;
            }`;

  if (content.includes(oldLogoStyleTarget)) {
    content = content.replace(oldLogoStyleTarget, newLogoStyleReplacement);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});

console.log('\nAll logo replacements and style updates completed successfully!');
