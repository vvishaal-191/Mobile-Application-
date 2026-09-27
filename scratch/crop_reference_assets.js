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

// 1. Crop Image 3 header (Leave Approvals)
// In Image 3, header is y=0 to y=106, width 562
const h3 = crop(img3, 0, 0, 562, 106);
fs.writeFileSync('scratch/image3_header.png', encodePng(h3.width, h3.height, h3.pixels));
console.log('Saved scratch/image3_header.png (562x106)');

// 2. Crop Image 4 header (Permission Approvals)
const h4 = crop(img4, 0, 0, 562, 106);
fs.writeFileSync('scratch/image4_header.png', encodePng(h4.width, h4.height, h4.pixels));
console.log('Saved scratch/image4_header.png (562x106)');

// 3. Crop Empty State 3D Graphic (Document + Magnifying glass)
// Look at where the graphic is inside the card: y=320..580, x=140..420
const g3 = crop(img3, 140, 320, 422, 590);
fs.writeFileSync('scratch/empty_state_graphic.png', encodePng(g3.width, g3.height, g3.pixels));
console.log('Saved scratch/empty_state_graphic.png (282x270)');
