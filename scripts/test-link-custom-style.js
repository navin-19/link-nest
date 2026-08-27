import { buttonStyles, BUTTON_STYLES } from '../components/links/buttonStyles.js';

console.log('--- Testing Per-Link Custom Style Resolution ---');

// Helper simulating LinkButton style resolution
function resolveEffectiveStyle(link, globalButtonStyle) {
  const effectiveStyle = link?.custom_style?.buttonStyle ?? globalButtonStyle;
  const buttonClass = buttonStyles[effectiveStyle] ?? buttonStyles.rounded;
  const isFilled = effectiveStyle === 'filled';
  const isBento = effectiveStyle === 'bentogrid';
  return { effectiveStyle, buttonClass, isFilled, isBento };
}

// 1. Link without custom_style uses global theme button style
const defaultLink = { id: '1', title: 'Default Link', url: 'https://example.com' };
const res1 = resolveEffectiveStyle(defaultLink, 'rounded');
console.log(`Test 1 (Default link with 'rounded' theme): ${res1.effectiveStyle === 'rounded' ? '✅' : '❌'} -> ${res1.effectiveStyle}`);

// 2. Link with custom_style uses override
const customLink = {
  id: '2',
  title: 'Custom Link',
  url: 'https://example.com',
  custom_style: { buttonStyle: 'neobrutalism' }
};
const res2 = resolveEffectiveStyle(customLink, 'rounded');
console.log(`Test 2 (Custom link override 'neobrutalism'): ${res2.effectiveStyle === 'neobrutalism' ? '✅' : '❌'} -> ${res2.effectiveStyle}`);

// 3. Global theme changes from 'rounded' to 'glassmorphism'
// - defaultLink should change to 'glassmorphism'
// - customLink should stay 'neobrutalism'
const res3Default = resolveEffectiveStyle(defaultLink, 'glassmorphism');
const res3Custom = resolveEffectiveStyle(customLink, 'glassmorphism');
console.log(`Test 3a (Default link updates to 'glassmorphism'): ${res3Default.effectiveStyle === 'glassmorphism' ? '✅' : '❌'} -> ${res3Default.effectiveStyle}`);
console.log(`Test 3b (Custom link retains 'neobrutalism'): ${res3Custom.effectiveStyle === 'neobrutalism' ? '✅' : '❌'} -> ${res3Custom.effectiveStyle}`);

// 4. Reset customLink custom_style to null
const resetLink = { ...customLink, custom_style: null };
const res4 = resolveEffectiveStyle(resetLink, 'glassmorphism');
console.log(`Test 4 (Reset custom style reverts to global 'glassmorphism'): ${res4.effectiveStyle === 'glassmorphism' ? '✅' : '❌'} -> ${res4.effectiveStyle}`);

// 5. Verify BUTTON_STYLES array contains all valid preset keys
let allPresetsValid = true;
for (const preset of BUTTON_STYLES) {
  if (!buttonStyles[preset.id]) {
    console.error(`❌ Preset ${preset.id} missing in buttonStyles dictionary!`);
    allPresetsValid = false;
  }
}
console.log(`Test 5 (All ${BUTTON_STYLES.length} BUTTON_STYLES presets exist in buttonStyles): ${allPresetsValid ? '✅' : '❌'}`);

if (
  res1.effectiveStyle === 'rounded' &&
  res2.effectiveStyle === 'neobrutalism' &&
  res3Default.effectiveStyle === 'glassmorphism' &&
  res3Custom.effectiveStyle === 'neobrutalism' &&
  res4.effectiveStyle === 'glassmorphism' &&
  allPresetsValid
) {
  console.log('--- All per-link custom style tests passed successfully! ---');
} else {
  console.error('--- Some tests failed! ---');
  process.exit(1);
}
