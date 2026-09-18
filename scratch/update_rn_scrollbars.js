const fs = require('fs');
const path = require('path');

function findFiles(dir, ext) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        results = results.concat(findFiles(fullPath, ext));
      }
    } else if (file.endsWith(ext)) {
      results.push(fullPath);
    }
  });
  return results;
}

const rnScreens = findFiles('EmergereApp/EmergereApp/src/screens', '.jsx');

rnScreens.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Replace <ScrollView contentContainerStyle={styles.scrollContent}>
  if (content.includes('<ScrollView contentContainerStyle={styles.scrollContent}>')) {
    content = content.replace(
      /<ScrollView contentContainerStyle=\{styles\.scrollContent\}>/g,
      '<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>'
    );
    changed = true;
  }

  // Replace <ScrollView style={{ maxHeight: 300 }}> (in MyAttendance)
  if (content.includes('<ScrollView style={{ maxHeight: 300 }}>')) {
    content = content.replace(
      /<ScrollView style=\{\{ maxHeight: 300 \}\}>/g,
      '<ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>'
    );
    changed = true;
  }

  // Generic fallback if any other <ScrollView without showsVerticalScrollIndicator exists
  if (content.includes('<ScrollView') && !content.includes('showsVerticalScrollIndicator')) {
    content = content.replace(
      /<ScrollView\b([^>]*?)>/g,
      (match, p1) => {
        if (p1.includes('showsVerticalScrollIndicator')) return match;
        return `<ScrollView${p1} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>`;
      }
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated React Native screen:', f);
  }
});
