const { decodePng } = require('./png_utils.js');
const fs = require('fs');

const img3 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505695484.png');
const img4 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505700693.png');

console.log('Image 3:', img3.width, 'x', img3.height);
console.log('Image 4:', img4.width, 'x', img4.height);

// Vertical profile of Image 3 (Leave Approvals)
console.log('\nImage 3 vertical profile (x=281, middle of screen):');
for (let y = 0; y < img3.height; y += 40) {
  const idx = (y * img3.width + 281) * 4;
  console.log(`y=${y}: rgb(${img3.pixels[idx]}, ${img3.pixels[idx+1]}, ${img3.pixels[idx+2]})`);
}

// Find header banner bounds in Image 3
let headerBottom = 0;
for (let y = 0; y < 250; y++) {
  const idx = (y * img3.width + 281) * 4;
  const b = img3.pixels[idx+2], r = img3.pixels[idx];
  if (b > 180 && r < 100) {
    headerBottom = y;
  }
}
console.log('\nHeader banner bottom in Image 3: y=' + headerBottom);

// Find tab bar bounds in Image 3
let tabStart = 0, tabEnd = 0;
for (let y = headerBottom; y < headerBottom + 150; y++) {
  const idx = (y * img3.width + 281) * 4;
  const r = img3.pixels[idx], g = img3.pixels[idx+1], b = img3.pixels[idx+2];
  // Tab bar in middle has white or light color
  if (r > 240 && g > 240 && b > 240) {
    if (tabStart === 0) tabStart = y;
    tabEnd = y;
  }
}
console.log(`Tab bar bounds in Image 3: y=${tabStart}..${tabEnd} (h=${tabEnd - tabStart})`);
