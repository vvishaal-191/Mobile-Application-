const fs = require('fs');
const zlib = require('zlib');

// Read input PNG
const inputBuf = fs.readFileSync('assets/tech-circuit-logo.png');

// Parse PNG chunks
let pos = 8;
let ihdrChunk = null;
const idatChunks = [];
let plteChunk = null;

while (pos < inputBuf.length) {
  const len = inputBuf.readUInt32BE(pos);
  const type = inputBuf.toString('ascii', pos + 4, pos + 8);
  const data = inputBuf.slice(pos + 8, pos + 8 + len);
  if (type === 'IHDR') ihdrChunk = data;
  if (type === 'IDAT') idatChunks.push(data);
  if (type === 'PLTE') plteChunk = data;
  pos += 12 + len;
}

const width = ihdrChunk.readUInt32BE(0);
const height = ihdrChunk.readUInt32BE(4);
const bitDepth = ihdrChunk[8];
const colorType = ihdrChunk[9];

console.log({ width, height, bitDepth, colorType });

// Decompress IDAT
const decompressed = zlib.inflateSync(Buffer.concat(idatChunks));

// Build un-filtered scanlines and convert to RGBA
const bpp = 4; // colorType 6 is RGBA
const stride = 1 + width * bpp;
const rawRgba = Buffer.alloc(width * height * 4);

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

// Unfilter
const recon = Buffer.alloc(height * width * bpp);
for (let y = 0; y < height; y++) {
  const filterType = decompressed[y * stride];
  const scanline = decompressed.slice(y * stride + 1, y * stride + 1 + width * bpp);
  const prevScanline = y > 0 ? recon.slice((y - 1) * width * bpp, y * width * bpp) : null;
  const currScanline = recon.slice(y * width * bpp, (y + 1) * width * bpp);

  for (let x = 0; x < width * bpp; x++) {
    const rawVal = scanline[x];
    const a = x >= bpp ? currScanline[x - bpp] : 0;
    const b = prevScanline ? prevScanline[x] : 0;
    const c = (prevScanline && x >= bpp) ? prevScanline[x - bpp] : 0;

    let reconVal = 0;
    if (filterType === 0) reconVal = rawVal;
    else if (filterType === 1) reconVal = (rawVal + a) & 0xff;
    else if (filterType === 2) reconVal = (rawVal + b) & 0xff;
    else if (filterType === 3) reconVal = (rawVal + Math.floor((a + b) / 2)) & 0xff;
    else if (filterType === 4) reconVal = (rawVal + paethPredictor(a, b, c)) & 0xff;

    currScanline[x] = reconVal;
  }
}

// Now in recon, we have the true RGBA pixels!
// Any pixel where luminance is dark (< 60), make alpha 0 (transparent).
// For the white pixels, keep them pure white #FFFFFF with full alpha.
const outScanlines = Buffer.alloc(height * (1 + width * 4));
for (let y = 0; y < height; y++) {
  outScanlines[y * (1 + width * 4)] = 0; // Filter None
  for (let x = 0; x < width; x++) {
    const inIdx = (y * width + x) * 4;
    const outIdx = y * (1 + width * 4) + 1 + x * 4;
    const r = recon[inIdx];
    const g = recon[inIdx + 1];
    const b = recon[inIdx + 2];
    const inA = recon[inIdx + 3];

    // Calculate brightness
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    if (lum < 40) {
      outScanlines[outIdx] = 0;
      outScanlines[outIdx + 1] = 0;
      outScanlines[outIdx + 2] = 0;
      outScanlines[outIdx + 3] = 0;
    } else {
      outScanlines[outIdx] = 255;
      outScanlines[outIdx + 1] = 255;
      outScanlines[outIdx + 2] = 255;
      outScanlines[outIdx + 3] = Math.min(255, Math.round((lum / 255) * inA));
    }
  }
}

// Compress into PNG
const compressedOut = zlib.deflateSync(outScanlines);

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  // CRC32
  let crc = 0xffffffff;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  for (let i = 0; i < typeBuf.length; i++) {
    crc = table[(crc ^ typeBuf[i]) & 0xff] ^ (crc >>> 8);
  }
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = (crc ^ 0xffffffff) >>> 0;
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const headerBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const ihdrOut = Buffer.alloc(13);
ihdrOut.writeUInt32BE(width, 0);
ihdrOut.writeUInt32BE(height, 4);
ihdrOut[8] = 8; // 8-bit
ihdrOut[9] = 6; // RGBA
ihdrOut[10] = 0; // Deflate
ihdrOut[11] = 0; // Filter
ihdrOut[12] = 0; // Interlace

const outPng = Buffer.concat([
  headerBuf,
  createChunk('IHDR', ihdrOut),
  createChunk('IDAT', compressedOut),
  createChunk('IEND', Buffer.alloc(0))
]);

fs.writeFileSync('assets/tech-circuit-logo.png', outPng);
fs.writeFileSync('EmergereApp/EmergereApp/assets/tech-circuit-logo.png', outPng);
console.log('Successfully written transparent tech-circuit-logo.png, size:', outPng.length);
