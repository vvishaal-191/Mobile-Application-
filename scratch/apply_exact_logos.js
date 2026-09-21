const fs = require('fs');
const path = require('path');

// 1. Read the two logo buffers
const transparentLogo512 = fs.readFileSync('scratch/logo_transparent_512.png');
const transparentMaster = fs.readFileSync('scratch/logo_transparent_master.png');
const loginLogo512 = fs.readFileSync('scratch/logo_login_512.png');
const loginMaster = fs.readFileSync('scratch/logo_login_master.png');

const transparentBase64 = transparentLogo512.toString('base64');
const transparentDataUri = `data:image/png;base64,${transparentBase64}`;

const loginBase64 = loginLogo512.toString('base64');
const loginDataUri = `data:image/png;base64,${loginBase64}`;

console.log('Transparent data URI length:', transparentDataUri.length);
console.log('Login data URI length:', loginDataUri.length);

// 2. Save asset files for project and React Native
// App-wide logo:
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png', transparentMaster);
fs.writeFileSync('assets/emergere-logo.png', transparentMaster);
console.log('Updated emergere-logo.png with transparent logo');

// Login-only logo:
fs.writeFileSync('EmergereApp/EmergereApp/assets/emergere-login-logo.png', loginMaster);
fs.writeFileSync('assets/emergere-login-logo.png', loginMaster);
console.log('Updated emergere-login-logo.png with Login-only logo');

// 3. Update favicon with transparent logo
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

const faviconBuf = makeFavicon(transparentLogo512);
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

  // Step 4a: In tpl-Login, use loginDataUri for .login-logo
  // Let's locate <template id="tpl-Login">...<img class="login-logo"...>
  content = content.replace(
    /(<template id="tpl-Login">[\s\S]*?<img class="login-logo"\s+src=")data:image\/png;base64,[A-Za-z0-9+/=]+(")/,
    `$1${loginDataUri}$2`
  );

  // Step 4b: For all other logos (.mini-logo and .nav-logo outside tpl-Login), replace with transparentDataUri
  // We can do this by splitting around tpl-Login or by checking each template
  // Let's find all templates and nav-logos
  let updatedCount = 0;
  // Match all <img ... src="data:image/png;base64,...">
  content = content.replace(/<img([^>]+)src="data:image\/png;base64,[A-Za-z0-9+/=]+"([^>]*)>/g, (fullMatch, before, after) => {
    // If it's the login-logo inside tpl-Login, it should be loginDataUri
    if (before.includes('login-logo') || after.includes('login-logo')) {
      updatedCount++;
      return `<img${before}src="${loginDataUri}"${after}>`;
    } else {
      // It's a mini-logo or nav-logo -> use transparentDataUri
      updatedCount++;
      return `<img${before}src="${transparentDataUri}"${after}>`;
    }
  });

  // Step 4c: Update CSS styles for logoGlobalStyle
  // .mini-logo and .brand img should have transparent background, no box shadow, no border, clean alignment
  // .login-logo retains its rich 18px rounded presentation with drop shadow
  content = content.replace(
    /\.mini-logo,\s*\.brand img,\s*\.dash-top \.brand img[\s\S]*?\.screen\s*\{/,
    `.mini-logo, .brand img, .dash-top .brand img, .nav-logo {
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
              -webkit-tap-highlight-color: transparent !important;
              object-fit: contain !important;
              flex-shrink: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .mini-logo:hover, .brand img:hover, .dash-top .brand img:hover, .nav-logo:hover {
              transform: scale(1.08) !important;
              opacity: 0.9 !important;
            }
            .mini-logo:active, .brand img:active, .dash-top .brand img:active, .nav-logo:active {
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
              object-fit: contain !important;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25) !important;
              margin-bottom: 24px !important;
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
            }
            .login-logo:hover {
              transform: scale(1.06) !important;
              opacity: 0.95 !important;
            }
            .login-logo:active {
              transform: scale(0.96) !important;
            }
            
            .statusbar { display: none !important; }
            .screen {`
  );

  // Update .brand img in tpl-EmployeeDashboard styles
  content = content.replace(
    /\.brand img\s*\{\s*width:\s*28px;\s*height:\s*28px;\s*border-radius:\s*6px;\s*object-fit:\s*contain;\s*box-shadow:\s*0 1px 4px rgba\(0, 0, 0, 0\.08\);\s*border:\s*1px solid rgba\(0, 0, 0, 0\.04\);\s*flex-shrink:\s*0;\s*\}/g,
    `.brand img {
          width: 28px;
          height: 28px;
          object-fit: contain;
          flex-shrink: 0;
          background: transparent;
        }`
  );

  // Update .mini-logo in tpl-ManagerDashboard styles
  content = content.replace(
    /\.mini-logo\s*\{\s*width:\s*28px;\s*height:\s*28px;\s*object-fit:\s*contain;\s*border-radius:\s*6px;\s*box-shadow:\s*0 1px 4px rgba\(0, 0, 0, 0\.08\);\s*border:\s*1px solid rgba\(0, 0, 0, 0\.04\);\s*flex-shrink:\s*0;\s*\}/g,
    `.mini-logo {
          width: 26px;
          height: 26px;
          object-fit: contain;
          flex-shrink: 0;
          background: transparent;
        }`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file} (${updatedCount} img tags processed)`);
});

// 5. Update preview/base.css
const baseCss = 'EmergereApp/EmergereApp/preview/base.css';
if (fs.existsSync(baseCss)) {
  let css = fs.readFileSync(baseCss, 'utf8');
  css = css.replace(
    /\.mini-logo\{[^}]+\}/,
    `.mini-logo{width:26px; height:26px; object-fit:contain; flex-shrink:0; background:transparent;}`
  );
  fs.writeFileSync(baseCss, css, 'utf8');
  console.log(`Updated ${baseCss}`);
}

// 6. Update EmployeeDashboard/preview.css
const empDashCss = 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.css';
if (fs.existsSync(empDashCss)) {
  let css = fs.readFileSync(empDashCss, 'utf8');
  css = css.replace(
    /\.brand img\s*\{[^}]+\}/,
    `.brand img { width: 28px; height: 28px; object-fit: contain; flex-shrink: 0; background: transparent; }`
  );
  fs.writeFileSync(empDashCss, css, 'utf8');
  console.log(`Updated ${empDashCss}`);
}

// 7. Update Login/preview.html and Login/LoginScreen.jsx to reference emergere-login-logo.png
const loginPreviewHtml = 'EmergereApp/EmergereApp/src/screens/Login/preview.html';
if (fs.existsSync(loginPreviewHtml)) {
  let html = fs.readFileSync(loginPreviewHtml, 'utf8');
  html = html.replace('emergere-logo.png', 'emergere-login-logo.png');
  fs.writeFileSync(loginPreviewHtml, html, 'utf8');
  console.log(`Updated ${loginPreviewHtml}`);
}

const loginScreenJsx = 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx';
if (fs.existsSync(loginScreenJsx)) {
  let jsx = fs.readFileSync(loginScreenJsx, 'utf8');
  jsx = jsx.replace('emergere-logo.png', 'emergere-login-logo.png');
  fs.writeFileSync(loginScreenJsx, jsx, 'utf8');
  console.log(`Updated ${loginScreenJsx}`);
}

// 8. Update LoginScreen.styles.js
const loginStylesJs = 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js';
if (fs.existsSync(loginStylesJs)) {
  let js = fs.readFileSync(loginStylesJs, 'utf8');
  js = js.replace(
    /logo:\s*\{[\s\S]*?\},/,
    `logo: {
    width: 76,
    height: 76,
    borderRadius: 18,
    resizeMode: 'contain',
    marginBottom: 24,
  },`
  );
  fs.writeFileSync(loginStylesJs, js, 'utf8');
  console.log(`Updated ${loginStylesJs}`);
}
