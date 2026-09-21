const fs = require('fs');
const zlib = require('zlib');

// Read source PNG
const buf = fs.readFileSync('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/632b9082-b01e-47b7-889e-446477304aba/.user_uploaded/media_1789964904573.png');

let pos = 8;
let idatChunks = [];
while (pos < buf.length) {
  const len = buf.readUInt32BE(pos);
  const type = buf.toString('ascii', pos + 4, pos + 8);
  if (type === 'IDAT') {
    idatChunks.push(buf.subarray(pos + 8, pos + 8 + len));
  }
  pos += 12 + len;
}

const decomp = zlib.inflateSync(Buffer.concat(idatChunks));
const srcW = 1024;
const srcH = 973;
const bpp = 4;
const srcRowLen = srcW * bpp;
const srcImg = Buffer.alloc(srcW * srcH * 4);

let srcPos = 0;
let prevRow = Buffer.alloc(srcRowLen);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < srcH; y++) {
  const filter = decomp[srcPos++];
  const curRow = Buffer.alloc(srcRowLen);
  for (let x = 0; x < srcRowLen; x++) {
    const raw = decomp[srcPos++];
    const a = x >= bpp ? curRow[x - bpp] : 0;
    const b = prevRow[x];
    const c = x >= bpp ? prevRow[x - bpp] : 0;
    let val = 0;
    if (filter === 0) val = raw;
    else if (filter === 1) val = (raw + a) & 0xff;
    else if (filter === 2) val = (raw + b) & 0xff;
    else if (filter === 3) val = (raw + Math.floor((a + b) / 2)) & 0xff;
    else if (filter === 4) val = (raw + paeth(a, b, c)) & 0xff;
    curRow[x] = val;
  }
  curRow.copy(srcImg, y * srcRowLen);
  prevRow = curRow;
}

// Downsample to 256x243 (or 512x486)
function downsample(dstW, dstH) {
  const dstImg = Buffer.alloc(dstW * dstH * 4);
  const scaleX = srcW / dstW;
  const scaleY = srcH / dstH;

  for (let dy = 0; dy < dstH; dy++) {
    for (let dx = 0; dx < dstW; dx++) {
      const startX = Math.floor(dx * scaleX);
      const endX = Math.min(srcW, Math.floor((dx + 1) * scaleX));
      const startY = Math.floor(dy * scaleY);
      const endY = Math.min(srcH, Math.floor((dy + 1) * scaleY));

      let rSum = 0, gSum = 0, bSum = 0, aSum = 0;
      let count = 0;

      for (let sy = startY; sy < endY; sy++) {
        for (let sx = startX; sx < endX; sx++) {
          const idx = (sy * srcW + sx) * 4;
          const a = srcImg[idx + 3];
          if (a > 0) {
            rSum += srcImg[idx] * a;
            gSum += srcImg[idx + 1] * a;
            bSum += srcImg[idx + 2] * a;
          }
          aSum += a;
          count++;
        }
      }

      const dstIdx = (dy * dstW + dx) * 4;
      const avgA = Math.round(aSum / count);
      dstImg[dstIdx + 3] = avgA;
      if (avgA > 0) {
        dstImg[dstIdx] = Math.round(rSum / aSum);
        dstImg[dstIdx + 1] = Math.round(gSum / aSum);
        dstImg[dstIdx + 2] = Math.round(bSum / aSum);
      }
    }
  }

  // Encode to PNG
  return encodePng(dstImg, dstW, dstH);
}

function encodePng(imgData, w, h) {
  // Simple PNG encoder
  const rowLen = 1 + w * 4;
  const rawData = Buffer.alloc(rowLen * h);
  for (let y = 0; y < h; y++) {
    rawData[y * rowLen] = 0; // Filter None
    imgData.copy(rawData, y * rowLen + 1, y * w * 4, (y + 1) * w * 4);
  }

  const compressed = zlib.deflateSync(rawData, { level: 9 });

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      let byte = buf[i];
      for (let j = 0; j < 8; j++) {
        if ((crc ^ byte) & 1) crc = (crc >>> 1) ^ 0xedb88320;
        else crc = crc >>> 1;
        byte >>>= 1;
      }
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4);
    data.copy(chunk, 8);
    const crc = crc32(chunk.subarray(4, 8 + len));
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(w, 0);
  ihdrData.writeUInt32BE(h, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', ihdrData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const png256 = downsample(256, 243);
fs.writeFileSync('scratch/logo_256.png', png256);
console.log('logo_256.png size:', png256.length);

const png512 = downsample(512, 486);
fs.writeFileSync('scratch/logo_512.png', png512);
console.log('logo_512.png size:', png512.length);
