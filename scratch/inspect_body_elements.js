const fs = require('fs');

const tpl = fs.readFileSync('scratch/current_lad_tpl.html', 'utf8');
const bodyStart = tpl.indexOf('<body>');
const bodyEnd = tpl.indexOf('</body>');
const body = tpl.substring(bodyStart, bodyEnd);

console.log('Images in body:');
const imgMatches = body.match(/<img[^>]*>/g);
if (imgMatches) {
  imgMatches.forEach(img => console.log('img tag length:', img.length, img.substring(0, 100)));
} else {
  console.log('No img tags');
}

console.log('SVGs in body:');
const svgMatches = body.match(/<svg[\s\S]*?<\/svg>/g);
if (svgMatches) {
  svgMatches.forEach(svg => console.log('svg length:', svg.length));
}

console.log('Scripts in body:');
const scriptMatches = body.match(/<script[\s\S]*?<\/script>/g);
if (scriptMatches) {
  scriptMatches.forEach(s => console.log('script length:', s.length));
}
