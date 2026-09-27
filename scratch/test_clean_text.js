const { decodePng, encodePng } = require('./png_utils.js');
const fs = require('fs');

// Test cleaning text area in PA banner
const pa = decodePng('scratch/extracted_pa_banner.png');
console.log('PA dims:', pa.width, 'x', pa.height);

// In PA banner, text is between x=115 and x=360, y=15 to y=85.
// Let's see what the background gradient looks like:
// At x=115, row y has a blue color. At x=360, row y has a slightly brighter blue color.
// Linear interpolation for each row y from x=115 to x=360 gives a perfectly seamless background!
const paClean = Buffer.alloc(pa.width * pa.height * 4);
pa.pixels.copy(paClean);

for (let y = 0; y < pa.height; y++) {
  // Sample left anchor at x=112, right anchor at x=365
  const leftIdx = (y * pa.width + 112) * 4;
  const rightIdx = (y * pa.width + 365) * 4;
  const rL = pa.pixels[leftIdx], gL = pa.pixels[leftIdx+1], bL = pa.pixels[leftIdx+2];
  const rR = pa.pixels[rightIdx], gR = pa.pixels[rightIdx+1], bR = pa.pixels[rightIdx+2];

  for (let x = 115; x <= 360; x++) {
    const t = (x - 115) / (360 - 115);
    const r = Math.round(rL + t * (rR - rL));
    const g = Math.round(gL + t * (gR - gL));
    const b = Math.round(bL + t * (bR - bL));
    const idx = (y * pa.width + x) * 4;
    paClean[idx] = r;
    paClean[idx+1] = g;
    paClean[idx+2] = b;
    paClean[idx+3] = 255;
  }
}

fs.writeFileSync('scratch/pa_clean_bg.png', encodePng(pa.width, pa.height, paClean));
console.log('Saved scratch/pa_clean_bg.png');
