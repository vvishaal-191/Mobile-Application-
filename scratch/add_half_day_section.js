const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

// We'll insert a "Half Day" section with a checkbox and Leave Type (First Half) dropdown
// AFTER the From Date / To Date two-col section and BEFORE Number of Days
// 
// Target: the "Number of Days" field div block
// We insert our new Half Day card BEFORE it

const targetStr = '\r\n          <div class="field"><label class="field-label">Number of Days</label>\r\n            <div class="auto-box" id="days-count-box">1.0 Day (Auto-calculated)</div>\r\n          </div>';

const halfDaySection = `\r\n          <div class="field half-day-row">\r\n            <div class="half-day-check-wrap">\r\n              <label class="half-day-label" for="half-day-check">\r\n                <input type="checkbox" id="half-day-check" onchange="toggleHalfDay(this.checked)" style="width:18px;height:18px;accent-color:var(--primary);cursor:pointer;flex-shrink:0;" />\r\n                <span>Half Day</span>\r\n              </label>\r\n            </div>\r\n            <div class="half-day-type-wrap" id="half-day-type-wrap" style="display:none;">\r\n              <label class="field-label" style="margin-bottom:6px;display:block;">Leave Type <span style="color:var(--danger)">*</span></label>\r\n              <div class="select-wrap" style="position:relative;">\r\n                <select id="half-day-type-select" style="width:100%; border:1px solid var(--border); border-radius:12px; padding:12px 40px 12px 14px; font-size:15px; color:var(--text); background:var(--surface); font-family:inherit; cursor:pointer; appearance:none; -webkit-appearance:none; font-weight:500; transition:border-color 0.25s ease, box-shadow 0.25s ease;">\r\n                  <option value="First Half">First Half</option>\r\n                  <option value="Second Half">Second Half</option>\r\n                </select>\r\n                <div style="position:absolute; right:16px; top:50%; transform:translateY(-50%); pointer-events:none; display:flex; align-items:center; color:#111827;">\r\n                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>\r\n                </div>\r\n              </div>\r\n            </div>\r\n          </div>`;

const replacement = halfDaySection + targetStr;

// Also add the CSS for the half-day-row
const cssTarget = '        /* ---- Apply Leave specific ---- */';
const cssInsert = `        /* Half Day Row */
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
        }

        `;

let updatedCount = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  
  // Insert the Half Day section before Number of Days
  if (c.includes(targetStr)) {
    c = c.replace(targetStr, replacement);
    
    // Also add CSS if not already present
    if (!c.includes('.half-day-row')) {
      // Find the Apply Leave CSS section or inject near screen-specific CSS
      const cssInsertPoint = c.indexOf(cssTarget, c.indexOf('tpl-ApplyLeave'));
      if (cssInsertPoint !== -1) {
        c = c.substring(0, cssInsertPoint) + cssInsert + c.substring(cssInsertPoint);
      } else {
        // Find Apply Leave template and add CSS before the screen-specific section
        const applyLeaveTpl = c.indexOf('id="tpl-ApplyLeave"');
        const screenSpecific = c.indexOf('/* ---- ', applyLeaveTpl);
        if (screenSpecific !== -1) {
          c = c.substring(0, screenSpecific) + cssInsert + c.substring(screenSpecific);
        } else {
          // Add before the body tag in ApplyLeave template
          const closeStyleIdx = c.indexOf('</style>', applyLeaveTpl);
          if (closeStyleIdx !== -1) {
            c = c.substring(0, closeStyleIdx) + cssInsert + c.substring(closeStyleIdx);
          }
        }
      }
    }
    
    // Add the toggleHalfDay JS function before </script> in the tpl-ApplyLeave template
    const tplIdx = c.indexOf('id="tpl-ApplyLeave"');
    const tplEnd = c.indexOf('</template>', tplIdx);
    
    // Find and inject our function into the first script block of the template that has handleApplyLeaveSubmit
    if (!c.includes('function toggleHalfDay')) {
      const submitFnIdx = c.indexOf('function handleApplyLeaveSubmit', tplIdx);
      if (submitFnIdx !== -1) {
        const toggleFn = `function toggleHalfDay(isChecked) {
          var wrap = document.getElementById('half-day-type-wrap');
          var daysBox = document.getElementById('days-count-box');
          if (wrap) wrap.style.display = isChecked ? 'block' : 'none';
          if (isChecked && daysBox) {
            daysBox.textContent = '0.5 Day (Half Day)';
          } else if (!isChecked && daysBox) {
            daysBox.textContent = '1.0 Day (Auto-calculated)';
          }
        }

        `;
        c = c.substring(0, submitFnIdx) + toggleFn + c.substring(submitFnIdx);
      }
    }
    
    fs.writeFileSync(f, c, 'utf8');
    updatedCount++;
    console.log('Updated:', f);
  } else {
    console.warn('Target string NOT FOUND in:', f);
  }
});

console.log('Done! Updated', updatedCount, 'files.');
