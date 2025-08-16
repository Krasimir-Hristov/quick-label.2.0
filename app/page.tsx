'use client';

import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import FileUpload, { FileUploadRef } from '@/components/FileUpload';
import LabelPreview from '@/components/LabelPreview';
import LabelSheetForPrint from '@/components/LabelSheetForPrint';
import { LabelData, ProcessedProduct } from '@/types';
import { Carrot, Rabbit } from 'lucide-react';
import { parseExcelData } from '@/lib/utils';
import { processProducts } from '@/lib/productProcessor';

export default function Home() {
  // State за съхраняване на парсваните данни от Excel файла
  const [labelData, setLabelData] = useState<LabelData[]>([]);
  // Регионален избор и резултати от процесинга
  const [selectedRegion, setSelectedRegion] = useState<'Germany' | 'Austria'>('Germany');
  const [germanyProcessed, setGermanyProcessed] = useState<ProcessedProduct[] | null>(null);
  const [austriaProcessed, setAustriaProcessed] = useState<ProcessedProduct[] | null>(null);

  // Ново: всички листове от качения Excel – sheetName -> raw rows
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sheetsMap, setSheetsMap] = useState<Record<string, any[]> | null>(null);
  // Ново: форматирани редове (с прилагани формати от Excel като % и €)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sheetsMapFormatted, setSheetsMapFormatted] = useState<Record<string, any[]> | null>(null);
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

  // Получаваме форматираните редове (за логване с % и €)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSheetsDetectedFormatted = (map: Record<string, any[]>) => {
    setSheetsMapFormatted(map);
  };

  // При избор на нов файл – зануляваме current state, за да се активира бутонът за качване
  const handleNewFileSelected = () => {
    setSheetsMap(null);
    setSelectedSheet(null);
    setLabelData([]);
  };

  // При избор на лист от dropdown – логваме и парсваме избрания лист
  const handleSheetChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    console.log('[Sheet selected]:', sheetName);
    if (sheetsMap && sheetName in sheetsMap) {
      const rows = sheetsMap[sheetName];
      // Log only formatted rows (with % and €)
      if (sheetsMapFormatted && sheetName in sheetsMapFormatted) {
        console.log('[Sheet data rows]:', sheetsMapFormatted[sheetName]);
      }
      
      // Debug: Log total products being processed
      console.log('=== PROCESSING', rows.length, 'PRODUCTS ===');
      
      // Test processProducts function with formatted Excel data (with % and €)
      try {
        if (sheetsMapFormatted && sheetName in sheetsMapFormatted) {
          const formattedRows = sheetsMapFormatted[sheetName];
          const result = await processProducts(formattedRows);
          console.log('=== PROCESSING RESULTS ===');
          console.log('Germany Products:', result.germanyProducts.length, 'items');
          console.log('Austria Products:', result.austriaProducts.length, 'items');
          console.log('Processing Errors:', result.errors.length, 'items');
          if (result.errors.length > 0) {
            console.log('Error details:', result.errors);
          }
          console.log('=== END PROCESSING RESULTS ===');

          // съхраняваме масивите от процесинга
          setGermanyProcessed(result.germanyProducts);
          setAustriaProcessed(result.austriaProducts);

          // изчисляваме LabelData по текущо избран регион
          const source = (selectedRegion === 'Germany' ? result.germanyProducts : result.austriaProducts) ?? [];
          const mapped: LabelData[] = source.map(p => ({
            artikelbezeichnung: p.artikelbezeichnung,
            // p.finalPrice e string ("54.99") -> number за Label
            verkaufspreis: parseFloat(p.finalPrice)
          }));
          console.log('[Selected region]', selectedRegion, '| items:', mapped.length);
          console.log('[Selected array sample]', mapped.slice(0, 5));
          setLabelData(mapped);
        }
      } catch (error) {
        console.error('Error processing products:', error);
      }
      // Fallback: ако няма форматирани редове (не би трябвало), ползваме стария парсер
      if (!sheetsMapFormatted || !(sheetName in sheetsMapFormatted)) {
        const parsed = parseExcelData(rows);
        setLabelData(parsed);
      }
    }
  };

  // При промяна на регион – прегенерираме LabelData от вече обработените масиви
  useEffect(() => {
    if (!germanyProcessed && !austriaProcessed) return;
    const source = (selectedRegion === 'Germany' ? germanyProcessed : austriaProcessed) ?? [];
    const mapped: LabelData[] = source.map(p => ({
      artikelbezeichnung: p.artikelbezeichnung,
      verkaufspreis: parseFloat(p.finalPrice)
    }));
    console.log('[Region change] Selected:', selectedRegion, '| items:', mapped.length);
    console.log('[Selected array sample]', mapped.slice(0, 5));
    setLabelData(mapped);
  }, [selectedRegion, germanyProcessed, austriaProcessed]);

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
              onSheetsDetectedFormatted={handleSheetsDetectedFormatted}
              fileUploaded={!!sheetsMap}
              onNewFileSelected={handleNewFileSelected}
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

            {/* Регионален избор: показва се само след избор на месец (лист) и след процесинг */}
            {selectedSheet && (germanyProcessed || austriaProcessed) && (
              <div className='mt-4'>
                <label htmlFor='region-select' className='block text-black font-semibold mb-2'>
                  Region auswählen
                </label>
                <select
                  id='region-select'
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as 'Germany' | 'Austria')}
                  className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8c706]'
                >
                  <option value='Germany'>Deutschland</option>
                  <option value='Austria'>Österreich</option>
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
