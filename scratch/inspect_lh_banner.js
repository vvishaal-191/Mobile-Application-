const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveHistory"');
console.log('tpl-LeaveHistory at', idx);
const endIdx = content.indexOf('</template>', idx);
const tpl = content.substring(idx, endIdx);
const bannerIdx = tpl.indexOf('class="header-banner"');
console.log(tpl.substring(bannerIdx, bannerIdx + 1200));
