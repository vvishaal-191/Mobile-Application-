const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

const mgrStart = c.indexOf('id="tpl-ManagerDashboard"');
const mgrEnd = c.indexOf('</template>', mgrStart);
const mgrTpl = c.substring(mgrStart, mgrEnd);

console.log('Manager Dashboard template length:', mgrTpl.length);

// Search for status / inactive / active
let pos = 0;
while ((pos = mgrTpl.indexOf('Inactive', pos)) !== -1) {
  console.log('Found Inactive at:', pos, mgrTpl.substring(pos - 60, pos + 100));
  pos += 8;
}

// Search for Active
pos = 0;
while ((pos = mgrTpl.indexOf('Active', pos)) !== -1) {
  console.log('Found Active at:', pos, mgrTpl.substring(pos - 60, pos + 100));
  pos += 6;
}

// Search for Recent Requests
pos = 0;
while ((pos = mgrTpl.indexOf('Recent Requests', pos)) !== -1) {
  console.log('Found Recent Requests at:', pos, mgrTpl.substring(pos - 60, pos + 100));
  pos += 15;
}

// Search for badges
pos = 0;
while ((pos = mgrTpl.indexOf('badge', pos)) !== -1) {
  console.log('Found badge at:', pos, mgrTpl.substring(pos - 40, pos + 80));
  pos += 5;
}
