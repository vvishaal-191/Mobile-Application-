const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../preview_app.html'), 'utf8');
console.log('preview_app.html size:', content.length);

const matches = content.match(/<template[^>]*>/g);
console.log('Templates found:', matches);

const screenMatches = content.match(/id="[^"]*login[^"]*"/gi);
console.log('Login IDs found:', screenMatches);
