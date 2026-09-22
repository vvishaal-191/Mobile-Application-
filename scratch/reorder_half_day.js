const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

// Current order: [Half Day row] → [two-col From/To Date]
// Desired order: [two-col From/To Date] → [Half Day row]

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');

  // Find the half-day-row block start
  const halfDayStart = c.indexOf('\r\n          <div class="field half-day-row">');
  if (halfDayStart === -1) {
    console.warn('half-day-row not found in', f);
    return;
  }

  // Find end of half-day-row block: ends before two-col
  const twoColStart = c.indexOf('\r\n          <div class="field two-col">', halfDayStart);
  if (twoColStart === -1) {
    console.warn('two-col not found after half-day-row in', f);
    return;
  }

  // Find end of two-col block: ends before Number of Days
  const numDaysMarker = '\r\n          <div class="field"><label class="field-label">Number of Days</label>';
  const twoColEnd = c.indexOf(numDaysMarker, twoColStart);
  if (twoColEnd === -1) {
    console.warn('Number of Days field not found in', f);
    return;
  }

  // Extract the two blocks
  const halfDayBlock = c.substring(halfDayStart, twoColStart);
  const twoColBlock  = c.substring(twoColStart, twoColEnd);

  // Replace: put twoColBlock first, then halfDayBlock
  const original = halfDayBlock + twoColBlock;
  const swapped  = twoColBlock + halfDayBlock;

  if (c.includes(original)) {
    c = c.replace(original, swapped);
    fs.writeFileSync(f, c, 'utf8');
    console.log('Swapped: date fields before Half Day in:', f);
  } else {
    console.warn('Could not find exact original block in:', f);
  }
});

console.log('Done!');
