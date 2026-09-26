const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434238593.png';
const img = decodePng(imgPath);

// Crop the banner
// Image bounds: width 641, height 128
// Let's inspect the entire image
const w = img.width;
const h = img.height;
const pixels = Buffer.alloc(w * h * 4);
img.pixels.copy(pixels);

// Any pixel in the top corners (or along top border) where r ~ 70, g ~ 90, b ~ 75 (dark outside)
// or r < 40, g < 40, b < 40 should be replaced with the blue of the banner: [0, 102, 233, 255]
for (let y = 0; y < 35; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    
    // Dark window border or green reflection outside the device
    if (b < 150 || (r > 60 && g > 80 && b < 100)) {
      // Sample a clean blue pixel from the same row near the middle
      const sampleX = Math.min(Math.max(x, 60), w - 60);
      const sampleIdx = (y * w + sampleX) * 4;
      pixels[idx] = pixels[sampleIdx];
      pixels[idx + 1] = pixels[sampleIdx + 1];
      pixels[idx + 2] = pixels[sampleIdx + 2];
      pixels[idx + 3] = 255;
    }
  }
}

// Let's also check row 0 to 8:
// If row 0 to 8 has top border artifacts, let's see if we crop starting from y=6
let startY = 0;
// Check if row 0 has any dark pixels left
fs.writeFileSync(path.join(__dirname, 'perfect_header_banner.png'), encodePng(w, h, pixels));
console.log('Saved perfect_header_banner.png');
