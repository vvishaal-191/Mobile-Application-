const fs = require('fs');

const transparentLen = 153446;
const loginLen = 129778;

const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(file => {
  console.log(`\n=== Checking: ${file} ===`);
  const content = fs.readFileSync(file, 'utf8');
  const imgs = content.match(/<img[^>]+>/g) || [];
  console.log(`Total <img> tags: ${imgs.length}`);

  let transparentCount = 0;
  let loginCount = 0;
  let otherCount = 0;

  imgs.forEach((img, i) => {
    const srcMatch = img.match(/src="(data:image\/png;base64,[^"]+)"/);
    if (!srcMatch) {
      console.log(`  Img ${i+1}: No base64 src! ${img.slice(0, 50)}`);
      return;
    }
    const src = srcMatch[1];
    const clsMatch = img.match(/class="([^"]+)"/);
    const cls = clsMatch ? clsMatch[1] : 'none';

    if (src.length === loginLen) {
      loginCount++;
      console.log(`  Img ${i+1} [LOGIN LOGO]: class="${cls}"`);
      if (cls !== 'login-logo') {
        console.error(`  ERROR: Login logo found in unexpected element with class "${cls}"!`);
      }
    } else if (src.length === transparentLen) {
      transparentCount++;
      // console.log(`  Img ${i+1} [TRANSPARENT]: class="${cls}"`);
    } else {
      otherCount++;
      console.log(`  Img ${i+1} [OTHER LEN ${src.length}]: class="${cls}"`);
    }
  });

  console.log(`Summary for ${file}: Transparent logos = ${transparentCount} (expected 16), Login logo = ${loginCount} (expected 1), Other = ${otherCount}`);
  if (loginCount === 1 && transparentCount === 16 && otherCount === 0) {
    console.log('✓ PASS: Perfect distribution! Second image is ONLY on the Login page, and First image is across all other 16 pages.');
  } else {
    console.error('✗ FAIL: Distribution mismatch!');
  }
});
