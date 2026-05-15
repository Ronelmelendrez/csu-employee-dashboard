# Google Sheets Real-Time Sync Setup Guide

## Overview

This guide explains how to set up real-time synchronization between your CSU Employee Dashboard and Google Sheets using Google Apps Script.

## Architecture

```
Dashboard (React)
    ↓↑
Spreadsheet Sync Utility (TypeScript)
    ↓↑
Google Apps Script Web App
    ↓↑
Google Sheets
```

## Step 1: Create a Google Sheet

1. Go to [Google Drive](https://drive.google.com)
2. Click **+ New** → **Google Sheets**
3. Name it: **CSU Employee Dashboard Data**
4. Copy the Sheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
   - Keep this ID safe - you'll need it soon

## Step 2: Set Up Google Apps Script

### 2.1 Create the Apps Script Project

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. You'll be taken to the Apps Script editor in a new tab
3. Delete the default `myFunction()` code
4. Copy the entire contents from `googleAppsScript.gs` file in this repository
5. Paste it into the Apps Script editor

### 2.2 Configure the Script

1. Find this line near the top:
   ```javascript
   const SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";
   ```
2. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with your actual Sheet ID from Step 1

### 2.3 Save and Deploy

1. Click **Save** (or Ctrl+S)
2. Click **Deploy** → **New Deployment**
3. Click the gear icon and select **Web app**
4. Configure:
   - **Execute as**: Your email account
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Important**: Copy the generated deployment URL (it looks like `https://script.google.com/macros/d/.../usercontent`)
7. Keep this URL safe - you'll need it in the dashboard

## Step 3: Initialize the Spreadsheet

1. In the Apps Script editor, click **Run** → look for `initializeSheet` function
2. Or go back to Google Sheets and verify the "Employees" sheet was created with headers

## Step 4: Integrate with Dashboard

### 4.1 Update App.tsx to Use Sync

Add this to your `App.tsx`:

```typescript
import { SpreadsheetSync } from "./utils/syncSpreadsheet";

// At the top of the component, after state declarations:
const spreadsheetSync = useRef<SpreadsheetSync | null>(null);

// In the useEffect for initialization:
useEffect(() => {
  // Initialize spreadsheet sync
  const appScriptUrl = "YOUR_DEPLOYMENT_URL_HERE"; // Paste your deployment URL
  spreadsheetSync.current = new SpreadsheetSync({
    appScriptUrl: appScriptUrl,
    autoSync: true,
    syncInterval: 30000 // Sync every 30 seconds
  });

  // Fetch initial data from spreadsheet
  spreadsheetSync.current
    .fetchEmployees()
    .then(syncedEmployees => {
      if (syncedEmployees.length > 0) {
        setEmployees(syncedEmployees);
      }
    })
    .catch(error => console.error("Failed to sync employees:", error));
}, []);
```

### 4.2 Add Upload Sync Functionality

Update your file upload handler to sync with Google Sheets:

```typescript
const handleFilesSelected = async (files: File[]) => {
  for (const file of files) {
    try {
      const uploadedData = await parseExcel(file);
      setEmployees(prev => [...prev, ...uploadedData]);

      // Sync new data to Google Sheets
      if (spreadsheetSync.current) {
        await spreadsheetSync.current.syncAllEmployees([
          ...employees,
          ...uploadedData
        ]);
        console.log("Data synced to Google Sheets");
      }
    } catch (error) {
      console.error("Error processing file:", error);
    }
  }
};
```

## Step 5: Test the Sync

1. **In Dashboard**:
   - Open your dashboard at `localhost:5174`
   - Upload an Excel file with employee data
   - Check browser console for sync success messages

2. **In Google Sheets**:
   - Refresh your Google Sheet
   - Verify that employee data appears in the "Employees" sheet
   - Manually edit a cell and the dashboard should reflect the change on next refresh

3. **Verify Auto-Sync**:
   - Wait 30 seconds (or your configured interval)
   - Make changes in Google Sheets
   - Check dashboard for updates

## API Endpoints

The Google Apps Script exposes these endpoints:

### GET Requests

```
GET /apps/script?action=getAll
→ Returns all employees

GET /apps/script?action=getById&id=1
→ Returns employee with ID 1
```

### POST Requests

```
POST /apps/script?action=add
Body: { employee object }
→ Adds new employee

POST /apps/script?action=update
Body: { employee object }
→ Updates existing employee

POST /apps/script?action=delete
Body: { id: 1 }
→ Deletes employee by ID

POST /apps/script?action=sync
Body: [array of employees]
→ Bulk sync all employees
```

## Usage Examples

### Manual Sync

```typescript
import { SpreadsheetSync } from "./utils/syncSpreadsheet";

const sync = new SpreadsheetSync({
  appScriptUrl: "YOUR_DEPLOYMENT_URL"
});

// Fetch all employees
const employees = await sync.fetchEmployees();

// Add new employee
const newEmployee = await sync.addEmployee({
  currentRank: "Instructor II",
  officialStation: "Main Campus",
  // ... other fields
});

// Update employee
await sync.updateEmployee({
  id: 1,
  currentRank: "Instructor III",
  // ... other fields
});

// Delete employee
await sync.deleteEmployee(1);

// Bulk sync
await sync.syncAllEmployees(employeeArray);
```

### Auto-Sync with Callbacks

```typescript
const sync = new SpreadsheetSync({
  appScriptUrl: "YOUR_DEPLOYMENT_URL",
  autoSync: true,
  syncInterval: 60000 // Every minute
});

// Manually trigger sync
const employees = await sync.fetchEmployees();
setEmployees(employees);

// Stop auto-sync when component unmounts
return () => sync.stopAutoSync();
```

## Troubleshooting

### "Apps Script URL not responding"

- Verify the deployment URL is correct
- Check that "Who has access" is set to "Anyone"
- Redeploy the script if needed

### "Sheet not found"

- Ensure the SPREADSHEET_ID in the script matches your actual Sheet ID
- Run the `initializeSheet` function manually in Apps Script

### "Permission denied"

- Click the **Authorize** button when prompted
- Verify you're signed into the correct Google account
- Check script permissions: **Project Settings** → **Show "appsscript.json" manifest file**

### "Employees not syncing"

- Check browser console (F12) for error messages
- Verify network requests in DevTools Network tab
- Run `testScript()` in Apps Script editor to verify functionality
- Check if auto-sync interval is too short (minimum 5000ms recommended)

## Security Considerations

1. **Anyone Can Access**: Currently the script allows anyone to access your data
   - For production, restrict to authenticated users only
   - Modify the `doGet()` and `doPost()` functions to check authentication

2. **Data Validation**: Add validation in the Apps Script before accepting data:
   ```javascript
   function validateEmployee(employee) {
     if (!employee.id || !employee.currentRank) {
       throw new Error("Missing required fields");
     }
     return true;
   }
   ```

3. **CORS Headers**: Add CORS headers if accessing from different domain:
   ```javascript
   const response = ContentService.createTextOutput(JSON.stringify(result))
     .setMimeType(ContentService.MimeType.JSON)
     .addHeader("Access-Control-Allow-Origin", "*");
   ```

## Advanced Configuration

### Environment Variables

Store your deployment URL in an environment variable:

```typescript
const SPREADSHEET_SYNC_URL = import.meta.env.VITE_SPREADSHEET_SYNC_URL;

const sync = new SpreadsheetSync({
  appScriptUrl: SPREADSHEET_SYNC_URL
});
```

In `.env` file:
```
VITE_SPREADSHEET_SYNC_URL=https://script.google.com/macros/d/.../usercontent
```

### Custom Sync Intervals

Adjust sync frequency based on your needs:

```typescript
// Real-time (every 5 seconds) - use sparingly
syncInterval: 5000

// Frequent (every 30 seconds)
syncInterval: 30000

// Standard (every minute)
syncInterval: 60000

// Periodic (every 5 minutes)
syncInterval: 300000
```

## Next Steps

1. ✅ Deploy Google Apps Script
2. ✅ Integrate SpreadsheetSync with dashboard
3. ✅ Test synchronization
4. 📝 Add data validation and error handling
5. 🔒 Implement authentication if needed
6. 📊 Monitor sync performance and adjust intervals
7. 🚀 Deploy to production

## Support

For issues with Google Apps Script:
- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script API Reference](https://developers.google.com/apps-script/reference)

For issues with the dashboard integration:
- Check the browser console for errors
- Verify the deployment URL is accessible
- Test the script directly using the test function in Apps Script
