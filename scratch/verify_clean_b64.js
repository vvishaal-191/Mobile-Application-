const fs = require('fs');

const laBuf = fs.readFileSync('scratch/la_clean_bg.png');
const paBuf = fs.readFileSync('scratch/pa_clean_bg.png');

const laB64 = laBuf.toString('base64');
const paB64 = paBuf.toString('base64');

console.log('laB64 length:', laB64.length);
console.log('paB64 length:', paB64.length);

// Verify round-trip
const laRound = Buffer.from(laB64, 'base64');
const paRound = Buffer.from(paB64, 'base64');

console.log('LA round-trip:', laRound.readUInt32BE(16), 'x', laRound.readUInt32BE(20));
console.log('PA round-trip:', paRound.readUInt32BE(16), 'x', paRound.readUInt32BE(20));

fs.writeFileSync('scratch/la_b64.txt', laB64);
fs.writeFileSync('scratch/pa_b64.txt', paB64);
console.log('Saved scratch/la_b64.txt and scratch/pa_b64.txt');
