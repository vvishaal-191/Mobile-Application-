const fs = require('fs');

const artBuf = fs.readFileSync('assets/requests-header-art.png');
const artB64 = artBuf.toString('base64');

const emptyBuf = fs.readFileSync('assets/empty-requests-art.png');
const emptyB64 = emptyBuf.toString('base64');

const newTpl = fs.readFileSync('scratch/new_leave_history_tpl.html', 'utf8');

// 1. Update the 4 HTML shell files
const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const startIdx = content.indexOf('<template id="tpl-LeaveHistory">');
    const endIdx = content.indexOf('</template>', startIdx);
    if (startIdx !== -1 && endIdx !== -1) {
      content = content.substring(0, startIdx) + newTpl + content.substring(endIdx);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}: replaced tpl-LeaveHistory successfully.`);
    } else {
      console.error(`Error: Could not locate tpl-LeaveHistory in ${file}`);
    }
  }
});

// 2. Update EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.css
const previewCssPath = 'EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.css';
if (fs.existsSync(previewCssPath)) {
  let css = fs.readFileSync(previewCssPath, 'utf8');
  
  const oldCssPattern = /\/\* Header Card Banner matching Image 2 \*\/[\s\S]*?\.mr-back-btn:active\s*\{[\s\S]*?\}/;
  
  const newHeaderCss = `/* Header Card Banner matching Image 2 */
.mr-header-banner {
  position: relative;
  width: 100% !important;
  margin: 0 !important;
  margin-top: 0 !important;
  padding: 18px 20px 24px 20px !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
  background: linear-gradient(135deg, #005CE6 0%, #0066FF 45%, #1877F2 100%);
  color: #FFFFFF;
  box-sizing: border-box;
  min-height: 116px;
}

.mr-header-banner::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -20px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.mr-header-banner::after {
  content: '';
  position: absolute;
  bottom: -40px;
  left: -20px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.mr-header-waves {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 55px;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.mr-header-wave-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.mr-header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.mr-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.mr-back-btn {
  width: 38px;
  height: 38px;
  min-width: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: transform 0.2s ease, background 0.2s ease;
  padding: 0;
  position: relative;
  z-index: 10;
}

.mr-back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.mr-header-text {
  display: flex;
  flex-direction: column;
}

.mr-header-title {
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.2;
}

.mr-header-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  margin: 4px 0 0 0;
  font-weight: 400;
  white-space: nowrap;
}

.mr-header-illustration {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -4px;
}

.mr-header-art-img {
  width: 82px;
  height: 82px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 4px 12px rgba(0, 30, 100, 0.25));
}`;

  if (oldCssPattern.test(css)) {
    css = css.replace(oldCssPattern, newHeaderCss);
    fs.writeFileSync(previewCssPath, css, 'utf8');
    console.log(`Updated ${previewCssPath} successfully.`);
  } else {
    console.error(`Could not match old header CSS in ${previewCssPath}`);
  }
}

// 3. Update EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.html
const previewHtmlPath = 'EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.html';
if (fs.existsSync(previewHtmlPath)) {
  let pHtml = fs.readFileSync(previewHtmlPath, 'utf8');
  
  const newHeaderHtml = `    <!-- Royal Blue Gradient Header Banner matching Image 2 -->
    <div class="mr-header-banner" id="mr-header-banner">
      <div class="mr-header-waves">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" class="mr-header-wave-svg">
          <path d="M0,25 C120,55 260,0 400,30 L400,60 L0,60 Z" fill="rgba(255,255,255,0.09)"></path>
          <path d="M0,40 C140,15 280,50 400,20 L400,60 L0,60 Z" fill="rgba(255,255,255,0.06)"></path>
        </svg>
      </div>
      <div class="mr-header-top-row">
        <div class="mr-header-left">
          <button 
            class="mr-back-btn" 
            onclick="handleRequestsBackNav()" 
            title="Go Back" 
            aria-label="Go Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="mr-header-text">
            <h1 class="mr-header-title">My Requests</h1>
            <p class="mr-header-subtitle">Track your leaves &amp; permissions</p>
          </div>
        </div>
        <div class="mr-header-illustration">
          <img 
            src="data:image/png;base64,${artB64}" 
            alt="" 
            class="mr-header-art-img" 
            onerror="this.style.display='none'; var svg=document.getElementById('mr-header-svg-fallback'); if(svg) svg.style.display='block';"
          />
          <svg id="mr-header-svg-fallback" style="display:none; width:82px; height:82px;" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="mrClipShadow" x="6" y="8" width="80" height="84" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="#002D80" flood-opacity="0.25"/>
              </filter>
              <filter id="mrClockShadow" x="48" y="48" width="46" height="46" filterUnits="userSpaceOnUse">
                <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#001F5C" flood-opacity="0.3"/>
              </filter>
            </defs>
            <circle cx="28" cy="24" r="14" fill="#60A5FA" fill-opacity="0.35"/>
            <circle cx="78" cy="30" r="12" fill="#60A5FA" fill-opacity="0.3"/>
            <rect x="18" y="16" width="56" height="68" rx="12" fill="#FFFFFF" filter="url(#mrClipShadow)"/>
            <rect x="34" y="10" width="24" height="12" rx="4" fill="#93C5FD"/>
            <rect x="41" y="7" width="10" height="6" rx="3" fill="#60A5FA"/>
            <rect x="28" y="30" width="36" height="5" rx="2.5" fill="#BFDBFE"/>
            <rect x="28" y="40" width="36" height="5" rx="2.5" fill="#BFDBFE"/>
            <rect x="28" y="50" width="28" height="5" rx="2.5" fill="#BFDBFE"/>
            <rect x="28" y="60" width="22" height="5" rx="2.5" fill="#BFDBFE"/>
            <g filter="url(#mrClockShadow)">
              <circle cx="70" cy="70" r="18" fill="#0066FF" stroke="#FFFFFF" stroke-width="3.5"/>
              <path d="M70 60V70H77" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
          </svg>
        </div>
      </div>
    </div>`;

  const bannerRegex = /<!-- Royal Blue Gradient Header Banner matching Image 2 -->[\s\S]*?<\/div>\s*<!-- Filter Segment Bar/;
  if (bannerRegex.test(pHtml)) {
    pHtml = pHtml.replace(bannerRegex, newHeaderHtml + '\n\n    <!-- Filter Segment Bar');
    console.log(`Replaced header banner HTML in ${previewHtmlPath}.`);
  } else {
    console.error(`Could not match header banner in ${previewHtmlPath}`);
  }

  // Replace empty state image with base64
  pHtml = pHtml.replace(
    /'<img src="\.\.\/\.\.\/\.\.\/assets\/empty-requests-art\.png"[^>]*>/,
    `'<img src="data:image/png;base64,${emptyB64}" alt="No requests yet" class="mr-empty-art-img" onerror="this.style.display=\\\'none\\\'; var svgEl=document.getElementById(\\\'mr-empty-svg-art\\\'); if(svgEl) svgEl.style.display=\\\'block\\\';" />'`
  );

  fs.writeFileSync(previewHtmlPath, pHtml, 'utf8');
  console.log(`Updated ${previewHtmlPath} successfully.`);
}

// 4. Update LeaveHistoryScreen.jsx & LeaveHistoryScreen.styles.js
const jsxPath = 'EmergereApp/EmergereApp/src/screens/LeaveHistory/LeaveHistoryScreen.jsx';
if (fs.existsSync(jsxPath)) {
  let jsx = fs.readFileSync(jsxPath, 'utf8');
  
  const oldBannerJsx = `      {/* Royal Blue Gradient Header Banner matching Image 2 */}
      <View style={styles.headerBanner}>
        <Image
          source={require('../../../assets/requests-header-banner.png')}
          style={styles.headerBannerImg}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation && navigation.canGoBack ? navigation.goBack() : go('Dashboard'))}
          activeOpacity={0.7}
          accessibilityLabel="Back"
        />
      </View>`;

  const newBannerJsx = `      {/* Royal Blue Gradient Header Banner matching Image 2 */}
      <View style={styles.headerBanner}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (navigation && navigation.canGoBack ? navigation.goBack() : go('Dashboard'))}
              activeOpacity={0.7}
              accessibilityLabel="Go Back"
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>My Requests</Text>
              <Text style={styles.headerSubtitle}>Track your leaves & permissions</Text>
            </View>
          </View>
          <View style={styles.headerIllustration}>
            <Image
              source={require('../../../assets/requests-header-art.png')}
              style={styles.headerArtImg}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>`;

  if (jsx.includes(oldBannerJsx)) {
    jsx = jsx.replace(oldBannerJsx, newBannerJsx);
    fs.writeFileSync(jsxPath, jsx, 'utf8');
    console.log(`Updated ${jsxPath} successfully.`);
  } else {
    console.error(`Could not match old banner JSX in ${jsxPath}`);
  }
}

const stylesJsPath = 'EmergereApp/EmergereApp/src/screens/LeaveHistory/LeaveHistoryScreen.styles.js';
if (fs.existsSync(stylesJsPath)) {
  let stylesJs = fs.readFileSync(stylesJsPath, 'utf8');

  const oldStylesPattern = /\/\* Royal Blue Gradient Header Banner matching Image 2 \*\/[\s\S]*?backBtn:\s*\{[\s\S]*?\},/;

  const newStylesBlock = `/* Royal Blue Gradient Header Banner matching Image 2 */
  headerBanner: {
    width: '100%',
    paddingTop: 48,
    paddingBottom: 22,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: '#0066FF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 3,
  },
  headerIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerArtImg: {
    width: 80,
    height: 80,
  },`;

  if (oldStylesPattern.test(stylesJs)) {
    stylesJs = stylesJs.replace(oldStylesPattern, newStylesBlock);
    fs.writeFileSync(stylesJsPath, stylesJs, 'utf8');
    console.log(`Updated ${stylesJsPath} successfully.`);
  } else {
    console.error(`Could not match old styles pattern in ${stylesJsPath}`);
  }
}
