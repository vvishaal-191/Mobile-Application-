const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'clean_perfect_banner.png'));

for (let y = 0; y < 15; y++) {
  const p1 = (y * img.width + 1) * 4;
  const p635 = (y * img.width + 635) * 4;
  console.log(`y=${y}: x=1:(${img.pixels[p1]},${img.pixels[p1+1]},${img.pixels[p1+2]}) x=635:(${img.pixels[p635]},${img.pixels[p635+1]},${img.pixels[p635+2]})`);
}
