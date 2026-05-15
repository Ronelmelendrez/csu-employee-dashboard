# Multi-Sheet Support - Update Summary

## 🎯 Changes Made

Your Google Apps Script and sync utilities have been updated to support your multiple sheet tabs:

- ✅ Masterlist
- ✅ 2021-2025
- ✅ 2021-2025(2)
- ✅ 2023-2024
- ✅ CMNS-CED
- ✅ Faculty - ongoing
- ✅ admin-ongoing

---

## 📝 What Was Updated

### 1. **Google Apps Script** (`googleAppsScript.gs`)

**Added**:
- Constants defining all available sheets
- Default sheet: "Masterlist"
- `getAvailableSheets()` function to list all sheets
- Sheet parameter support in all functions

**Updated Functions**:
- All GET/POST handlers now accept `sheet` parameter
- `getEmployees(sheetName)` - fetch from specific sheet
- `getEmployeeById(id, sheetName)` - find employee in specific sheet
- `addEmployee(employee, sheetName)` - add to specific sheet
- `updateEmployee(employee, sheetName)` - update in specific sheet
- `deleteEmployee(id, sheetName)` - delete from specific sheet
- `syncEmployees(employees, sheetName)` - sync to specific sheet
- `initializeSheet()` - no longer clears existing data

**New Test Function**:
```javascript
testScript() // Tests all sheets and shows data counts
```

---

### 2. **Spreadsheet Sync Utility** (`src/utils/syncSpreadsheet.ts`)

**Added**:
- `sheetName` property (defaults to "Masterlist")
- `setSheetName(sheetName)` - switch sheets
- `getSheetName()` - get current sheet
- `getAvailableSheets()` - fetch list of all sheets

**Updated**:
- All API calls now include sheet parameter
- URLs include `&sheet=${encodeURIComponent(this.sheetName)}`
- Constructor accepts `sheetName` in config

---

### 3. **React Hook** (`src/hooks/useSpreadsheetSync.ts`)

**Added**:
- `currentSheet` state
- `switchSheet(sheetName)` function - switch sheets dynamically
- `getAvailableSheets()` function - fetch available sheets

**Updated**:
- Constructor now accepts `sheetName` option
- Returns `currentSheet` and new functions

---

## 🚀 New Usage Patterns

### Switch Between Sheets

```typescript
const { currentSheet, switchSheet, employees } = useSpreadsheetSync({
  appScriptUrl: 'YOUR_URL',
  sheetName: 'Masterlist' // Start with this sheet
});

// Switch to different sheet
await switchSheet('2021-2025');
console.log('Now reading from:', currentSheet);
```

### Get Available Sheets

```typescript
const { getAvailableSheets } = useSpreadsheetSync(config);

const sheets = await getAvailableSheets();
sheets.forEach(sheet => {
  console.log(`${sheet.name}: ${sheet.rows} rows`);
});

// Output:
// Masterlist: 25 rows (isDefault: true)
// 2021-2025: 18 rows
// 2021-2025(2): 22 rows
// etc...
```

### Create Sheet Selector UI

```typescript
function SheetSelector() {
  const { currentSheet, switchSheet, getAvailableSheets } = useSpreadsheetSync(config);
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    getAvailableSheets().then(setSheets);
  }, []);

  return (
    <select value={currentSheet} onChange={e => switchSheet(e.target.value)}>
      {sheets.map(sheet => (
        <option key={sheet.name} value={sheet.name}>
          {sheet.name} ({sheet.rows} rows)
          {sheet.isDefault ? ' [Default]' : ''}
        </option>
      ))}
    </select>
  );
}
```

---

## 🔌 API Endpoints

### Fetch from Specific Sheet
```
GET ?action=getAll&sheet=2021-2025
GET ?action=getById&id=1&sheet=CMNS-CED
```

### Modify Data in Specific Sheet
```
POST ?action=add&sheet=Faculty%20-%20ongoing
POST ?action=update&sheet=admin-ongoing&id=1
POST ?action=delete&sheet=2023-2024&id=1
POST ?action=sync&sheet=2021-2025%282%29
```

### Get Available Sheets
```
GET ?action=getSheets
```

Returns:
```json
{
  "success": true,
  "message": "Available sheets",
  "data": [
    { "name": "Masterlist", "rows": 25, "isDefault": true },
    { "name": "2021-2025", "rows": 18, "isDefault": false },
    ...
  ]
}
```

---

## 💾 Data Isolation

Each sheet is **completely independent**:
- Employees in "Masterlist" don't affect "2021-2025"
- Deleting from one sheet doesn't touch others
- Each sheet maintains its own set of data
- Syncing to one sheet only updates that sheet

---

## 🔧 Configuration

### In App.tsx

```typescript
import { useSpreadsheetSync } from './hooks/useSpreadsheetSync';

export default function App() {
  const { 
    employees, 
    currentSheet, 
    switchSheet,
    getAvailableSheets 
  } = useSpreadsheetSync({
    appScriptUrl: import.meta.env.VITE_SPREADSHEET_SYNC_URL,
    autoSync: true,
    syncInterval: 30000,
    sheetName: 'Masterlist' // Start with Masterlist
  });

  // Use employees, currentSheet, switchSheet as needed
}
```

### Environment Variables (.env)
```env
VITE_SPREADSHEET_SYNC_URL=https://script.google.com/macros/d/YOUR_ID/usercontent
```

---

## 📊 Example: Multi-Sheet Dashboard

```typescript
export function MultiSheetDashboard() {
  const {
    employees,
    currentSheet,
    switchSheet,
    getAvailableSheets,
    loading,
    error
  } = useSpreadsheetSync({
    appScriptUrl: import.meta.env.VITE_SPREADSHEET_SYNC_URL,
    autoSync: true,
    syncInterval: 30000,
    sheetName: 'Masterlist'
  });

  const [availableSheets, setAvailableSheets] = useState([]);

  useEffect(() => {
    getAvailableSheets().then(setAvailableSheets);
  }, [getAvailableSheets]);

  return (
    <div>
      {/* Sheet Selector */}
      <select 
        value={currentSheet} 
        onChange={e => switchSheet(e.target.value)}
        disabled={loading}
      >
        {availableSheets.map(sheet => (
          <option key={sheet.name} value={sheet.name}>
            {sheet.name} ({sheet.rows} rows)
          </option>
        ))}
      </select>

      {/* Status */}
      <p>
        Reading from: <strong>{currentSheet}</strong>
        {loading && ' (Syncing...)'}
      </p>

      {/* Data */}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <p>Found {employees.length} employees</p>

      {/* Employee List */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Rank</th>
            <th>Station</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.currentRank}</td>
              <td>{emp.officialStation}</td>
              <td>{emp.employmentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🧪 Testing Multi-Sheet Support

### In Google Apps Script Editor

```javascript
// Run this to test all sheets
testScript();

// Output in Logger:
// === Available Sheets ===
// Masterlist: 25 employees
// 2021-2025: 18 employees
// 2021-2025(2): 22 employees
// 2023-2024: 15 employees
// CMNS-CED: 8 employees
// Faculty - ongoing: 12 employees
// admin-ongoing: 5 employees
```

### In Browser Console

```javascript
// Fetch from specific sheet
fetch('YOUR_URL?action=getAll&sheet=2021-2025')
  .then(r => r.json())
  .then(data => console.log(`Found ${data.data.length} employees`));

// Get available sheets
fetch('YOUR_URL?action=getSheets')
  .then(r => r.json())
  .then(data => console.log(data.data));
```

---

## ✅ Build Status

```
✓ npm run build successful
✓ 835 modules transformed
✓ No TypeScript errors
✓ Build time: 54.46s
```

---

## 🎯 Next Steps

1. **Deploy Updated Script**
   - Copy updated `googleAppsScript.gs` to Google Apps Script
   - Replace SPREADSHEET_ID if needed
   - Deploy as web app

2. **Update App.tsx** (Optional)
   - Add sheet selector dropdown
   - Use `switchSheet()` to change sheets
   - Display current sheet name

3. **Test Multi-Sheet Functionality**
   - Upload data to different sheets
   - Switch between sheets in dashboard
   - Verify data isolation

4. **Monitor Sheet Performance**
   - Each sheet is processed independently
   - Large sheets may take longer to fetch
   - Adjust sync intervals if needed

---

## 💡 Tips

- **Default Sheet**: Start with "Masterlist" by default
- **Sheet Names**: Use exact sheet names (case-sensitive)
- **URL Encoding**: Special characters in sheet names are automatically encoded
- **Independent Data**: Changes in one sheet don't affect others
- **Bulk Operations**: `syncAll()` only updates the current sheet
- **Performance**: For large sheets, consider longer sync intervals

---

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Sheet not found" | Verify exact sheet name spelling |
| "No data returned" | Check sheet has proper headers |
| "Slow sync" | Increase `syncInterval` for large sheets |
| "404 error" | Verify deployment URL is correct |
| "Empty sheet list" | Run `testScript()` in Apps Script |

---

## 📋 Summary

Your dashboard now supports **7 different sheet tabs** with:
- ✅ Sheet switching
- ✅ Data isolation
- ✅ Automatic sheet detection
- ✅ Independent CRUD operations
- ✅ Real-time sync per sheet
- ✅ Sheet metadata (row counts, defaults)

**All changes are backward compatible** - existing code continues to work without modification, but now you can leverage multi-sheet functionality!
