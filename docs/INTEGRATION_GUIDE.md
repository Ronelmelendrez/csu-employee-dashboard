# Implementation Guide: How to Integrate Google Sheets into Your App

This guide shows **exactly how** to modify your existing `App.tsx` and components to use the new Google Sheets integration.

---

## 📝 Step 1: Update App.tsx - Basic Integration

Replace the relevant section in your `App.tsx` to add Google Sheets sync:

```typescript
import { useState, useEffect } from 'react';
import { useGoogleSheetsSync } from './hooks/useGoogleSheetsSync';
import { Employee } from './types/employee';
import Layout from './components/Layout';

export default function App() {
  const [page, setPage] = useState<'dashboard' | 'directory' | 'analytics'>('dashboard');
  const [dark, setDark] = useState(true);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize Google Sheets sync
  const {
    employees,
    loading,
    error,
    isConnected,
    syncFromSheet,
    switchSheet,
    availableSheets,
    loadAvailableSheets
  } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL || '',
    defaultSheetName: 'Masterlist',
    onSuccess: (data) => {
      console.log(`✓ Successfully synced ${data.length} employees from Google Sheets`);
    },
    onError: (error) => {
      console.error(`✗ Google Sheets sync failed: ${error}`);
    }
  });

  // Load available sheets on mount
  useEffect(() => {
    if (import.meta.env.VITE_GOOGLE_SHEETS_URL) {
      loadAvailableSheets();
      // Initial sync
      syncFromSheet('Masterlist');
    }
  }, []);

  // Render header with status indicator
  const connectionStatus = isConnected ? (
    <span style={{ color: '#22c55e', marginLeft: '8px', fontSize: '14px' }}>
      ✓ Google Sheets Connected
    </span>
  ) : (
    <span style={{ color: '#ef4444', marginLeft: '8px', fontSize: '14px' }}>
      ✗ Not Connected
    </span>
  );

  return (
    <div style={{
      background: dark ? '#0f172a' : '#f8fafc',
      color: dark ? '#f1f5f9' : '#1e293b',
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Sticky Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: dark ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>CSU Dashboard</span>
          <span style={{ fontSize: '14px', color: dark ? '#94a3b8' : '#64748b' }}>
            {employees.length} Employees
          </span>
          {connectionStatus}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Sync Button */}
          <button onClick={() => syncFromSheet()} disabled={loading} style={{
            background: loading ? '#64748b' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'background 200ms'
          }}>
            {loading ? '⟳ Syncing...' : '↻ Sync Sheets'}
          </button>

          {/* Theme Toggle */}
          <button onClick={() => setDark(!dark)} style={{
            background: dark ? '#334155' : '#e2e8f0',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fecaca',
          color: '#991b1b',
          padding: '12px 24px',
          borderBottom: '1px solid #fca5a5',
          fontSize: '14px'
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: '240px',
            background: dark ? '#1e293b' : '#f1f5f9',
            borderRight: `1px solid ${dark ? '#334155' : '#e2e8f0'}`,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Page Navigation */}
            {(['dashboard', 'directory', 'analytics'] as const).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{
                background: page === p ? '#3b82f6' : 'transparent',
                color: page === p ? 'white' : 'inherit',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}>
                {p}
              </button>
            ))}

            {/* Sheet Selector */}
            {availableSheets.length > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${dark ? '#334155' : '#e2e8f0'}` }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                  Active Sheet
                </label>
                <select 
                  onChange={(e) => switchSheet(e.target.value)}
                  defaultValue="Masterlist"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${dark ? '#475569' : '#cbd5e1'}`,
                    background: dark ? '#0f172a' : '#ffffff',
                    color: 'inherit',
                    fontSize: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {availableSheets.map(sheet => (
                    <option key={sheet.name} value={sheet.name}>
                      {sheet.name} ({sheet.rows})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Main Content - Use employees array from Google Sheets */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          {loading && employees.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <p>Loading employees from Google Sheets...</p>
            </div>
          ) : (
            <Layout 
              page={page} 
              employees={employees}
              selected={selected}
              setSelected={setSelected}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🔧 Step 2: Create .env Configuration

Create `.env` file in your project root:

```env
# Google Sheets Web App URL (from Google Apps Script deployment)
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID_HERE/usercontent

# Optional: Auto-sync interval in milliseconds
VITE_AUTO_SYNC_INTERVAL=60000

# Optional: API Key for production
VITE_API_KEY=your_secret_key_here
```

Update `.env.local` (Git-ignored) with your actual deployment ID:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9i0j/usercontent
```

---

## 🔌 Step 3: Replace Excel Upload with Google Sheets Sync

If you have an existing `FileUploader` component, modify it to support both:

```typescript
// src/components/ui/FileUploader.tsx
import { useState } from 'react';
import { Employee } from '../../types/employee';
import { fetchEmployeesFromGoogleSheets } from '../../utils/googleSheetsSync';

interface FileUploaderProps {
  onFileSelect?: (employees: Employee[]) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Your existing Excel parsing logic here
      const employees = await parseExcelFile(file);
      onFileSelect?.(employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sheets sync
  const handleSheetsSync = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchEmployeesFromGoogleSheets(
        import.meta.env.VITE_GOOGLE_SHEETS_URL,
        'Masterlist'
      );

      if (result.success) {
        onFileSelect?.(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      gap: '16px',
      padding: '16px',
      background: '#f5f5f5',
      borderRadius: '8px',
      alignItems: 'center'
    }}>
      {/* Excel Upload */}
      <div>
        <label style={{ marginRight: '8px', fontSize: '14px' }}>
          Upload Excel:
        </label>
        <input 
          type="file" 
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          disabled={loading}
          style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        />
      </div>

      {/* Google Sheets Sync */}
      <button 
        onClick={handleSheetsSync}
        disabled={loading}
        style={{
          background: loading ? '#cccccc' : '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {loading ? '⟳ Syncing...' : '↻ Sync from Google Sheets'}
      </button>

      {/* Status */}
      {error && <span style={{ color: 'red', fontSize: '14px' }}>Error: {error}</span>}
    </div>
  );
}

// Helper function for Excel parsing (your existing logic)
async function parseExcelFile(file: File): Promise<Employee[]> {
  // Your existing parseExcel function here
  return [];
}
```

---

## 📊 Step 4: Add to Directory Page

```typescript
// src/pages/Directory.tsx - Update to use Google Sheets employees
import { useState, useMemo } from 'react';
import { Employee } from '../types/employee';

interface DirectoryProps {
  employees: Employee[];  // Now comes from Google Sheets
  selected: Employee | null;
  setSelected: (emp: Employee | null) => void;
}

export default function Directory({ employees, selected, setSelected }: DirectoryProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.no?.toString().toLowerCase().includes(search.toLowerCase()) ||
        emp.currentRank?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !statusFilter || emp.employmentStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  const itemsPerPage = 10;
  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div style={{ padding: '32px' }}>
      <h1>Employee Directory</h1>

      {/* Search and Filters */}
      <input 
        type="text"
        placeholder="🔍 Search employees..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        style={{
          width: '100%',
          padding: '8px',
          marginBottom: '16px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Rank</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Station</th>
            <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map(emp => (
            <tr 
              key={emp.id}
              onClick={() => setSelected(emp)}
              style={{
                cursor: 'pointer',
                background: selected?.id === emp.id ? '#e3f2fd' : '#fff',
                borderBottom: '1px solid #eee'
              }}
            >
              <td style={{ padding: '8px' }}>{emp.no}</td>
              <td style={{ padding: '8px' }}>{emp.currentRank}</td>
              <td style={{ padding: '8px' }}>{emp.officialStation}</td>
              <td style={{ padding: '8px' }}>{emp.employmentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {Array.from({ length: pageCount }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            style={{
              background: page === i + 1 ? '#3b82f6' : '#ddd',
              color: page === i + 1 ? 'white' : 'black',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Step 5: Optional - Add a "Sync Status" Widget

```typescript
// src/components/SyncStatus.tsx
import { useGoogleSheetsSync } from '../hooks/useGoogleSheetsSync';

export function SyncStatus() {
  const { isConnected, currentSheet, loading, error } = useGoogleSheetsSync({
    webAppUrl: import.meta.env.VITE_GOOGLE_SHEETS_URL || ''
  });

  return (
    <div style={{
      padding: '12px',
      background: isConnected ? '#dcfce7' : '#fee2e2',
      color: isConnected ? '#166534' : '#991b1b',
      borderRadius: '4px',
      fontSize: '13px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span>
        {isConnected ? '✓' : '✗'} {isConnected ? 'Connected' : 'Disconnected'}
        {currentSheet && ` (${currentSheet})`}
      </span>
      {loading && <span>Syncing...</span>}
      {error && <span>Error: {error}</span>}
    </div>
  );
}
```

---

## ✅ Testing Checklist

- [ ] `.env` has `VITE_GOOGLE_SHEETS_URL`
- [ ] Google Apps Script deployed
- [ ] Run `npm run build` - no errors
- [ ] Run `npm run dev` 
- [ ] "Sync Sheets" button appears
- [ ] Click button → employees load
- [ ] Sheet selector shows available sheets
- [ ] Switching sheets updates data
- [ ] Errors display correctly
- [ ] Directory page shows employees from Google Sheets
- [ ] Dashboard stats update automatically

---

## 🚀 Next Steps

1. **Update App.tsx** with the integration code above
2. **Create .env** with your deployment URL
3. **Test locally** with `npm run dev`
4. **Deploy to production** with your preferred hosting
5. **Monitor** Google Sheets sync performance
6. **Add authentication** if needed for sensitive data

---

## 📚 Related Files

- [Google Apps Script](./googleAppsScript.gs) - Backend
- [Sync Utility](./src/utils/googleSheetsSync.ts) - API functions
- [Hook](./src/hooks/useGoogleSheetsSync.ts) - React integration
- [Full Documentation](./GOOGLE_SHEETS_DYNAMIC_MAPPING.md) - Complete reference
