import { buttonStyles } from '../components/links/buttonStyles.js';
import { getContrastMode, getLuminance } from '../utils/getContrastMode.js';

console.log('--- Running Regression Tests for Issue 11 ---');

// 1. Test buttonStyles contains all standard and bento presets
const requiredStyles = [
  'rounded',
  'filled',
  'outline',
  'shadow',
  'glassmorphism',
  'hardshadow',
  'bentogrid',
  'neumorphism',
  'liquidglass',
  'neobrutalism',
  'claymorphism',
  'flat',
  'neondark',
  'minimal',
  'skeuomorphism',
  'maximalism',
];

for (const style of requiredStyles) {
  if (!buttonStyles[style]) {
    console.error(`❌ Missing button style: ${style}`);
    process.exit(1);
  }
  console.log(`✅ Button style exists: ${style}`);
}

// 2. Test Contrast Mode across various dark & light backgrounds
const themesToTest = [
  { name: 'Midnight', bg: { type: 'solid', value: '#0f0f1a' }, expected: 'dark' },
  { name: 'Aurora', bg: { type: 'gradient', value: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }, expected: 'dark' },
  { name: 'Sunset', bg: { type: 'gradient', value: 'linear-gradient(135deg,#1a0533 0%,#3d0068 50%,#c800a1 100%)' }, expected: 'dark' },
  { name: 'Ocean', bg: { type: 'gradient', value: 'linear-gradient(135deg,#020024 0%,#090979 50%,#00d4ff 100%)' }, expected: 'dark' },
  { name: 'Forest', bg: { type: 'gradient', value: 'linear-gradient(135deg,#0a2e0a 0%,#1a4a1a 50%,#2d8a2d 100%)' }, expected: 'dark' },
  { name: 'Clean White', bg: { type: 'solid', value: '#ffffff' }, expected: 'light' },
  { name: 'Soft Gray', bg: { type: 'solid', value: '#f1f5f9' }, expected: 'light' },
  { name: 'Light Gradient', bg: { type: 'gradient', value: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)' }, expected: 'light' },
  { name: 'Custom Image', bg: { type: 'image', value: 'https://images.unsplash.com/photo-1' }, expected: 'dark' },
  { name: 'Solid string #000', bg: '#000000', expected: 'dark' },
  { name: 'Solid string #fff', bg: '#ffffff', expected: 'light' },
];

for (const theme of themesToTest) {
  const mode = getContrastMode(theme.bg);
  if (mode !== theme.expected) {
    console.error(`❌ Contrast check failed for ${theme.name}: expected ${theme.expected}, got ${mode}`);
    process.exit(1);
  }
  console.log(`✅ Contrast mode for ${theme.name}: ${mode}`);
}

console.log('--- All regression tests passed successfully! ---');
