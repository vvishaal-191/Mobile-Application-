const fs = require('fs');
const path = require('path');
const { decodePng } = require('./png_utils.js');

const img1Path = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\.user_uploaded\\media_1790434219317.png';
const img1 = decodePng(img1Path);
console.log('Image 1 Size:', img1.width, 'x', img1.height);
