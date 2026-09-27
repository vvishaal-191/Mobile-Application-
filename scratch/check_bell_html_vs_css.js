const fs = require('fs');
const pApp = fs.readFileSync('preview_app.html', 'utf8');
const tplStart = pApp.indexOf('<template id="tpl-ManagerDashboard">');
const tplEnd = pApp.indexOf('</template>', tplStart);
const tplContent = pApp.substring(tplStart, tplEnd);

console.log('HTML div match:', tplContent.includes('<div class="mgr-bell-btn"'));
console.log('CSS class match:', tplContent.includes('.mgr-bell-btn'));
console.log('Dot match:', tplContent.includes('.mgr-bell-dot'));
