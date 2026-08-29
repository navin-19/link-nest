const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Public Profile View Inspection ===\n');

// 1. Check Public Profile Page Route
console.log('--- Test 1: Public Profile Page Route Inspection ---');
const publicPagePath = path.join(__dirname, '../app/[username]/page.jsx');
assert(fs.existsSync(publicPagePath), 'app/[username]/page.jsx must exist');
const publicPageContent = fs.readFileSync(publicPagePath, 'utf8');

assert(publicPageContent.includes("export const dynamic = 'force-dynamic'"), 'Must be force-dynamic');
assert(publicPageContent.includes('export const revalidate = 0'), 'Must have revalidate = 0');
assert(publicPageContent.includes('PublicProfileClient'), 'Must render PublicProfileClient');
assert(!publicPageContent.includes('Sidebar'), 'Must NOT include dashboard Sidebar');
assert(!publicPageContent.includes('CustomThemeDesigner'), 'Must NOT include CustomThemeDesigner');
console.log('✅ Test 1 Passed: Public profile page is visitor-facing with zero dashboard/editor wrappers.');

// 2. Check LinkBioRenderer.jsx for Editor Component Exclusion
console.log('\n--- Test 2: LinkBioRenderer Pure Renderer Inspection ---');
const rendererPath = path.join(__dirname, '../components/profile/LinkBioRenderer.jsx');
assert(fs.existsSync(rendererPath), 'LinkBioRenderer.jsx must exist');
const rendererContent = fs.readFileSync(rendererPath, 'utf8');

// Assert NO theme editor controls appear in renderer
assert(!rendererContent.includes('BackgroundPicker'), 'Must NOT render BackgroundPicker in LinkBioRenderer');
assert(!rendererContent.includes('Color Theme'), 'Must NOT have Color Theme text');
assert(!rendererContent.includes('Button Style'), 'Must NOT have Button Style text');
assert(!rendererContent.includes('Card Design'), 'Must NOT have Card Design text');
assert(!rendererContent.includes('Preset Themes'), 'Must NOT have Preset Themes text');
assert(!rendererContent.includes('Customize Theme'), 'Must NOT have Customize Theme text');
assert(!rendererContent.includes('Save Changes'), 'Must NOT have Save Changes button');
assert(!rendererContent.includes('Reset to Default'), 'Must NOT have Reset to Default button');
assert(!rendererContent.includes('Upload Image'), 'Must NOT have Upload Image text');
assert(!rendererContent.includes('Image URL'), 'Must NOT have Image URL text');
console.log('✅ Test 2 Passed: Public profile renderer contains zero editor controls or configuration settings.');

// 3. Check Public Profile Sections & Accordion Defaults
console.log('\n--- Test 3: Public Profile Section Structure & Accordion Defaults ---');
assert(rendererContent.includes('ProfileHeader'), 'Must include ProfileHeader');
assert(rendererContent.includes('GoogleReviewsSummary'), 'Must include GoogleReviewsSummary');
assert(rendererContent.includes('LinkList'), 'Must include LinkList (QuickLinks)');
assert(rendererContent.includes('ReachUsSection'), 'Must include ReachUsSection');
assert(rendererContent.includes('ProductsStoreSection'), 'Must include ProductsStoreSection');
assert(rendererContent.includes('SocialIcons'), 'Must include SocialIcons');
assert(rendererContent.includes('useState(null)'), 'All accordions must default to collapsed (null)');

const quickLinksPath = path.join(__dirname, '../components/profile/QuickLinks.jsx');
const quickLinksContent = fs.readFileSync(quickLinksPath, 'utf8');
assert(quickLinksContent.includes('isExpanded = false'), 'QuickLinks must start collapsed');

const productsStorePath = path.join(__dirname, '../components/profile/ProductsStoreSection.jsx');
const productsStoreContent = fs.readFileSync(productsStorePath, 'utf8');
assert(productsStoreContent.includes('PRODUCTS & SERVICES'), 'Products header must be full PRODUCTS & SERVICES');
assert(productsStoreContent.includes('break-words sm:whitespace-nowrap'), 'Products header must prevent text truncation');

console.log('✅ Test 3 Passed: Structure conforms to visitor profile with all accordions collapsed by default.');

// 4. Check Background Rendering
console.log('\n--- Test 4: Background Image & Gradient Resolution ---');
assert(rendererContent.includes("backgroundPosition: 'center'"), 'Background must be center positioned');
assert(rendererContent.includes("backgroundSize: 'cover'"), 'Background must have cover sizing');
console.log('✅ Test 4 Passed: Saved background images and gradients render cleanly on public view.');

console.log('\n🎉 ALL PUBLIC PROFILE VIEW TESTS PASSED SUCCESSFULLY! 🎉');
