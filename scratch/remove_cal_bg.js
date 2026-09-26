const fs = require('fs');
const path = require('path');
const { decodePng, encodePng } = require('./png_utils.js');

const img = decodePng(path.join(__dirname, 'crop_cal.png'));
const w = img.width;
const h = img.height;
const pixels = img.pixels;

// Flood fill from outer boundaries
const visited = new Uint8Array(w * h);
const queue = [];

function isOuterBg(x, y) {
  const idx = (y * w + x) * 4;
  const r = pixels[idx];
  const g = pixels[idx + 1];
  const b = pixels[idx + 2];
  
  // Outer background is the header blue gradient or the wave blue at bottom
  // Calendar itself is:
  // white body: r > 200, g > 200, b > 200
  // binder tabs: r > 180, g > 180, b > 200
  // clock: r < 50, g < 140, b > 200
  // Let's check if (x,y) is outside the calendar envelope
  return (b > 220 && r < 140 && g < 185) || (r > 230 && g > 240 && b > 250 && y > 75 && x < 40);
}

// Add boundary pixels that are bg
for (let x = 0; x < w; x++) {
  if (isOuterBg(x, 0)) queue.push([x, 0]);
  if (isOuterBg(x, h - 1)) queue.push([x, h - 1]);
}
for (let y = 0; y < h; y++) {
  if (isOuterBg(0, y)) queue.push([0, y]);
  if (isOuterBg(w - 1, y)) queue.push([w - 1, y]);
}

for (const [x, y] of queue) {
  visited[y * w + x] = 1;
}

let head = 0;
while (head < queue.length) {
  const [cx, cy] = queue[head++];
  const neighbors = [
    [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
  ];
  for (const [nx, ny] of neighbors) {
    if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
      const nIdx = ny * w + nx;
      if (!visited[nIdx] && isOuterBg(nx, ny)) {
        visited[nIdx] = 1;
        queue.push([nx, ny]);
      }
    }
  }
}

// Create transparent png
const outPixels = Buffer.alloc(w * h * 4);
pixels.copy(outPixels);

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    if (visited[y * w + x]) {
      outPixels[idx + 3] = 0; // Transparent
    }
  }
}

fs.writeFileSync(path.join(__dirname, 'cal_transparent.png'), encodePng(w, h, outPixels));
console.log('Saved cal_transparent.png');
