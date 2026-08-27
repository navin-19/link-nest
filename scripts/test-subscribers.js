console.log('--- Testing Subscribers & Mobile Number Logic ---');

const phoneRegex = /^[\d+\-\s()]{6,20}$/;

const validPhones = [
  '+1 234 567 8900',
  '9876543210',
  '+91 (123) 456-7890',
  '+44 7911 123456',
  '020 7946 0991',
  '+81 90 1234 5678',
];

const invalidPhones = [
  'abc',
  '12',
  'phone12345',
  '+++=--',
  'invalid@phone',
  '1234567890123456789012345', // > 20 chars
];

let phoneTestsPassed = true;

for (const phone of validPhones) {
  const isValid = phoneRegex.test(phone.trim());
  console.log(`Valid phone test "${phone}": ${isValid ? '✅' : '❌'}`);
  if (!isValid) phoneTestsPassed = false;
}

for (const phone of invalidPhones) {
  const isValid = phoneRegex.test(phone.trim());
  console.log(`Invalid phone test "${phone}": ${!isValid ? '✅ (Rejected)' : '❌ (Accepted)'}`);
  if (isValid) phoneTestsPassed = false;
}

// Test CSV generator logic
const sampleSubscribers = [
  { id: '1', email: 'alice@example.com', mobile_number: '+1 234 567 8900', created_at: '2026-08-27T10:00:00.000Z' },
  { id: '2', email: 'bob@example.com', mobile_number: null, created_at: '2026-08-27T11:00:00.000Z' },
  { id: '3', email: 'charlie"special"@example.com', mobile_number: '+44 7911 123456', created_at: '2026-08-27T12:00:00.000Z' },
];

const headers = ['Email', 'Mobile Number', 'Subscribed Date'];
const rows = sampleSubscribers.map((s) => [
  `"${s.email.replace(/"/g, '""')}"`,
  `"${(s.mobile_number || '').replace(/"/g, '""')}"`,
  `"${new Date(s.created_at).toISOString()}"`,
]);

const csv = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
console.log('\n--- Generated CSV Output Sample ---');
console.log(csv);

const csvValid =
  csv.includes('"alice@example.com","+1 234 567 8900"') &&
  csv.includes('"bob@example.com",""') &&
  csv.includes('"charlie""special""@example.com","+44 7911 123456"');

console.log(`\nCSV generation test: ${csvValid ? '✅' : '❌'}`);

if (phoneTestsPassed && csvValid) {
  console.log('--- All subscriber & lead tests passed successfully! ---');
} else {
  console.error('--- Some subscriber tests failed! ---');
  process.exit(1);
}
