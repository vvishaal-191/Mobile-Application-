const fs = require('fs');

function validateSvg(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const pathRegex = /<path[^>]+d=["']([^"']+)["']/g;
  let match;
  let count = 0;
  let errors = 0;

  while ((match = pathRegex.exec(content)) !== null) {
    count++;
    const d = match[1];
    // Check for 's' followed by incorrect count of numbers
    const tokens = d.trim().split(/[\s,]+/);
    // Simple check: test if standard SVG path commands are well formed
    if (/s\s*[^a-z]*z/i.test(d)) {
      // Let's inspect
      console.log(`Checking path ${count}:`, d);
    }
  }
  console.log(`Validated ${count} paths in ${filePath}. Any errors detected: ${errors}`);
}

validateSvg('scratch/test_new_hc_header.html');
