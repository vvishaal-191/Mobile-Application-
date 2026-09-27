const { decodePng, encodePng } = require('./png_utils.js');
const fs = require('fs');

const img3 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505695484.png');
const img4 = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790505700693.png');

function crop(src, x1, y1, x2, y2) {
  const w = x2 - x1;
  const h = y2 - y1;
  const out = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcIdx = ((y1 + y) * src.width + (x1 + x)) * 4;
      const dstIdx = (y * w + x) * 4;
      out[dstIdx] = src.pixels[srcIdx];
      out[dstIdx+1] = src.pixels[srcIdx+1];
      out[dstIdx+2] = src.pixels[srcIdx+2];
      out[dstIdx+3] = src.pixels[srcIdx+3];
    }
  }
  return { width: w, height: h, pixels: out };
}

// 1. Check header in Image 3
// Where does the tab bar card start?
// Let's find the top edge of the tab bar card:
console.log('Scanning rows 80..150 for tab bar top edge:');
for (let y = 80; y <= 150; y += 5) {
  let whiteCount = 0;
  for (let x = 50; x < 500; x++) {
    const idx = (y * img3.width + x) * 4;
    const r = img3.pixels[idx], g = img3.pixels[idx+1], b = img3.pixels[idx+2];
    if (r > 245 && g > 245 && b > 245) whiteCount++;
  }
  console.log(`y=${y}: white pixels=${whiteCount}`);
}

// Check where tab bar ends (bottom edge of tab bar card)
console.log('Scanning rows 150..220 for tab bar bottom edge:');
for (let y = 150; y <= 220; y += 5) {
  let whiteCount = 0;
  for (let x = 50; x < 500; x++) {
    const idx = (y * img3.width + x) * 4;
    const r = img3.pixels[idx], g = img3.pixels[idx+1], b = img3.pixels[idx+2];
    if (r > 245 && g > 245 && b > 245) whiteCount++;
  }
  console.log(`y=${y}: white pixels=${whiteCount}`);
}
