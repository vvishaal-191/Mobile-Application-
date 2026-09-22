const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const oldCss = `        /* Half Day Row */
        .half-day-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 4px 0;
        }
        .half-day-row .half-day-check-wrap {
          display: flex;
          align-items: center;
          padding-top: 4px;
          flex-shrink: 0;
          min-width: 110px;
        }
        .half-day-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          user-select: none;
        }
        .half-day-row .half-day-type-wrap {
          flex: 1;
        }`;

const newCss = `        /* Half Day Row */
        .half-day-row {
          display: block;
          padding: 4px 0;
          margin-bottom: 2px;
        }
        .half-day-row .half-day-check-wrap {
          display: flex;
          align-items: center;
          margin-bottom: 0;
        }
        .half-day-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 500;
          color: var(--text);
          cursor: pointer;
          user-select: none;
        }
        .half-day-row .half-day-type-wrap {
          margin-top: 14px;
          width: 100%;
        }`;

let updated = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes(oldCss)) {
    c = c.replace(oldCss, newCss);
    fs.writeFileSync(f, c, 'utf8');
    updated++;
    console.log('Updated CSS in:', f);
  } else {
    console.warn('CSS target not found in:', f);
  }
});
console.log('Done! Updated', updated, 'files.');
