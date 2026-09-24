const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    allPassed = false;
  } else {
    console.log('PASS:', message);
  }
}

files.forEach(file => {
  console.log(`\n--- Auditing ${file} ---`);
  const content = fs.readFileSync(file, 'utf8');

  // 1. Check template exists
  assert(content.includes('<template id="tpl-LeaveBalance">'), `${file} has tpl-LeaveBalance`);

  // Extract template
  const start = content.indexOf('<template id="tpl-LeaveBalance">');
  const end = content.indexOf('</template>', start);
  const tpl = content.slice(start, end);

  // 2. Check device style in template
  assert(tpl.includes('max-width: 440px;'), `${file} tpl has max-width: 440px for device`);
  assert(!tpl.includes('max-width: 390px;'), `${file} tpl does NOT have max-width: 390px`);
  assert(tpl.includes('min-width: 769px'), `${file} tpl uses min-width: 769px media query`);
  assert(!tpl.includes('min-width: 480px'), `${file} tpl does NOT use min-width: 480px media query`);

  // 3. Check header banner style in template
  assert(tpl.includes('width: 100% !important;'), `${file} tpl has width: 100% !important on lb-header-banner`);
  assert(tpl.includes('border-top-left-radius: 0 !important;'), `${file} tpl has border-top-left-radius: 0 !important on lb-header-banner`);
  assert(tpl.includes('border-top-right-radius: 0 !important;'), `${file} tpl has border-top-right-radius: 0 !important on lb-header-banner`);
  assert(tpl.includes('border-bottom-left-radius: 28px;'), `${file} tpl has border-bottom-left-radius: 28px; on lb-header-banner`);
  assert(tpl.includes('border-bottom-right-radius: 28px;'), `${file} tpl has border-bottom-right-radius: 28px; on lb-header-banner`);

  // 4. Check screen style in template
  assert(tpl.includes('padding-top: 0 !important;'), `${file} tpl has padding-top: 0 !important on .screen`);

  // 5. Check global style overrides
  assert(content.includes(':not(.has-lb-header):not(:has(.lb-header-banner))'), `${file} excludes has-lb-header and lb-header-banner from 16px padding-top rule`);
  assert(content.includes('.screen.has-lb-header,\n            .screen:has(.lb-header-banner)'), `${file} includes has-lb-header in padding-top: 0 rule`);
  assert(content.includes('.mr-header-banner,\n            .lb-header-banner {'), `${file} includes lb-header-banner in margin/radius reset rule`);
});

// Audit preview/base.css
console.log('\n--- Auditing EmergereApp/EmergereApp/preview/base.css ---');
const baseCss = fs.readFileSync('EmergereApp/EmergereApp/preview/base.css', 'utf8');
assert(baseCss.includes('.screen:has(.lb-header-banner)'), 'base.css includes .screen:has(.lb-header-banner)');
assert(baseCss.includes('.screen.has-lb-header'), 'base.css includes .screen.has-lb-header');
assert(baseCss.includes('.lb-header-banner'), 'base.css includes .lb-header-banner');

// Audit src/screens/LeaveBalance/preview.css
console.log('\n--- Auditing EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.css ---');
const prevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.css', 'utf8');
assert(prevCss.includes('.screen:has(.lb-header-banner)'), 'preview.css includes .screen:has(.lb-header-banner)');
assert(prevCss.includes('.screen.has-lb-header'), 'preview.css includes .screen.has-lb-header');
assert(prevCss.includes('width: 100% !important;'), 'preview.css has width: 100% !important on lb-header-banner');
assert(prevCss.includes('border-top-left-radius: 0 !important;'), 'preview.css has border-top-left-radius: 0 !important');
assert(prevCss.includes('border-top-right-radius: 0 !important;'), 'preview.css has border-top-right-radius: 0 !important');

console.log('\nFinal result:', allPassed ? 'ALL AUDITS PASSED ✅' : 'SOME AUDITS FAILED ❌');
