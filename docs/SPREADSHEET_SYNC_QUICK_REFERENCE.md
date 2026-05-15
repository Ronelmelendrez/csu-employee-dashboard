# Spreadsheet Sync - Quick Reference Card

## 🎯 One-Minute Setup

### 1. Create Deployment
```
1. Google Sheets → Extensions → Apps Script
2. Paste: googleAppsScript.gs
3. Find line: const SPREADSHEET_ID = "..."
4. Replace with your Sheet ID
5. Deploy → New Deployment → Web app
6. Copy URL
```

### 2. Configure Dashboard
```
1. Create .env file:
   VITE_SPREADSHEET_SYNC_URL=https://script.google.com/...

2. Update App.tsx:
   import { useSpreadsheetSync } from './hooks/useSpreadsheetSync';
   
   const { employees, loading, error } = useSpreadsheetSync({
     appScriptUrl: import.meta.env.VITE_SPREADSHEET_SYNC_URL,
     autoSync: true,
     syncInterval: 30000
   });
```

### 3. Test
```
1. Upload file in dashboard
2. Check Google Sheet for data
3. Edit in Google Sheet
4. Refresh dashboard - should show updates
```

## 📋 Files Created

| File | Purpose |
|------|---------|
| `googleAppsScript.gs` | Google Apps Script code - deploy to Sheets |
| `src/utils/syncSpreadsheet.ts` | Sync utility class |
| `src/hooks/useSpreadsheetSync.ts` | React hook for easy integration |
| `SPREADSHEET_SYNC_SETUP.md` | Detailed setup guide |
| `SPREADSHEET_SYNC_EXAMPLES.md` | Code examples |
| `SPREADSHEET_SYNC_README.md` | Complete documentation |

## 🔌 API Methods

```typescript
// Fetch
const employees = await sync.fetchEmployees();
const emp = await sync.fetchEmployeeById(1);

// Create
const newEmp = await sync.addEmployee({ ... });

// Update
await sync.updateEmployee({ id: 1, ... });

// Delete
await sync.deleteEmployee(1);

// Bulk
await sync.syncAllEmployees([...]);

// Control
sync.startAutoSync();
sync.stopAutoSync();
sync.validateConnection();
```

## ⚙️ Configuration Options

```typescript
{
  appScriptUrl: string,        // Required: Your deployment URL
  autoSync?: boolean,          // Default: false
  syncInterval?: number,       // Default: 60000 (1 minute)
  onSyncSuccess?: (data) => {}, // Callback on success
  onSyncError?: (error) => {}   // Callback on error
}
```

## 🔍 Sync Intervals

```
5 seconds   → 5000     (Real-time, high bandwidth)
30 seconds  → 30000    ⭐ Recommended
1 minute    → 60000    (Standard)
5 minutes   → 300000   (Large datasets)
On-demand   → false    (Manual only)
```

## ✅ Status Indicators

```typescript
// Check connection
if (isConnected) console.log("Connected ✓");

// Check if syncing
if (loading) console.log("Syncing...");

// Check for errors
if (error) console.log("Error:", error.message);
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Check import paths are correct |
| "URL not responding" | Verify deployment URL is correct |
| "Sheet not found" | Run `initializeSheet()` in Apps Script |
| "No data syncing" | Check console for errors, increase interval |
| "CORS error" | Check URL accessibility in browser |

## 📱 React Hook Usage

```typescript
const {
  employees,              // Employee[]
  loading,               // boolean
  error,                 // Error | null
  isConnected,          // boolean
  sync,                 // () => Promise<void>
  addEmployee,          // (emp) => Promise<Employee | null>
  updateEmployee,       // (emp) => Promise<boolean>
  deleteEmployee,       // (id) => Promise<boolean>
  syncAll              // (employees) => Promise<boolean>
} = useSpreadsheetSync(config);
```

## 🔐 Security Quick Setup

```javascript
// In googleAppsScript.gs
const API_KEY = "your-secret-key-here";

function doGet(e) {
  if (e.parameter.key !== API_KEY) {
    return createResponse(false, "Unauthorized", null);
  }
  // ... rest of function
}
```

```typescript
// In dashboard
const url = `${appScriptUrl}?action=getAll&key=${process.env.VITE_API_KEY}`;
```

## 📊 What Syncs

```
Synced Fields:
├── id
├── currentRank
├── officialStation
├── categoryOfEmployment
├── employmentStatus
├── courseProgram
├── fundingSource
├── universityAttended
├── contractDuration
├── reinstatement
├── schoolingStatus
├── graduationDate
└── connectedWithCSU
```

## 🚀 Deploy Checklist

- [ ] Google Sheet created
- [ ] Apps Script deployed
- [ ] SPREADSHEET_ID replaced in script
- [ ] Deployment URL copied
- [ ] .env file configured
- [ ] App.tsx updated with hook
- [ ] Build completes: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] File upload syncs to Sheet
- [ ] Edit in Sheet shows in dashboard

## 📞 Test Commands

```bash
# Build check
npm run build

# Start dev server
npm run dev

# Check browser console
F12 → Console tab

# Look for messages:
✓ Connected to Google Sheets
✓ Synced X employees from Google Sheets
✗ Sync error messages
```

## 🎓 Learning Resources

- Setup: See `SPREADSHEET_SYNC_SETUP.md`
- Examples: See `SPREADSHEET_SYNC_EXAMPLES.md`
- Full Docs: See `SPREADSHEET_SYNC_README.md`
- Google Apps Script: https://developers.google.com/apps-script

## 💡 Pro Tips

1. **Test Connection First**
   ```typescript
   const isConnected = await sync.validateConnection();
   ```

2. **Handle Errors Gracefully**
   ```typescript
   onSyncError: (error) => {
     console.error("Sync failed:", error);
     // Show user notification
   }
   ```

3. **Monitor Performance**
   - Check Network tab in DevTools
   - Watch for failed requests
   - Adjust sync interval if needed

4. **Batch Updates**
   - Use `syncAll()` for multiple changes
   - More efficient than individual updates

5. **Disable Auto-Sync for Testing**
   ```typescript
   autoSync: false, // Set manually during development
   ```

---

**For detailed information, see the full documentation files included in your project.**
