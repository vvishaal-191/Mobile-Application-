const { decodePng } = require('./png_utils.js');
const img = decodePng('scratch/extracted_pa_banner.png');

console.log('Banner size:', img.width, 'x', img.height);
// Look for white / light arrow or circle around x=20..80, y=20..80
let minX = 999, maxX = 0, minY = 999, maxY = 0;
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < 120; x++) {
    const idx = (y * img.width + x) * 4;
    const r = img.pixels[idx], g = img.pixels[idx+1], b = img.pixels[idx+2];
    // Arrow or circle has lighter pixels (e.g. translucent white or white icon)
    if (r > 100 && g > 150 && b > 230) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log(`Arrow/circle area in banner: x=${minX}..${maxX}, y=${minY}..${maxY}`);
