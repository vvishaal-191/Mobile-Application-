const fs = require('fs');
const content = fs.readFileSync('scratch/profile_tpl.html', 'utf8');

const sStart = content.indexOf('<script>');
console.log('--- SCRIPTS in tpl-MyProfile ---');
console.log(content.substring(sStart));
