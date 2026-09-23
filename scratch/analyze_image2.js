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

const f2 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\d79b2efe-f599-4901-a8d2-e61bec3047ee\\.user_uploaded\\media_1790138379818.png';
const img = decodePng(f2);

function getPixel(x, y) {
  const idx = (y * img.width + x) * 4;
  return [img.pixels[idx], img.pixels[idx+1], img.pixels[idx+2]];
}

function hex(rgb) {
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
}

console.log('Top left (20, 20):', hex(getPixel(20, 20)));
console.log('Top center (240, 20):', hex(getPixel(240, 20)));
console.log('Top right (460, 20):', hex(getPixel(460, 20)));

for (let y = 0; y < 1024; y += 30) {
  console.log('y=' + y + ': x=20:' + hex(getPixel(20, y)) + ', x=240:' + hex(getPixel(240, y)) + ', x=460:' + hex(getPixel(460, y)));
}
