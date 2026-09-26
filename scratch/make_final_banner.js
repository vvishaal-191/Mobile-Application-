const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'clean_perfect_banner.png'));

const x = 1;
const y = 1;
const w = 635;
const h = 118;

const out = Buffer.alloc(w * h * 4);
for (let row = 0; row < h; row++) {
  const srcOffset = ((y + row) * img.width + x) * 4;
  const dstOffset = row * w * 4;
  img.pixels.copy(out, dstOffset, srcOffset, srcOffset + w * 4);
}

const outPng = encodePng(w, h, out);
fs.writeFileSync('assets/leave-approvals-header-banner.png', outPng);
fs.writeFileSync('EmergereApp/EmergereApp/assets/leave-approvals-header-banner.png', outPng);
fs.writeFileSync('scratch/final_leave_approvals_banner.png', outPng);

console.log('Saved final_leave_approvals_banner.png, size:', w, 'x', h);
