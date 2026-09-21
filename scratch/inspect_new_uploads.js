const fs = require('fs');
const path = require('path');

const img1Path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966388799.png';
const img2Path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\632b9082-b01e-47b7-889e-446477304aba\\.user_uploaded\\media_1789966396437.png';

function inspectPng(p, name) {
  const buf = fs.readFileSync(p);
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const bitDepth = buf[24];
  const colorType = buf[25];
  console.log(`${name}: ${p}`);
  console.log(`  Size: ${buf.length} bytes, Resolution: ${width}x${height}, BitDepth: ${bitDepth}, ColorType: ${colorType}`);
}

inspectPng(img1Path, 'media_1789966388799');
inspectPng(img2Path, 'media_1789966396437');
