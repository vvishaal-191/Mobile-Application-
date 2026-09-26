const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveApprovals"');
const endIdx = content.indexOf('</template>', idx);
const tpl = content.substring(idx, endIdx);

const bannerIdx = tpl.indexOf('class="la-header-banner-wrap"');
console.log('la-header-banner-wrap at', bannerIdx);
if (bannerIdx !== -1) {
  console.log(tpl.substring(bannerIdx, bannerIdx + 400));
} else {
  console.log('la-header-banner-wrap not found in preview_app.html!');
}
