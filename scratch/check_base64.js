const fs = require('fs');
const path = require('path');

const headerBg = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/assets/login-header-bg.png')).toString('base64');
const bottomBg = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/assets/login-bottom-bg.png')).toString('base64');
const logoPng = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/assets/emergere-login-logo.png')).toString('base64');

console.log('headerBg length:', headerBg.length);
console.log('bottomBg length:', bottomBg.length);
console.log('logoPng length:', logoPng.length);
