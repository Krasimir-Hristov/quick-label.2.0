import { ProcessedCheckItem, ProcessingError, CheckListResult } from '@/types';
import {
  getSafeValue,
  determineRegion,
  normalizeVal,
} from '@/lib/shared/dataProcessing';

/**
 * Главна функция за обработка на check-liste артикули от Excel данни
 * @param rawItems - Масив от сурови обекти от Excel
 * @returns Promise с обработени артикули, разделени по региони, и грешки
 */
export const processCheckListItems = async (
  rawItems: Record<string, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<CheckListResult> => {
  const germanyD1Items: ProcessedCheckItem[] = [];
  const germanyD2Items: ProcessedCheckItem[] = [];
  const austriaItems: ProcessedCheckItem[] = [];
  const beneluxItems: ProcessedCheckItem[] = [];
  const errors: ProcessingError[] = [];

  for (const item of rawItems) {
    try {
      // Извличаме необходимите стойности
      const artikelNr = getSafeValue(item, 'artikelnr');
      const artikelbezeichnung = getSafeValue(item, 'artikelbezeichnung');
      const preisschiene = getSafeValue(item, 'preisschiene');
      const aktion = getSafeValue(item, 'aktion');
      const aktionszeitraum = getSafeValue(item, 'aktionszeitraum');

      // Ако полето Aktion е празно, пропускаме този запис
      if (normalizeVal(aktion) === '') {
        continue;
      }

      // Валидация на задължителни полета
      if (!artikelNr || !artikelbezeichnung || !preisschiene) {
        const productName =
          artikelbezeichnung || artikelNr || 'Неизвестен артикул';
        errors.push({
          productName: productName,
          message: `Fehlende erforderliche Felder für "${productName}": ArtikelNr, Artikelbezeichnung oder Preisschiene`,
          productData: item,
        });
        continue;
      }

      // Определяме региона
      const region = determineRegion(preisschiene);
      if (region === null) {
        continue;
      }

      // Създаваме обработения артикул
      const processedItem: ProcessedCheckItem = {
        artikelNr: artikelNr,
        artikelbezeichnung: artikelbezeichnung,
        aktionszeitraum:
          aktionszeitraum && aktionszeitraum.trim() !== ''
            ? aktionszeitraum
            : undefined,
      };

      // Добавяме към правилния масив
      switch (region) {
        case 'Austria':
          austriaItems.push(processedItem);
          break;
        case 'Benelux':
          beneluxItems.push(processedItem);
          break;
        case 'GermanyD1':
          germanyD1Items.push(processedItem);
          break;
        case 'GermanyD2':
          germanyD2Items.push(processedItem);
          break;
      }
    } catch (error) {
      const productName =
        getSafeValue(item, 'artikelbezeichnung') ||
        getSafeValue(item, 'artikelnr') ||
        'Неизвестен артикул';
      errors.push({
        productName: productName,
        message: `Fehler bei der Verarbeitung von "${productName}": ${
          error instanceof Error ? error.message : 'Unbekannter Fehler'
        }`,
        productData: item,
      });
    }
  }

  return {
    germanyD1Items,
    germanyD2Items,
    austriaItems,
    beneluxItems,
    errors,
  };
};
