import { getProfileUrl } from '../utils/qrGenerator.js';

console.log('--- Testing getProfileUrl ---');

// Test 1: Explicit baseUrl
const url1 = getProfileUrl('alice', 'https://customdomain.com');
console.log(`Test 1 (Explicit baseUrl): ${url1 === 'https://customdomain.com/alice' ? '✅' : '❌'} -> ${url1}`);

// Test 2: process.env.NEXT_PUBLIC_APP_URL
const origEnv = process.env.NEXT_PUBLIC_APP_URL;
process.env.NEXT_PUBLIC_APP_URL = 'https://linknest.app';
const url2 = getProfileUrl('bob');
console.log(`Test 2 (NEXT_PUBLIC_APP_URL): ${url2 === 'https://linknest.app/bob' ? '✅' : '❌'} -> ${url2}`);

// Test 3: Simulated browser runtime window.location.origin (when env is unset)
delete process.env.NEXT_PUBLIC_APP_URL;
global.window = {
  location: {
    origin: 'https://preview-123.vercel.app'
  }
};
const url3 = getProfileUrl('charlie');
console.log(`Test 3 (Browser runtime window.location.origin): ${url3 === 'https://preview-123.vercel.app/charlie' ? '✅' : '❌'} -> ${url3}`);

// Test 4: Server fallback when window and env are missing
delete global.window;
const url4 = getProfileUrl('david');
console.log(`Test 4 (Server fallback localhost): ${url4 === 'http://localhost:3000/david' ? '✅' : '❌'} -> ${url4}`);

// Test 5: Empty username
const url5 = getProfileUrl('');
console.log(`Test 5 (Empty username): ${url5 === '' ? '✅' : '❌'} -> "${url5}"`);

// Restore env
if (origEnv) {
  process.env.NEXT_PUBLIC_APP_URL = origEnv;
}

if (
  url1 === 'https://customdomain.com/alice' &&
  url2 === 'https://linknest.app/bob' &&
  url3 === 'https://preview-123.vercel.app/charlie' &&
  url4 === 'http://localhost:3000/david' &&
  url5 === ''
) {
  console.log('--- All getProfileUrl tests passed! ---');
} else {
  console.error('--- Some tests failed! ---');
  process.exit(1);
}
