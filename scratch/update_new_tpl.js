const fs = require('fs');

let tpl = fs.readFileSync('scratch/new_leave_balance_tpl.html', 'utf8');

// Update body and .device styles in template
const oldDeviceCss = `        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: var(--bg);
          display: flex;
          justify-content: center;
          align-items: stretch;
          padding: 0;
          height: 100vh;
        }

        .device {
          width: 100%;
          max-width: 390px;
          height: 844px;
          background: var(--bg);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          box-shadow: 0 0 20px rgba(0,0,0,.15);
        }

        @media (min-width: 480px) {
          body { background: #0e1420; padding: 15px 0; align-items: center; }
          .device { border-radius: 40px; border: 8px solid #1f2937; height: 844px; box-shadow: 0 20px 40px rgba(0,0,0,.4); }
        }`;

const newDeviceCss = `        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: var(--bg);
          display: flex;
          justify-content: center;
          align-items: stretch;
          padding: 0;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .device {
          width: 100%;
          max-width: 440px;
          height: 100vh;
          height: 100dvh;
          background: var(--bg);
          border-radius: 0;
          border: none;
          overflow: hidden;
          position: relative;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        @media (min-width: 769px) {
          body { background: #0e1420; padding: 15px 0; align-items: center; }
          .device { border-radius: 40px; border: 8px solid #1f2937; height: 844px; box-shadow: 0 20px 40px rgba(0,0,0,.4); }
        }`;

if (tpl.includes(oldDeviceCss)) {
  tpl = tpl.replace(oldDeviceCss, newDeviceCss);
  console.log('Successfully updated device CSS in new_leave_balance_tpl.html');
} else {
  console.error('Could not find oldDeviceCss in new_leave_balance_tpl.html');
}

// Update lb-header-banner to ensure width 100% !important and padding 18px 20px 24px 20px
tpl = tpl.replace(
  /\.lb-header-banner\s*\{[\s\S]*?padding:\s*16px\s*18px\s*24px\s*18px\s*!important;/,
  `.lb-header-banner {
          position: relative;
          width: 100% !important;
          margin: 0 !important;
          margin-top: 0 !important;
          padding: 18px 20px 24px 20px !important;`
);

// Update cards container padding to 16px 20px 20px 20px
tpl = tpl.replace(
  /\.lb-cards-container\s*\{\s*padding:\s*16px\s*18px\s*20px\s*18px;/,
  `.lb-cards-container {
          padding: 16px 20px 20px 20px;`
);

fs.writeFileSync('scratch/new_leave_balance_tpl.html', tpl, 'utf8');
console.log('Done writing updated scratch/new_leave_balance_tpl.html');
