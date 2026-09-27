const { decodePng } = require('./png_utils.js');
const img = decodePng('scratch/extracted_la_banner.png');

console.log('LA banner size:', img.width, 'x', img.height);
let minX = 999, maxX = 0, minY = 999, maxY = 0;
for (let y = 0; y < img.height; y++) {
  for (let x = 100; x < 400; x++) {
    const idx = (y * img.width + x) * 4;
    const r = img.pixels[idx], g = img.pixels[idx+1], b = img.pixels[idx+2];
    if (r > 150 && g > 180 && b > 230) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log('LA Banner text area: x=' + minX + '..' + maxX + ', y=' + minY + '..' + maxY);
