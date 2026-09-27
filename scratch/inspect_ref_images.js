const { decodePng } = require('./png_utils.js');
const fs = require('fs');

const img3 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505695484.png');
const img4 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505700693.png');

console.log('Image 3:', img3.width, 'x', img3.height);
console.log('Image 4:', img4.width, 'x', img4.height);

// Header banner in Image 3
// Find where blue ends vertically across x=100..400
let maxBlueY = 0;
for (let x = 0; x < img3.width; x += 10) {
  for (let y = 0; y < 200; y++) {
    const idx = (y * img3.width + x) * 4;
    const r = img3.pixels[idx], g = img3.pixels[idx+1], b = img3.pixels[idx+2];
    if (b > 180 && r < 120) {
      if (y > maxBlueY) maxBlueY = y;
    }
  }
}
console.log('Max blue Y in Image 3 header:', maxBlueY);

// Check bottom nav in Image 3 (around y=900..1024)
let bottomNavStart = 1024;
for (let y = 880; y < 1024; y++) {
  const idx = (y * img3.width + 50) * 4;
  const r = img3.pixels[idx], g = img3.pixels[idx+1], b = img3.pixels[idx+2];
  // Nav bar has white background
  if (r > 250 && g > 250 && b > 250) {
    if (y < bottomNavStart) bottomNavStart = y;
  }
}
console.log('Bottom nav start around y:', bottomNavStart);
