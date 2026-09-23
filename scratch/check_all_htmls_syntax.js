const fs = require('fs');
const cp = require('child_process');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f + ': NOT FOUND');
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  // Find all <script> tags that are not src=""
  const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  let hasError = false;
  while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    const testFileName = `scratch/temp_${f.replace(/[\/\\\.]/g, '_')}_${count}.js`;
    fs.writeFileSync(testFileName, match[1], 'utf8');
    try {
      cp.execSync(`node -c "${testFileName}"`, { stdio: 'pipe' });
    } catch (e) {
      hasError = true;
      console.log(`${f} [script #${count}]: SYNTAX ERROR: ${e.stderr.toString().split('\n')[0]}`);
    }
  }
  if (!hasError) {
    console.log(`${f}: ALL ${count} inline scripts passed syntax check!`);
  }
});
