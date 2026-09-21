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

const img1 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789967121162.png';
const img2 = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789967149825.png';

function inspectImage(path, label) {
  const data = decodePng(path);
  console.log(`\n=== ${label} ===`);
  console.log(`Dimensions: ${data.width} x ${data.height}`);

  let transparentCount = 0;
  let whiteCount = 0;
  let blueCount = 0;
  let otherCount = 0;
  let minX = data.width, maxX = 0, minY = data.height, maxY = 0;

  for (let y = 0; y < data.height; y++) {
    for (let x = 0; x < data.width; x++) {
      const idx = (y * data.width + x) * 4;
      const r = data.pixels[idx];
      const g = data.pixels[idx+1];
      const b = data.pixels[idx+2];
      const a = data.pixels[idx+3];

      if (a < 10) {
        transparentCount++;
      } else if (r > 240 && g > 240 && b > 240) {
        whiteCount++;
      } else if (b > 150 && r < 100) {
        blueCount++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        otherCount++;
      }
    }
  }

  console.log(`Transparent: ${transparentCount}, White: ${whiteCount}, Blue: ${blueCount}, Other: ${otherCount}`);
  console.log(`Blue graphic bbox: x=${minX}..${maxX} (w=${maxX-minX+1}), y=${minY}..${maxY} (h=${maxY-minY+1})`);
}

inspectImage(img1, 'Image 1 (media_1789967121162.png)');
inspectImage(img2, 'Image 2 (media_1789967149825.png)');
