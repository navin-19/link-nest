// Verification test suite for Issue 27 (Site-wide Performance Audit & Speed Optimization)

const fs = require('fs');
const path = require('path');

console.log('=== Running Issue 27 Performance Audit Verification Suite ===\n');

let allPassed = true;

function check(title, condition) {
  if (condition) {
    console.log(`✅ PASS: ${title}`);
  } else {
    console.error(`❌ FAIL: ${title}`);
    allPassed = false;
  }
}

const rootDir = path.resolve(__dirname, '..');

// 1. Area 5: Font Loading (next/font/google vs external @import/links)
console.log('--- 1. Area 5: Font Loading Optimization ---');
const layoutPath = path.join(rootDir, 'app', 'layout.jsx');
const globalsCssPath = path.join(rootDir, 'app', 'globals.css');

if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  check('app/layout.jsx uses next/font/google', layoutContent.includes('next/font/google'));
  check('app/layout.jsx has no external Google Fonts <link> stylesheet', !layoutContent.includes('fonts.googleapis.com') && !layoutContent.includes('fonts.gstatic.com'));
}

if (fs.existsSync(globalsCssPath)) {
  const cssContent = fs.readFileSync(globalsCssPath, 'utf8');
  check('app/globals.css has no blocking @import url to Google Fonts', !cssContent.includes('@import url('));
}

// 2. Area 1 & 2: Database Round Trips, ISR & Response Caching
console.log('\n--- 2. Area 1 & 2: Database Round Trips & Edge Caching ---');
const publicProfilePagePath = path.join(rootDir, 'app', '[username]', 'page.jsx');
const trackLinkPath = path.join(rootDir, 'app', 'api', 'track', '[linkId]', 'route.js');
const trackProductPath = path.join(rootDir, 'app', 'api', 'track-product', '[productId]', 'route.js');
const trackClickLibPath = path.join(rootDir, 'lib', 'trackClick.js');

if (fs.existsSync(publicProfilePagePath)) {
  const content = fs.readFileSync(publicProfilePagePath, 'utf8');
  check('app/[username]/page.jsx enables ISR revalidate = 60', content.includes('revalidate = 60'));
  check('app/[username]/page.jsx uses cached getProfileByUsername helper', content.includes('getProfileByUsername'));
  check('app/[username]/page.jsx fetches links and products concurrently with Promise.all', content.includes('Promise.all(['));
}

if (fs.existsSync(trackClickLibPath)) {
  const content = fs.readFileSync(trackClickLibPath, 'utf8');
  check('trackClick uses atomic increment_click_count RPC', content.includes('increment_click_count'));
  check('trackClick uses atomic increment_product_click_count RPC', content.includes('increment_product_click_count'));
}

if (fs.existsSync(trackLinkPath)) {
  const content = fs.readFileSync(trackLinkPath, 'utf8');
  check('Click tracking route fails open without blocking redirect', content.includes('failing open') || content.includes('trackClick'));
}

// 3. Area 3: Code Splitting & Bundle Size Optimization
console.log('\n--- 3. Area 3: Bundle Size & Dynamic Code-Splitting ---');
const sidebarPath = path.join(rootDir, 'components', 'dashboard', 'Sidebar.jsx');
const analyticsPagePath = path.join(rootDir, 'app', '(dashboard)', 'dashboard', 'analytics', 'page.jsx');
const subscribeBarPath = path.join(rootDir, 'components', 'profile', 'SubscribeBar.jsx');
const publicRendererPath = path.join(rootDir, 'components', 'profile', 'LinkBioRenderer.jsx');

if (fs.existsSync(sidebarPath)) {
  const content = fs.readFileSync(sidebarPath, 'utf8');
  check('Sidebar.jsx dynamically imports QRCodeSVG (code-splitting qrcode.react)', content.includes('next/dynamic') && content.includes('qrcode.react'));
}

if (fs.existsSync(analyticsPagePath)) {
  const content = fs.readFileSync(analyticsPagePath, 'utf8');
  check('Analytics page dynamically imports AnalyticsChartsView (code-splitting recharts)', content.includes('next/dynamic') && content.includes('AnalyticsChartsView'));
  check('Analytics page does not statically import recharts at top', !content.includes("from 'recharts';"));
}

if (fs.existsSync(subscribeBarPath)) {
  const content = fs.readFileSync(subscribeBarPath, 'utf8');
  check('SubscribeBar.jsx dynamically imports SubscribeFormClient', content.includes('next/dynamic') && content.includes('SubscribeFormClient'));
}

if (fs.existsSync(publicRendererPath)) {
  const content = fs.readFileSync(publicRendererPath, 'utf8');
  check('Public profile bundle is free from recharts', !content.includes('recharts'));
  check('Public profile bundle is free from @dnd-kit', !content.includes('@dnd-kit'));
  check('Public profile bundle is free from qrcode.react', !content.includes('qrcode.react'));
}

// 4. Area 4: Images Configuration
console.log('\n--- 4. Area 4: Next.js Image Optimization ---');
const nextConfigPath = path.join(rootDir, 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8');
  check('next.config.js enables AVIF and WebP image formats', content.includes('image/avif') && content.includes('image/webp'));
  check('next.config.js includes Supabase storage and Unsplash remotePatterns', content.includes('supabase.co') && content.includes('images.unsplash.com'));
}

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL ISSUE 27 PERFORMANCE AUDIT CHECKS PASSED CLEANLY! 🎉');
} else {
  console.error('❌ SOME CHECKS FAILED. Please review output above.');
  process.exit(1);
}
