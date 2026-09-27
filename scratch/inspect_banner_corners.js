const { decodePng } = require('./png_utils.js');
const img = decodePng('scratch/extracted_pa_banner.png');

console.log('Top row y=0:');
for (let x = 0; x < img.width; x += 20) {
  const idx = (0 * img.width + x) * 4;
  console.log(`x=${x}: rgba(${img.pixels[idx]}, ${img.pixels[idx+1]}, ${img.pixels[idx+2]}, ${img.pixels[idx+3]})`);
}

console.log('\nTop-left corner (y=0..5, x=0..10):');
for (let y = 0; y < 5; y++) {
  let row = `y=${y}: `;
  for (let x = 0; x < 10; x++) {
    const idx = (y * img.width + x) * 4;
    row += `(${img.pixels[idx]},${img.pixels[idx+1]},${img.pixels[idx+2]},${img.pixels[idx+3]}) `;
  }
  console.log(row);
}
