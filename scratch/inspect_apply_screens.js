const fs = require('fs');

function inspectTemplate(html, id) {
  const start = html.indexOf(`<template id="${id}">`);
  if (start === -1) return null;
  const end = html.indexOf('</template>', start);
  const content = html.substring(start, end);
  
  // Extract style tag
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1] : '';
  
  // Extract body, device, screen styles
  const bodyStyle = (style.match(/body\s*\{([\s\S]*?)\}/) || [])[1] || '';
  const deviceStyle = (style.match(/\.device\s*\{([\s\S]*?)\}/) || [])[1] || '';
  const screenStyle = (style.match(/\.screen\s*\{([\s\S]*?)\}/) || [])[1] || '';
  const bottomNavStyle = (style.match(/\.bottom-nav\s*\{([\s\S]*?)\}/) || [])[1] || '';
  
  // Extract HTML structure around screen and bottom-nav
  const screenTag = (content.match(/<div class="screen[^"]*">/) || [])[0] || '';
  const hasBottomNav = content.includes('class="bottom-nav"');
  
  return {
    id,
    bodyStyle: bodyStyle.replace(/\s+/g, ' ').trim(),
    deviceStyle: deviceStyle.replace(/\s+/g, ' ').trim(),
    screenStyle: screenStyle.replace(/\s+/g, ' ').trim(),
    bottomNavStyle: bottomNavStyle.replace(/\s+/g, ' ').trim(),
    screenTag,
    hasBottomNav
  };
}

for (const file of ['index.html', 'preview_app.html']) {
  console.log(`\n=================== FILE: ${file} ===================`);
  const html = fs.readFileSync(file, 'utf8');
  console.log('--- ApplyLeave ---');
  console.log(inspectTemplate(html, 'tpl-ApplyLeave'));
  console.log('--- ApplyPermission ---');
  console.log(inspectTemplate(html, 'tpl-ApplyPermission'));
}
