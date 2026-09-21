const fs = require('fs');

function inspectFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const imgs = content.match(/<img[^>]+>/g) || [];
  console.log(`\n=== File: ${filePath} ===`);
  console.log(`Total <img>: ${imgs.length}`);
  imgs.forEach((img, i) => {
    const src = (img.match(/src="([^"]+)"/) || [])[1] || '';
    const cls = (img.match(/class="([^"]+)"/) || [])[1] || '';
    console.log(`  ${i + 1}. class="${cls}" srcLen=${src.length} src="${src.slice(0, 40)}..."`);
  });
}

inspectFile('index.html');
inspectFile('preview_app.html');
inspectFile('EmergereApp/EmergereApp/index.html');
inspectFile('EmergereApp/EmergereApp/preview_app.html');
