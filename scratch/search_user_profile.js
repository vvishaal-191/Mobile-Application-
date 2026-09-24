const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const matches = [...content.matchAll(/USER_PROFILE/g)];
console.log('Matches for USER_PROFILE:', matches.length);
matches.forEach((m, idx) => {
  if (idx < 15) {
    console.log(m.index, content.substring(Math.max(0, m.index - 40), Math.min(content.length, m.index + 100)).replace(/\n/g, ' '));
  }
});
