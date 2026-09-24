const fs = require('fs');
const content = fs.readFileSync('EmergereApp/EmergereApp/index.html', 'utf8');
console.log('Includes id=frame:', content.includes('id="frame"'));
console.log('Includes <iframe:', content.includes('<iframe'));
console.log('Templates count:', (content.match(/<template/g) || []).length);

// Also check preview_app.html
const pContent = fs.readFileSync('preview_app.html', 'utf8');
console.log('preview_app.html templates count:', (pContent.match(/<template/g) || []).length);
