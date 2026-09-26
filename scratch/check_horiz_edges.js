const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'clean_perfect_banner.png'));

// Check columns at y = 40 (middle height)
for (let x = 0; x < 20; x++) {
  const p = (40 * img.width + x) * 4;
  console.log(`x=${x}: (${img.pixels[p]},${img.pixels[p+1]},${img.pixels[p+2]})`);
}
for (let x = img.width - 20; x < img.width; x++) {
  const p = (40 * img.width + x) * 4;
  console.log(`x=${x}: (${img.pixels[p]},${img.pixels[p+1]},${img.pixels[p+2]})`);
}
