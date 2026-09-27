const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const match = content.match(/id="pa-header-banner"[\s\S]*?<img src="data:image\/png;base64,([^"']+)"/);
if (match) {
  const buf = Buffer.from(match[1], 'base64');
  console.log('Buffer len:', buf.length);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  console.log('Image dimensions:', w, 'x', h);
  fs.writeFileSync('scratch/extracted_pa_banner.png', buf);
} else {
  console.log('No match');
}
