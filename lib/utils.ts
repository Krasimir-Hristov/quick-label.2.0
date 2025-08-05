import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LabelData } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Парсва суровите данни от Excel файл и ги преобразува в LabelData масив
 * @param data - Суровият масив от данни от xlsx библиотеката
 * @returns Масив от LabelData обекти
 */
// С този коментар казваме на ESLint да игнорира правилото no-explicit-any
// само и единствено за следващия ред.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseExcelData(data: any[]): LabelData[] {
  if (!data || data.length === 0) {
    return [];
  }

  // Дефинираме имената на колоните тук, за да избегнем повторение
  const productNameColumn = 'Artikelbezeichnung';
  const priceColumn = 'Aktions-VK';

  return data
    .filter((row) => {
      // Филтрираме редове, които имат и двете необходими колони
      return row[productNameColumn] && row[priceColumn];
    })
    .map((row) => {
      // Вземаме стойността от колона "Artikelbezeichnung"
      const artikelbezeichnung = String(row[productNameColumn]).trim();

      // Вземаме стойността от колона "Verkaufspreis\r\nKölle-Zoo" и я преобразуваме в число
      let verkaufspreis = 0;
      const priceValue = row[priceColumn];

      if (priceValue !== undefined && priceValue !== null) {
        // Преобразуваме в string и заменяме запетая с точка за правилно парсване
        const priceString = String(priceValue).replace(',', '.');
        const parsedPrice = parseFloat(priceString);

        // Проверяваме дали е валидно число
        if (!isNaN(parsedPrice)) {
          verkaufspreis = parsedPrice;
        }
      }

      return {
        artikelbezeichnung,
        verkaufspreis,
      } as LabelData;
    })
    .filter((item) => {
      // Допълнителна проверка - премахваме записи с празни имена или нулеви цени
      return item.artikelbezeichnung.length > 0 && item.verkaufspreis > 0;
    });
}
