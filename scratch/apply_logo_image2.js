const fs = require('fs');
const path = require('path');

// 1. Load the new logo buffers
const fullLogoBuf = fs.readFileSync('scratch/logo_image2_full_centered.png');
const logo512Buf = fs.readFileSync('scratch/logo_image2_centered_512.png');
const newBase64 = logo512Buf.toString('base64');
const newDataUri = `data:image/png;base64,${newBase64}`;

console.log('New data URI length:', newDataUri.length);

// 2. Write to asset files
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png', fullLogoBuf);
console.log('Updated EmergereApp/EmergereApp/assets/emergere-logo.png');

if (!fs.existsSync('assets')) fs.mkdirSync('assets', { recursive: true });
fs.writeFileSync('assets/emergere-logo.png', fullLogoBuf);
console.log('Updated assets/emergere-logo.png');

// 3. Generate favicon
const zlib = require('zlib');
// Load 256 crop for favicon
function makeFavicon(pngBuf) {
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type
  icoHeader.writeUInt16LE(1, 4); // 1 image

  const icoDirEntry = Buffer.alloc(16);
  icoDirEntry.writeUInt8(0, 0); // 0 means 256 width
  icoDirEntry.writeUInt8(0, 1); // 0 means 256 height
  icoDirEntry.writeUInt8(0, 2); // color count
  icoDirEntry.writeUInt8(0, 3); // reserved
  icoDirEntry.writeUInt16LE(1, 4); // color planes
  icoDirEntry.writeUInt16LE(32, 6); // bpp
  icoDirEntry.writeUInt32LE(pngBuf.length, 8); // image size
  icoDirEntry.writeUInt32LE(22, 12); // image offset

  return Buffer.concat([icoHeader, icoDirEntry, pngBuf]);
}

const faviconBuf = makeFavicon(logo512Buf);
fs.writeFileSync('EmergereApp/EmergereApp/favicon.ico', faviconBuf);
fs.writeFileSync('favicon.ico', faviconBuf);
console.log('Updated favicon.ico files');

// 4. Update the 4 bundle HTML files
const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Replace all data:image/png;base64,... that are logos
  let count = 0;
  content = content.replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, (match) => {
    // Check if it looks like the previous logo (length > 1000)
    if (match.length > 500) {
      count++;
      return newDataUri;
    }
    return match;
  });

  // Ensure alignment and styling in logoGlobalStyle
  // Look for logoGlobalStyle
  const oldLogoStyleRegex = /\.mini-logo,\s*\.brand img[\s\S]*?\.screen\s*\{/g;
  const replacementStyle = `.mini-logo, .brand img, .dash-top .brand img, .login-logo, .nav-logo {
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
              -webkit-tap-highlight-color: transparent !important;
              object-fit: contain !important;
              flex-shrink: 0 !important;
              border-radius: 6px !important;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08) !important;
            }
            .mini-logo:hover, .brand img:hover, .dash-top .brand img:hover, .login-logo:hover, .nav-logo:hover {
              transform: scale(1.08) !important;
              opacity: 0.92 !important;
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
              width: 28px !important;
              height: 28px !important;
              margin-top: 0 !important;
              margin-right: 2px !important;
              flex-shrink: 0 !important;
              vertical-align: middle !important;
            }
            .brand {
              display: flex !important;
              align-items: center !important;
              gap: 10px !important;
            }
            .login-logo {
              width: 76px !important;
              height: 76px !important;
              border-radius: 18px !important;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
            }
            
            .statusbar { display: none !important; }
            .screen {`;

  if (oldLogoStyleRegex.test(content)) {
    content = content.replace(oldLogoStyleRegex, replacementStyle);
  }

  // Also in tpl-Login: ensure login-logo has border-radius 18px and box-shadow
  content = content.replace(
    /\.login-logo\s*\{[\s\S]*?\}/,
    `.login-logo {
          width: 76px;
          height: 76px;
          object-fit: contain;
          margin-bottom: 24px;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}: replaced ${count} logo occurrences`);
});

// 5. Update EmployeeDashboard/preview.css and preview/base.css
const baseCssFiles = [
  'EmergereApp/EmergereApp/preview/base.css'
];
baseCssFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let css = fs.readFileSync(f, 'utf8');
    css = css.replace(
      /\.mini-logo\{[^}]+\}/,
      `.mini-logo{width:26px; height:26px; object-fit:contain; border-radius:6px; box-shadow:0 1px 4px rgba(0,0,0,0.08);}`
    );
    fs.writeFileSync(f, css, 'utf8');
    console.log(`Updated ${f}`);
  }
});

const empDashCss = 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.css';
if (fs.existsSync(empDashCss)) {
  let css = fs.readFileSync(empDashCss, 'utf8');
  if (!css.includes('.brand img')) {
    css += '\n.brand img { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }\n';
    css += '.brand { display: flex; align-items: center; gap: 10px; }\n';
  } else {
    css = css.replace(
      /\.brand img\s*\{[^}]+\}/,
      `.brand img { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }`
    );
  }
  fs.writeFileSync(empDashCss, css, 'utf8');
  console.log(`Updated ${empDashCss}`);
}
