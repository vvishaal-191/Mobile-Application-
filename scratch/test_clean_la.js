const { decodePng, encodePng } = require('./png_utils.js');
const fs = require('fs');

const la = decodePng('scratch/extracted_la_banner.png');
console.log('LA dims:', la.width, 'x', la.height);

const laClean = Buffer.alloc(la.width * la.height * 4);
la.pixels.copy(laClean);

for (let y = 0; y < la.height; y++) {
  // Sample left anchor at x=105, right anchor at x=450
  const leftIdx = (y * la.width + 105) * 4;
  const rightIdx = (y * la.width + 450) * 4;
  const rL = la.pixels[leftIdx], gL = la.pixels[leftIdx+1], bL = la.pixels[leftIdx+2];
  const rR = la.pixels[rightIdx], gR = la.pixels[rightIdx+1], bR = la.pixels[rightIdx+2];

  for (let x = 108; x <= 440; x++) {
    const t = (x - 108) / (440 - 108);
    const r = Math.round(rL + t * (rR - rL));
    const g = Math.round(gL + t * (gR - gL));
    const b = Math.round(bL + t * (bR - bL));
    const idx = (y * la.width + x) * 4;
    laClean[idx] = r;
    laClean[idx+1] = g;
    laClean[idx+2] = b;
    laClean[idx+3] = 255;
  }
}

fs.writeFileSync('scratch/la_clean_bg.png', encodePng(la.width, la.height, laClean));
console.log('Saved scratch/la_clean_bg.png');
