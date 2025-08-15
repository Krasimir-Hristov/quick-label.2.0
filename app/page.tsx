'use client';

import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import FileUpload, { FileUploadRef } from '@/components/FileUpload';
import LabelPreview from '@/components/LabelPreview';
import LabelSheetForPrint from '@/components/LabelSheetForPrint';
import { LabelData } from '@/types';
import { Carrot, Rabbit } from 'lucide-react';
import { parseExcelData } from '@/lib/utils';

export default function Home() {
  // State за съхраняване на парсваните данни от Excel файла
  const [labelData, setLabelData] = useState<LabelData[]>([]);

  // Ново: всички листове от качения Excel – sheetName -> raw rows
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sheetsMap, setSheetsMap] = useState<Record<string, any[]> | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  // State за съхраняване на парсваните данни от Excel файла - с dummy данни за тестване
  // const [labelData, setLabelData] = useState<LabelData[]>([
  //   { artikelbezeichnung: 'Kaninchenfutter Premium', verkaufspreis: 12.99 },
  //   { artikelbezeichnung: 'Hamsterfutter Mix', verkaufspreis: 8.5 },
  //   { artikelbezeichnung: 'Vogelfutter Deluxe', verkaufspreis: 15.75 },
  //   { artikelbezeichnung: 'Katzenfutter Royal', verkaufspreis: 22.3 },
  //   { artikelbezeichnung: 'Hundefutter Premium', verkaufspreis: 18.9 },
  //   { artikelbezeichnung: 'Fischfutter Tropical', verkaufspreis: 6.45 },
  //   { artikelbezeichnung: 'Meerschweinchenfutter', verkaufspreis: 9.8 },
  //   { artikelbezeichnung: 'Wellensittichfutter', verkaufspreis: 7.25 },
  //   { artikelbezeichnung: 'Kaninchenfutter Basic', verkaufspreis: 5.99 },
  //   { artikelbezeichnung: 'Hamsterfutter Standard', verkaufspreis: 4.75 },
  //   { artikelbezeichnung: 'Reptilienfutter Spezial', verkaufspreis: 13.4 },
  //   { artikelbezeichnung: 'Aquarienfutter Tropical', verkaufspreis: 11.2 },
  // ]);

  // Ref за контейнера с етикетите за принтиране (стар)
  const printRef = useRef<HTMLDivElement>(null);

  // Ref за новия print-friendly компонент
  const printComponentRef = useRef<HTMLDivElement>(null);

  // Ref за FileUpload компонента
  const fileUploadRef = useRef<FileUploadRef>(null);

  // Функция за обновяване на състоянието с нови данни
  const handleDataParsed = (data: LabelData[]) => {
    setLabelData(data);
  };

  // При откриване на листове от FileUpload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSheetsDetected = (map: Record<string, any[]>) => {
    setSheetsMap(map);
    setSelectedSheet(null); // изисква избор от потребителя
    setLabelData([]); // изчистваме евентуално стари етикети до избор
  };

  // При избор на лист от dropdown – логваме и парсваме избрания лист
  const handleSheetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    console.log('[Sheet selected]:', sheetName);
    if (sheetsMap && sheetName in sheetsMap) {
      const rows = sheetsMap[sheetName];
      // Log entire sheet data
      console.log('[Sheet data rows]:', rows);
      const parsed = parseExcelData(rows);
      setLabelData(parsed);
    }
  };

  // Функция за изчистване на всички етикети и файла
  const handleClear = () => {
    setLabelData([]);
    setSheetsMap(null);
    setSelectedSheet(null);
    // Изчистваме и избрания файл
    fileUploadRef.current?.clearFile();
  };

  // Функция за принтиране на етикетите
  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: 'Produktetiketten',
    pageStyle: `@page { size: A4; margin: 34.5mm 9mm !important; }`, // За 4x6 етикети
  });

  return (
    <main className='min-h-screen bg-black py-8'>
      <div className='container mx-auto px-4'>
        {/* Обвиваме всичко ненужно в този div */}
        <div className='print-hide'>
          <h1 className='text-6xl font-bold text-center text-[#a8c706] mb-8'>
            Etiketten-Generator
          </h1>
          <div className='flex justify-center space-x-1'>
            <div>
              <Rabbit size={200} className='text-[#a8c706]' />
            </div>
            <div>
              <Carrot size={100} className='text-[#a8c706]' />
            </div>
          </div>

          <div className='max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8'>
            {/* Подаваме функцията, ref и състоянието за данните на FileUpload */}
            <FileUpload
              ref={fileUploadRef}
              onDataParsed={handleDataParsed}
              hasLabelData={labelData.length > 0}
              onSheetsDetected={handleSheetsDetected}
            />

            {/* Dropdown за избор на лист, показва се след качване и откриване на листове */}
            {sheetsMap && (
              <div className='mt-4'>
                <label htmlFor='sheet-select' className='block text-black font-semibold mb-2'>
                  Wählen Sie ein Arbeitsblatt
                </label>
                <select
                  id='sheet-select'
                  value={selectedSheet ?? ''}
                  onChange={handleSheetChange}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8c706]'
                >
                  <option value='' disabled>
                    Bitte wählen Sie ein Arbeitsblatt
                  </option>
                  {Object.keys(sheetsMap).map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Бутони - показват се само ако има данни */}
            {labelData.length > 0 && (
              <div className='mt-6 text-center space-y-3'>
                <button
                  onClick={handlePrint}
                  className='bg-black hover:bg-white text-lg text-[#a8c706] font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto gap-2 cursor-pointer'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z'
                    />
                  </svg>
                  Etiketten drucken
                </button>

                <button
                  onClick={handleClear}
                  className='bg-red-600 hover:bg-red-700 text-lg text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto gap-2 cursor-pointer'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                  Alles löschen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Тук е нашият "лист хартия" - добавяме му print-container клас */}
        <div
          ref={printRef}
          className='max-w-7xl mx-auto p-8 rounded-lg print-container'
          style={{ backgroundColor: '#a8c706' }}
        >
          <LabelPreview labelData={labelData} />
        </div>

        {/* Невидим компонент-призрак за печат */}
        <div style={{ display: 'none' }}>
          <LabelSheetForPrint ref={printComponentRef} labelData={labelData} />
        </div>
      </div>
    </main>
  );
}
