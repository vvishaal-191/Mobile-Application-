const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'crop_cal.png'));
console.log('Size:', img.width, 'x', img.height);

function getPixel(x, y) {
  const idx = (y * img.width + x) * 4;
  return [img.pixels[idx], img.pixels[idx+1], img.pixels[idx+2], img.pixels[idx+3]];
}

console.log('Top-left (0,0):', getPixel(0, 0));
console.log('Top-right (w-1,0):', getPixel(img.width-1, 0));
console.log('Bottom-left (0,h-1):', getPixel(0, img.height-1));
console.log('Bottom-right (w-1,h-1):', getPixel(img.width-1, img.height-1));
