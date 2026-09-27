const fs = require('fs');

const h3 = fs.readFileSync('scratch/image3_header.png');
const h4 = fs.readFileSync('scratch/image4_header.png');
const g = fs.readFileSync('scratch/empty_state_graphic.png');

console.log('h3 size:', h3.length);
console.log('h4 size:', h4.length);
console.log('g size:', g.length);

const h3B64 = h3.toString('base64');
const h4B64 = h4.toString('base64');
const gB64 = g.toString('base64');

fs.writeFileSync('scratch/img3_header_b64.txt', h3B64);
fs.writeFileSync('scratch/img4_header_b64.txt', h4B64);
fs.writeFileSync('scratch/empty_graphic_b64.txt', gB64);

console.log('Saved b64 files:');
console.log('h3B64 len:', h3B64.length);
console.log('h4B64 len:', h4B64.length);
console.log('gB64 len:', gB64.length);
