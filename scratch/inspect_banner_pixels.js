const fs = require('fs');
const { decodePng } = require('./png_utils.js');

const img = decodePng('scratch/current_pa_banner.png');
console.log('Top rows of current_pa_banner.png:');
for (let y = 0; y < 15; y += 2) {
  let colors = [];
  for (let x = 100; x < 450; x += 70) {
    const idx = (y * img.width + x) * 4;
    colors.push('(' + img.pixels[idx] + ',' + img.pixels[idx+1] + ',' + img.pixels[idx+2] + ')');
  }
  console.log('y=' + y + ': ' + colors.join(' '));
}

console.log('Corners at y=0:');
for (let x = 0; x < 20; x++) {
  const idx = (0 * img.width + x) * 4;
  console.log('x=' + x + ': (' + img.pixels[idx] + ',' + img.pixels[idx+1] + ',' + img.pixels[idx+2] + ',' + img.pixels[idx+3] + ')');
}
