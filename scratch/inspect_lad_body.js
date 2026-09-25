const fs = require('fs');
const path = require('path');

const tpl = fs.readFileSync(path.join(__dirname, 'current_lad_tpl.html'), 'utf8');

// Let's inspect the body HTML (strip large base64 strings if any)
const bodyMatch = tpl.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  let bodyHtml = bodyMatch[1];
  // replace long base64
  bodyHtml = bodyHtml.replace(/data:image\/[^;]+;base64,[^"']+/g, '[BASE64_IMG]');
  console.log('Body length:', bodyHtml.length);
  fs.writeFileSync(path.join(__dirname, 'current_lad_body.html'), bodyHtml, 'utf8');
  console.log('Saved body to current_lad_body.html');
} else {
  console.log('No body found');
}
