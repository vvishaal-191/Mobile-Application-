const fs = require('fs');

const p1 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966388799.png';
const zlib = require('zlib');

const buf = fs.readFileSync(p1);
let offset = 8, idatChunks = [], width = 0, height = 0;
while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.slice(offset + 8, offset + 8 + len));
  }
  offset += 12 + len;
}
const raw = zlib.inflateSync(Buffer.concat(idatChunks));
const bpp = 4, stride = 1 + width * bpp;
const pixels = Buffer.alloc(width * height * bpp);
function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}
for (let y = 0; y < height; y++) {
  const filterType = raw[y * stride];
  const rowOffset = y * stride + 1;
  const prev = (y - 1) * width * bpp;
  const cur = y * width * bpp;
  for (let x = 0; x < width * bpp; x++) {
    const c = raw[rowOffset + x];
    const left = x >= bpp ? pixels[cur + x - bpp] : 0;
    const up = y > 0 ? pixels[prev + x] : 0;
    const upLeft = (y > 0 && x >= bpp) ? pixels[prev + x - bpp] : 0;
    let val = c;
    if (filterType === 1) val = (c + left) & 0xff;
    else if (filterType === 2) val = (c + up) & 0xff;
    else if (filterType === 3) val = (c + Math.floor((left + up) / 2)) & 0xff;
    else if (filterType === 4) val = (c + paeth(left, up, upLeft)) & 0xff;
    pixels[cur + x] = val;
  }
}

// Find red pixels (the drawn red circle)
let redMinX = width, redMaxX = 0, redMinY = height, redMaxY = 0, redCount = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
    if (r > 180 && g < 50 && b < 50) {
      redCount++;
      if (x < redMinX) redMinX = x;
      if (x > redMaxX) redMaxX = x;
      if (y < redMinY) redMinY = y;
      if (y > redMaxY) redMaxY = y;
    }
  }
}

console.log(`Image 1 resolution: ${width}x${height}`);
console.log(`Red circle bbox: x=${redMinX}..${redMaxX}, y=${redMinY}..${redMaxY}`);

// Check what is inside the red circle
// Sample colors inside the red circle:
const insideColors = {};
for (let y = redMinY + 20; y < redMaxY - 20; y++) {
  for (let x = redMinX + 20; x < redMaxX - 20; x++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2];
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    insideColors[hex] = (insideColors[hex] || 0) + 1;
  }
}
console.log('Colors inside red circle:', Object.entries(insideColors).sort((a,b) => b[1] - a[1]).slice(0, 10));
