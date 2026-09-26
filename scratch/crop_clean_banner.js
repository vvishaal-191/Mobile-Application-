const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434238593.png';
const img = decodePng(imgPath);

function crop(src, x, y, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let row = 0; row < h; row++) {
    const srcRow = y + row;
    if (srcRow >= 0 && srcRow < src.height) {
      const srcOffset = (srcRow * src.width + x) * 4;
      const dstOffset = (row * w) * 4;
      src.pixels.copy(out, dstOffset, srcOffset, srcOffset + w * 4);
    }
  }
  return { width: w, height: h, pixels: out };
}

// Exact header banner:
// x: 1, y: 12, width: 634, height: 107
const banner = crop(img, 1, 12, 634, 107);
fs.writeFileSync(path.join(__dirname, 'clean_header_banner.png'), encodePng(banner.width, banner.height, banner.pixels));
console.log('Saved clean_header_banner.png');
