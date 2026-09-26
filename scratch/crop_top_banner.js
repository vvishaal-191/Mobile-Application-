const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'perfect_header_banner.png'));

// Crop y from 8 to 128 (height = 120)
const w = img.width;
const startY = 8;
const h = img.height - startY;

const out = Buffer.alloc(w * h * 4);
for (let y = 0; y < h; y++) {
  const srcY = startY + y;
  const srcOffset = srcY * w * 4;
  const dstOffset = y * w * 4;
  img.pixels.copy(out, dstOffset, srcOffset, srcOffset + w * 4);
}

fs.writeFileSync(path.join(__dirname, 'clean_perfect_banner.png'), encodePng(w, h, out));
console.log('Saved clean_perfect_banner.png, size:', w, 'x', h);
