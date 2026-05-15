import XLSX from 'xlsx';

const wb = XLSX.readFile('MASTERLIST-2026-STUDY-LEAVE-2.xlsx');

const masterlistWs = wb.Sheets['Masterlist'];
const rows = XLSX.utils.sheet_to_json(masterlistWs, { header: 1 });

console.log('=== MASTERLIST SHEET ===');
console.log('Total rows:', rows.length);

let headerRowIndex = -1;
for (let i = 0; i < Math.min(rows.length, 10); i++) {
  const row = rows[i];
  if (row.some(cell => cell && String(cell).toLowerCase().includes('no.'))) {
    headerRowIndex = i;
    break;
  }
}

if (headerRowIndex < 0) {
  console.log('Header row not found.');
  process.exit(0);
}

const headers = rows[headerRowIndex];
const headerMap = new Map();
headers.forEach((header, idx) => {
  headerMap.set(String(header || '').trim().toLowerCase(), idx);
});

const findHeaderIndex = (candidates) => {
  for (const candidate of candidates) {
    const idx = headerMap.get(candidate.toLowerCase());
    if (typeof idx === 'number') return idx;
  }
  return -1;
};

const schoolingIndex = findHeaderIndex(['schooling status']);
const categoryIndex = findHeaderIndex(['category of employment']);
const reinstatementIndex = findHeaderIndex(['reinstatement']);

const uniqueValues = (index) => {
  if (index < 0) return [];
  const values = new Set();
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const value = rows[i][index];
    const text = String(value ?? '').trim();
    if (text) values.add(text);
  }
  return Array.from(values).slice(0, 20);
};

console.log(`Header row index: ${headerRowIndex}`);
console.log('Schooling Status index:', schoolingIndex);
console.log('Category of Employment index:', categoryIndex);
console.log('Reinstatement index:', reinstatementIndex);

console.log('\nSample Schooling Status values:');
console.log(uniqueValues(schoolingIndex));

console.log('\nSample Category of Employment values:');
console.log(uniqueValues(categoryIndex));

console.log('\nSample Reinstatement values:');
console.log(uniqueValues(reinstatementIndex));
