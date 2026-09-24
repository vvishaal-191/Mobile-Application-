const http = require('http');

http.get('http://127.0.0.1:3000/EmergereApp/EmergereApp/src/screens/MyProfile/preview.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Standalone screen HTTP Status:', res.statusCode);
    console.log('Standalone screen bytes:', data.length);
    console.log('Contains profile-header-banner:', data.includes('profile-header-banner'));
  });
}).on('error', (err) => {
  console.error(err);
});
