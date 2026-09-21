const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

function inspectTemplate(tplId) {
  const match = content.match(new RegExp(`<template id="${tplId}">([\\s\\S]*?)<\\/template>`));
  if (!match) {
    console.log(`Template ${tplId} not found`);
    return;
  }
  const tpl = match[1];
  console.log(`\n=== Template: ${tplId} ===`);
  const imgs = tpl.match(/<img[^>]+>/g) || [];
  console.log(`Total <img>: ${imgs.length}`);
  imgs.forEach((img, i) => {
    console.log(`  img ${i+1}: ${img.replace(/data:image\/[^;]+;base64,[^"]+/, '[BASE64]').slice(0, 150)}`);
  });
  // Search for any mention of logo in the template
  const lines = tpl.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('logo') || l.includes('brand') || l.includes('header')) {
      console.log(`  L${i+1}: ${l.trim().replace(/data:image\/[^;]+;base64,[^"]+/, '[BASE64]').slice(0, 100)}`);
    }
  });
}

inspectTemplate('tpl-EmployeeDashboard');
inspectTemplate('tpl-ManagerDashboard');
