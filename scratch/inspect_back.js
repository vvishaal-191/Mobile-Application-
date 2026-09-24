const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');

const tpls = ['tpl-HolidayCalendar', 'tpl-ApplyPermission', 'tpl-MyProfile', 'tpl-LeaveBalance'];
tpls.forEach(t => {
  const idx = content.indexOf(`id="${t}"`);
  if (idx !== -1) {
    const end = content.indexOf('</template>', idx);
    const chunk = content.substring(idx, end);
    console.log(`=== ${t} ===`);
    const backMatches = chunk.match(/onclick="[^"]*back[^"]*"/gi) || [];
    backMatches.forEach(m => console.log('  ', m));
    const navMatches = chunk.match(/handleBack[a-zA-Z0-9_]*\([^)]*\)/gi) || [];
    navMatches.forEach(m => console.log('   func call:', m));
    const scriptIdx = chunk.indexOf('<script>');
    if (scriptIdx !== -1) {
      const script = chunk.substring(scriptIdx);
      const funcMatch = script.match(/function\s+(?:handleBack|goBack|navigateBack)[^{]*\{[^}]*\}/gi);
      if (funcMatch) {
        funcMatch.forEach(f => console.log('   func def:', f));
      }
    }
  }
});
