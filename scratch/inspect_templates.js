const fs = require('fs');

function inspectTemplates(filename) {
  console.log('=== Inspecting', filename, '===');
  const content = fs.readFileSync(filename, 'utf8');
  const regex = /<template\s+id=["']([^"']+)["']/g;
  let m;
  const templates = [];
  while ((m = regex.exec(content)) !== null) {
    templates.push({ id: m[1], index: m.index });
  }
  console.log('Found', templates.length, 'templates:');
  templates.forEach(t => console.log(' -', t.id, 'at index', t.index));
}

inspectTemplates('index.html');
inspectTemplates('preview_app.html');
