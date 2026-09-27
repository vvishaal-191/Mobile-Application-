const fs = require('fs');

const file = 'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html';
const c = fs.readFileSync(file, 'utf8');
const bodyStart = c.indexOf('<body');
console.log(c.substring(bodyStart, bodyStart + 1200).replace(/data:image\/[^;]+;base64,[^"']+/g, 'data:image/...[BASE64]...'));
