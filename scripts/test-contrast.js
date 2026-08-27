import { getContrastMode, getLuminance } from '../utils/getContrastMode.js';

const testCases = [
  { input: { type: 'solid', value: '#0f0f1a' }, expected: 'dark', label: 'Midnight solid dark' },
  { input: { type: 'solid', value: '#ffffff' }, expected: 'light', label: 'Pure white' },
  { input: { type: 'solid', value: '#fafaf9' }, expected: 'light', label: 'Stone light' },
  { input: { type: 'gradient', value: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)' }, expected: 'dark', label: 'Aurora dark gradient' },
  { input: { type: 'gradient', value: 'linear-gradient(135deg,#1a0533 0%,#3d0068 50%,#c800a1 100%)' }, expected: 'dark', label: 'Sunset dark gradient' },
  { input: { type: 'gradient', value: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)' }, expected: 'light', label: 'White/slate light gradient' },
  { input: { type: 'image', value: 'https://images.unsplash.com/photo-123' }, expected: 'dark', label: 'Image background' },
  { input: '#000000', expected: 'dark', label: 'Black string' },
  { input: '#ffffff', expected: 'light', label: 'White string' },
];

let allPassed = true;
console.log('Testing getContrastMode...');
for (const { input, expected, label } of testCases) {
  const result = getContrastMode(input);
  const passed = result === expected;
  console.log(`${passed ? '✅' : '❌'} [${label}]: result=${result}, expected=${expected}`);
  if (!passed) allPassed = false;
}

if (!allPassed) {
  console.error('Some tests failed!');
  process.exit(1);
} else {
  console.log('All contrast tests passed successfully!');
}
