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

function encodePng(width, height, rgbaBuffer) {
  const bpp = 4;
  const stride = 1 + width * bpp;
  const raw = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    raw[y * stride] = 0; // Filter: None
    rgbaBuffer.copy(raw, y * stride + 1, y * width * bpp, (y + 1) * width * bpp);
  }
  const idatData = zlib.deflateSync(raw, { level: 9 });

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);
    return Buffer.concat([len, typeAndData, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    header,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idatData),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

const srcImg = decodePng('C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png');

// Center crop the graphic to a square
// Graphic bbox in srcImg: x=167..801, y=176..760
// Center: (484, 468)
// Let's take a square of size 680 centered at (484, 468):
// srcX: 484 - 340 = 144
// srcY: 468 - 340 = 128
const cropSize = 680;
const cropStartX = 144;
const cropStartY = 128;

// Scale down to 512x512 with anti-aliasing (bilinear)
const outSize = 512;
const outPixels = Buffer.alloc(outSize * outSize * 4);

for (let dy = 0; dy < outSize; dy++) {
  const sy = cropStartY + (dy / outSize) * cropSize;
  const y0 = Math.floor(sy);
  const y1 = Math.min(srcImg.height - 1, y0 + 1);
  const fy = sy - y0;

  for (let dx = 0; dx < outSize; dx++) {
    const sx = cropStartX + (dx / outSize) * cropSize;
    const x0 = Math.floor(sx);
    const x1 = Math.min(srcImg.width - 1, x0 + 1);
    const fx = sx - x0;

    const outIdx = (dy * outSize + dx) * 4;

    for (let c = 0; c < 4; c++) {
      const p00 = srcImg.pixels[(y0 * srcImg.width + x0) * 4 + c];
      const p10 = srcImg.pixels[(y0 * srcImg.width + x1) * 4 + c];
      const p01 = srcImg.pixels[(y1 * srcImg.width + x0) * 4 + c];
      const p11 = srcImg.pixels[(y1 * srcImg.width + x1) * 4 + c];

      const val = (1 - fx) * (1 - fy) * p00 +
                  fx * (1 - fy) * p10 +
                  (1 - fx) * fy * p01 +
                  fx * fy * p11;

      outPixels[outIdx + c] = Math.round(val);
    }
  }
}

const outPng = encodePng(outSize, outSize, outPixels);
fs.writeFileSync('scratch/logo_image2_centered_512.png', outPng);
console.log('Saved scratch/logo_image2_centered_512.png, size:', outPng.length, 'bytes');

// Also generate full-res centered version:
const fullCropPixels = Buffer.alloc(cropSize * cropSize * 4);
for (let y = 0; y < cropSize; y++) {
  for (let x = 0; x < cropSize; x++) {
    const srcX = cropStartX + x;
    const srcY = cropStartY + y;
    const inIdx = (srcY * srcImg.width + srcX) * 4;
    const outIdx = (y * cropSize + x) * 4;
    for (let c = 0; c < 4; c++) {
      fullCropPixels[outIdx + c] = srcImg.pixels[inIdx + c];
    }
  }
}
const fullCropPng = encodePng(cropSize, cropSize, fullCropPixels);
fs.writeFileSync('scratch/logo_image2_full_centered.png', fullCropPng);
console.log('Saved scratch/logo_image2_full_centered.png, size:', fullCropPng.length, 'bytes');
