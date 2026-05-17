# CSU Employee Dashboard

A web-based employee management and analytics dashboard for Caraga State University. It supports Excel uploads, Google Sheets sync, and visual analytics for attendance, staffing, and HR insights.

## Features

- Employee directory with search and filters
- Dashboard analytics (charts, summaries)
- Excel import with robust header detection
- Optional Google Sheets real-time sync
- Responsive UI built with Vite + React + Tailwind

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Recharts

## Requirements

- Node.js 18+ (recommended)
- npm 9+ (or pnpm/yarn if you prefer)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Start the dev server

```bash
npm run dev
```

3) Build for production

```bash
npm run build
```

4) Preview the production build

```bash
npm run preview
```

## Environment Variables

Create a `.env` or `.env.local` at the project root if you want Google Sheets sync:

```env
VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/d/YOUR_ID_HERE/usercontent
VITE_AUTO_SYNC_INTERVAL=60000
VITE_API_KEY=your_secret_key
```

If you do not use Google Sheets sync, the app still works with Excel uploads and local data.

## Google Sheets Sync (Optional)

1) Deploy `googleAppsScript.gs` as a Google Apps Script Web App.
2) Copy the deployment URL into `VITE_GOOGLE_SHEETS_URL`.
3) Start the app and verify sync.

Detailed docs are in the `docs/` folder.

## Documentation

- docs/INTEGRATION_GUIDE.md
- docs/GOOGLE_SHEETS_DYNAMIC_MAPPING.md
- docs/SPREADSHEET_SYNC_SETUP.md
- docs/SPREADSHEET_SYNC_README.md
- docs/EXCEL_PARSER_GUIDE.md
- docs/EXCEL_PARSER_QUICK_START.md

## Project Structure

```
csu_employee_dashboard/
├── googleAppsScript.gs
├── index.html
├── package.json
├── src/
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
└── docs/
```

## Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview the build

## Troubleshooting

- If the dev server fails, ensure Node.js is installed and run `npm install` again.
- For Sheets sync issues, verify the deployment URL and access permissions.
- For Excel import issues, review the parser docs in `docs/`.
