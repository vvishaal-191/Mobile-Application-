const fs = require('fs');

const tpl = fs.readFileSync('scratch/current_lad_tpl.html', 'utf8');
console.log('Total length:', tpl.length);

const headStart = tpl.indexOf('<head>');
const headEnd = tpl.indexOf('</head>');
console.log('Head length:', headEnd - headStart);

const bodyStart = tpl.indexOf('<body>');
const bodyEnd = tpl.indexOf('</body>');
console.log('Body length:', bodyEnd - bodyStart);

const scriptStart = tpl.indexOf('<script>');
const scriptEnd = tpl.indexOf('</script>');
console.log('Script length:', scriptEnd - scriptStart);
