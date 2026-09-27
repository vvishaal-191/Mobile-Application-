const fs = require('fs');

const c = fs.readFileSync('preview_app.html', 'utf8');
const laIdx = c.indexOf('id="la-header-banner"');
const match = c.substring(laIdx, laIdx + 1000).match(/src="data:image\/png;base64,([^"]+)"/);
if (match) {
  const buf = Buffer.from(match[1], 'base64');
  console.log('LA banner:', buf.readUInt32BE(16), 'x', buf.readUInt32BE(20));
}
