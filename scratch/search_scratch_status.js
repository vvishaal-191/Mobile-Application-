const fs = require('fs');
const path = require('path');

const dir = 'scratch';
const files = fs.readdirSync(dir);
files.forEach(f => {
  if (f.endsWith('.html') || f.endsWith('.js')) {
    const c = fs.readFileSync(path.join(dir, f), 'utf8');
    if (c.includes('profile-status-pill') || c.includes('profile-status-dot') || c.includes('Employee Status') || c.includes('emp-status')) {
      console.log('Match in scratch file:', f);
      const lines = c.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('status-pill') || l.includes('status-dot') || l.includes('Employee Status') || l.includes('profile-emp-status')) {
          console.log(`  ${i+1}: ${l.trim()}`);
        }
      });
    }
  }
});
