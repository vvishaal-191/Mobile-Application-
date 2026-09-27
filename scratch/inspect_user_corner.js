const { decodePng } = require('./png_utils.js');
const imgUser = decodePng('C:/Users/vishaal.poobalan/.gemini/antigravity-ide/brain/51eb393b-7758-4ea4-8032-27cffa408611/.user_uploaded/media_1790500240478.png');

console.log('User image around y=20..30 near left edge:');
for (let y = 18; y <= 30; y++) {
  let row = `y=${y}: `;
  for (let x = 10; x <= 35; x += 2) {
    const idx = (y * imgUser.width + x) * 4;
    const r = imgUser.pixels[idx], g = imgUser.pixels[idx+1], b = imgUser.pixels[idx+2];
    const isBlue = (b > 180 && r < 100);
    const isDark = (r < 40 && g < 40 && b < 60);
    const isLight = (r > 200 && g > 200 && b > 200);
    row += (isBlue ? 'B' : isDark ? 'D' : isLight ? 'L' : '?') + ' ';
  }
  console.log(row);
}
