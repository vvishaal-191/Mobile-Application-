const fs = require('fs');

// 1. Update ApplyPermissionScreen.styles.js
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const oldStylesRegex = /\/\* Dropdown Calendar Card directly below Date Field \(Image 1 Design\) \*\/[\s\S]*?\}\);?/;
const newCompactStyles = `/* Dropdown Calendar Card directly below Date Field (Compact Image 1 Design) */
  calendarDropdownCard: {
    marginTop: 6,
    width: 224,
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  calMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  calMonthYearText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  calCaret: {
    marginTop: 1,
    marginLeft: 1,
  },
  calNavArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calArrowBtn: {
    padding: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calWeekDayText: {
    width: 26,
    textAlign: 'center',
    fontSize: 11.5,
    fontWeight: '600',
    color: '#111827',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 2,
  },
  calDayCell: {
    width: 26,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginVertical: 1,
  },
  calDayCellSelected: {
    backgroundColor: '#0066FF',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 2,
  },
  calDayCellToday: {
    borderWidth: 1,
    borderColor: '#71717A',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  calDayText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  calDayTextMuted: {
    color: '#94A3B8',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calDayTextToday: {
    color: '#111827',
    fontWeight: '600',
  },
  calFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 2,
    paddingHorizontal: 2,
  },
  calFooterLink: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0070F3',
  },
});`;

stylesContent = stylesContent.replace(oldStylesRegex, newCompactStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');

// 2. Compact CSS for Web
const compactCalCss = `
        /* Compact Calendar Dropdown directly below Date Field (Image 1 Design) */
        .perm-calendar-dropdown {
          display: none;
          width: 224px;
          margin-top: 6px;
          margin-left: auto;
          margin-right: 0;
          background: #FFFFFF;
          border-radius: 6px;
          border: 1px solid #D1D5DB;
          padding: 10px 10px 8px 10px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          user-select: none;
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
  const oldCssRegex = /\/\* Calendar Dropdown directly below Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
  if (oldCssRegex.test(tpl)) {
    tpl = tpl.replace(oldCssRegex, compactCalCss.trim());
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
const oldStandCssRegex = /\/\* Calendar Dropdown directly below Date Field[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
if (oldStandCssRegex.test(standCss)) {
  standCss = standCss.replace(oldStandCssRegex, compactCalCss.trim());
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);
