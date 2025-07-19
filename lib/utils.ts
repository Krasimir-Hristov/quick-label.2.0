import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { LabelData } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Парсва суровите данни от Excel файл и ги преобразува в LabelData масив
 * @param data - Суровият масив от данни от xlsx библиотеката
 * @returns Масив от LabelData обекти
 */
export function parseExcelData(data: any[]): LabelData[] {
  if (!data || data.length === 0) {
    console.log("parseExcelData: Няма данни за парсване");
    return [];
  }

  console.log("parseExcelData: Започвам парсване на", data.length, "реда");
  
  // Показваме колоните от първия ред с много колони
  const rowWithMostColumns = data.reduce((prev, current) => 
    Object.keys(current).length > Object.keys(prev).length ? current : prev
  );
  console.log("parseExcelData: Всички налични колони:", Object.keys(rowWithMostColumns));
  
  // Търсим колони, които съдържат "цена" или "preis"
  const priceColumns = Object.keys(rowWithMostColumns).filter(key => 
    key.toLowerCase().includes('preis') || key.toLowerCase().includes('price')
  );
  console.log("parseExcelData: Колони с цени:", priceColumns);

  return data
    .filter((row, index) => {
      // Филтрираме редове, които имат и двете необходими колони
      const hasArtikel = row['Artikelbezeichnung'];
      const hasPrice = row['Verkaufspreis\r\nKölle-Zoo']; // Правилното име с \r\n
      
      console.log(`Ред ${index}:`, {
        'Artikelbezeichnung': hasArtikel,
        'Verkaufspreis\\r\\nKölle-Zoo': hasPrice,
        'Всички ключове': Object.keys(row)
      });
      
      return hasArtikel && hasPrice;
    })
    .map(row => {
      // Вземаме стойността от колона "Artikelbezeichnung"
      const artikelbezeichnung = String(row['Artikelbezeichnung']).trim();
      
      // Вземаме стойността от колона "Verkaufspreis\r\nKölle-Zoo" и я преобразуваме в число
      let verkaufspreis = 0;
      const priceValue = row['Verkaufspreis\r\nKölle-Zoo']; // Правилното име
      
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
        verkaufspreis
      } as LabelData;
    })
    .filter(item => {
      // Допълнителна проверка - премахваме записи с празни имена или нулеви цени
      return item.artikelbezeichnung.length > 0 && item.verkaufspreis > 0;
    });
}
