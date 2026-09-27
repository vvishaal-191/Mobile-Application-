const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const paIdx = content.indexOf('id="tpl-PermissionApprovals"');
const nextTplIdx = content.indexOf('<template id=', paIdx + 1);
const tplContent = content.substring(paIdx, nextTplIdx);

const styleMatch = tplContent.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
  const css = styleMatch[1];
  console.log('CSS lines with padding or margin or screen or header:');
  css.split('\n').forEach((l, i) => {
    if (/screen|header|banner|device|body|padding|margin/i.test(l) && !l.includes('base64')) {
      console.log((i + 1) + ': ' + l);
    }
  });
}
