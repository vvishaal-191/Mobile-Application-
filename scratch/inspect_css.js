const fs = require('fs');

const phtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.html', 'utf8');
const pcss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.css', 'utf8');
const bcss = fs.readFileSync('EmergereApp/EmergereApp/preview/base.css', 'utf8');

console.log('preview.html has screen class:', phtml.includes('class="screen'));
console.log('base.css screen rules:');
bcss.split('\n').filter(l => l.includes('.screen')).forEach(l => console.log(l));

console.log('\npreview.css rules:');
pcss.split('\n').filter(l => l.includes('.lb-header-banner') || l.includes('.screen')).forEach(l => console.log(l));
