const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'leave_approvals_header_banner.png'));

// Check top row (y = 0..10)
for (let y = 0; y < 15; y++) {
  const pLeft = (y * img.width + 10) * 4;
  const pMid = (y * img.width + Math.floor(img.width/2)) * 4;
  const pRight = (y * img.width + img.width - 10) * 4;
  console.log(`y=${y}: left=(${img.pixels[pLeft]},${img.pixels[pLeft+1]},${img.pixels[pLeft+2]}) mid=(${img.pixels[pMid]},${img.pixels[pMid+1]},${img.pixels[pMid+2]}) right=(${img.pixels[pRight]},${img.pixels[pRight+1]},${img.pixels[pRight+2]})`);
}
