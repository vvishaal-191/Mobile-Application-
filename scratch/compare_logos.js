const fs = require('fs');

const p1 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789964904573.png';
const p2 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png';

console.log('Previous logo size:', fs.statSync(p1).size);
console.log('New image 2 size:', fs.statSync(p2).size);

// Let's decode both and find the bounding box of the blue graphic in both!
const zlib = require('zlib');
function getBlueBbox(filePath) {
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

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let blueCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = pixels[idx], g = pixels[idx+1], b = pixels[idx+2], a = pixels[idx+3];
      // blue pixel: b > 200, r < 100, a > 50
      if (b > 180 && r < 100 && a > 50) {
        blueCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { width, height, blueCount, bbox: { minX, maxX, minY, maxY, w: maxX - minX + 1, h: maxY - minY + 1 } };
}

console.log('Previous logo:', getBlueBbox(p1));
console.log('New image 2:', getBlueBbox(p2));
