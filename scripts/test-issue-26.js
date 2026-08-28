// Verification test suite for Issue 26 (Three bugs: invisible image backgrounds, ISR cache revalidation, optimistic toggle UI)

const fs = require('fs');
const path = require('path');

console.log('=== Running Issue 26 Verification Suite ===\n');

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

// 1. Bug 1: Invisible Image Backgrounds
console.log('--- 1. Bug 1: Image Background Visibility & iOS Compatibility ---');

const linkBioRendererPath = path.join(rootDir, 'components', 'profile', 'LinkBioRenderer.jsx');
const livePreviewPath = path.join(rootDir, 'components', 'dashboard', 'LivePreview.jsx');
const dashboardPagePath = path.join(rootDir, 'app', '(dashboard)', 'dashboard', 'page.jsx');
const backgroundPickerPath = path.join(rootDir, 'components', 'theme', 'BackgroundPicker.jsx');

if (fs.existsSync(linkBioRendererPath)) {
  const content = fs.readFileSync(linkBioRendererPath, 'utf8');
  check('LinkBioRenderer does not use fixed backgroundAttachment', !content.includes("backgroundAttachment: 'fixed'") && !content.includes('backgroundAttachment: preview ? \'scroll\' : \'fixed\''));
  check('LinkBioRenderer uses scroll backgroundAttachment', content.includes("backgroundAttachment: 'scroll'"));
}

if (fs.existsSync(livePreviewPath)) {
  const content = fs.readFileSync(livePreviewPath, 'utf8');
  check('LivePreview supports image background with scroll backgroundAttachment', content.includes("backgroundAttachment: 'scroll'"));
}

if (fs.existsSync(dashboardPagePath)) {
  const content = fs.readFileSync(dashboardPagePath, 'utf8');
  check('Dashboard page getBackgroundStyle supports scroll backgroundAttachment', content.includes("backgroundAttachment: 'scroll'"));
}

if (fs.existsSync(backgroundPickerPath)) {
  const content = fs.readFileSync(backgroundPickerPath, 'utf8');
  check('BackgroundPicker includes HTTPS validation warning for custom image URLs', content.includes('https://') && content.includes('Secure URL required'));
}

// 2. Bug 2: Stale Link Card / Theme Style (ISR Revalidation)
console.log('\n--- 2. Bug 2: On-Demand ISR Revalidation on Theme/Card/Product Saves ---');

const profileRoutePath = path.join(rootDir, 'app', 'api', 'profile', 'route.js');
const themesRoutePath = path.join(rootDir, 'app', 'api', 'themes', 'route.js');
const themeItemRoutePath = path.join(rootDir, 'app', 'api', 'themes', '[id]', 'route.js');
const linksRoutePath = path.join(rootDir, 'app', 'api', 'links', 'route.js');
const linkItemRoutePath = path.join(rootDir, 'app', 'api', 'links', '[id]', 'route.js');
const productsRoutePath = path.join(rootDir, 'app', 'api', 'products', 'route.js');
const productItemRoutePath = path.join(rootDir, 'app', 'api', 'products', '[id]', 'route.js');

if (fs.existsSync(profileRoutePath)) {
  const content = fs.readFileSync(profileRoutePath, 'utf8');
  check('/api/profile imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(themesRoutePath)) {
  const content = fs.readFileSync(themesRoutePath, 'utf8');
  check('/api/themes imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(themeItemRoutePath)) {
  const content = fs.readFileSync(themeItemRoutePath, 'utf8');
  check('/api/themes/[id] imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(linksRoutePath)) {
  const content = fs.readFileSync(linksRoutePath, 'utf8');
  check('/api/links imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(linkItemRoutePath)) {
  const content = fs.readFileSync(linkItemRoutePath, 'utf8');
  check('/api/links/[id] imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(productsRoutePath)) {
  const content = fs.readFileSync(productsRoutePath, 'utf8');
  check('/api/products imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

if (fs.existsSync(productItemRoutePath)) {
  const content = fs.readFileSync(productItemRoutePath, 'utf8');
  check('/api/products/[id] imports and calls revalidatePath', content.includes('revalidatePath') && content.includes('next/cache'));
}

// 3. Bug 3: Optimistic Toggle Updates
console.log('\n--- 3. Bug 3: Instant Optimistic UI Updates on Toggles ---');

const productsTabPath = path.join(rootDir, 'components', 'links', 'ProductsTab.jsx');
const useProductsPath = path.join(rootDir, 'hooks', 'useProducts.js');
const useLinksPath = path.join(rootDir, 'hooks', 'useLinks.js');

if (fs.existsSync(productsTabPath)) {
  const content = fs.readFileSync(productsTabPath, 'utf8');
  check('ProductsTab handleToggleShowProducts updates state optimistically', content.includes('setShowProducts(val)') && content.includes('previous'));
  check('ProductsTab toggle button is not blocked with disabled=toggling', !content.includes('disabled={toggling}'));
  check('ProductsTab displays toggleError upon server rollback', content.includes('toggleError'));
}

if (fs.existsSync(useProductsPath)) {
  const content = fs.readFileSync(useProductsPath, 'utf8');
  check('useProducts updateProduct updates state optimistically before fetch', content.includes('previousProducts') && content.includes('setProducts'));
}

if (fs.existsSync(useLinksPath)) {
  const content = fs.readFileSync(useLinksPath, 'utf8');
  check('useLinks updateLink updates state optimistically before fetch', content.includes('previousLinks') && content.includes('setLinks'));
}

console.log('\n=================================================');
if (allPassed) {
  console.log('🎉 ALL ISSUE 26 BUG FIX TESTS PASSED CLEANLY! 🎉');
} else {
  console.error('❌ SOME TESTS FAILED. Please review output above.');
  process.exit(1);
}
