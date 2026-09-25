const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. New Holiday Calendar CSS block
const OLD_CSS_START = '/* ========================================================\n           HOLIDAY CALENDAR REDESIGN (IMAGE 2)\n           ======================================================== */';
const OLD_CSS_END = '/* Horizontally Scrollable Month Filter Pill Tabs */';

const NEW_CSS = `/* ========================================================
           HOLIDAY CALENDAR REDESIGN (IMAGE 2)
           ======================================================== */

        .screen.has-hc-header {
          padding-top: 0 !important;
        }

        /* Header Card Banner matching Image 2 */
        .hc-header-banner {
          position: relative;
          width: 100% !important;
          margin: 0 !important;
          margin-top: 0 !important;
          padding: 22px 20px 24px 20px !important;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          overflow: hidden;
          box-shadow: 0 12px 30px rgba(0, 85, 225, 0.28);
          background: linear-gradient(135deg, #0050D8 0%, #0066FF 48%, #1680FF 100%);
          color: #FFFFFF;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        /* Subtle top-right ambient glow */
        .hc-header-banner::before {
          content: '';
          position: absolute;
          top: -30px;
          right: 20px;
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
          z-index: 1;
        }

        .hc-header-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          z-index: 3;
        }

        .hc-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          min-width: 0;
        }

        /* Glossy 3D Back Button matching Image 2 */
        .hc-back-btn {
          width: 44px;
          height: 44px;
          min-width: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.12) 100%);
          border: 1.5px solid rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          color: #FFFFFF;
          box-shadow: 0 4px 14px rgba(0, 30, 90, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.5);
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .hc-back-btn:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.2) 100%);
          transform: scale(1.05);
          box-shadow: 0 6px 18px rgba(0, 30, 90, 0.3), inset 0 1px 3px rgba(255, 255, 255, 0.6);
        }

        .hc-back-btn:active {
          transform: scale(0.96);
        }

        .hc-header-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .hc-header-title {
          font-size: 21px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.3px;
          text-shadow: 0 1px 3px rgba(0, 30, 80, 0.25);
        }

        .hc-header-subtitle {
          font-size: 13px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.9);
          margin: 4px 0 0 0;
          letter-spacing: 0.1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* 3D Calendar Illustration with Foliage & Bell Badge */
        .hc-header-illustration {
          position: relative;
          width: 104px;
          height: 92px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-right: -4px;
        }

        /* Horizontally Scrollable Month Filter Pill Tabs */`;

// 2. New Holiday Calendar Header HTML block
const OLD_HTML_START = '<div class="device">\n        <div class="screen">\n          <!-- HEADER BANNER -->\n          <div class="hc-header-banner">';
const OLD_HTML_END = '<!-- MONTH FILTER PILL TABS -->';

const NEW_HTML = `<div class="device">
        <div class="screen has-hc-header">
          <!-- HEADER BANNER (Image 2 Redesign) -->
          <div class="hc-header-banner">
            <!-- Integrated Background Luminous Waves matching Image 2 -->
            <svg style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:1;" preserveAspectRatio="none" viewBox="0 0 400 110" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="hcWaveGrad1" x1="0%" y1="100%" x2="40%" y2="0%">
                  <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#60A5FA" stop-opacity="0"/>
                </linearGradient>
              </defs>
              <path d="M-20 110 Q 30 75 90 85 T 180 110 Z" fill="url(#hcWaveGrad1)"/>
              <path d="M-10 110 Q 40 90 85 96 T 150 110 Z" fill="#67E8F9" fill-opacity="0.2"/>
            </svg>

            <div class="hc-header-top-row">
              <div class="hc-header-left">
                <button class="hc-back-btn" title="Back" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-EmployeeDashboard')}else{window.history.back()}">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <div class="hc-header-text">
                  <h1 class="hc-header-title">Holiday Calendar</h1>
                  <p class="hc-header-subtitle">Company &amp; optional holidays 2026</p>
                </div>
              </div>

              <div class="hc-header-illustration">
                <!-- 3D Calendar Illustration with Foliage & Bell Badge matching Image 2 -->
                <svg width="104" height="92" viewBox="0 0 120 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <!-- 3D Calendar Drop Shadow -->
                    <filter id="cal3dShadow" x="12" y="10" width="94" height="92" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#002266" flood-opacity="0.38"/>
                    </filter>
                    
                    <!-- Notification Bell Badge Shadow -->
                    <filter id="bell3dShadow" x="62" y="52" width="52" height="52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#001F5C" flood-opacity="0.45"/>
                    </filter>

                    <!-- Ring Drop Shadow -->
                    <filter id="ringShadow" x="-20%" y="-10%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#00358E" flood-opacity="0.25"/>
                    </filter>

                    <!-- Calendar Base Shading Gradient -->
                    <linearGradient id="calBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#FFFFFF"/>
                      <stop offset="85%" stop-color="#F4F8FD"/>
                      <stop offset="100%" stop-color="#E5EFFB"/>
                    </linearGradient>

                    <!-- Calendar Header Bar Gradient -->
                    <linearGradient id="calHeaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#5B9BFC"/>
                      <stop offset="50%" stop-color="#3B82F6"/>
                      <stop offset="100%" stop-color="#2563EB"/>
                    </linearGradient>

                    <!-- 3D Ring Metallic / Plastic Gradient -->
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#FFFFFF"/>
                      <stop offset="35%" stop-color="#EBF3FD"/>
                      <stop offset="70%" stop-color="#D0E3FC"/>
                      <stop offset="100%" stop-color="#A5C7F9"/>
                    </linearGradient>

                    <!-- Debossed Day Cell Gradients -->
                    <linearGradient id="cellGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stop-color="#D3E5FD"/>
                      <stop offset="100%" stop-color="#B8D7FC"/>
                    </linearGradient>

                    <!-- Bell Badge Gradient -->
                    <linearGradient id="bellBadgeGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                      <stop offset="0%" stop-color="#1E78FF"/>
                      <stop offset="60%" stop-color="#0058F0"/>
                      <stop offset="100%" stop-color="#0043C4"/>
                    </linearGradient>

                    <!-- Soft Botanical Leaf Gradients matching Image 2 -->
                    <linearGradient id="leafGrad1" x1="0%" y1="100%" x2="70%" y2="0%">
                      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
                      <stop offset="100%" stop-color="#93C5FD" stop-opacity="0.85"/>
                    </linearGradient>
                    <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="50%" y2="0%">
                      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.5"/>
                      <stop offset="100%" stop-color="#BFDBFE" stop-opacity="0.8"/>
                    </linearGradient>
                    <linearGradient id="leafGrad3" x1="100%" y1="100%" x2="30%" y2="0%">
                      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.5"/>
                      <stop offset="100%" stop-color="#93C5FD" stop-opacity="0.75"/>
                    </linearGradient>
                  </defs>

                  <!-- ================= BACKGROUND BOTANICAL LEAVES (Image 2) ================= -->
                  <path d="M26 84 C16 75 12 58 20 48 C28 54 28 68 28 84 Z" fill="url(#leafGrad1)"/>
                  <path d="M30 84 C22 65 24 38 42 26 C48 38 44 65 34 84 Z" fill="url(#leafGrad2)"/>
                  <path d="M28 84 C25 72 28 52 38 42 C42 54 38 72 30 84 Z" fill="#93C5FD" fill-opacity="0.4"/>
                  <path d="M88 80 C98 68 106 46 116 38 C116 52 108 72 90 84 Z" fill="url(#leafGrad3)"/>
                  <path d="M86 84 C98 75 110 65 118 55 C118 68 108 82 88 88 Z" fill="#60A5FA" fill-opacity="0.35"/>
                  <path d="M10 88 C40 70 80 92 120 78 V95 H10 Z" fill="#93C5FD" fill-opacity="0.25"/>

                  <!-- ================= 3D CALENDAR BASE ================= -->
                  <g filter="url(#cal3dShadow)">
                    <rect x="24" y="20" width="68" height="64" rx="14" fill="url(#calBodyGrad)"/>
                    <path d="M24 32 C24 25.37 29.37 20 36 20 H80 C86.63 20 92 25.37 92 32 V36 H24 V32 Z" fill="url(#calHeaderGrad)"/>
                    <path d="M26 22 C30 20.8 35 20.5 40 20.5 H76 C81 20.5 86 20.8 90 22" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.6"/>

                    <!-- 6 Day Cells (2 Rows of 3) matching Image 2 -->
                    <rect x="33" y="44" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="33" y="44" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>
                    <rect x="51.5" y="44" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="51.5" y="44" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>
                    <rect x="70" y="44" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="70" y="44" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>

                    <rect x="33" y="60" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="33" y="60" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>
                    <rect x="51.5" y="60" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="51.5" y="60" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>
                    <rect x="70" y="60" width="13" height="12" rx="3.5" fill="url(#cellGrad)"/>
                    <rect x="70" y="60" width="13" height="12" rx="3.5" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.8"/>
                  </g>

                  <!-- ================= 4 3D SPIRAL BINDER RINGS ================= -->
                  <g filter="url(#ringShadow)">
                    <rect x="33" y="12" width="6" height="16" rx="3" fill="url(#ringGrad)"/>
                    <path d="M34 13.5 V24.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.9"/>
                    <ellipse cx="36" cy="27" rx="3" ry="1.5" fill="#1E40AF" fill-opacity="0.35"/>
                  </g>
                  <g filter="url(#ringShadow)">
                    <rect x="48" y="12" width="6" height="16" rx="3" fill="url(#ringGrad)"/>
                    <path d="M49 13.5 V24.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.9"/>
                    <ellipse cx="51" cy="27" rx="3" ry="1.5" fill="#1E40AF" fill-opacity="0.35"/>
                  </g>
                  <g filter="url(#ringShadow)">
                    <rect x="63" y="12" width="6" height="16" rx="3" fill="url(#ringGrad)"/>
                    <path d="M64 13.5 V24.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.9"/>
                    <ellipse cx="66" cy="27" rx="3" ry="1.5" fill="#1E40AF" fill-opacity="0.35"/>
                  </g>
                  <g filter="url(#ringShadow)">
                    <rect x="77" y="12" width="6" height="16" rx="3" fill="url(#ringGrad)"/>
                    <path d="M78 13.5 V24.5" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" stroke-opacity="0.9"/>
                    <ellipse cx="80" cy="27" rx="3" ry="1.5" fill="#1E40AF" fill-opacity="0.35"/>
                  </g>

                  <!-- ================= 3D NOTIFICATION BELL BADGE ================= -->
                  <g filter="url(#bell3dShadow)">
                    <circle cx="86" cy="74" r="18" fill="url(#bellBadgeGrad)" stroke="#FFFFFF" stroke-width="3.5"/>
                    <circle cx="84" cy="71" r="13" fill="none" stroke="#FFFFFF" stroke-width="0.8" stroke-opacity="0.3"/>
                    <circle cx="86" cy="62.5" r="1.5" fill="#FFFFFF"/>
                    <path d="M86 63.8 C83.2 63.8 81 66 81 68.8 V73 L78.8 75.2 C78.3 75.7 78.6 76.5 79.3 76.5 H92.7 C93.4 76.5 93.7 75.7 93.2 75.2 L91 73 V68.8 C91 66 88.8 63.8 86 63.8 Z" fill="#FFFFFF"/>
                    <path d="M84.2 77.5 C84.5 78.5 85.2 79.2 86 79.2 C86.8 79.2 87.5 78.5 87.8 77.5 H84.2 Z" fill="#FFFFFF"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>\n\n          <!-- MONTH FILTER PILL TABS -->`;

// 3. Global CSS rules update:
// Add :not(.has-hc-header):not(:has(.hc-header-banner))
// Add .screen.has-hc-header, .screen:has(.hc-header-banner)
// Add .hc-header-banner to banner resets
function updateGlobalStyles(content) {
  // Update .screen:not(...) selector
  content = content.replace(
    /\.screen:not\(\.neumorphic-login-screen\):not\(\.has-dash-header\):not\(:has\(\.dash-header\)\):not\(\.has-al-header\):not\(:has\(\.al-header-banner\)\):not\(\.has-perm-header\):not\(:has\(\.perm-header-banner\)\):not\(\.has-profile-header\):not\(:has\(\.profile-header-banner\)\):not\(\.has-notif-header\):not\(:has\(\.notif-header-banner\)\):not\(\.has-mr-header\):not\(:has\(\.mr-header-banner\)\):not\(\.has-lb-header\):not\(:has\(\.lb-header-banner\)\)/g,
    '.screen:not(.neumorphic-login-screen):not(.has-dash-header):not(:has(.dash-header)):not(.has-al-header):not(:has(.al-header-banner)):not(.has-perm-header):not(:has(.perm-header-banner)):not(.has-profile-header):not(:has(.profile-header-banner)):not(.has-notif-header):not(:has(.notif-header-banner)):not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner)):not(.has-hc-header):not(:has(.hc-header-banner))'
  );

  // Update .screen:has(.lb-header-banner) block with hc-header
  content = content.replace(
    /\.screen\.has-lb-header,\s*\.screen:has\(\.lb-header-banner\)\s*\{\s*height:\s*844px\s*!important;\s*padding-top:\s*0\s*!important;\s*\}/g,
    `.screen.has-lb-header,
            .screen:has(.lb-header-banner),
            .screen.has-hc-header,
            .screen:has(.hc-header-banner) {
              height: 844px !important;
              padding-top: 0 !important;
            }`
  );

  // Update banner reset list
  content = content.replace(
    /\.mr-header-banner,\s*\.lb-header-banner\s*\{\s*margin-top:\s*0\s*!important;/g,
    `.mr-header-banner,
            .lb-header-banner,
            .hc-header-banner {
              margin-top: 0 !important;`
  );

  return content;
}

// 4. Update the four primary HTML files
const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(relPath => {
  const fullPath = path.join(ROOT, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Verify template exists
  const tplIdx = content.indexOf('id="tpl-HolidayCalendar"');
  if (tplIdx === -1) {
    console.error('Template not found in:', relPath);
    return;
  }
  const nextTplIdx = content.indexOf('id="tpl-Notifications"', tplIdx);
  let tplContent = content.slice(tplIdx, nextTplIdx);

  // Replace CSS
  const cssStart = tplContent.indexOf(OLD_CSS_START);
  const cssEnd = tplContent.indexOf(OLD_CSS_END);
  if (cssStart !== -1 && cssEnd !== -1) {
    tplContent = tplContent.slice(0, cssStart) + NEW_CSS + tplContent.slice(cssEnd + OLD_CSS_END.length);
    console.log(`Replaced CSS in ${relPath}`);
  } else {
    console.warn(`Could not find exact CSS anchors in ${relPath}`);
  }

  // Replace HTML
  const htmlStart = tplContent.indexOf(OLD_HTML_START);
  const htmlEnd = tplContent.indexOf(OLD_HTML_END);
  if (htmlStart !== -1 && htmlEnd !== -1) {
    tplContent = tplContent.slice(0, htmlStart) + NEW_HTML + tplContent.slice(htmlEnd + OLD_HTML_END.length);
    console.log(`Replaced HTML in ${relPath}`);
  } else {
    console.warn(`Could not find exact HTML anchors in ${relPath}`);
  }

  content = content.slice(0, tplIdx) + tplContent + content.slice(nextTplIdx);

  // Update global styles in the file
  content = updateGlobalStyles(content);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Successfully updated ${relPath}`);
});

// 5. Update EmergereApp/EmergereApp/preview/base.css
const baseCssPath = path.join(ROOT, 'EmergereApp/EmergereApp/preview/base.css');
if (fs.existsSync(baseCssPath)) {
  let baseCss = fs.readFileSync(baseCssPath, 'utf8');
  baseCss = baseCss.replace(
    /\.screen:has\(\.lb-header-banner\),\s*\.screen\.has-lb-header\s*\{\s*padding-top:\s*0\s*!important;\s*\}/g,
    `.screen:has(.lb-header-banner),
.screen.has-lb-header,
.screen:has(.hc-header-banner),
.screen.has-hc-header {
  padding-top: 0 !important;
}`
  );
  baseCss = baseCss.replace(
    /\.mr-header-banner,\s*\.lb-header-banner\s*\{\s*margin-top:\s*0\s*!important;/g,
    `.mr-header-banner,
.lb-header-banner,
.hc-header-banner {
  margin-top: 0 !important;`
  );
  fs.writeFileSync(baseCssPath, baseCss, 'utf8');
  console.log('Successfully updated preview/base.css');
}

// 6. Update HolidayCalendar standalone preview.html and preview.css
const hcPreviewHtmlPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.html');
if (fs.existsSync(hcPreviewHtmlPath)) {
  let hcHtml = fs.readFileSync(hcPreviewHtmlPath, 'utf8');
  const hStart = hcHtml.indexOf('<div class="device">\n  <div class="screen">\n    <!-- HEADER BANNER -->\n    <div class="hc-header-banner">');
  const hEnd = hcHtml.indexOf('<!-- MONTH FILTER PILL TABS -->');
  if (hStart !== -1 && hEnd !== -1) {
    hcHtml = hcHtml.slice(0, hStart) + NEW_HTML + hcHtml.slice(hEnd + OLD_HTML_END.length);
    fs.writeFileSync(hcPreviewHtmlPath, hcHtml, 'utf8');
    console.log('Successfully updated HolidayCalendar/preview.html');
  } else {
    console.warn('Could not find anchors in HolidayCalendar/preview.html');
  }
}

const hcPreviewCssPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.css');
if (fs.existsSync(hcPreviewCssPath)) {
  let hcCss = fs.readFileSync(hcPreviewCssPath, 'utf8');
  const cStart = hcCss.indexOf('/* Header Card Banner matching Image 2 */');
  const cEnd = hcCss.indexOf('/* Horizontally Scrollable Month Filter Pill Tabs */');
  if (cStart !== -1 && cEnd !== -1) {
    hcCss = hcCss.slice(0, cStart) + NEW_CSS.slice(NEW_CSS.indexOf('/* Header Card Banner matching Image 2 */')) + hcCss.slice(cEnd + OLD_CSS_END.length);
    fs.writeFileSync(hcPreviewCssPath, hcCss, 'utf8');
    console.log('Successfully updated HolidayCalendar/preview.css');
  } else {
    console.warn('Could not find anchors in HolidayCalendar/preview.css');
  }
}

console.log('All Holiday Calendar files updated successfully!');
