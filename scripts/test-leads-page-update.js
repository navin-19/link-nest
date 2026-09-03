const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running Test Suite: Updated Subscriber Leads Dashboard UI ===\n');

// 1. Inspect Leads page
const leadsPath = path.join(__dirname, '../app/(dashboard)/dashboard/leads/page.jsx');
assert(fs.existsSync(leadsPath), 'Leads page must exist');
const content = fs.readFileSync(leadsPath, 'utf8');

// Check 1: Order of Sections in JSX
console.log('--- Test 1: Page Structure and Order of Sections ---');
const kpiPos = content.indexOf('Total Leads');
const formFieldsSectionPos = content.indexOf('Customize Subscriber Form');
const subscribersHeadingPos = content.lastIndexOf('Subscribers');

assert(kpiPos !== -1, 'Must have KPI cards');
assert(formFieldsSectionPos !== -1, 'Must have Customize Subscriber Form section');
assert(subscribersHeadingPos !== -1, 'Must have Subscribers heading');

assert(kpiPos < formFieldsSectionPos, 'KPI Cards must appear before Customize Subscriber Form');
assert(formFieldsSectionPos < subscribersHeadingPos, 'Customize Subscriber Form must appear before Subscribers Table');
console.log('✅ Test 1 Passed: Page structure strictly follows Header -> KPI Cards -> Customize Subscriber Form -> Subscribers.');

// Check 2: Form Fields Customization Table & Columns
console.log('\n--- Test 2: Form Field Customization Table & Columns ---');
assert(content.includes('Field Label'), 'Must have Field Label column');
assert(content.includes('Field Key'), 'Must have Field Key column');
assert(content.includes('Field Type'), 'Must have Field Type column');
assert(content.includes('Required'), 'Must have Required column');
assert(content.includes('Enabled'), 'Must have Enabled column');
assert(content.includes('Actions'), 'Must have Actions column');

assert(content.includes('Add Field'), 'Must have Add Field button');
assert(content.includes('Add Subscriber Form Field'), 'Must have Add Subscriber Form Field modal');
assert(content.includes('Edit Subscriber Form Field'), 'Must have Edit Subscriber Form Field modal');
console.log('✅ Test 2 Passed: Form Field customization table has all requested columns and modals.');

// Check 3: Supported Field Types
console.log('\n--- Test 3: Supported Field Types ---');
const types = ['text', 'email', 'phone', 'number', 'textarea', 'url', 'date', 'dropdown'];
types.forEach((type) => {
  assert(content.includes(`value="${type}"`), `Must support field type: ${type}`);
});
console.log('✅ Test 3 Passed: All 8 field types (Text, Email, Phone, Number, Textarea, URL, Date, Select/Dropdown) supported.');

// Check 4: Drag and Drop Reordering Integration
console.log('\n--- Test 4: Drag and Drop Reordering Integration ---');
assert(content.includes('DndContext'), 'Must integrate DndContext');
assert(content.includes('SortableContext'), 'Must integrate SortableContext');
assert(content.includes('useSortable'), 'Must use useSortable');
assert(content.includes('GripVertical'), 'Must have GripVertical drag handle icon');
console.log('✅ Test 4 Passed: DnD-kit sortable drag-and-drop integrated for reordering.');

// Check 5: Subscribers Table, Pagination & Actions
console.log('\n--- Test 5: Subscribers Table & Functionality ---');
assert(content.includes('Name'), 'Must have Name column');
assert(content.includes('Email'), 'Must have Email column');
assert(content.includes('Mobile Number'), 'Must have Mobile Number column');
assert(content.includes('Place / City'), 'Must have Place / City column');
assert(content.includes('Address'), 'Must have Address column');
assert(content.includes('Date Subscribed'), 'Must have Date Subscribed column');
assert(content.includes('handleExportCSV'), 'Must preserve CSV export');
assert(content.includes('totalPages'), 'Must support pagination');
assert(content.includes('viewingSubscriber'), 'Must support View Subscriber detail modal');
assert(content.includes('deleteSubscriber'), 'Must preserve delete subscriber');
console.log('✅ Test 5 Passed: Subscribers table has clean columns, pagination, CSV export, delete, and view modal.');

// Check 6: Empty States
console.log('\n--- Test 6: Empty States ---');
assert(content.includes('No custom fields yet'), 'Must have custom fields empty state');
assert(content.includes('No subscribers yet'), 'Must have subscribers empty state');
console.log('✅ Test 6 Passed: Professional empty states present for both tables.');

console.log('\n🎉 ALL LEADS DASHBOARD UI TESTS PASSED SUCCESSFULLY! 🎉');
