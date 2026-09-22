const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

const tplStart = content.indexOf('id="tpl-ApplyLeave"');
const endIdx = content.indexOf('</template>', tplStart);
const templateContent = content.substring(tplStart, endIdx + 11);

// Find the body
const bodyStart = templateContent.indexOf('<body');
const bodyEnd = templateContent.indexOf('</body>');
const bodyContent = templateContent.substring(bodyStart, bodyEnd);

const screenStart = bodyContent.indexOf('<div class="device"');
const screenEnd = bodyContent.indexOf('<script');
console.log('=== tpl-ApplyLeave HTML Layout (verify order) ===');
console.log(bodyContent.substring(screenStart, screenEnd !== -1 ? screenEnd : bodyContent.length));
