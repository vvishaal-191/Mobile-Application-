const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const tplStart = content.indexOf('id="tpl-HolidayCalendar"');
  if (tplStart === -1) {
    console.error(`tpl-HolidayCalendar not found in ${f}`);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  if (tplEnd === -1) {
    console.error(`</template> not found for tpl-HolidayCalendar in ${f}`);
    return;
  }

  const before = content.slice(0, tplStart);
  let tpl = content.slice(tplStart, tplEnd);
  const after = content.slice(tplEnd);

  const target = '<div class="tab active"><span class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"';
  const replacement = '<div class="tab"><span class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"';

  if (!tpl.includes(target)) {
    console.error(`Target string not found in tpl-HolidayCalendar of ${f}`);
    return;
  }

  tpl = tpl.replace(target, replacement);
  content = before + tpl + after;
  fs.writeFileSync(f, content, 'utf8');
  console.log(`Successfully updated ${f}`);
});
