const fs = require('fs');
const path = require('path');
const { decodePng } = require('./png_utils.js');

const imgPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434238593.png';
const img = decodePng(imgPath);
console.log('Size:', img.width, 'x', img.height);

function getPixel(x, y) {
  const idx = (y * img.width + x) * 4;
  return [img.pixels[idx], img.pixels[idx+1], img.pixels[idx+2], img.pixels[idx+3]];
}

console.log('(0, 0):', getPixel(0, 0));
console.log('(10, 10):', getPixel(10, 10));
console.log('(50, 50):', getPixel(50, 50));
console.log('(w/2, 10):', getPixel(Math.floor(img.width/2), 10));
console.log('(w/2, 2):', getPixel(Math.floor(img.width/2), 2));
console.log('(w-10, 10):', getPixel(img.width - 10, 10));
console.log('(w-1, 0):', getPixel(img.width - 1, 0));
