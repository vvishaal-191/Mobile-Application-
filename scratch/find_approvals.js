const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const lines = content.split(/\r?\n/);

lines.forEach((line, idx) => {
  if (line.includes('approve') || line.includes('Approve') || line.includes('reject') || line.includes('Reject')) {
    if (line.includes('function') || line.includes('onclick') || line.includes('status')) {
      console.log(`${idx + 1}: ${line.trim()}`);
    }
  }
});
