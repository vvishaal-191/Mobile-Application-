const fs = require('fs');

const svgHeaderBg = `<svg class="login-header-bg-svg" viewBox="0 0 400 240" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lgnHdrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0056FF"/>
      <stop offset="45%" stop-color="#0066FF"/>
      <stop offset="85%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#0D3BB0"/>
    </linearGradient>
    <linearGradient id="bldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#1E40AF" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="bldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.15"/>
    </linearGradient>
    <linearGradient id="bldGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#BFDBFE" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="lgnRibbon1" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.45"/>
      <stop offset="50%" stop-color="#2563EB" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0.05"/>
    </linearGradient>
    <linearGradient id="lgnRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Base Gradient -->
  <rect width="400" height="240" fill="url(#lgnHdrGrad)"/>

  <!-- City Architecture Backdrop (Right Side) -->
  <g opacity="0.85">
    <!-- Back building -->
    <polygon points="260,240 260,95 305,65 305,240" fill="url(#bldGrad1)"/>
    <!-- Grid windows on back building -->
    <line x1="270" y1="110" x2="295" y2="110" stroke="#FFFFFF" stroke-opacity="0.15" stroke-dasharray="2,3"/>
    <line x1="270" y1="125" x2="295" y2="125" stroke="#FFFFFF" stroke-opacity="0.15" stroke-dasharray="2,3"/>
    <line x1="270" y1="140" x2="295" y2="140" stroke="#FFFFFF" stroke-opacity="0.15" stroke-dasharray="2,3"/>
    <line x1="270" y1="155" x2="295" y2="155" stroke="#FFFFFF" stroke-opacity="0.15" stroke-dasharray="2,3"/>

    <!-- Mid building -->
    <polygon points="295,240 295,75 345,45 345,240" fill="url(#bldGrad3)"/>
    <line x1="305" y1="85" x2="335" y2="85" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
    <line x1="305" y1="100" x2="335" y2="100" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
    <line x1="305" y1="115" x2="335" y2="115" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
    <line x1="305" y1="130" x2="335" y2="130" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>

    <!-- Front glass tower (skyscraper on far right) -->
    <polygon points="330,240 330,55 385,25 400,32 400,240" fill="url(#bldGrad2)"/>
    <!-- Angled architectural lines & window grids -->
    <line x1="330" y1="55" x2="385" y2="25" stroke="#FFFFFF" stroke-opacity="0.4" stroke-width="1.5"/>
    <line x1="345" y1="70" x2="395" y2="42" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    <line x1="345" y1="90" x2="395" y2="62" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    <line x1="345" y1="110" x2="395" y2="82" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    <line x1="345" y1="130" x2="395" y2="102" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    <line x1="345" y1="150" x2="395" y2="122" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    <line x1="345" y1="170" x2="395" y2="142" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
    
    <line x1="355" y1="65" x2="355" y2="240" stroke="#FFFFFF" stroke-opacity="0.2"/>
    <line x1="375" y1="50" x2="375" y2="240" stroke="#FFFFFF" stroke-opacity="0.2"/>
  </g>

  <!-- Flowing Translucent Ribbon Curves -->
  <path d="M-20,90 C80,40 180,110 280,75 C340,55 380,25 420,10 L420,240 L-20,240 Z" fill="url(#lgnRibbon1)"/>
  <path d="M420,130 C320,140 220,90 140,150 C80,195 20,220 -20,230 L-20,240 L420,240 Z" fill="url(#lgnRibbon2)"/>

  <!-- Crisp Organic Lower Transition Wave -->
  <path d="M-10,175 C80,185 140,240 220,210 C290,185 350,195 410,180 L410,240 L-10,240 Z" fill="#FFFFFF" fill-opacity="0.22"/>
  <path d="M-10,195 C70,195 130,245 200,225 C280,200 340,235 410,205 L410,240 L-10,240 Z" fill="#FFFFFF" fill-opacity="0.38"/>
  <path d="M-10,210 C60,205 120,248 190,238 C260,228 330,248 410,220 L410,240 L-10,240 Z" fill="#EEF5FF"/>
</svg>`;

const svgBottomWaves = `<svg class="login-bottom-waves-svg" viewBox="0 0 400 180" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="botWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
      <stop offset="50%" stop-color="#60A5FA" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="botWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0066FF" stop-opacity="0.85"/>
      <stop offset="60%" stop-color="#1D4ED8" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#0052FF" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="botWaveGrad3" x1="0%" y1="0%" x2="100%" y2="80%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
      <stop offset="60%" stop-color="#2563EB" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#1E40AF" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <!-- Top soft cyan wave -->
  <path d="M0,70 C100,120 220,10 320,80 C360,110 390,90 400,80 L400,180 L0,180 Z" fill="url(#botWaveGrad1)"/>

  <!-- Middle cyan-blue wave -->
  <path d="M0,105 C80,60 180,130 280,85 C340,60 380,95 400,100 L400,180 L0,180 Z" fill="url(#botWaveGrad3)"/>

  <!-- Front deep blue wave -->
  <path d="M0,135 C110,95 210,165 310,120 C360,100 385,125 400,130 L400,180 L0,180 Z" fill="url(#botWaveGrad2)"/>

  <!-- Translucent Bokeh / Glowing Bubble Circles -->
  <circle cx="60" cy="120" r="14" fill="#FFFFFF" fill-opacity="0.25"/>
  <circle cx="110" cy="150" r="8" fill="#FFFFFF" fill-opacity="0.3"/>
  <circle cx="240" cy="95" r="6" fill="#38BDF8" fill-opacity="0.5"/>
  <circle cx="340" cy="110" r="12" fill="#FFFFFF" fill-opacity="0.35"/>
  <circle cx="380" cy="140" r="7" fill="#FFFFFF" fill-opacity="0.2"/>
</svg>`;

console.log('SVGs defined successfully.');
