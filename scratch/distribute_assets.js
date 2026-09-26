const fs = require('fs');
const path = require('path');

// 1. Empty state illustration from crop_empty.png
const emptyBuf = fs.readFileSync('scratch/crop_empty.png');
fs.writeFileSync('assets/leave-approvals-empty.png', emptyBuf);
fs.writeFileSync('EmergereApp/EmergereApp/assets/leave-approvals-empty.png', emptyBuf);

// 2. Calendar graphic: let's save the generated 3D calendar
const genCalPath = 'C:\\Users\\vishaal.poobalan\\.gemini\\antigravity-ide\\brain\\a15d5bc2-bce2-41cd-93b8-933142d6008e\\calendar_clock_3d_1790433703785.jpg';
if (fs.existsSync(genCalPath)) {
  const calBuf = fs.readFileSync(genCalPath);
  fs.writeFileSync('assets/leave-approvals-cal.jpg', calBuf);
  fs.writeFileSync('EmergereApp/EmergereApp/assets/leave-approvals-cal.jpg', calBuf);
}

// Also keep crop_cal.png
const cropCalBuf = fs.readFileSync('scratch/crop_cal.png');
fs.writeFileSync('assets/leave-approvals-cal.png', cropCalBuf);
fs.writeFileSync('EmergereApp/EmergereApp/assets/leave-approvals-cal.png', cropCalBuf);

console.log('Saved assets in both assets/ and EmergereApp/EmergereApp/assets/');
