const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const isCrlf = content.includes('\r\n');
  const nl = isCrlf ? '\r\n' : '\n';
  
  // Find start of .login-logo around line 11400 (after 2000000)
  const pos = content.indexOf('.login-logo {', 2000000);
  if (pos === -1) {
    console.error(`Could not find .login-logo in ${f}`);
    return;
  }
  
  // Find the end of .login-logo:active { ... }
  const activePos = content.indexOf('.login-logo:active', pos);
  const endPos = content.indexOf('}', activePos) + 1;
  
  const original = content.substring(pos, endPos);
  console.log(`Found block in ${f} (${original.length} chars)`);
  
  const replacement = [
    '.login-logo {',
    '              width: 76px !important;',
    '              height: 76px !important;',
    '              border-radius: 0 !important;',
    '              object-fit: contain !important;',
    '              filter: drop-shadow(0 0 8px rgba(77, 150, 255, 0.35));',
    '              margin-bottom: 24px !important;',
    '              cursor: pointer !important;',
    '              transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease !important;',
    '              animation: logoBlueGlow 4s ease-in-out infinite;',
    '            }',
    '            .login-logo:hover {',
    '              transform: scale(1.04) !important;',
    '              filter: drop-shadow(0 0 12px rgba(77, 150, 255, 0.55)) !important;',
    '            }',
    '            .login-logo:active {',
    '              transform: scale(0.96) !important;',
    '            }',
    '            @keyframes logoBlueGlow {',
    '              0%, 100% {',
    '                filter: drop-shadow(0 0 6px rgba(77, 150, 255, 0.3));',
    '              }',
    '              50% {',
    '                filter: drop-shadow(0 0 10px rgba(77, 150, 255, 0.45));',
    '              }',
    '            }'
  ].join(nl);
  
  content = content.substring(0, pos) + replacement + content.substring(endPos);
  fs.writeFileSync(f, content, 'utf8');
  console.log(`Successfully updated ${f}`);
});
