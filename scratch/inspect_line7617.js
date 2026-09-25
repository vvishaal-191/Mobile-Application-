const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html');
const lines = fs.readFileSync(filePath, 'utf8').split('\n');
const line7617 = lines[7616];
console.log('Line 7617 length:', line7617.length);
console.log('Last 100 characters of line 7617:');
console.log(line7617.slice(-100));
console.log('Character codes of last 20 characters:');
const last20 = line7617.slice(-20);
for (let i = 0; i < last20.length; i++) {
  console.log(i, JSON.stringify(last20[i]), last20.charCodeAt(i));
}
