const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const permTplStart = content.indexOf('id="tpl-ApplyPermission"');
const permTplEnd = content.indexOf('</template>', permTplStart);
const permTpl = content.substring(permTplStart, permTplEnd);

console.log('tpl-ApplyPermission length:', permTpl.length);

// Search for submit or manager or badge in permTpl
let pos = 0;
while ((pos = permTpl.indexOf('submit', pos)) !== -1) {
  console.log('submit in permTpl at:', pos, permTpl.substring(pos - 40, pos + 100));
  pos += 6;
}

pos = 0;
while ((pos = permTpl.indexOf('manager', pos)) !== -1) {
  console.log('manager in permTpl at:', pos, permTpl.substring(pos - 40, pos + 100));
  pos += 7;
}

pos = 0;
while ((pos = permTpl.indexOf('badge', pos)) !== -1) {
  console.log('badge in permTpl at:', pos, permTpl.substring(pos - 40, pos + 100));
  pos += 5;
}
