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

// Inspect left Action card 1 (Apply Leave):
console.log('Action card 1 (top-left) (50, 260):', hex(getPixel(50, 260)));
console.log('Action card 1 icon wrap (50, 250):', hex(getPixel(50, 250)));
console.log('Action card 1 corner curve (200, 320):', hex(getPixel(200, 320)));

// Inspect Action card 2 (Apply Permission):
console.log('Action card 2 (top-right) (280, 260):', hex(getPixel(280, 260)));
console.log('Action card 2 icon wrap (280, 250):', hex(getPixel(280, 250)));
console.log('Action card 2 corner curve (440, 320):', hex(getPixel(440, 320)));

// Inspect Action card 3 (My Requests):
console.log('Action card 3 (bottom-left) (50, 400):', hex(getPixel(50, 400)));
console.log('Action card 3 icon wrap (50, 390):', hex(getPixel(50, 390)));
console.log('Action card 3 corner curve (200, 460):', hex(getPixel(200, 460)));

// Inspect Action card 4 (Holiday Calendar):
console.log('Action card 4 (bottom-right) (280, 400):', hex(getPixel(280, 400)));
console.log('Action card 4 icon wrap (280, 390):', hex(getPixel(280, 390)));
console.log('Action card 4 corner curve (440, 460):', hex(getPixel(440, 460)));

// Inspect Leave Balances Card:
console.log('\n--- Leave Balances Card ---');
console.log('Leave Balances Card Top y ~510-530');
for (let y = 510; y < 535; y++) {
  const p = getPixel(100, y);
  if (p[0] > 250 && p[1] > 250 && p[2] > 250) {
    console.log('Leave Balances card top starts at y =', y);
    break;
  }
}
for (let y = 750; y < 785; y++) {
  const p = getPixel(100, y);
  if (p[0] < 250) {
    console.log('Leave Balances card bottom ends at y =', y);
    break;
  }
}

// Inspect 3 badges in Leave Balances:
// Badge 1 (Casual Leave):
console.log('Row 1 Badge center (x=60, y=580):', hex(getPixel(60, 580)));
console.log('Row 1 Progress fill (x=150, y=606):', hex(getPixel(150, 606)));
console.log('Row 1 Progress track (x=350, y=606):', hex(getPixel(350, 606)));

// Badge 2 (Sick Leave):
console.log('Row 2 Badge center (x=60, y=648):', hex(getPixel(60, 648)));
console.log('Row 2 Progress fill (x=150, y=674):', hex(getPixel(150, 674)));

// Badge 3 (WFH):
console.log('Row 3 Badge center (x=60, y=722):', hex(getPixel(60, 722)));
console.log('Row 3 Progress fill (x=150, y=748):', hex(getPixel(150, 748)));

// Inspect Upcoming Holiday card:
console.log('\n--- Upcoming Holiday Card ---');
for (let y = 780; y < 805; y++) {
  const p = getPixel(100, y);
  if (p[2] > 240 && p[0] < 240) {
    console.log('Holiday card top starts at y =', y, hex(p));
    break;
  }
}
for (let y = 860; y < 890; y++) {
  const p = getPixel(100, y);
  if (p[0] > 240 && p[1] > 240 && p[2] > 240) {
    console.log('Holiday card bottom ends at y =', y, hex(p));
    break;
  }
}
console.log('Holiday date box (x=50, y=828):', hex(getPixel(50, 828)));
console.log('Holiday right chevron (x=438, y=828):', hex(getPixel(438, 828)));
