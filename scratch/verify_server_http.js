const http = require('http');

const req = http.get('http://127.0.0.1:3000/preview_app.html', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Total bytes received:', data.length);
    console.log('Contains profile-header-banner:', data.includes('profile-header-banner'));
    console.log('Contains profile-hero-card:', data.includes('profile-hero-card'));
    console.log('Contains profile-status-card:', data.includes('profile-status-card'));
    console.log('Contains profile-camera-badge:', data.includes('profile-camera-badge'));
    console.log('Contains profile-logout-btn:', data.includes('profile-logout-btn'));
    console.log('Contains .screen.has-profile-header:', data.includes('.screen.has-profile-header'));
  });
});

req.on('error', (err) => {
  console.error('Request error code:', err.code, err.message);
});
