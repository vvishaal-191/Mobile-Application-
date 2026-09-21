const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const tpls = content.match(/<template id="tpl-[^"]+">[\s\S]*?<\/template>/g) || [];
console.log('Total templates found in index.html:', tpls.length);

tpls.forEach(t => {
  const idMatch = t.match(/id="([^"]+)"/);
  const id = idMatch ? idMatch[1] : 'unknown';
  const hasLogo = t.includes('logo') || t.includes('mini-logo');
  const imgMatches = t.match(/<img[^>]+>/g) || [];
  console.log(`\nTemplate: ${id}`);
  console.log(`  hasLogo keyword: ${hasLogo}`);
  console.log(`  img count: ${imgMatches.length}`);
  imgMatches.forEach(img => {
    console.log(`    img: ${img.slice(0, 120)}...`);
  });
  // Check header
  const headerMatch = t.match(/<div class="header">([\s\S]*?)<\/div>/);
  if (headerMatch) {
    console.log(`  header: ${headerMatch[0].replace(/\s+/g, ' ').slice(0, 150)}`);
  }
});
