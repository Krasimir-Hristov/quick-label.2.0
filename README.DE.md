## Kölle Zoo Etiketten-Generator

Ein Next.js 14 App Router Projekt zum Erzeugen und Drucken von Preisetiketten aus Excel-Dateien, mit Login-Schutz, regionsbasiertem Filtern (Deutschland/Österreich) und spezieller Anzeige-Logik für den Benutzer „ZOO“.

### Hauptfunktionen
- **Login & Session**: Geschützt durch Middleware; Login via `/api/login`. Unterstützt zwei Benutzer-Paare aus `.env`.
- **Excel-Upload**: Lädt `.xlsx/.xls`, liest alle Sheets und erzeugt JSON-Daten (roh und formatiert).
- **Produktverarbeitung**: `lib/productProcessor.ts` validiert Felder, berechnet Preise (inkl. Aktion in % oder €), und trennt Produkte nach Region (DE/AT).
- **Regionsauswahl**: UI erlaubt Umschalten zwischen Deutschland und Österreich, zeigt die passenden Labels.
- **ZOO-Benutzerlimit**: Für den Benutzername `ZOO` werden maximal 10 Ergebnisse pro Region angezeigt; andere Benutzer sehen alle.
- **Drucken**: Druckfreundliche Ansicht mit `react-to-print`.

---

## Wie es funktioniert

1. **Authentifizierung**
   - Route: `app/login/page.tsx` sendet POST an `app/api/login/route.ts`.
   - Erfolgreicher Login setzt zwei Cookies:
     - `session=authenticated` (httpOnly) – für Middleware-Schutz.
     - `user=<username>` (nicht httpOnly) – für clientseitige Logik (z.B. ZOO-Limit).
   - Middleware `middleware.ts` blockiert alle Seiten außer `/login`, wenn keine Session vorhanden ist.

2. **Datei-Upload & Sheets** (`components/FileUpload.tsx`)
   - Akzeptiert Excel, prüft Dateityp, liest Workbook mit `xlsx`.
   - Liefert an die Startseite sowohl rohe als auch formatierte Zeilen je Sheet (`onSheetsDetected`, `onSheetsDetectedFormatted`).

3. **Sheet-Auswahl & Verarbeitung** (`app/page.tsx`)
   - Nach Auswahl eines Sheets ruft die Seite `processProducts(formattedRows)` aus `lib/productProcessor.ts` auf.
   - Ergebnis: `{ germanyProducts, austriaProducts, errors }`.
   - UI zeigt eine Regionsauswahl. Je nach Auswahl wird die passende Liste auf `LabelData` gemappt.
   - Falls `user === 'ZOO'`, wird die Anzeige auf `slice(0, 10)` begrenzt.

4. **Label-Rendering**
   - `components/LabelPreview.tsx` rendert ein Raster von `Label`-Komponenten.
   - `components/Label.tsx` zeichnet das einzelne Etikett (Farben, Schrift, Preisformatierung „XX,YY€“).
   - Drucken via `LabelSheetForPrint` und `useReactToPrint`.

5. **Produktverarbeitung im Detail** (`lib/productProcessor.ts`)
   - Liest sichere Werte mit `getSafeValue()` (Case-/Trim-insensitiv).
   - Erfordert `verkaufspreis kölle-zoo` und `preisschiene`; sonst wird ein Eintrag nach `errors` geschrieben.
   - `calculatePrices()` berechnet Original- und Endpreis; unterstützt Rabatte in `%` oder `€`.
   - `determineRegion()` leitet aus `preisschiene` die Region ab (enthält „österreich“ → AT, sonst DE).
   - Preise werden als Strings mit zwei Dezimalstellen (`toFixed(2)`) in `ProcessedProduct` gespeichert.

---

## Projektstruktur (Auszug)

- `app/`
  - `page.tsx` – Hauptseite: Upload, Sheet-Auswahl, Region, Anzeige, Drucken.
  - `login/page.tsx` – Login-UI.
  - `api/login/route.ts` – Login (setzt Cookies, prüft `.env` Werte).
  - `api/logout/route.ts` – Logout (löscht Session-Cookie).
  - `api/check-session/route.ts` – Session-Check (optional nutzbar).
- `components/`
  - `FileUpload.tsx`, `LabelPreview.tsx`, `Label.tsx`, `LabelSheetForPrint.tsx`, `Header.tsx` u.a.
- `lib/`
  - `productProcessor.ts` – Kernlogik zur Produktverarbeitung.
  - `excel.ts` – Excel-Helfer (Sheet-Maps etc.).
  - `utils.ts` – Hilfsfunktionen inkl. Fallback-Parser `parseExcelData`.
- `middleware.ts` – Auth-Schutz.
- `types/index.ts` – Typen für Labels/Produkte/Errors.

---

## Environment Variablen

Legen Sie in `.env` folgende Variablen an:

```
DEMO_USER=...
DEMO_PASSWORD=...
DEMO_ADMIN_USER=...
DEMO_ADMIN_PASSWORD=...
NODE_ENV=development
```

Hinweis: In Produktion sollte `secure` für Cookies aktiv sein (automatisch, wenn `NODE_ENV==='production'`).

---

## Entwicklung

Installieren und starten:

```bash
npm install
npm run dev
# http://localhost:3000
```

Login über `/login`. Nach erfolgreichem Login gelangen Sie zur Hauptseite.

---

## API Endpunkte

- `POST /api/login`
  - Body: `{ username, password }`
  - Prüft gegen `DEMO_*` und `DEMO_ADMIN_*`. Setzt `session` und `user` Cookies.

- `POST /api/logout`
  - Löscht die Session.

- `GET /api/check-session`
  - Antwortet `{ authenticated: true|false }`.

---

## Hinweise & Erweiterungen

- Fehlerhafte Produkte werden in `errors` gesammelt (z.B. fehlende Pflichtfelder).
- Region kann jederzeit umgeschaltet werden; Anzeige aktualisiert sich entsprechend.
- Für den Benutzer `ZOO` wird die Anzeige pro Region auf 10 Einträge begrenzt. Andere Benutzer sehen alle.
- Erweiterungen möglich:
  - Rollenspezifische Funktionen (Admin-UI), serverseitige Role-Checks.
  - Sichtbares UI für Fehlerliste (`errors`).
  - Tests (Unit/Integration) für Verarbeitung und UI.
