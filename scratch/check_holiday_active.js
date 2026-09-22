const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.html',
  'EmergereApp/EmergereApp/src/screens/HolidayCalendar/HolidayCalendarScreen.jsx'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (f.endsWith('.jsx')) {
    const match = c.match(/<BottomNavBar[^>]*>/g);
    console.log(f, match);
  } else {
    const tplStart = c.indexOf('id="tpl-HolidayCalendar"');
    if (tplStart !== -1) {
      const tplEnd = c.indexOf('</template>', tplStart);
      const slice = c.slice(tplStart, tplEnd);
      const activeTabs = slice.match(/<div class="tab active">[\s\S]*?<\/div>/g);
      console.log(f, activeTabs ? activeTabs.length : 0, 'active tab(s)');
      if (activeTabs) console.log(activeTabs[0].replace(/\s+/g, ' '));
    } else {
      const activeTabs = c.match(/<div class="tab active">[\s\S]*?<\/div>/g);
      console.log(f, activeTabs ? activeTabs.length : 0, 'active tab(s)');
      if (activeTabs) console.log(activeTabs[0].replace(/\s+/g, ' '));
    }
  }
});
