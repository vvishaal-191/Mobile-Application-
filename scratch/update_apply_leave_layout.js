const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const oldCssPattern = `        /* Half Day Row — two-col layout mirroring date fields */
        .half-day-row {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 4px 0;
          margin-bottom: 8px;
        }
        .half-day-col-left {
          flex: 1;
          display: flex;
          align-items: center;
          min-height: 46px;
          padding-left: 10px;
        }
        .half-day-col-right {
          flex: 1;
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
        }`;

const newCss = `        /* Half Day Row — two-col layout mirroring date fields */
        .half-day-row,
        .field.half-day-row {
          display: flex;
          gap: 12px;
          align-items: flex-end;
          padding: 0 20px;
          margin-bottom: 18px;
        }
        .half-day-col-left {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          height: 44px;
          padding-left: 8px;
        }
        .half-day-col-right {
          flex: 1;
          min-width: 0;
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
        }`;

const oldSelectHtml = `padding:10px 36px 10px 12px; font-size:14px;`;
const newSelectHtml = `height:44px; padding:0 36px 0 12px; font-size:14px;`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Normalize CRLF to LF for matching
  const hasCRLF = content.includes('\r\n');
  let normalized = content.replace(/\r\n/g, '\n');
  const normalizedOldCss = oldCssPattern.replace(/\r\n/g, '\n');
  const normalizedNewCss = newCss.replace(/\r\n/g, '\n');

  if (normalized.includes(normalizedOldCss)) {
    normalized = normalized.replace(normalizedOldCss, normalizedNewCss);
    changed = true;
    console.log(`CSS replaced in ${f}`);
  } else {
    console.warn(`CSS pattern not found in ${f}`);
  }

  if (normalized.includes(oldSelectHtml)) {
    normalized = normalized.replace(oldSelectHtml, newSelectHtml);
    changed = true;
    console.log(`Select HTML replaced in ${f}`);
  }

  if (changed) {
    if (hasCRLF) {
      normalized = normalized.replace(/\n/g, '\r\n');
    }
    fs.writeFileSync(f, normalized, 'utf8');
    console.log(`Successfully updated ${f}`);
  }
});
