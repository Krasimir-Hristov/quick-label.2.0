import { ProcessedProduct, ProcessingError, ProcessingResult } from '@/types';

/**
 * Безопасно извличане на стойност от продуктов обект
 * Игнорира главни/малки букви и водещи/крайни интервали в ключовете
 * @param product - Продуктовият обект от Excel
 * @param keyName - Името на ключа, който търсим
 * @returns Почистената стойност или null ако не е намерена
 */
// Normalize helpers
// Keys: be very permissive - lowercase, trim, remove diacritics, and strip all non-alphanumeric chars
const normalizeKey = (val: unknown): string => {
  if (val == null) return '';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '');
};
// Values: lowercase, trim, remove diacritics, collapse inner spaces
const normalizeVal = (val: unknown): string => {
  if (val == null) return '';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]+/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

export const getSafeValue = (product: Record<string, any>, keyName: string): string | null => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const normalizedKeyName = normalizeKey(keyName);

  for (const key in product) {
    if (normalizeKey(key) === normalizedKeyName) {
      const value = product[key];
      return typeof value === 'string' ? value.trim() : value;
    }
  }

  return null;
};

/**
 * Изчислява оригинална и финална цена на базата на цена и отстъпка
 * @param originalPriceStr - Оригиналната цена като стринг
 * @param aktionStr - Отстъпката като стринг (с % или €) или null
 * @returns Обект с originalPrice и finalPrice като числа
 */
export const calculatePrices = (originalPriceStr: string, aktionStr: string | null): { originalPrice: number; finalPrice: number } => {
  const originalPrice = parseFloat(originalPriceStr.replace(',', '.'));

  if (isNaN(originalPrice)) {
    return { originalPrice: 0, finalPrice: 0 }; // Или хвърли грешка
  }

  let finalPrice = originalPrice;

  if (aktionStr) {
    const aktionValueStr = aktionStr.replace(/[-€\s]/g, '').replace(',', '.');
    const aktionValue = parseFloat(aktionValueStr);

    if (!isNaN(aktionValue)) {
      if (aktionStr.includes('%')) {
        finalPrice = originalPrice * (1 - aktionValue / 100);
      } else if (aktionStr.includes('€')) {
        finalPrice = originalPrice - aktionValue;
      }
    }
  }
  
  return {
    originalPrice: parseFloat(originalPrice.toFixed(2)),
    finalPrice: parseFloat(finalPrice.toFixed(2)),
  };
};

/**
 * Определя региона на базата на preisschiene стойността
 * @param preisschiene - Стойността от колоната за ценова схема
 * @returns 'Austria' ако съдържа 'österreich', иначе 'Germany'
 */
export const determineRegion = (preisschiene: string): 'Germany' | 'Austria' => {
  const norm = normalizeVal(preisschiene)
    .replace(/[^a-z]+/g, ''); // keep only letters for matching
  // Match both osterreich and österreich (accents removed by normalizeVal)
  if (norm.includes('osterreich')) {
    return 'Austria';
  }
  return 'Germany';
};

/**
 * Главна функция за обработка на продукти от Excel данни
 * @param rawProducts - Масив от сурови обекти от Excel
 * @returns Promise с обработени продукти, разделени по региони, и грешки
 */
export const processProducts = async (rawProducts: Record<string, any>[]): Promise<ProcessingResult> => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const germanyProducts: ProcessedProduct[] = [];
  const austriaProducts: ProcessedProduct[] = [];
  const errors: ProcessingError[] = [];

  for (const product of rawProducts) {
    try {
      // Извличаме необходимите стойности с безопасни функции (реални колони от Excel)
      // Нормализираме търсенето с toLowerCase().trim() за избягване на грешки от работници
      const artikelbezeichnung = getSafeValue(product, 'artikelbezeichnung');
      const verkaufspreis = getSafeValue(product, 'verkaufspreis kölle-zoo');
      const preisschiene = getSafeValue(product, 'preisschiene');
      const aktion = getSafeValue(product, 'aktion');

      // Валидация на задължителни полета
      if (!verkaufspreis || !preisschiene) {
        const productName = artikelbezeichnung || getSafeValue(product, 'artikelnr') || getSafeValue(product, 'ursprungsland') || 'Неизвестен продукт';
        errors.push({
          productName: productName,
          message: `Fehlende erforderliche Felder für "${productName}": Verkaufspreis oder Preisschiene`,
          productData: product
        });
        continue;
      }

      // Изчисляваме цените
      const { originalPrice, finalPrice } = calculatePrices(verkaufspreis, aktion);

      // Определяме региона
      const region = determineRegion(preisschiene);

      // Създаваме обработения продукт с форматирани цени до 2 знака
      const processedProduct: ProcessedProduct = {
        artikelbezeichnung: artikelbezeichnung || 'Неизвестен продукт',
        originalPrice: originalPrice.toFixed(2),
        finalPrice: finalPrice.toFixed(2)
      };

      // Добавяме към правилния масив
      if (region === 'Austria') {
        austriaProducts.push(processedProduct);
      } else {
        germanyProducts.push(processedProduct);
      }

    } catch (error) {
      const productName = getSafeValue(product, 'artikelbezeichnung') || 'Неизвестен продукт';
      errors.push({
        productName: productName,
        message: `Fehler bei der Verarbeitung von "${productName}": ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        productData: product
      });
    }
  }

  return {
    germanyProducts,
    austriaProducts,
    errors
  };
};
