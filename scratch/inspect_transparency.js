const fs = require('fs');
const zlib = require('zlib');

function decodePng(filePath) {
  const buf = fs.readFileSync(filePath);
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
  return { width, height, pixels };
}

const img = decodePng('C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png');

// Check alpha channel across the image
let transparentCount = 0;
let opaqueWhiteCount = 0;
let opaqueBlueCount = 0;
let otherCount = 0;

for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const idx = (y * img.width + x) * 4;
    const r = img.pixels[idx], g = img.pixels[idx+1], b = img.pixels[idx+2], a = img.pixels[idx+3];
    if (a < 10) {
      transparentCount++;
    } else if (r > 240 && g > 240 && b > 240) {
      opaqueWhiteCount++;
    } else if (b > 150 && r < 100) {
      opaqueBlueCount++;
    } else {
      otherCount++;
    }
  }
}

console.log({ transparentCount, opaqueWhiteCount, opaqueBlueCount, otherCount });
// Check where the transparent pixels are
let tMinX = img.width, tMaxX = 0, tMinY = img.height, tMaxY = 0;
let wMinX = img.width, wMaxX = 0, wMinY = img.height, wMaxY = 0;
for (let y = 0; y < img.height; y++) {
  for (let x = 0; x < img.width; x++) {
    const idx = (y * img.width + x) * 4;
    const a = img.pixels[idx+3];
    const r = img.pixels[idx], g = img.pixels[idx+1], b = img.pixels[idx+2];
    if (a < 10) {
      if (x < tMinX) tMinX = x;
      if (x > tMaxX) tMaxX = x;
      if (y < tMinY) tMinY = y;
      if (y > tMaxY) tMaxY = y;
    }
    if (a > 200 && r > 240 && g > 240 && b > 240) {
      if (x < wMinX) wMinX = x;
      if (x > wMaxX) wMaxX = x;
      if (y < wMinY) wMinY = y;
      if (y > wMaxY) wMaxY = y;
    }
  }
}
console.log('Transparent bbox:', { tMinX, tMaxX, tMinY, tMaxY });
console.log('White bbox:', { wMinX, wMaxX, wMinY, wMaxY });
