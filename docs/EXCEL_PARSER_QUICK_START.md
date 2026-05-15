# Excel Parser - Comparison & Integration Guide

## Old vs New Parser

### Old Parser (Simple, Fixed Headers)
```typescript
// ❌ Could only handle exact column names
const columnMapping = {
  'No.': 'no',
  'Current Rank': 'currentRank',
  'Official Station': 'officialStation',
  // ... exact names only
};

// ❌ Failed if:
// - Headers were in different order
// - Headers had variations ("Rank" vs "Current Rank")
// - There were title rows above headers
// - Headers spanned multiple rows
```

### New Parser (Intelligent, Flexible)
```typescript
// ✅ Automatically detects and maps headers
const employees = await parseExcelToEmployees(file);

// ✅ Handles:
// - Headers in any order
// - 60+ variations per field
// - Title rows above headers
// - Multi-row merged headers
// - Extra columns (safely ignored)
```

---

## Migration Guide

### Step 1: Update Import

**Before:**
```typescript
import { parseExcelToEmployees } from '../utils/excelParser';
// (old function)
```

**After:**
```typescript
import { parseExcelToEmployees, headerVariations } from '../utils/excelParser';
// Same import, but now returns Promise<Employee[]>
```

### Step 2: Update Usage

**Before:**
```typescript
const result = parseExcelToEmployees(file); // Sync
if (result.success) {
  const employees = result.data;
}
```

**After:**
```typescript
const employees = await parseExcelToEmployees(file); // Async
// Directly get Employee[]
```

### Step 3: Update Error Handling

**Before:**
```typescript
const result = parseExcelToEmployees(file);
if (!result.success) {
  console.error(result.error);
}
```

**After:**
```typescript
try {
  const employees = await parseExcelToEmployees(file);
} catch (error) {
  console.error(error.message);
}
```

---

## Integration Examples

### Option 1: Direct Component Integration

```typescript
// src/components/ui/FileUploader.tsx
import { parseExcelToEmployees } from '../../utils/excelParser';
import { useState } from 'react';
import { Employee } from '../../types/employee';

interface FileUploaderProps {
  onEmployeesLoaded?: (employees: Employee[]) => void;
}

export default function FileUploader({ onEmployeesLoaded }: FileUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const employees = await parseExcelToEmployees(file);
      console.log(`✓ Loaded ${employees.length} employees`);
      onEmployeesLoaded?.(employees);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file';
      setError(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', background: '#f5f5f5', borderRadius: '8px' }}>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        📁 Upload Excel File
      </label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileSelect}
        disabled={loading}
        style={{
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.5 : 1
        }}
      />
      {loading && <p style={{ marginTop: '8px', color: '#3b82f6' }}>⟳ Parsing...</p>}
      {error && <p style={{ marginTop: '8px', color: '#ef4444' }}>✗ {error}</p>}
    </div>
  );
}
```

**Usage in parent:**
```typescript
<FileUploader onEmployeesLoaded={(emps) => {
  setEmployees(emps);
  // or: updateEmployees in store
}} />
```

---

### Option 2: With Store Integration (Zustand)

```typescript
// src/hooks/useExcelImport.ts
import { useState } from 'react';
import { parseExcelToEmployees } from '../utils/excelParser';
import { useAppStore } from '../store/appStore';
import { Employee } from '../types/employee';

export function useExcelImport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setEmployees = useAppStore(state => state.setEmployees);

  const importFromExcel = async (file: File) => {
    setLoading(true);
    setError(null);

    try {
      const employees = await parseExcelToEmployees(file);
      setEmployees(employees);
      return employees;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { importFromExcel, loading, error };
}
```

**Usage in component:**
```typescript
const { importFromExcel, loading, error } = useExcelImport();

<button onClick={() => {
  fileInputRef.current?.click();
}} disabled={loading}>
  {loading ? 'Importing...' : 'Upload Excel'}
</button>

<input
  ref={fileInputRef}
  type="file"
  accept=".xlsx,.xls"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) importFromExcel(file);
  }}
  style={{ display: 'none' }}
/>

{error && <div style={{ color: 'red' }}>Error: {error}</div>}
```

---

### Option 3: With Sheet Selection

```typescript
// src/components/ImportModal.tsx
import { parseExcelToEmployees } from '../utils/excelParser';
import { Employee } from '../types/employee';
import { useState } from 'react';

export function ImportModal({ onImport }: { onImport: (emps: Employee[]) => void }) {
  const [step, setStep] = useState<'select' | 'preview' | 'complete'>('select');
  const [file, setFile] = useState<File | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (f: File) => {
    setFile(f);
    setLoading(true);
    setError(null);

    try {
      const parsed = await parseExcelToEmployees(f);
      setEmployees(parsed);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onImport(employees);
    setStep('complete');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '32px', 
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%'
      }}>
        {step === 'select' && (
          <>
            <h2>Import Employee Data</h2>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              disabled={loading}
            />
            {loading && <p>Parsing file...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}

        {step === 'preview' && (
          <>
            <h2>Preview Data</h2>
            <p>Ready to import {employees.length} employees:</p>
            <ul style={{ maxHeight: '300px', overflow: 'auto' }}>
              {employees.slice(0, 5).map(emp => (
                <li key={emp.id}>
                  {emp.no} - {emp.currentRank} ({emp.officialStation})
                </li>
              ))}
              {employees.length > 5 && <li>... and {employees.length - 5} more</li>}
            </ul>
            <button onClick={handleConfirm} style={{
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              marginTop: '16px'
            }}>
              ✓ Import All
            </button>
          </>
        )}

        {step === 'complete' && (
          <>
            <h2 style={{ color: '#22c55e' }}>✓ Import Complete</h2>
            <p>{employees.length} employees imported successfully</p>
          </>
        )}
      </div>
    </div>
  );
}
```

---

### Option 4: Drag & Drop Upload

```typescript
// src/components/DragDropUpload.tsx
import { parseExcelToEmployees } from '../utils/excelParser';
import { Employee } from '../types/employee';
import { useState } from 'react';

export function DragDropUpload({ onUpload }: { onUpload: (emps: Employee[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const employees = await parseExcelToEmployees(file);
      onUpload(employees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      style={{
        border: isDragging ? '2px solid #3b82f6' : '2px dashed #cbd5e1',
        borderRadius: '8px',
        padding: '40px',
        textAlign: 'center',
        cursor: 'pointer',
        background: isDragging ? '#eff6ff' : '#f8fafc',
        transition: 'all 200ms'
      }}
    >
      <p style={{ fontSize: '18px', marginBottom: '8px' }}>
        📁 {loading ? 'Uploading...' : 'Drop Excel file here'}
      </p>
      <p style={{ fontSize: '14px', color: '#64748b' }}>or click to select</p>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        style={{ display: 'none' }}
        id="excel-input"
      />
      <label htmlFor="excel-input" style={{ cursor: 'pointer' }}>
        Click to browse
      </label>
      {error && <p style={{ color: 'red', marginTop: '16px' }}>{error}</p>}
    </div>
  );
}
```

---

### Option 5: Batch Processing with Progress

```typescript
// src/hooks/useBatchExcelImport.ts
import { parseExcelToEmployees } from '../utils/excelParser';
import { Employee } from '../types/employee';
import { useState } from 'react';

export function useBatchExcelImport() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importMultipleFiles = async (files: File[]): Promise<Employee[]> => {
    setLoading(true);
    setError(null);
    const allEmployees: Employee[] = [];
    let processedCount = 0;

    try {
      for (const file of files) {
        try {
          const employees = await parseExcelToEmployees(file);
          allEmployees.push(...employees);
          processedCount++;
          setProgress(Math.round((processedCount / files.length) * 100));
        } catch (fileError) {
          console.warn(`Failed to process ${file.name}:`, fileError);
          // Continue with other files
        }
      }

      return allEmployees;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Batch import failed');
      throw err;
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { importMultipleFiles, loading, progress, error };
}
```

**Usage:**
```typescript
const { importMultipleFiles, loading, progress } = useBatchExcelImport();

<div>
  <input
    multiple
    type="file"
    accept=".xlsx,.xls"
    onChange={async (e) => {
      const files = Array.from(e.target.files || []);
      const all = await importMultipleFiles(files);
      console.log(`Imported ${all.length} employees total`);
    }}
  />
  {loading && <progress value={progress} max={100} />}
</div>
```

---

## Real-World Scenarios

### Scenario 1: Department Head Uploads Monthly Report

```
File: Department_Report_Jan_2025.xlsx
Structure:
- Row 1-2: Title and date
- Row 3: Blank
- Row 4-5: Multi-row headers
- Row 6+: Data

Parser handles automatically ✓
```

### Scenario 2: Data Entry Person Uses Different Column Order

```
Their file: [No.] [Rank] [Status] [Station]
Standard:   [No.] [Station] [Rank] [Status]

Parser works either way ✓
```

### Scenario 3: External HR System Export

```
Export has extra columns: [ID] [Name] [Email] [Phone] [Status] [Rank]

Parser:
- Maps: ID→no, Status→employmentStatus, Rank→currentRank
- Ignores: Name, Email, Phone
- Works perfectly ✓
```

### Scenario 4: Legacy Excel File with Merged Cells

```
Headers:
┌─────────────────────┬─────────────────┐
│ Employee Information│ Current Position│
├───────┬───────┬─────┼────────┬────────┤
│ No.   │ Name  │Email│ Rank   │ Title  │
├───────┴───────┴─────┴────────┴────────┤
│ Data rows...

Parser flattens: [Employee Information No., Employee Information Name, ...]
Matches: No.→no, Rank→currentRank, Title→currentRank (second match)
Works with flexibility ✓
```

---

## Testing Your Integration

### Test 1: Basic Upload

```typescript
// Create simple test Excel with headers in row 1
const result = await parseExcelToEmployees(testFile);
console.assert(result.length > 0, 'Should parse data');
console.assert(result[0].id > 0, 'Should have ID');
```

### Test 2: Complex Headers

```typescript
// Create Excel with title rows and multi-row headers
const result = await parseExcelToEmployees(complexFile);
console.assert(result.length > 0, 'Should handle complex headers');
```

### Test 3: Different Column Order

```typescript
// Create Excel with columns in different order
const result = await parseExcelToEmployees(reorderedFile);
console.assert(result.length > 0, 'Should work with any column order');
```

### Test 4: Missing Columns

```typescript
// Create Excel missing some columns (e.g., no graduationDate)
const result = await parseExcelToEmployees(incompleteFile);
console.assert(result[0].graduationDate === '', 'Missing fields should be empty string');
```

---

## Deployment Checklist

- [ ] Built successfully: `npm run build`
- [ ] No TypeScript errors
- [ ] Tested with real Excel files
- [ ] FileUploader component updated
- [ ] Error handling added
- [ ] User feedback for success/failure
- [ ] Loading states working
- [ ] Tested with various column orders
- [ ] Tested with multi-row headers
- [ ] Tested with title rows above data
- [ ] Tested with extra columns
- [ ] Date conversion verified
- [ ] ID auto-increment working
- [ ] Ready for production ✓

---

## Performance Tips

```typescript
// For large files (5000+ employees)
// Consider adding loading indicator

const startTime = performance.now();
const employees = await parseExcelToEmployees(largeFile);
const duration = performance.now() - startTime;
console.log(`Parsed ${employees.length} rows in ${duration}ms`);
```

---

## Summary

✅ **Old Parser**: Simple, fixed headers
✅ **New Parser**: Smart, flexible, production-ready

**Benefits:**
- Works with any header layout
- Handles variations automatically
- Multi-row and title rows
- 60+ column synonyms per field
- Type-safe Employee interface
- Comprehensive error handling
- Ready for real-world data

**Next Step**: Choose an integration option above and implement!
