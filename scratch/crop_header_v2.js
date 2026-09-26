const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434238593.png';
const img = decodePng(imgPath);

// Calendar is on the right side of this image
// Image width is 641, height is 128
// Calendar spans approximately x: 490..610, y: 15..115
function crop(src, x, y, w, h) {
  const out = Buffer.alloc(w * h * 4);
  for (let row = 0; row < h; row++) {
    const srcRow = y + row;
    if (srcRow >= 0 && srcRow < src.height) {
      const srcOffset = (srcRow * src.width + x) * 4;
      const dstOffset = (row * w) * 4;
      src.pixels.copy(out, dstOffset, srcOffset, srcOffset + w * 4);
    }
  }
  return { width: w, height: h, pixels: out };
}

const calCrop = crop(img, 485, 10, 130, 110);
fs.writeFileSync(path.join(__dirname, 'cal_crop_v2.png'), encodePng(calCrop.width, calCrop.height, calCrop.pixels));

// Also let's crop the entire clean banner without the outer 9px dark padding
// top: 9, left: 1, width: 635, height: 119
const bannerCrop = crop(img, 1, 9, 635, 119);
fs.writeFileSync(path.join(__dirname, 'leave_approvals_header_banner.png'), encodePng(bannerCrop.width, bannerCrop.height, bannerCrop.pixels));

console.log('Saved cal_crop_v2.png and leave_approvals_header_banner.png');
