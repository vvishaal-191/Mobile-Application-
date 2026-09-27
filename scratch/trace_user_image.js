const { decodePng } = require('./png_utils.js');
const img = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790500240478.png');

console.log('Image dimensions:', img.width, 'x', img.height);

// Find first blue pixel in each column:
console.log('First blue y for various x:');
for (let x = 0; x < img.width; x += 30) {
  let firstBlueY = -1;
  for (let y = 0; y < img.height; y++) {
    const idx = (y * img.width + x) * 4;
    const r = img.pixels[idx], g = img.pixels[idx+1], b = img.pixels[idx+2];
    if (b > 180 && r < 100) {
      firstBlueY = y;
      break;
    }
  }
  console.log(`x=${x}: firstBlueY=${firstBlueY}`);
}
