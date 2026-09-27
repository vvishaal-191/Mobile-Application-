const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const tpls = [...content.matchAll(/<template id="([^"]+)">([\s\S]*?)<\/template>/g)];
tpls.forEach(t => {
  const id = t[1];
  const body = t[2];
  const screenMatch = body.match(/<div class="screen[^"]*"[^>]*>/);
  if (screenMatch) {
    console.log(id, '-->', screenMatch[0]);
  }
});
