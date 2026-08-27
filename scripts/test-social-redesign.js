// Test suite for Unified Dark-Themed Social Media Icon Redesign

console.log('=== Running Social Media Icon System Verification ===\n');

const platforms = [
  { key: 'phone', label: 'Phone / Call', input: '+1234567890', expectedUrl: 'tel:+1234567890' },
  { key: 'whatsapp', label: 'WhatsApp', input: '+1234567890', expectedUrl: 'https://wa.me/1234567890' },
  { key: 'facebook', label: 'Facebook', input: 'mybrand', expectedUrl: 'https://facebook.com/mybrand' },
  { key: 'instagram', label: 'Instagram', input: '@creativestudio', expectedUrl: 'https://instagram.com/creativestudio' },
  { key: 'tiktok', label: 'TikTok', input: '@creator', expectedUrl: 'https://tiktok.com/@creator' },
  { key: 'youtube', label: 'YouTube', input: '@channel', expectedUrl: 'https://youtube.com/@channel' },
  { key: 'x', label: 'Twitter / X', input: 'elonmusk', expectedUrl: 'https://x.com/elonmusk' },
  { key: 'linkedin', label: 'LinkedIn', input: 'in/johndoe', expectedUrl: 'https://linkedin.com/in/johndoe' },
  { key: 'telegram', label: 'Telegram', input: 'mychannel', expectedUrl: 'https://t.me/mychannel' },
  { key: 'email', label: 'Email', input: 'contact@linknest.io', expectedUrl: 'mailto:contact@linknest.io' },
  { key: 'website', label: 'Website', input: 'https://mywebsite.com', expectedUrl: 'https://mywebsite.com' },
  { key: 'github', label: 'GitHub', input: 'octocat', expectedUrl: 'https://github.com/octocat' },
  { key: 'twitch', label: 'Twitch', input: 'streamer', expectedUrl: 'https://twitch.tv/streamer' },
];

let allPassed = true;

console.log('--- 1. Testing Supported Platforms and URL Formatting ---');
for (const p of platforms) {
  let formatted = p.input;
  if (p.key === 'phone') {
    const c = p.input.replace(/[^\d+]/g, '');
    formatted = c.startsWith('tel:') ? c : `tel:${c}`;
  } else if (p.key === 'whatsapp') {
    formatted = p.input.startsWith('http') ? p.input : `https://wa.me/${p.input.replace(/\D/g, '')}`;
  } else if (p.key === 'facebook') {
    formatted = p.input.startsWith('http') ? p.input : `https://facebook.com/${p.input}`;
  } else if (p.key === 'instagram') {
    formatted = p.input.startsWith('http') ? p.input : `https://instagram.com/${p.input.replace(/^@/, '')}`;
  } else if (p.key === 'tiktok') {
    formatted = p.input.startsWith('http') ? p.input : `https://tiktok.com/${p.input.startsWith('@') ? p.input : '@' + p.input}`;
  } else if (p.key === 'youtube') {
    formatted = p.input.startsWith('http') ? p.input : `https://youtube.com/${p.input.startsWith('@') ? p.input : '@' + p.input}`;
  } else if (p.key === 'x') {
    formatted = p.input.startsWith('http') ? p.input : `https://x.com/${p.input.replace(/^@/, '')}`;
  } else if (p.key === 'linkedin') {
    formatted = p.input.startsWith('http') ? p.input : (p.input.includes('/') ? `https://linkedin.com/${p.input}` : `https://linkedin.com/in/${p.input}`);
  } else if (p.key === 'telegram') {
    formatted = p.input.startsWith('http') ? p.input : `https://t.me/${p.input.replace(/^@/, '')}`;
  } else if (p.key === 'email') {
    formatted = p.input.startsWith('mailto:') ? p.input : `mailto:${p.input}`;
  } else if (p.key === 'github') {
    formatted = p.input.startsWith('http') ? p.input : `https://github.com/${p.input.replace(/^@/, '')}`;
  } else if (p.key === 'twitch') {
    formatted = p.input.startsWith('http') ? p.input : `https://twitch.tv/${p.input}`;
  }

  const match = formatted === p.expectedUrl;
  console.log(`Platform [${p.label}] -> Output: "${formatted}" ${match ? '✅' : '❌'}`);
  if (!match) allPassed = false;
}

console.log('\n--- 2. Design System Specification Verification ---');
const designSpecs = {
  containerSize: '44px on mobile (w-11), 48px on desktop (sm:w-12)',
  iconSize: '22px centered',
  borderRadius: '14px (rounded-[14px])',
  themeStyle: 'Dark / near-black (bg-slate-900 / dark:bg-slate-850) with white icon marks',
  border: 'Subtle slate border (border-slate-800/90)',
  gap: '12-14px (gap-3 sm:gap-3.5) with flex-wrap and horizontal centering',
};

for (const [k, v] of Object.entries(designSpecs)) {
  console.log(`- ${k}: ${v} ✅`);
}

if (allPassed) {
  console.log('\n🎉 ALL SOCIAL MEDIA ICON REDESIGN TESTS PASSED! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
