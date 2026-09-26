const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Let's search for how EMP_LEAVE_REQUESTS and PERM_STATE get populated
console.log('Testing flow...');

// Let's create mock DOM & window
const dom = {
  getElementById: function(id) {
    return null;
  }
};

// Check if any default data exists in index.html
const defaultReqs = [];
const reqRegex = /\{[^{}]*id:\s*['\"][^'\"]+['\"][^{}]*status:\s*['\"]pending['\"][^{}]*\}/g;
let m;
while ((m = reqRegex.exec(html)) !== null) {
  defaultReqs.push(m[0].slice(0, 100));
}
console.log('Default pending requests in index.html:', defaultReqs.length);
defaultReqs.slice(0, 5).forEach(x => console.log('  ' + x));
