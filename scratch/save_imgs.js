const fs = require('fs');

const content = fs.readFileSync('scratch/leave_approvals_template.html', 'utf8');

const imgMatches = [...content.matchAll(/src="(data:image\/[^;]+;base64,[^"]+)"/g)];
console.log('Found', imgMatches.length, 'images in template');

imgMatches.forEach((m, idx) => {
  const dataUri = m[1];
  const commaIdx = dataUri.indexOf(',');
  const b64 = dataUri.substring(commaIdx + 1);
  const ext = dataUri.includes('image/png') ? 'png' : (dataUri.includes('image/svg') ? 'svg' : 'jpg');
  const filename = `scratch/tpl_img_${idx}.${ext}`;
  fs.writeFileSync(filename, Buffer.from(b64, 'base64'));
  console.log(`Saved ${filename}, size: ${Buffer.from(b64, 'base64').length} bytes`);
});
