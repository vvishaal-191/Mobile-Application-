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

const prev = decodePng('C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789964904573.png');
const next = decodePng('C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png');

// In prev, the graphic is scaled to 846 x 779 inside a 1024x973 canvas.
// In next, the graphic is 635 x 585 inside a 1024x864 canvas with WHITE background!
// Let's check the ratio:
console.log('Prev graphic scale:', 846 / 635, 779 / 585);
// 846 / 635 = 1.332, 779 / 585 = 1.3316 ! Exactly 4/3 (1.333) scaling!
// Let's check what the background of new image 2 is:
// It has white background (#ffffff)!
