const fs = require('fs');
const path = require('path');

const fullHeaderBase64 = fs.readFileSync(path.join(__dirname, '../assets/login-header-full.png')).toString('base64');
const bottomWaveBase64 = fs.readFileSync(path.join(__dirname, '../assets/login-bottom-wave.png')).toString('base64');

fs.writeFileSync(path.join(__dirname, 'login_assets_base64.json'), JSON.stringify({
  topHeader: `data:image/png;base64,${fullHeaderBase64}`,
  bottomWave: `data:image/png;base64,${bottomWaveBase64}`
}));

console.log('Saved updated login_assets_base64.json');
