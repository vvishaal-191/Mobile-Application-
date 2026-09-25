const fs = require('fs');

const tpl = fs.readFileSync('scratch/current_mgr_tpl_inspect.html', 'utf8');

// Find all HTML sections/cards in body
const bodyStart = tpl.indexOf('<body');
const scriptStart = tpl.indexOf('<script', bodyStart);
const bodyHtml = tpl.substring(bodyStart, scriptStart);

console.log('Body length:', bodyHtml.length);
// List main divs / headers
const headings = bodyHtml.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi);
console.log('Headings in Manager Dashboard:', headings);

// Find all class names
const classMatches = bodyHtml.match(/class="([^"]+)"/g);
const classes = [...new Set(classMatches.map(c => c.replace(/class="|"/g, '')))];
console.log('Classes:', classes);
