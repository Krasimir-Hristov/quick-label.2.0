## Kölle Zoo Label Generator

A Next.js 14 App Router project to generate and print price labels from Excel files. It includes login protection, region-based filtering (Germany/Austria), and a special display rule for the user "ZOO".

### Key Features
- **Login & Session**: Protected by middleware; login via `/api/login`. Supports two user pairs from `.env`.
- **Excel Upload**: Accepts `.xlsx/.xls`, reads all sheets, and produces JSON data (raw and formatted).
- **Product Processing**: `lib/productProcessor.ts` validates fields, calculates prices (incl. discounts in % or €), and splits products by region (DE/AT).
- **Region Selection**: UI toggle between Germany and Austria to show the respective labels.
- **ZOO User Limit**: If the username is `ZOO`, show at most 10 items per region; other users see everything.
- **Printing**: Print-friendly view powered by `react-to-print`.

---

## How It Works

1. **Authentication**
   - Page `app/login/page.tsx` posts to `app/api/login/route.ts`.
   - On success, two cookies are set:
     - `session=authenticated` (httpOnly) – used by the middleware to protect routes.
     - `user=<username>` (not httpOnly) – used on the client for UI logic (e.g., ZOO limit).
   - The middleware `middleware.ts` blocks all pages except `/login` when there is no session.

2. **File Upload & Sheets** (`components/FileUpload.tsx`)
   - Accepts Excel files, validates file type, reads the workbook with `xlsx`.
   - Notifies the home page with both raw and formatted rows for each sheet (`onSheetsDetected`, `onSheetsDetectedFormatted`).

3. **Sheet Selection & Processing** (`app/page.tsx`)
   - After selecting a sheet, the page calls `processProducts(formattedRows)` from `lib/productProcessor.ts`.
   - Result: `{ germanyProducts, austriaProducts, errors }`.
   - UI provides a region selector and maps the chosen list into `LabelData` for rendering.
   - If `user === 'ZOO'`, display is limited using `slice(0, 10)`.

4. **Label Rendering**
   - `components/LabelPreview.tsx` renders a grid of `Label` components.
   - `components/Label.tsx` draws a single label (colors, typography, price formatting "XX,YY€").
   - Printing is handled via `LabelSheetForPrint` and `useReactToPrint`.

5. **Product Processing Details** (`lib/productProcessor.ts`)
   - Reads values safely via `getSafeValue()` (case- and trim-insensitive key matching).
   - Requires `verkaufspreis kölle-zoo` and `preisschiene`; otherwise an entry is pushed to `errors`.
   - `calculatePrices()` computes original and final price; handles discounts in `%` and `€`.
   - `determineRegion()` infers region from `preisschiene` (contains "österreich" → AT, otherwise DE).
   - Prices are stored as strings with two decimals (`toFixed(2)`) in `ProcessedProduct`.

---

## Project Structure (Excerpt)

- `app/`
  - `page.tsx` – Home: upload, sheet selection, region toggle, preview, printing.
  - `login/page.tsx` – Login UI.
  - `api/login/route.ts` – Login (sets cookies, checks `.env`).
  - `api/logout/route.ts` – Logout (clears session cookie).
  - `api/check-session/route.ts` – Optional session check.
- `components/`
  - `FileUpload.tsx`, `LabelPreview.tsx`, `Label.tsx`, `LabelSheetForPrint.tsx`, `Header.tsx`, etc.
- `lib/`
  - `productProcessor.ts` – Core product processing logic.
  - `excel.ts` – Excel helpers (sheet maps, etc.).
  - `utils.ts` – Helpers incl. fallback parser `parseExcelData`.
- `middleware.ts` – Auth protection.
- `types/index.ts` – Types for labels/products/errors.

---

## Environment Variables

Create a `.env` with:

```
DEMO_USER=...
DEMO_PASSWORD=...
DEMO_ADMIN_USER=...
DEMO_ADMIN_PASSWORD=...
NODE_ENV=development
```

Note: In production, `secure` is enabled for cookies automatically when `NODE_ENV==='production'`.

---

## Development

Install and start:

```bash
npm install
npm run dev
# http://localhost:3000
```

Login via `/login`. After a successful login you will be redirected to the home page.

---

## API Endpoints

- `POST /api/login`
  - Body: `{ username, password }`
  - Verifies against `DEMO_*` and `DEMO_ADMIN_*`. Sets `session` and `user` cookies.

- `POST /api/logout`
  - Clears the session.

- `GET /api/check-session`
  - Returns `{ authenticated: true|false }`.

---

## Notes & Extensions

- Invalid products are collected in `errors` (e.g., missing required fields).
- The region can be switched at any time; the display updates accordingly.
- For the `ZOO` user, at most 10 entries per region are displayed; other users see all entries.
- Possible extensions:
  - Role-based features (Admin UI), server-side role checks.
  - Visible UI to inspect `errors`.
  - Tests (unit/integration) for processing and UI.
