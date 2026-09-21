const fs = require('fs');
const zlib = require('zlib');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png';

const buf = fs.readFileSync(imgPath);
// Parse PNG chunks
let offset = 8;
let idatChunks = [];
let width = 0, height = 0;

while (offset < buf.length) {
  const length = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  if (type === 'IHDR') {
    width = buf.readUInt32BE(offset + 8);
    height = buf.readUInt32BE(offset + 12);
  } else if (type === 'IDAT') {
    idatChunks.push(buf.slice(offset + 8, offset + 8 + length));
  }
  offset += 12 + length;
}

const compressed = Buffer.concat(idatChunks);
const raw = zlib.inflateSync(compressed);

const stride = 1 + width * 4;
let minX = width, maxX = 0, minY = height, maxY = 0;
let opaqueCount = 0;
let transparentCount = 0;
const colorCounts = {};

// Paeth / PNG filter reconstruction (assuming none or sub or up)
// Just sample uncompressed scanlines approximately to check bounding box and colors
for (let y = 0; y < height; y++) {
  const rowStart = y * stride + 1;
  for (let x = 0; x < width; x++) {
    const px = rowStart + x * 4;
    const r = raw[px];
    const g = raw[px + 1];
    const b = raw[px + 2];
    const a = raw[px + 3];
    if (a > 10) {
      opaqueCount++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    } else {
      transparentCount++;
    }
  }
}

console.log(`Resolution: ${width}x${height}`);
console.log(`Bounding box of non-transparent pixels: (${minX}, ${minY}) to (${maxX}, ${maxY})`);
console.log(`BBox dimensions: ${maxX - minX + 1} x ${maxY - minY + 1}`);
console.log(`Opaque pixels: ${opaqueCount}, Transparent pixels: ${transparentCount}`);

const sortedColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('Top colors:', sortedColors);
