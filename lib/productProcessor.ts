import { ProcessedProduct, ProcessingError, ProcessingResult } from '@/types';

/**
 * Безопасно извличане на стойност от продуктов обект
 * Игнорира главни/малки букви и водещи/крайни интервали в ключовете
 * @param product - Продуктовият обект от Excel
 * @param keyName - Името на ключа, който търсим
 * @returns Почистената стойност или null ако не е намерена
 */
export const getSafeValue = (product: Record<string, any>, keyName: string): string | null => { // eslint-disable-line @typescript-eslint/no-explicit-any
  const normalizedKeyName = keyName.toLowerCase().trim();
  
  for (const key in product) {
    if (key.toLowerCase().trim() === normalizedKeyName) {
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
  if (preisschiene.toLowerCase().includes('österreich')) {
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

      // Създаваме обработения продукт
      const processedProduct: ProcessedProduct = {
        artikelbezeichnung: artikelbezeichnung || 'Неизвестен продукт',
        originalPrice,
        finalPrice
      };

      // Добавяме към правилния масив
      if (region === 'Austria') {
        austriaProducts.push(processedProduct);
      } else {
        germanyProducts.push(processedProduct);
      }

    } catch (error) {
      const productName = getSafeValue(product, 'artikelbezeichnung') || 'Неизвестен продукт';
      console.log('🚨 ADDING PRODUCT TO ERRORS ARRAY (EXCEPTION):');
      console.log('Full product object:', JSON.stringify(product, null, 2));
      console.log('Product name:', productName);
      console.log('Error details:', error);
      console.log('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      errors.push({
        productName: productName,
        message: `Fehler bei der Verarbeitung von "${productName}": ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        productData: product
      });
    }
  }

  // Логове за резултатите
  console.log('=== PROCESSING RESULTS ===');
  console.log('Germany Products:', germanyProducts.length, 'items');
  console.log(germanyProducts);
  console.log('Austria Products:', austriaProducts.length, 'items');
  console.log(austriaProducts);
  console.log('Processing Errors:', errors.length, 'items');
  console.log(errors);

  return {
    germanyProducts,
    austriaProducts,
    errors
  };
};
