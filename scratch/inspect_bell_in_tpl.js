const fs = require('fs');
const pApp = fs.readFileSync('preview_app.html', 'utf8');
const tplStart = pApp.indexOf('<template id="tpl-ManagerDashboard">');
const tplEnd = pApp.indexOf('</template>', tplStart);
const tplContent = pApp.substring(tplStart, tplEnd);
const bellIdx = tplContent.indexOf('mgr-bell');
if (bellIdx !== -1) {
  console.log('Found in tpl-ManagerDashboard:');
  console.log(JSON.stringify(tplContent.substring(bellIdx - 100, bellIdx + 300)));
} else {
  console.log('mgr-bell not found in tpl-ManagerDashboard');
}
