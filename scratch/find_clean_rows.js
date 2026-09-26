const fs = require('fs');
const path = require('path');
const { decodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'clean_header_banner.png'));

for (let y = 0; y < 30; y++) {
  const p0 = y * img.width * 4;
  const pEnd = (y * img.width + img.width - 1) * 4;
  console.log(`y=${y}: left=(${img.pixels[p0]},${img.pixels[p0+1]},${img.pixels[p0+2]}) right=(${img.pixels[pEnd]},${img.pixels[pEnd+1]},${img.pixels[pEnd+2]})`);
}
