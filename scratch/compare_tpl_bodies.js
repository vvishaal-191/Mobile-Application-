const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');

function getTemplateSnippet(id) {
  const start = content.indexOf(`id="${id}"`);
  if (start === -1) return 'NOT FOUND';
  const end = content.indexOf('</template>', start);
  const tpl = content.substring(start, end);
  
  // Extract body
  const bodyStart = tpl.indexOf('<body');
  const bodyEnd = tpl.indexOf('</body>');
  let bodyContent = tpl.substring(bodyStart, bodyEnd + 7);
  // remove long base64
  bodyContent = bodyContent.replace(/data:image\/[^;]+;base64,[^"']+/g, 'data:image/...[BASE64]...');
  return bodyContent;
}

console.log('=== LEAVE APPROVALS BODY ===');
console.log(getTemplateSnippet('tpl-LeaveApprovals').substring(0, 2000));

console.log('\n=== PERMISSION APPROVALS BODY ===');
console.log(getTemplateSnippet('tpl-PermissionApprovals').substring(0, 2000));
