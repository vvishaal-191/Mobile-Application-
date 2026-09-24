const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'preview_app.html');
const content = fs.readFileSync(file, 'utf8');

const tplStart = content.indexOf('<template id="tpl-MyProfile">');
const tplEnd = content.indexOf('</template>', tplStart);
const tpl = content.substring(tplStart, tplEnd);

console.log('Template length:', tpl.length);
console.log('Contains .bottom-nav in CSS:', tpl.indexOf('.bottom-nav {') !== -1);
console.log('Contains display: flex in .bottom-nav:', tpl.indexOf('display: flex !important') !== -1);
console.log('Contains handleNavTab:', tpl.indexOf('handleNavTab(') !== -1);
console.log('Contains nav-apply-circle:', tpl.indexOf('class="nav-apply-circle"') !== -1);
console.log('Contains tab-dashboard:', tpl.indexOf('id="tab-dashboard"') !== -1);
console.log('Contains tab-attendance:', tpl.indexOf('id="tab-attendance"') !== -1);
console.log('Contains tab-apply:', tpl.indexOf('id="tab-apply"') !== -1);
console.log('Contains tab-history:', tpl.indexOf('id="tab-history"') !== -1);
console.log('Contains tab-profile:', tpl.indexOf('id="tab-profile"') !== -1);
console.log('Contains active Profile pill:', tpl.indexOf('class="nav-pill-wrap"') !== -1);
console.log('Contains active dot indicator:', tpl.indexOf('class="active-dot-indicator"') !== -1);

// Check if .bottom-nav is placed after </div class="screen">
const screenClose = tpl.lastIndexOf('</div>\n  </div>\n\n  <!-- Bottom Navigation Bar');
console.log('Is bottom-nav placed outside screen:', tpl.indexOf('<!-- Bottom Navigation Bar (Image 2 Reference) -->') !== -1);
