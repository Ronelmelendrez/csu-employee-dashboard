# Google Sheets Integration with Dynamic Column Mapping

Complete guide for integrating Google Sheets with dynamic column mapping into your CSU Employee Dashboard.

## 🎯 Features

- ✅ **Dynamic Column Mapping**: Automatically maps sheet headers to Employee fields
- ✅ **Synonym Support**: Recognizes variations like "Rank", "Position", "Job Title"
- ✅ **Date Formatting**: Converts dates to YYYY-MM-DD format automatically
- ✅ **Multi-Sheet Support**: Read from different sheet tabs
- ✅ **Type-Safe**: Full TypeScript support with Employee interface
- ✅ **Error Handling**: Comprehensive error handling and validation
- ✅ **React Hooks**: Easy integration with custom hooks

## 📋 What Was Created

### 1. **Google Apps Script** (`googleAppsScript.gs`)

Updated with:
- `COLUMN_MAPPING` object with synonyms for all Employee fields
- `normalizeHeader()` function for case-insensitive header matching
- `getFieldNameForHeader()` function for intelligent header mapping
- `formatDate()` function for date conversion
- `rowToEmployee()` function for data transformation
- `/getMapping` endpoint to retrieve column mapping from React

**Column Mapping Example**:
```javascript
currentRank: ["current rank", "rank", "position", "job title", "title"]
officialStation: ["official station", "station", "campus", "office", "department"]
graduationDate: ["graduation date", "grad date", "date graduated", "graduation"]
```

### 2. **Google Sheets Sync Utility** (`src/utils/googleSheetsSync.ts`)

Functions:
- `fetchEmployeesFromGoogleSheets()` - Main fetch function
- `fetchEmployeeByIdFromGoogleSheets()` - Get single employee
- `getAvailableSheetsFromGoogleSheets()` - List sheets
- `getColumnMappingFromGoogleSheets()` - Get mapping config
- `syncFromGoogleSheets()` - Store integration helper

### 3. **React Hook** (`src/hooks/useGoogleSheetsSync.ts`)

Provides:
- `employees` - Array of employees
- `loading` - Sync loading state
- `error` - Error messages
- `isConnected` - Connection status
- `currentSheet` - Active sheet name
- `availableSheets` - List of sheets
- `syncFromSheet()` - Manual sync trigger
- `switchSheet()` - Switch active sheet
- `loadAvailableSheets()` - Load sheet list
- `retry()` - Retry failed sync

---

## 🚀 Setup Instructions

### Step 1: Deploy Google Apps Script

1. Create a new Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete default code
4. Copy entire contents of `googleAppsScript.gs`
5. Find this line:
   ```javascript
   const SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
   ```
6. Replace with your actual Sheet ID from the URL
7. Click **Save** (Ctrl+S)
8. Click **Deploy** → **New Deployment**
9. Select **Web app**
10. Configure:
    - Execute as: Your email
    - Who has access: Anyone
11. Click **Deploy**
12. Copy the generated URL (format: `https://script.google.com/macros/d/...`)

### Step 2: Configure React App

Create `.env` file in project root:
```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/d/YOUR_ID_HERE/usercontent
```

### Step 3: Add to App.tsx

---

## 💻 Integration Examples

### Option 1: Simple Integration (Recommended)

```typescript
import { useGoogleSheetsSync } from './hooks/useGoogleSheetsSync';

export default function App() {
  const {
    employees,
    loading,
    error,
    isConnected,
    currentSheet,
    syncFromSheet
  } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL,
    defaultSheetName: 'Masterlist',
    onSuccess: (data) => {
      console.log(`✓ Loaded ${data.length} employees`);
    },
    onError: (error) => {
      console.error(`✗ ${error}`);
    }
  });

  return (
    <div>
      <button onClick={() => syncFromSheet()}>
        {loading ? 'Syncing...' : 'Sync from Google Sheets'}
      </button>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {isConnected && <p>✓ Connected to: {currentSheet}</p>}
      <p>Employees: {employees.length}</p>
    </div>
  );
}
```

### Option 2: With Sheet Selector

```typescript
import { useGoogleSheetsSync } from './hooks/useGoogleSheetsSync';
import { useEffect } from 'react';

export default function App() {
  const {
    employees,
    currentSheet,
    availableSheets,
    switchSheet,
    loadAvailableSheets,
    loading,
    error
  } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL,
    defaultSheetName: 'Masterlist'
  });

  useEffect(() => {
    loadAvailableSheets();
  }, [loadAvailableSheets]);

  return (
    <div>
      {/* Sheet Selector */}
      <select 
        value={currentSheet}
        onChange={(e) => switchSheet(e.target.value)}
        disabled={loading}
      >
        {availableSheets.map(sheet => (
          <option key={sheet.name} value={sheet.name}>
            {sheet.name} ({sheet.rows} rows)
            {sheet.isDefault ? ' [Default]' : ''}
          </option>
        ))}
      </select>

      {/* Status */}
      {loading && <p>Syncing...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Employee List */}
      <p>Loaded: {employees.length} employees from {currentSheet}</p>
    </div>
  );
}
```

### Option 3: With Zustand Store Integration

```typescript
import { useGoogleSheetsSync } from './hooks/useGoogleSheetsSync';
import { useAppStore } from './store/appStore';
import { useEffect } from 'react';

export default function App() {
  const { setEmployees } = useAppStore();
  
  const {
    employees,
    syncFromSheet,
    loading,
    error,
    isConnected
  } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL,
    onSuccess: (data) => {
      setEmployees(data); // Update Zustand store
    }
  });

  // Auto-sync on mount
  useEffect(() => {
    syncFromSheet('Masterlist');
  }, [syncFromSheet]);

  return (
    <div>
      <button 
        onClick={() => syncFromSheet()} 
        disabled={loading}
      >
        {loading ? 'Syncing...' : 'Refresh from Sheets'}
      </button>

      {!isConnected && (
        <div style={{ background: '#fee', color: '#c33', padding: '10px' }}>
          ⚠️ Not connected to Google Sheets
        </div>
      )}

      {error && (
        <div style={{ background: '#ffe0e0', color: '#933', padding: '10px' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}
```

### Option 4: Add "Sync from Google Sheets" Button to Existing Upload Component

```typescript
import { fetchEmployeesFromGoogleSheets } from './utils/googleSheetsSync';
import { useState } from 'react';

export function UploadBanner() {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleSyncFromSheets = async () => {
    setSyncing(true);
    setSyncError(null);

    try {
      const result = await fetchEmployeesFromGoogleSheets(
        import.meta.env.VITE_GOOGLE_SHEETS_URL,
        'Masterlist'
      );

      if (result.success) {
        // Update your app state
        setEmployees(result.data);
        console.log(`✓ Synced ${result.data.length} employees`);
      } else {
        setSyncError(result.message);
      }
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      {/* Existing upload section */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

      {/* New sync button */}
      <button onClick={handleSyncFromSheets} disabled={syncing}>
        {syncing ? '⟳ Syncing from Google Sheets...' : '↻ Sync from Google Sheets'}
      </button>

      {syncError && (
        <div style={{ color: 'red', marginTop: '8px' }}>
          Error: {syncError}
        </div>
      )}
    </div>
  );
}
```

---

## 🔍 How Column Mapping Works

### The Process

1. **Read Headers**: Apps Script reads the first row of the sheet
2. **Normalize**: Each header is converted to lowercase and trimmed
3. **Match**: Uses `normalizeHeader()` to find matching Employee field
4. **Map**: Each column is mapped to the correct Employee property
5. **Transform**: Special handling for dates and empty values
6. **Validate**: React validates the data structure

### Example

If your Google Sheet has these headers:
```
| Employee #  | Rank        | Campus      | Status      | Grad Date    |
|-------------|-------------|-------------|-------------|--------------|
| 001         | Instructor II | Main Campus | Permanent  | 2023-05-15   |
```

The mapping works like this:
```
Employee #     → id (matches "no." synonym)
Rank           → currentRank (exact match)
Campus         → officialStation (matches "campus" synonym)
Status         → employmentStatus (matches "status" synonym)
Grad Date      → graduationDate (matches "grad date" synonym)
```

Result:
```json
{
  "id": "001",
  "currentRank": "Instructor II",
  "officialStation": "Main Campus",
  "employmentStatus": "Permanent",
  "graduationDate": "2023-05-15"
}
```

---

## 🗂️ Complete Column Mapping Reference

All fields with their recognized synonyms:

```javascript
{
  id: ["id", "employee id", "emp id", "no.", "no", "#"],
  no: ["no.", "no", "#", "employee no", "emp no"],
  currentRank: ["current rank", "rank", "position", "job title", "title"],
  officialStation: ["official station", "station", "campus", "office", "department"],
  categoryOfEmployment: ["category of employment", "employment category", "employment type", "category"],
  employmentStatus: ["employment status", "status", "employment stat"],
  courseProgram: ["course program", "program", "course", "degree", "qualification"],
  fundingSource: ["funding source", "funding", "budget source", "fund source"],
  universityAttended: ["university attended", "university", "institution", "educational institution"],
  contractDuration: ["contract duration", "duration", "contract period", "contract term"],
  reinstatement: ["reinstatement", "reinstated", "reinstate"],
  schoolingStatus: ["schooling status", "school status", "education status", "status school"],
  graduationDate: ["graduation date", "grad date", "date graduated", "graduation"],
  connectedWithCSU: ["connected with csu", "connected", "csu connection", "affiliation"]
}
```

---

## 🧪 Testing

### Test in Google Apps Script

```javascript
function testDynamicMapping() {
  // Run the test function
  testScript();
  
  // Check the logs (View > Logs)
}
```

### Test in Browser Console

```javascript
// Fetch employees with dynamic mapping
fetch('YOUR_WEB_APP_URL?action=getAll&sheet=Masterlist')
  .then(r => r.json())
  .then(data => {
    console.log('Success:', data.success);
    console.log('Employees loaded:', data.data.length);
    console.log('First employee:', data.data[0]);
  });

// Test header mapping
fetch('YOUR_WEB_APP_URL?action=getMapping')
  .then(r => r.json())
  .then(data => console.log('Column mapping:', data.data));
```

### React Component Test

```typescript
import { fetchEmployeesFromGoogleSheets } from './utils/googleSheetsSync';

async function testFetch() {
  const result = await fetchEmployeesFromGoogleSheets(
    'YOUR_WEB_APP_URL',
    'Masterlist'
  );
  
  console.log('Result:', result);
  console.log('Employees:', result.data);
  console.log('First employee fields:', Object.keys(result.data[0]));
}
```

---

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Sheet not found" | Verify exact sheet name and SPREADSHEET_ID |
| "Column mapping not working" | Check header names match column mapping synonyms |
| "404 error" | Verify deployment URL is correct and web app is deployed |
| "Empty data returned" | Ensure sheet has headers in first row and data below |
| "Date format wrong" | Check graduationDate column format; should be convertible to date |
| "CORS error" | Ensure web app is deployed with "Anyone" access |
| "TypeScript errors" | Verify all imports and ensure utilities are in correct paths |

---

## 🔒 Security Notes

### Current Setup
- Allows anyone with the URL to read your data
- Good for internal use
- Consider restricting in production

### Production Security
Add authentication to Apps Script:

```javascript
function doGet(e) {
  if (e.parameter.key !== YOUR_SECRET_KEY) {
    return createResponse(false, "Unauthorized", null);
  }
  // ... rest of function
}
```

Then in React:
```typescript
const url = new URL(webAppUrl);
url.searchParams.append("key", import.meta.env.VITE_API_KEY);
```

---

## 📊 API Reference

### GET Endpoints

```
GET ?action=getAll&sheet=Masterlist
Returns: All employees from sheet with dynamic mapping

GET ?action=getById&id=123&sheet=Masterlist
Returns: Single employee by ID

GET ?action=getSheets
Returns: List of available sheets

GET ?action=getMapping
Returns: Column mapping configuration
```

---

## ✅ Verification Checklist

- [ ] Google Sheet created with employee data
- [ ] Apps Script deployed as web app
- [ ] SPREADSHEET_ID configured correctly
- [ ] Deployment URL copied
- [ ] `.env` file has `VITE_GOOGLE_SHEETS_URL`
- [ ] Hooks imported in your components
- [ ] Manual test successful
- [ ] Data loads correctly in app
- [ ] Column mapping working for all fields
- [ ] Error handling working

---

## 🎓 Next Steps

1. ✅ Deploy Google Apps Script
2. ✅ Add deployment URL to `.env`
3. ✅ Integrate hooks into components
4. ✅ Test with sample data
5. ✅ Replace Excel upload with Google Sheets
6. ✅ Add sheet selector dropdown
7. ✅ Monitor sync performance
8. 📈 Add auto-sync functionality
9. 🔒 Implement authentication if needed
10. 📱 Test on mobile/different browsers
