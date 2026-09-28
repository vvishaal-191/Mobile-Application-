const fs = require('fs');
const path = require('path');

const topHeaderBase64 = fs.readFileSync(path.join(__dirname, '../assets/login-top-header.png')).toString('base64');
const bottomWaveBase64 = fs.readFileSync(path.join(__dirname, '../assets/login-bottom-wave.png')).toString('base64');

fs.writeFileSync(path.join(__dirname, 'login_assets_base64.json'), JSON.stringify({
  topHeader: `data:image/png;base64,${topHeaderBase64}`,
  bottomWave: `data:image/png;base64,${bottomWaveBase64}`
}));

console.log('Saved login_assets_base64.json successfully');
