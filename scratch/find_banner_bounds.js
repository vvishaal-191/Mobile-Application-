const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434238593.png';
const img = decodePng(imgPath);

// Find top boundary of blue (where r < 70 and b > 180)
let topY = 0;
for (let y = 0; y < img.height; y++) {
  const idx = (y * img.width + Math.floor(img.width / 2)) * 4;
  if (img.pixels[idx + 2] > 200 && img.pixels[idx] < 50) {
    topY = y;
    break;
  }
}

// Find left and right boundaries of blue
let leftX = 0, rightX = img.width - 1;
for (let x = 0; x < img.width; x++) {
  const idx = (50 * img.width + x) * 4;
  if (img.pixels[idx + 2] > 180) {
    leftX = x;
    break;
  }
}
for (let x = img.width - 1; x >= 0; x--) {
  const idx = (50 * img.width + x) * 4;
  if (img.pixels[idx + 2] > 180) {
    rightX = x;
    break;
  }
}

console.log('Detected header banner bounds:');
console.log('topY:', topY, 'leftX:', leftX, 'rightX:', rightX, 'width:', rightX - leftX + 1, 'height:', img.height - topY);

// Also let's find the calendar bounding box inside this image
// In this image, the calendar is located around x: 500..630, y: topY..125
console.log('Calendar area in Image 2:');
for (let y = topY; y < img.height; y += 10) {
  const line = [];
  for (let x = 500; x < rightX; x += 15) {
    const idx = (y * img.width + x) * 4;
    line.push(`(${img.pixels[idx]},${img.pixels[idx+1]},${img.pixels[idx+2]})`);
  }
  // console.log(`y=${y}:`, line.join(' '));
}
