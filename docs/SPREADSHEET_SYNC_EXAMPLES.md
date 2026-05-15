/**
 * Example Configuration and Integration Guide
 * 
 * This file shows how to integrate the spreadsheet sync functionality
 * into your existing App.tsx or any component
 */

// ============================================================================
// OPTION 1: Simple Integration in App.tsx
// ============================================================================

/*
import { useState, useEffect, useRef } from 'react';
import { SpreadsheetSync } from './utils/syncSpreadsheet';
import { Employee } from './types/employee';

export function App() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const syncRef = useRef<SpreadsheetSync | null>(null);

  useEffect(() => {
    // Initialize spreadsheet sync
    // IMPORTANT: Replace with your actual deployment URL from Google Apps Script
    const appScriptUrl = 'https://script.google.com/macros/d/YOUR_ID_HERE/usercontent';
    
    syncRef.current = new SpreadsheetSync({
      appScriptUrl: appScriptUrl,
      autoSync: true,
      syncInterval: 30000 // Sync every 30 seconds
    });

    // Fetch initial employees from spreadsheet
    syncRef.current
      .fetchEmployees()
      .then(syncedEmployees => {
        if (syncedEmployees.length > 0) {
          setEmployees(syncedEmployees);
        }
      })
      .catch(error => console.error('Failed to sync employees:', error));

    // Cleanup on unmount
    return () => syncRef.current?.stopAutoSync();
  }, []);

  // When uploading files, sync to spreadsheet
  const handleFileUpload = async (newEmployees: Employee[]) => {
    const updatedEmployees = [...employees, ...newEmployees];
    setEmployees(updatedEmployees);

    // Sync to Google Sheets
    if (syncRef.current) {
      const success = await syncRef.current.syncAllEmployees(updatedEmployees);
      if (success) {
        console.log('✓ Data synced to Google Sheets');
      }
    }
  };

  return (
    // ... your component JSX
  );
}
*/

// ============================================================================
// OPTION 2: Using Custom Hook (RECOMMENDED)
// ============================================================================

/*
import { useState } from 'react';
import { useSpreadsheetSync } from './hooks/useSpreadsheetSync';
import { Employee } from './types/employee';

export function App() {
  const [page, setPage] = useState<'dashboard' | 'directory' | 'analytics'>('dashboard');

  // Use the custom hook - handles all sync logic
  const {
    employees,
    loading,
    error,
    isConnected,
    sync,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    syncAll
  } = useSpreadsheetSync({
    appScriptUrl: 'https://script.google.com/macros/d/YOUR_ID_HERE/usercontent',
    autoSync: true,
    syncInterval: 30000,
    onSyncSuccess: (data) => {
      console.log('✓ Sync successful, loaded', data.length, 'employees');
    },
    onSyncError: (error) => {
      console.error('✗ Sync failed:', error.message);
    }
  });

  // Show connection status
  const connectionStatus = (
    <div style={{
      padding: '12px 16px',
      background: isConnected ? '#10b98122' : '#ef444422',
      borderLeft: `4px solid ${isConnected ? '#10b981' : '#ef4444'}`,
      color: isConnected ? '#047857' : '#991b1b',
      fontSize: '13px',
      marginBottom: '16px',
      borderRadius: '4px'
    }}>
      {isConnected 
        ? '✓ Connected to Google Sheets' 
        : '✗ Disconnected from Google Sheets'}
    </div>
  );

  if (error) {
    return <div>{connectionStatus}</div>;
  }

  return (
    <div>
      {connectionStatus}
      {loading && <p>Syncing...</p>}
      
      {/ * Rest of your app * /}
    </div>
  );
}
*/

// ============================================================================
// OPTION 3: Environment Variable Configuration
// ============================================================================

/*
// .env file
VITE_SPREADSHEET_SYNC_URL=https://script.google.com/macros/d/YOUR_ID_HERE/usercontent
VITE_SYNC_AUTO=true
VITE_SYNC_INTERVAL=30000

// In your component
const config = {
  appScriptUrl: import.meta.env.VITE_SPREADSHEET_SYNC_URL,
  autoSync: import.meta.env.VITE_SYNC_AUTO === 'true',
  syncInterval: parseInt(import.meta.env.VITE_SYNC_INTERVAL || '30000')
};

const { employees, ... } = useSpreadsheetSync(config);
*/

// ============================================================================
// OPTION 4: Advanced - Multiple Sync Instances
// ============================================================================

/*
import { SpreadsheetSync } from './utils/syncSpreadsheet';

// For reading and writing separately
const readSync = new SpreadsheetSync({
  appScriptUrl: 'https://script.google.com/...',
  autoSync: true,
  syncInterval: 60000
});

const writeSync = new SpreadsheetSync({
  appScriptUrl: 'https://script.google.com/...'
});

// Read data periodically
const employees = await readSync.fetchEmployees();

// Write data on demand
await writeSync.addEmployee({ ... });
*/

// ============================================================================
// OPTION 5: Complete App.tsx Example
// ============================================================================

/*
import { useState, useRef } from 'react';
import { useSpreadsheetSync } from './hooks/useSpreadsheetSync';
import { Employee } from './types/employee';
import { parseExcel } from './utils/excelParser';
import DashboardPage from './pages/Dashboard';
import DirectoryPage from './pages/Directory';
import AnalyticsPage from './pages/Analytics';

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'directory' | 'analytics'>('dashboard');
  const [dark, setDark] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Integrate spreadsheet sync
  const {
    employees,
    loading,
    error,
    isConnected,
    syncAll
  } = useSpreadsheetSync({
    appScriptUrl: import.meta.env.VITE_SPREADSHEET_SYNC_URL || 
                   'https://script.google.com/macros/d/YOUR_ID_HERE/usercontent',
    autoSync: true,
    syncInterval: 30000,
    onSyncSuccess: (data) => {
      console.log('✓ Synced', data.length, 'employees from Google Sheets');
    },
    onSyncError: (error) => {
      console.error('✗ Sync error:', error.message);
    }
  });

  // Handle file uploads
  const handleFilesSelected = async (files: File[]) => {
    try {
      let allNewEmployees: Employee[] = [];
      
      for (const file of files) {
        const parsed = await parseExcel(file);
        allNewEmployees = [...allNewEmployees, ...parsed];
      }

      // Update local state
      const updated = [...employees, ...allNewEmployees];

      // Sync to Google Sheets
      const success = await syncAll(updated);
      if (success) {
        console.log('✓ File uploaded and synced to Google Sheets');
      } else {
        console.error('✗ Failed to sync to Google Sheets');
      }
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  const theme = dark
    ? {
        '--bg': '#0f172a',
        '--card': '#1e293b',
        '--text': '#f1f5f9',
        '--muted': '#94a3b8',
        '--border': '#334155',
        '--hover': '#1e293b',
        '--sidebar': '#0f172a',
        '--accent': '#6366f1'
      }
    : {
        '--bg': '#fff',
        '--card': '#f8fafc',
        '--text': '#1e293b',
        '--muted': '#64748b',
        '--border': '#e2e8f0',
        '--hover': '#f1f5f9',
        '--sidebar': '#f8fafc',
        '--accent': '#6366f1'
      };

  return (
    <div style={{ ...theme as any, background: 'var(--bg)' }}>
      {/ * Connection Status Bar * /}
      {!isConnected && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#991b1b',
          padding: '12px 24px',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          ⚠️ Not connected to Google Sheets. Check your configuration.
        </div>
      )}

      {/ * Loading Indicator * /}
      {loading && (
        <div style={{
          background: '#fef3c7',
          color: '#92400e',
          padding: '8px 24px',
          fontSize: '12px'
        }}>
          ↻ Syncing with Google Sheets...
        </div>
      )}

      {/ * Your app layout * /}
      <div style={{ display: 'flex' }}>
        {/ * Sidebar * /}
        {/ * Main content * /}
        {page === 'dashboard' && <DashboardPage employees={employees} />}
        {page === 'directory' && <DirectoryPage employees={employees} />}
        {page === 'analytics' && <AnalyticsPage employees={employees} />}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".xlsx,.xls"
        onChange={(e) => {
          if (e.target.files) {
            handleFilesSelected(Array.from(e.target.files));
          }
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
*/

// ============================================================================
// CONFIGURATION CHECKLIST
// ============================================================================

/*
Before using the spreadsheet sync, complete these steps:

✅ STEP 1: Get Deployment URL
   - Go to Google Apps Script editor
   - Click Deploy → Choose deployment
   - Copy the deployment URL
   - Format: https://script.google.com/macros/d/YOUR_ID/usercontent

✅ STEP 2: Configure Spreadsheet Sync
   - Replace 'YOUR_ID_HERE' with your actual deployment URL
   - Or set VITE_SPREADSHEET_SYNC_URL environment variable

✅ STEP 3: Choose Integration Method
   - Option 1: Direct SpreadsheetSync class
   - Option 2: useSpreadsheetSync hook (recommended)
   - Option 3: Environment variables

✅ STEP 4: Test Connection
   - Check browser console for sync messages
   - Verify data appears in Google Sheets
   - Test uploading new files

✅ STEP 5: Monitor Sync Status
   - Watch for connection status indicators
   - Check for error messages
   - Adjust sync interval if needed

✅ STEP 6: Production Deployment
   - Add error handling UI
   - Implement retry logic
   - Set appropriate sync intervals
   - Add logging/monitoring
*/

// ============================================================================
// TROUBLESHOOTING
// ============================================================================

/*
ISSUE: "Failed to fetch from spreadsheet"
SOLUTION: 
  - Verify deployment URL is correct
  - Check CORS settings in Apps Script
  - Ensure "Anyone" has access permission

ISSUE: "Sheet not found"
SOLUTION:
  - Run initializeSheet() in Apps Script
  - Verify SPREADSHEET_ID in script
  - Check Sheet name matches "Employees"

ISSUE: "Data not syncing"
SOLUTION:
  - Check sync interval isn't too short
  - Verify internet connection
  - Check browser console for errors
  - Test with syncAll() instead of autoSync

ISSUE: "Performance is slow"
SOLUTION:
  - Increase sync interval (300000ms = 5 minutes)
  - Disable autoSync, call sync() manually
  - Filter which fields to sync
  - Monitor network tab in DevTools
*/

export {};
