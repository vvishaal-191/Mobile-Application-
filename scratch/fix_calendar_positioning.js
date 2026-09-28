const fs = require('fs');

// 1. UPDATE ApplyPermissionScreen.styles.js
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const oldRNCardStyles = /calendarDropdownCard:\s*\{[^}]+\},/;
const newRNCardStyles = `calendarDropdownCard: {
    position: 'absolute',
    top: 80,
    right: 0,
    width: 224,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 1000,
  },`;

stylesContent = stylesContent.replace(oldRNCardStyles, newRNCardStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');

// 2. CSS for Web - Pop Down Relative to Calendar Icon
const correctCalCss = `
        /* Calendar Dropdown - Positioned Correctly Below Calendar Icon (Image 1 Design) */
        .perm-field-date {
          position: relative !important;
          z-index: 1000 !important;
        }

        .perm-calendar-dropdown {
          display: none;
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 6px;
          width: 224px;
          background: #FFFFFF;
          border-radius: 6px;
          border: 1px solid #D1D5DB;
          padding: 10px 10px 8px 10px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          box-sizing: border-box;
          user-select: none;
          z-index: 1000;
          animation: permCalFadeIn 0.15s ease-out;
        }

        .perm-calendar-dropdown.open {
          display: block;
        }

        @keyframes permCalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cal-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 0 2px;
        }

        .cal-month-selector {
          display: flex;
          align-items: center;
          gap: 3px;
          cursor: pointer;
        }

        .cal-month-title {
          font-size: 13px;
          font-weight: 700;
          color: #000000;
          letter-spacing: -0.2px;
        }

        .cal-caret-svg {
          color: #111827;
          margin-top: 1px;
          width: 10px;
          height: 10px;
        }

        .cal-nav-arrows {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cal-arrow-btn {
          background: transparent;
          border: none;
          color: #111827;
          padding: 1px 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .cal-arrow-btn svg {
          width: 15px;
          height: 15px;
        }

        .cal-arrow-btn:hover {
          background: #F1F5F9;
          color: #0066FF;
        }

        .cal-weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 4px;
        }

        .cal-weekdays-row span {
          font-size: 11.5px;
          font-weight: 600;
          color: #111827;
          padding: 1px 0;
        }

        .cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 2px;
          column-gap: 2px;
        }

        .cal-day-cell {
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11.5px;
          font-weight: 500;
          color: #111827;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.12s ease;
          box-sizing: border-box;
        }

        .cal-day-cell.muted {
          color: #94A3B8;
        }

        .cal-day-cell:hover:not(.selected) {
          background: #F1F5F9;
        }

        .cal-day-cell.today:not(.selected) {
          border: 1px solid #71717A;
          background: #FFFFFF;
          color: #111827;
          font-weight: 600;
        }

        .cal-day-cell.selected {
          background: #0066FF !important;
          border: 1.5px solid #000000 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }

        .cal-dropdown-footer {
          margin-top: 8px;
          padding-top: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 2px;
          padding-right: 2px;
        }

        .cal-footer-link {
          background: transparent;
          border: none;
          color: #0070F3;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 3px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .cal-footer-link:hover {
          color: #0051B3;
          background: #EFF6FF;
        }
`;

function updateHtmlBundle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ApplyPermission">');
  if (tplStart === -1) {
    console.error('tpl-ApplyPermission not found in ' + filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  let tpl = content.substring(tplStart, tplEnd + 11);

  // Replace CSS
  const oldCssRegex = /\/\* Calendar Dropdown - Opens Above Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
  if (oldCssRegex.test(tpl)) {
    tpl = tpl.replace(oldCssRegex, correctCalCss.trim());
  } else {
    const oldCssRegex2 = /\/\* Compact Calendar Dropdown directly below Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
    if (oldCssRegex2.test(tpl)) {
      tpl = tpl.replace(oldCssRegex2, correctCalCss.trim());
    }
  }

  content = content.substring(0, tplStart) + tpl + content.substring(tplEnd + 11);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

// Update the 4 html bundles
updateHtmlBundle('preview_app.html');
updateHtmlBundle('index.html');
updateHtmlBundle('EmergereApp/EmergereApp/preview_app.html');
updateHtmlBundle('EmergereApp/EmergereApp/index.html');

// Update standalone preview.css
const standaloneCssPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css';
let standCss = fs.readFileSync(standaloneCssPath, 'utf8');
const oldStandCssRegex = /\/\* Calendar Dropdown - Opens Above Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
if (oldStandCssRegex.test(standCss)) {
  standCss = standCss.replace(oldStandCssRegex, correctCalCss.trim());
} else {
  const oldStandCssRegex2 = /\/\* Compact Calendar Dropdown directly below Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
  if (oldStandCssRegex2.test(standCss)) {
    standCss = standCss.replace(oldStandCssRegex2, correctCalCss.trim());
  }
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);
