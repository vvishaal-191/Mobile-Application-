const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const regex = /<template\s+id=["']tpl-MyProfile["']>([\s\S]*?)<\/template>/i;
const match = content.match(regex);
if (match) {
  console.log('Found tpl-MyProfile, length:', match[0].length);
  fs.writeFileSync('scratch/profile_tpl.html', match[0]);
} else {
  console.log('Not found');
}
