const fs = require('fs');

function searchInFile(filePath, regex) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const results = [];
  lines.forEach((line, idx) => {
    if (regex.test(line)) {
      results.push({ lineNum: idx + 1, content: line.trim() });
    }
  });
  return results;
}

const file = process.argv[2] || 'index.html';
const term = process.argv[3] || 'Holiday';
const re = new RegExp(term, 'i');
const res = searchInFile(file, re);
console.log(`Found ${res.length} matches in ${file} for "${term}":`);
res.slice(0, 30).forEach(r => console.log(`${r.lineNum}: ${r.content}`));
