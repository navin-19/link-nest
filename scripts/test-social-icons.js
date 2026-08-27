// Test suite for Profile Social Media & URL Icons verification

const URL_PATTERNS = [
  { pattern: /instagram\.com|instagr\.am/i,       label: 'Instagram' },
  { pattern: /youtube\.com|youtu\.be/i,           label: 'YouTube' },
  { pattern: /tiktok\.com/i,                      label: 'TikTok' },
  { pattern: /twitter\.com|x\.com/i,              label: 'Twitter / X' },
  { pattern: /facebook\.com|fb\.me|fb\.com/i,     label: 'Facebook' },
  { pattern: /linkedin\.com/i,                    label: 'LinkedIn' },
  { pattern: /whatsapp\.com|wa\.me/i,             label: 'WhatsApp' },
  { pattern: /t\.me|telegram\.me|telegram\.org/i, label: 'Telegram' },
  { pattern: /github\.com|github\.io/i,           label: 'GitHub' },
  { pattern: /twitch\.tv/i,                       label: 'Twitch' },
  { pattern: /mailto:|gmail\.com/i,               label: 'Email' },
  { pattern: /tel:|call:/i,                       label: 'Phone' },
];

function resolveTest(url) {
  for (const { pattern, label } of URL_PATTERNS) {
    if (pattern.test(url)) return label;
  }
  return 'Website';
}

console.log('=== Running Social Media & URL Icons Verification ===\n');

const testCases = [
  { url: 'https://youtube.com/@techcreator', expected: 'YouTube' },
  { url: 'https://youtu.be/dQw4w9WgXcQ', expected: 'YouTube' },
  { url: 'https://instagram.com/johndoe', expected: 'Instagram' },
  { url: 'https://instagr.am/p/12345', expected: 'Instagram' },
  { url: 'https://facebook.com/mybrand', expected: 'Facebook' },
  { url: 'https://fb.me/custompage', expected: 'Facebook' },
  { url: 'https://tiktok.com/@tiktokstar', expected: 'TikTok' },
  { url: 'https://twitter.com/devnews', expected: 'Twitter / X' },
  { url: 'https://x.com/elonmusk', expected: 'Twitter / X' },
  { url: 'https://linkedin.com/in/john-smith', expected: 'LinkedIn' },
  { url: 'https://wa.me/1234567890', expected: 'WhatsApp' },
  { url: 'https://whatsapp.com/channel/123', expected: 'WhatsApp' },
  { url: 'https://t.me/telegramchannel', expected: 'Telegram' },
  { url: 'https://telegram.me/joinchat', expected: 'Telegram' },
  { url: 'https://github.com/facebook/react', expected: 'GitHub' },
  { url: 'https://twitch.tv/ninja', expected: 'Twitch' },
  { url: 'mailto:contact@example.com', expected: 'Email' },
  { url: 'tel:+1234567890', expected: 'Phone' },
  { url: 'https://mycustomwebsite.org/blog', expected: 'Website' },
  { url: 'https://subdomain.randomdomain.io', expected: 'Website' },
];

let allPassed = true;

for (const tc of testCases) {
  const detected = resolveTest(tc.url);
  const pass = detected === tc.expected;
  console.log(`URL: "${tc.url}" -> Detected: "${detected}" (Expected: "${tc.expected}") ${pass ? '✅' : '❌'}`);
  if (!pass) allPassed = false;
}

if (allPassed) {
  console.log('\n🎉 ALL SOCIAL & URL ICON RESOLUTION TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
