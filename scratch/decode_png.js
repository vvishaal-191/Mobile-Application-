const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let idatChunks = [];
  let width = 0, height = 0, bitDepth = 0, colorType = 0;

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'IHDR') {
      width = buf.readUInt32BE(offset + 8);
      height = buf.readUInt32BE(offset + 12);
      bitDepth = buf[offset + 16];
      colorType = buf[offset + 17];
    } else if (type === 'IDAT') {
      idatChunks.push(buf.slice(offset + 8, offset + 8 + length));
    }
    offset += 12 + length;
  }

  const compressed = Buffer.concat(idatChunks);
  const raw = zlib.inflateSync(compressed);

  const bpp = 4; // RGBA
  const stride = 1 + width * bpp;
  const pixels = Buffer.alloc(width * height * bpp);

  function paeth(a, b, c) {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    if (pa <= pb && pa <= pc) return a;
    if (pb <= pc) return b;
    return c;
  }

  for (let y = 0; y < height; y++) {
    const filterType = raw[y * stride];
    const rowOffset = y * stride + 1;
    const prevRowOffset = (y - 1) * width * bpp;
    const curRowOffset = y * width * bpp;

    for (let x = 0; x < width * bpp; x++) {
      const cur = raw[rowOffset + x];
      const left = x >= bpp ? pixels[curRowOffset + x - bpp] : 0;
      const up = y > 0 ? pixels[prevRowOffset + x] : 0;
      const upLeft = (y > 0 && x >= bpp) ? pixels[prevRowOffset + x - bpp] : 0;

      let val = cur;
      if (filterType === 1) { // Sub
        val = (cur + left) & 0xff;
      } else if (filterType === 2) { // Up
        val = (cur + up) & 0xff;
      } else if (filterType === 3) { // Average
        val = (cur + Math.floor((left + up) / 2)) & 0xff;
      } else if (filterType === 4) { // Paeth
        val = (cur + paeth(left, up, upLeft)) & 0xff;
      }
      pixels[curRowOffset + x] = val;
    }
  }

  return { width, height, pixels };
}

const { width, height, pixels } = decodePng('C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png');

let minX = width, maxX = 0, minY = height, maxY = 0;
let opaqueCount = 0;
const colorMap = {};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    const a = pixels[idx + 3];

    if (a > 20) {
      opaqueCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }
  }
}

console.log(`Dimensions: ${width}x${height}`);
console.log(`Non-transparent bbox: x=${minX}..${maxX} (w=${maxX - minX + 1}), y=${minY}..${maxY} (h=${maxY - minY + 1})`);
console.log(`Opaque pixels: ${opaqueCount}`);
console.log('Top colors:', Object.entries(colorMap).sort((a,b) => b[1] - a[1]).slice(0, 10));
