const fs = require('fs');
const path = require('path');

const imgPath = path.join(__dirname, '../assets/login-top-header.png');
console.log('Exists:', fs.existsSync(imgPath));
console.log('Size:', fs.statSync(imgPath).size);
