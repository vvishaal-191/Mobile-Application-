const fs = require('fs');

console.log('=== VERIFYING PERMISSION APPROVALS FIX ===\n');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const paIdx = c.indexOf('id="tpl-PermissionApprovals"');
  if (paIdx === -1) {
    console.error(`[FAIL] ${f}: tpl-PermissionApprovals not found!`);
    return;
  }
  const paEnd = c.indexOf('</template>', paIdx);
  const tpl = c.substring(paIdx, paEnd);

  // Check screen tag
  const hasScreen = tpl.includes('<div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">');
  // Check banner tag
  const hasBanner = tpl.includes('<div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">');
  // Check back button inline style
  const hasBtn = tpl.includes('style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"');
  // Check banner image inline style
  const hasImg = tpl.includes('style="width: 100%; height: auto; display: block;"');

  console.log(`${f}:`);
  console.log('  Screen tag updated:', hasScreen);
  console.log('  Banner tag updated:', hasBanner);
  console.log('  Back button style updated:', hasBtn);
  console.log('  Banner image style updated:', hasImg);

  // Check injected styles
  const hasNotPa = c.includes(':not(.has-pa-header):not(:has(.pa-header-banner-wrap))');
  const hasZeroPad = c.includes('.screen.has-pa-header');
  const hasZeroMarg = c.includes('.pa-header-banner-wrap,');
  console.log('  Injected :not excludes PA:', hasNotPa);
  console.log('  Injected zero padding includes PA:', hasZeroPad);
  console.log('  Injected zero margin includes PA:', hasZeroMarg);
});

// Check standalone preview.html
const stand = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';
const standC = fs.readFileSync(stand, 'utf8');
const standScreen = standC.includes('<div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">');
const standBanner = standC.includes('<div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">');
console.log(`\n${stand}:`);
console.log('  Screen tag updated:', standScreen);
console.log('  Banner tag updated:', standBanner);

// Check template equality across 4 files
function getPaTpl(filePath) {
  const c = fs.readFileSync(filePath, 'utf8');
  const start = c.indexOf('<template id="tpl-PermissionApprovals">');
  const end = c.indexOf('</template>', start) + 11;
  return c.substring(start, end);
}

const t0 = getPaTpl(files[0]);
let allMatch = true;
for (let i = 1; i < files.length; i++) {
  if (t0 !== getPaTpl(files[i])) {
    allMatch = false;
    console.error(`Diff between ${files[0]} and ${files[i]}`);
  }
}
console.log('\nAll 4 app HTML files have 100% identical tpl-PermissionApprovals:', allMatch);
