const { decodePng } = require('./png_utils.js');
const imgExt = decodePng('scratch/extracted_pa_banner.png');
const imgUser = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790500240478.png');

console.log('Extracted banner:');
console.log('dim:', imgExt.width, 'x', imgExt.height);
console.log('Extracted banner y=0..5 at x=200:');
for (let y = 0; y < 6; y++) {
  const idx = (y * imgExt.width + 200) * 4;
  console.log(`y=${y}: rgba(${imgExt.pixels[idx]}, ${imgExt.pixels[idx+1]}, ${imgExt.pixels[idx+2]}, ${imgExt.pixels[idx+3]})`);
}

console.log('\nUser uploaded image:');
console.log('dim:', imgUser.width, 'x', imgUser.height);
console.log('User uploaded y=0..35 at x=200:');
for (let y = 0; y < 35; y += 2) {
  const idx = (y * imgUser.width + 200) * 4;
  console.log(`y=${y}: rgba(${imgUser.pixels[idx]}, ${imgUser.pixels[idx+1]}, ${imgUser.pixels[idx+2]}, ${imgUser.pixels[idx+3]})`);
}
