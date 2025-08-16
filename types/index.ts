// TypeScript interface за данните от етикета
export interface LabelData {
  artikelbezeichnung: string;  // Име на продукта (от колона "Artikelbezeichnung")
  verkaufspreis: number;       // Цена на продукта (от колона "Verkaufspreis Kölle-Zoo")
}

// Финален, обработен продукт, готов за етикетите
export interface ProcessedProduct {
  artikelbezeichnung: string;
  originalPrice: number;
  finalPrice: number;
}

// Грешки, открити по време на обработката
export interface ProcessingError {
  productName: string;
  message: string; // Съобщението за грешка на немски
  productData?: Record<string, any>; // Пълният продукт за debug // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Финален обект, който основната функция връща
export interface ProcessingResult {
  germanyProducts: ProcessedProduct[];
  austriaProducts: ProcessedProduct[];
  errors: ProcessingError[];
}
