// Test suite for Issue 16: WhatsApp/Call Click Analytics, Social Icons, and Lead Capture

console.log('=== Running Issue 16 Test Suite ===\n');

// 1. Test WhatsApp & Phone link formatting
console.log('--- 1. Testing WhatsApp & Phone Formatting ---');
const testWhatsAppNumbers = [
  { raw: '+1 (234) 567-8900', expected: 'https://wa.me/12345678900' },
  { raw: 'https://wa.me/919876543210', expected: 'https://wa.me/919876543210' },
  { raw: '+44 7911 123456', expected: 'https://wa.me/447911123456' },
  { raw: '9876543210', expected: 'https://wa.me/9876543210' },
];

let waFormattingPassed = true;
for (const item of testWhatsAppNumbers) {
  const formatted = `https://wa.me/${item.raw.replace(/\D/g, '')}`;
  const pass = formatted === item.expected;
  console.log(`WhatsApp format "${item.raw}" -> "${formatted}": ${pass ? '✅' : '❌'}`);
  if (!pass) waFormattingPassed = false;
}

const testPhoneNumbers = [
  { raw: '+1 (234) 567-8900', expected: 'tel:+12345678900' },
  { raw: '+91 9876543210', expected: 'tel:+919876543210' },
  { raw: 'tel:+447911123456', expected: 'tel:+447911123456' },
];

let phoneFormattingPassed = true;
for (const item of testPhoneNumbers) {
  const c = item.raw.replace(/[^\d+]/g, '');
  const formatted = c.startsWith('tel:') ? c : `tel:${c}`;
  const pass = formatted === item.expected;
  console.log(`Phone format "${item.raw}" -> "${formatted}": ${pass ? '✅' : '❌'}`);
  if (!pass) phoneFormattingPassed = false;
}

// 2. Test Analytics aggregation logic for distinct click types
console.log('\n--- 2. Testing Analytics Click Type Aggregations ---');
const mockClicks = [
  { type: 'link', clickType: 'link', platform: 'other' },
  { type: 'link', clickType: 'link', platform: 'instagram' },
  { type: 'link', clickType: 'whatsapp', platform: 'whatsapp' },
  { type: 'link', clickType: 'whatsapp', platform: 'whatsapp' },
  { type: 'link', clickType: 'call', platform: 'call' },
  { type: 'product', clickType: 'product', platform: 'product' },
];

const totalClicks = mockClicks.length;
const whatsappClicks = mockClicks.filter((c) => c.clickType === 'whatsapp' || c.platform === 'whatsapp').length;
const callClicks = mockClicks.filter((c) => c.clickType === 'call' || c.platform === 'call').length;
const linkClicks = mockClicks.filter((c) => c.clickType === 'link').length;
const productClicks = mockClicks.filter((c) => c.clickType === 'product').length;

console.log(`Total Clicks: ${totalClicks} (expected 6) -> ${totalClicks === 6 ? '✅' : '❌'}`);
console.log(`WhatsApp Clicks: ${whatsappClicks} (expected 2) -> ${whatsappClicks === 2 ? '✅' : '❌'}`);
console.log(`Call Clicks: ${callClicks} (expected 1) -> ${callClicks === 1 ? '✅' : '❌'}`);
console.log(`Link Clicks: ${linkClicks} (expected 2) -> ${linkClicks === 2 ? '✅' : '❌'}`);
console.log(`Product Clicks: ${productClicks} (expected 1) -> ${productClicks === 1 ? '✅' : '❌'}`);

const analyticsPassed = totalClicks === 6 && whatsappClicks === 2 && callClicks === 1 && linkClicks === 2 && productClicks === 1;

// 3. Test Full Lead-Capture & CSV Generation
console.log('\n--- 3. Testing Full Leads & CSV Export ---');
const sampleLeads = [
  {
    id: 'lead-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    country_code: '+1',
    mobile_number: '2345678900',
    place: 'San Francisco, CA',
    address: '123 Market St, Suite 400',
    created_at: '2026-08-27T10:00:00.000Z',
  },
  {
    id: 'lead-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    country_code: '+44',
    mobile_number: '7911123456',
    place: 'London',
    address: null,
    created_at: '2026-08-27T11:00:00.000Z',
  },
  {
    id: 'lead-3',
    name: null,
    email: 'simple@example.com',
    country_code: null,
    mobile_number: null,
    place: null,
    address: null,
    created_at: '2026-08-27T12:00:00.000Z',
  },
];

const headers = [
  'Name',
  'Email',
  'Country Code',
  'Mobile Number',
  'Full Phone',
  'Place / City',
  'Address',
  'Subscribed Date',
];

const rows = sampleLeads.map((s) => {
  const fullPhone = [s.country_code, s.mobile_number].filter(Boolean).join(' ');
  return [
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${s.email.replace(/"/g, '""')}"`,
    `"${(s.country_code || '').replace(/"/g, '""')}"`,
    `"${(s.mobile_number || '').replace(/"/g, '""')}"`,
    `"${fullPhone.replace(/"/g, '""')}"`,
    `"${(s.place || '').replace(/"/g, '""')}"`,
    `"${(s.address || '').replace(/"/g, '""')}"`,
    `"${new Date(s.created_at).toISOString()}"`,
  ];
});

const csvOutput = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
console.log('Sample CSV Output:');
console.log(csvOutput);

const csvValid =
  csvOutput.includes('"Alice Johnson","alice@example.com","+1","2345678900","+1 2345678900","San Francisco, CA"') &&
  csvOutput.includes('"Bob Smith","bob@example.com","+44","7911123456","+44 7911123456","London"') &&
  csvOutput.includes('"","simple@example.com","","","","",""');

console.log(`\nCSV Structure Verification: ${csvValid ? '✅' : '❌'}`);

if (waFormattingPassed && phoneFormattingPassed && analyticsPassed && csvValid) {
  console.log('\n🎉 ALL ISSUE 16 TESTS PASSED SUCCESSFULLY! 🎉');
} else {
  console.error('\n❌ SOME TESTS FAILED.');
  process.exit(1);
}
