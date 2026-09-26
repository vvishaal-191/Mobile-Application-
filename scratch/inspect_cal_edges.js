const fs = require('fs');
const zlib = require('zlib');

// Load crop_cal.png and check edge pixel colors
const buf = fs.readFileSync('scratch/crop_cal.png');
// We have decodePng in scratch/crop_assets.js
const { decodePng, encodePng } = require('./scratch/crop_assets_helper.js');
