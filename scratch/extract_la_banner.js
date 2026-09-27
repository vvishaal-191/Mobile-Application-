const fs = require('fs');

const c = fs.readFileSync('preview_app.html', 'utf8');
const idx = c.indexOf('id="la-header-banner"');
const match = c.substring(idx, idx + 1000).match(/src="data:image\/png;base64,([^"]+)"/);
// The base64 is longer, so extract from src="data:image/png;base64, to next "
const srcStart = c.indexOf('src="data:image/png;base64,', idx) + 'src="data:image/png;base64,'.length;
const srcEnd = c.indexOf('"', srcStart);
const b64 = c.substring(srcStart, srcEnd);
const buf = Buffer.from(b64, 'base64');
console.log('LA banner saved, len:', buf.length);
fs.writeFileSync('scratch/extracted_la_banner.png', buf);
