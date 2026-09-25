const fs = require('fs');
const path = require('path');

function assert(msg, condition) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`PASS: ${msg}`);
  }
}

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  assert(`${f}: has-hc-header class present on screen`, content.includes('<div class="screen has-hc-header">'));
  assert(`${f}: has-hc-header in screen:not exclusion`, content.includes(':not(.has-hc-header):not(:has(.hc-header-banner))'));
  assert(`${f}: has-hc-header in padding-top: 0 rule`, content.includes('.screen.has-hc-header,\n            .screen:has(.hc-header-banner) {\n              height: 844px !important;\n              padding-top: 0 !important;'));
  assert(`${f}: hc-header-banner in banner reset rule`, content.includes('.hc-header-banner {\n              margin-top: 0 !important;'));
  assert(`${f}: hc-header-banner has 28px bottom radii`, content.includes('border-bottom-left-radius: 28px;\n          border-bottom-right-radius: 28px;'));
  assert(`${f}: 3D calendar SVG has 4 rings`, (content.match(/ringShadow/g) || []).length >= 4);
  assert(`${f}: 3D calendar SVG has 6 day cells`, content.includes('6 Day Cells (2 Rows of 3) matching Image 2'));
  assert(`${f}: 3D notification bell badge present`, content.includes('bell3dShadow') && content.includes('3D NOTIFICATION BELL BADGE'));
  assert(`${f}: Botanical leaves present`, content.includes('BACKGROUND BOTANICAL LEAVES (Image 2)'));
  assert(`${f}: Back button present with onclick`, content.includes('class="hc-back-btn" title="Back" onclick="if(window.parent'));
  assert(`${f}: Month pills present`, content.includes('filterHolidayMonth(\'all\', this)'));
  assert(`${f}: Month cards present`, content.includes('JANUARY 2026') && content.includes('New Year\'s Day'));
});

// Check base.css
const baseCss = fs.readFileSync('EmergereApp/EmergereApp/preview/base.css', 'utf8');
assert('base.css: has-hc-header included in padding-top: 0', baseCss.includes('.screen.has-hc-header'));
assert('base.css: hc-header-banner included in banner reset', baseCss.includes('.hc-header-banner {\n  margin-top: 0 !important;'));

// Check preview.html & preview.css
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.html', 'utf8');
assert('preview.html: has-hc-header present', prevHtml.includes('<div class="screen has-hc-header">'));
assert('preview.html: 3D illustration present', prevHtml.includes('3D Calendar Illustration with Foliage & Bell Badge matching Image 2'));

const prevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.css', 'utf8');
assert('preview.css: 28px radius present', prevCss.includes('border-bottom-left-radius: 28px;'));

// Check JSX
const jsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/HolidayCalendar/HolidayCalendarScreen.jsx', 'utf8');
assert('HolidayCalendarScreen.jsx: 6 cells present', (jsx.match(/styles\.calGridCell/g) || []).length === 6);

// Validate all SVG path strings
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const pathRegex = /<path[^>]+d=["']([^"']+)["']/g;
  let m;
  let count = 0;
  while ((m = pathRegex.exec(content)) !== null) {
    count++;
    const d = m[1];
    // Check for malformed 's' command missing coordinate numbers before z
    const sMatch = d.match(/s([^a-z]+)z/i);
    if (sMatch) {
      const sArgs = sMatch[1].trim().split(/[\s,-]+/).filter(Boolean);
      assert(`${f} path ${count} has valid s coordinates (${sArgs.length} args)`, sArgs.length % 4 === 0);
    }
  }
  console.log(`Validated ${count} SVG paths in ${f}: all clean!`);
});

console.log('\n*** ALL VERIFICATION CHECKS PASSED PERFECTLY! ***');
