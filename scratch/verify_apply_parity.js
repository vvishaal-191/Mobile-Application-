const fs = require('fs');

const files = [
  'index.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

console.log('====================================================');
console.log('APPLY PERMISSION vs APPLY LEAVE PARITY AUDIT');
console.log('====================================================\n');

files.forEach(f => {
  console.log(`Checking ${f}:`);
  const rawContent = fs.readFileSync(f, 'utf8');
  const content = rawContent.replace(/\r\n/g, '\n');

  const leaveStart = content.indexOf('<template id="tpl-ApplyLeave">');
  const leaveEnd = content.indexOf('</template>', leaveStart);
  const leaveTpl = content.substring(leaveStart, leaveEnd);

  const permStart = content.indexOf('<template id="tpl-ApplyPermission">');
  const permEnd = content.indexOf('</template>', permStart);
  const permTpl = content.substring(permStart, permEnd);

  // Check 1: Body height, display flex, overflow hidden
  const bodyHasHeight = permTpl.includes('height: 100vh;') && permTpl.includes('height: 100dvh;') && permTpl.includes('overflow: hidden;');
  console.log('  1. Body height & overflow hidden:', bodyHasHeight ? 'PASS' : 'FAIL');

  // Check 2: Device max-width 440px, height 100vh/100dvh, flex-direction column, overflow hidden
  const deviceMatches = permTpl.includes('max-width: 440px;') && permTpl.includes('height: 100vh;') && permTpl.includes('flex-direction: column;') && permTpl.includes('overflow: hidden;');
  console.log('  2. Device container matching dimensions:', deviceMatches ? 'PASS' : 'FAIL');

  // Check 3: Desktop media query height 844px
  const mediaMatches = permTpl.includes('@media (min-width: 769px)') && permTpl.includes('height: 844px;');
  console.log('  3. Desktop 844px media query:', mediaMatches ? 'PASS' : 'FAIL');

  // Check 4: Screen flex: 1, overflow-y: auto, padding-bottom: 90px
  const screenMatches = permTpl.includes('flex: 1;') && permTpl.includes('overflow-y: auto;') && permTpl.includes('padding-bottom: 90px;');
  console.log('  4. Screen scrollable container & padding-bottom: 90px:', screenMatches ? 'PASS' : 'FAIL');

  // Check 5: Bottom nav position: absolute, height: 68px
  const navStyleMatch = permTpl.match(/\.bottom-nav\s*\{([\s\S]*?)\}/);
  const navStyle = navStyleMatch ? navStyleMatch[1] : '';
  const navMatches = navStyle.includes('position: absolute;') && navStyle.includes('height: 68px;') && !navStyle.includes('display: none');
  console.log('  5. Bottom nav styling & visibility:', navMatches ? 'PASS' : 'FAIL');

  // Check 6: Screen closed before bottom-nav
  const screenCloseIndex = permTpl.indexOf('</div>\n        </div>\n\n        <!-- Bottom Navigation Bar -->');
  console.log('  6. Screen container closes before bottom nav:', screenCloseIndex !== -1 ? 'PASS' : 'FAIL');

  // Check 7: No perm-bottom-spacer
  const noSpacer = !permTpl.includes('perm-bottom-spacer');
  console.log('  7. No artificial bottom spacer div:', noSpacer ? 'PASS' : 'FAIL');
  console.log('');
});

// React Native checks
const rnPermStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js', 'utf8');
const rnLeaveStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyLeave/ApplyLeaveScreen.styles.js', 'utf8');

console.log('Checking React Native Styles:');
const rnPermPadding = rnPermStyles.match(/scrollContent:\s*\{\s*paddingBottom:\s*(\d+),/);
const rnLeavePadding = rnLeaveStyles.match(/scrollContent:\s*\{\s*paddingBottom:\s*(\d+),/);
console.log('  ApplyPermission paddingBottom:', rnPermPadding ? rnPermPadding[1] : 'not found');
console.log('  ApplyLeave paddingBottom:', rnLeavePadding ? rnLeavePadding[1] : 'not found');
console.log('  RN Padding matches:', rnPermPadding && rnLeavePadding && rnPermPadding[1] === rnLeavePadding[1] ? 'PASS' : 'FAIL');

// Preview CSS checks
const prevPermCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css', 'utf8');
const prevLeaveCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyLeave/preview.css', 'utf8');

console.log('\nChecking Screen Preview CSS:');
const prevPermPad = prevPermCss.match(/padding-bottom:\s*(\d+px);/);
const prevLeavePad = prevLeaveCss.match(/padding-bottom:\s*(\d+px);/);
console.log('  ApplyPermission preview.css padding-bottom:', prevPermPad ? prevPermPad[1] : 'not found');
console.log('  ApplyLeave preview.css padding-bottom:', prevLeavePad ? prevLeavePad[1] : 'not found');
console.log('  Preview CSS Padding matches:', prevPermPad && prevLeavePad && prevPermPad[1] === prevLeavePad[1] ? 'PASS' : 'FAIL');
