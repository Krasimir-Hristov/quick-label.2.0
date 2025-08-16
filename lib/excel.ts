import * as XLSX from 'xlsx';

// Map of sheet name to row array
export type SheetsMap = Record<string, any[]>; // eslint-disable-line @typescript-eslint/no-explicit-any

// Check if filename is a supported Excel type
export function isSupportedExcelFile(filename: string): boolean {
  const ext = filename.toLowerCase().split('.').pop();
  return ext === 'xlsx' || ext === 'xls';
}

// Build both RAW and FORMATTED JSON maps from a workbook
export function getSheetsMaps(workbook: XLSX.WorkBook): { raw: SheetsMap; formatted: SheetsMap } {
  const raw: SheetsMap = {};
  const formatted: SheetsMap = {};

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    raw[sheetName] = XLSX.utils.sheet_to_json(ws, { raw: true });
    formatted[sheetName] = XLSX.utils.sheet_to_json(ws, { raw: false });
  }

  return { raw, formatted };
}
