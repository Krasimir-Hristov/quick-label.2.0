// TypeScript interface за данните от етикета
export interface LabelData {
  artikelbezeichnung: string; // Име на продукта (от колона "Artikelbezeichnung")
  verkaufspreis: number; // Цена на продукта (от колона "Verkaufspreis Kölle-Zoo")
  aktionszeitraum?: string; // Валидност на промоцията (от колона "Aktionszeitraum")
}

// Финален, обработен продукт, готов за етикетите
export interface ProcessedProduct {
  artikelbezeichnung: string;
  originalPrice: string;
  finalPrice: string;
  aktionszeitraum?: string;
}

// Грешки, открити по време на обработката
export interface ProcessingError {
  productName: string;
  message: string; // Съобщението за грешка на немски
  productData?: Record<string, any>; // Пълният продукт за debug // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Финален обект, който основната функция връща
export interface ProcessingResult {
  germanyD1Products: ProcessedProduct[];
  germanyD2Products: ProcessedProduct[];
  austriaProducts: ProcessedProduct[];
  beneluxProducts: ProcessedProduct[];
  errors: ProcessingError[];
}

// ============================================= //
//          CHECK-LISTE TYPES                    //
// ============================================= //

// TypeScript interface за данните от check-liste
export interface CheckListData {
  artikelNr: string; // Номер на артикула (от колона "ArtikelNr")
  artikelbezeichnung: string; // Име на продукта (от колона "Artikelbezeichnung")
  aktionszeitraum?: string; // Валидност на промоцията (от колона "Aktionszeitraum")
  checked?: boolean; // Дали е checked в UI
}

// Финален, обработен артикул, готов за check-liste
export interface ProcessedCheckItem {
  artikelNr: string;
  artikelbezeichnung: string;
  aktionszeitraum?: string;
}

// Финален обект, който функцията за обработка връща
export interface CheckListResult {
  germanyD1Items: ProcessedCheckItem[];
  germanyD2Items: ProcessedCheckItem[];
  austriaItems: ProcessedCheckItem[];
  beneluxItems: ProcessedCheckItem[];
  errors: ProcessingError[];
}
