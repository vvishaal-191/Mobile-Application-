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

function resampleBilinear(src, cropStartX, cropStartY, cropW, cropH, outW, outH) {
  const outPixels = Buffer.alloc(outW * outH * 4);
  for (let dy = 0; dy < outH; dy++) {
    const sy = cropStartY + (dy / outH) * cropH;
    const y0 = Math.max(0, Math.min(src.height - 1, Math.floor(sy)));
    const y1 = Math.max(0, Math.min(src.height - 1, y0 + 1));
    const fy = sy - Math.floor(sy);

    for (let dx = 0; dx < outW; dx++) {
      const sx = cropStartX + (dx / outW) * cropW;
      const x0 = Math.max(0, Math.min(src.width - 1, Math.floor(sx)));
      const x1 = Math.max(0, Math.min(src.width - 1, x0 + 1));
      const fx = sx - Math.floor(sx);

      const outIdx = (dy * outW + dx) * 4;

      for (let c = 0; c < 4; c++) {
        const p00 = src.pixels[(y0 * src.width + x0) * 4 + c];
        const p10 = src.pixels[(y0 * src.width + x1) * 4 + c];
        const p01 = src.pixels[(y1 * src.width + x0) * 4 + c];
        const p11 = src.pixels[(y1 * src.width + x1) * 4 + c];

        const val = (1 - fx) * (1 - fy) * p00 +
                    fx * (1 - fy) * p10 +
                    (1 - fx) * fy * p01 +
                    fx * fy * p11;

        outPixels[outIdx + c] = Math.round(val);
      }
    }
  }
  return outPixels;
}

// -------------------------------------------------------------
// 1. Process Image 1 (Transparent, for all pages except Login)
// -------------------------------------------------------------
const img1Path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789967121162.png';
const srcImg1 = decodePng(img1Path);

// Graphic bbox in srcImg1: x=90..936 (w=847), y=146..925 (h=780)
// Center: (513, 535.5)
// Max dimension = 847. Let's make a square centered crop:
const size1 = 880;
const cropStartX1 = 513 - size1 / 2; // 73
const cropStartY1 = 535.5 - size1 / 2; // 95.5

// Generate 512x512 transparent PNG
const out512Img1 = resampleBilinear(srcImg1, cropStartX1, cropStartY1, size1, size1, 512, 512);
const png512Img1 = encodePng(512, 512, out512Img1);
fs.writeFileSync('scratch/logo_transparent_512.png', png512Img1);
console.log('Saved scratch/logo_transparent_512.png, size:', png512Img1.length);

// Also copy raw 1024x973 transparent logo
fs.copyFileSync(img1Path, 'scratch/logo_transparent_master.png');

// -------------------------------------------------------------
// 2. Process Image 2 (White background, for Login page ONLY)
// -------------------------------------------------------------
const img2Path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789967149825.png';
const srcImg2 = decodePng(img2Path);

// Graphic bbox in srcImg2: x=73..576 (w=504), y=112..576 (h=465)
// Center: (324.5, 344)
// Max dimension = 504. Let's make a square centered crop with white background:
const size2 = 530;
const cropStartX2 = 324.5 - size2 / 2; // 59.5
const cropStartY2 = 344 - size2 / 2;   // 79

// Generate 512x512 white-background PNG for Login
const out512Img2 = resampleBilinear(srcImg2, cropStartX2, cropStartY2, size2, size2, 512, 512);
const png512Img2 = encodePng(512, 512, out512Img2);
fs.writeFileSync('scratch/logo_login_512.png', png512Img2);
console.log('Saved scratch/logo_login_512.png, size:', png512Img2.length);

// Also copy raw Image 2 as master login logo
fs.copyFileSync(img2Path, 'scratch/logo_login_master.png');
