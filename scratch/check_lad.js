const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
console.log('index.html tpl-LeaveApprovalDetail index:', start);
if (start !== -1) {
  const tplOpen = content.lastIndexOf('<template', start);
  const end = content.indexOf('</template>', start);
  console.log('tplOpen:', tplOpen, 'end index:', end);
  const tpl = content.substring(tplOpen, end + 11);
  fs.writeFileSync('scratch/current_lad_tpl.html', tpl);
  console.log('Wrote scratch/current_lad_tpl.html, length:', tpl.length);
}
