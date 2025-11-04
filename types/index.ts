// TypeScript interface за данните от етикета
export interface LabelData {
  artikelbezeichnung: string; // Име на продукта (от колона "Artikelbezeichnung")
  verkaufspreis: number; // Цена на продукта (от колона "Verkaufspreis Kölle-Zoo")
  gultigkeit?: string; // Валидност на промоцията (от колона "Gültigkeit")
}

// Финален, обработен продукт, готов за етикетите
export interface ProcessedProduct {
  artikelbezeichnung: string;
  originalPrice: string;
  finalPrice: string;
  gultigkeit?: string;
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
