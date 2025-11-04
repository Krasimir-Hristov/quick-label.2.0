'use client';

import { useState, useEffect, useRef } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { CheckListData, ProcessedCheckItem } from '@/types';
import CheckListUpload, {
  CheckListUploadRef,
} from '@/components/check-liste/CheckListUpload';
import CheckListPreview from '@/components/check-liste/CheckListPreview';
import CheckListSheetForPrint from '@/components/check-liste/CheckListSheetForPrint';
import { processCheckListItems } from '@/lib/features/check-liste/checkListProcessor';
import { Button } from '@/components/ui/button';
import { useReactToPrint } from 'react-to-print';

export default function CheckListePage() {
  // State за съхраняване на парсваните данни от Excel файла
  const [checkListData, setCheckListData] = useState<CheckListData[]>([]);
  // Регионален избор и резултати от процесинга
  const [selectedRegion, setSelectedRegion] = useState<
    'GermanyD1' | 'GermanyD2' | 'Austria' | 'Benelux'
  >('GermanyD1');
  const [germanyD1Processed, setGermanyD1Processed] = useState<
    ProcessedCheckItem[] | null
  >(null);
  const [germanyD2Processed, setGermanyD2Processed] = useState<
    ProcessedCheckItem[] | null
  >(null);
  const [austriaProcessed, setAustriaProcessed] = useState<
    ProcessedCheckItem[] | null
  >(null);
  const [beneluxProcessed, setBeneluxProcessed] = useState<
    ProcessedCheckItem[] | null
  >(null);

  // Текущ потребител от cookie
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Всички листове от качения Excel
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sheetsMap, setSheetsMap] = useState<Record<string, any[]> | null>(
    null
  );
  // Форматирани редове
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sheetsMapFormatted, setSheetsMapFormatted] = useState<Record<
    string,
    any[]
  > | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string | null>(null);

  // Ref за upload компонента
  const uploadRef = useRef<CheckListUploadRef>(null);

  // Ref за print компонента
  const printComponentRef = useRef<HTMLDivElement>(null);

  // Прочитаме 'user' cookie от клиента
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const match = document.cookie.match(/(?:^|; )user=([^;]+)/);
    setCurrentUser(match ? decodeURIComponent(match[1]) : null);
  }, []);

  // При откриване на листове от Upload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSheetsDetected = (map: Record<string, any[]>) => {
    setSheetsMap(map);
    setSelectedSheet(null);
    setCheckListData([]);
  };

  // Получаваме форматираните редове
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSheetsDetectedFormatted = (map: Record<string, any[]>) => {
    setSheetsMapFormatted(map);
  };

  // При избор на нов файл
  const handleNewFileSelected = () => {
    setSheetsMap(null);
    setSelectedSheet(null);
    setCheckListData([]);
  };

  // При избор на лист от dropdown
  const handleSheetChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sheetName = e.target.value;
    setSelectedSheet(sheetName);
    if (sheetsMap && sheetName in sheetsMap) {
      try {
        if (sheetsMapFormatted && sheetName in sheetsMapFormatted) {
          const formattedRows = sheetsMapFormatted[sheetName];
          const result = await processCheckListItems(formattedRows);

          // Съхраняваме масивите от процесинга
          setGermanyD1Processed(result.germanyD1Items);
          setGermanyD2Processed(result.germanyD2Items);
          setAustriaProcessed(result.austriaItems);
          setBeneluxProcessed(result.beneluxItems);

          // Изчисляваме CheckListData по текущо избран регион
          const source: ProcessedCheckItem[] =
            (selectedRegion === 'GermanyD1'
              ? result.germanyD1Items
              : selectedRegion === 'GermanyD2'
              ? result.germanyD2Items
              : selectedRegion === 'Austria'
              ? result.austriaItems
              : result.beneluxItems) ?? [];
          const limitedSource =
            currentUser === 'ZOO' ? source.slice(0, 10) : source;
          const mapped: CheckListData[] = limitedSource.map(
            (p: ProcessedCheckItem) => ({
              artikelNr: p.artikelNr,
              artikelbezeichnung: p.artikelbezeichnung,
              aktionszeitraum: p.aktionszeitraum,
              checked: false,
            })
          );
          setCheckListData(mapped);
        }
      } catch (error) {
        console.error('Error processing check list items:', error);
      }
    }
  };

  // При промяна на регион
  useEffect(() => {
    if (
      !germanyD1Processed &&
      !germanyD2Processed &&
      !austriaProcessed &&
      !beneluxProcessed
    )
      return;
    const source: ProcessedCheckItem[] =
      selectedRegion === 'GermanyD1'
        ? germanyD1Processed ?? []
        : selectedRegion === 'GermanyD2'
        ? germanyD2Processed ?? []
        : selectedRegion === 'Austria'
        ? austriaProcessed ?? []
        : beneluxProcessed ?? [];
    const limitedSource = currentUser === 'ZOO' ? source.slice(0, 10) : source;
    const mapped: CheckListData[] = limitedSource.map(
      (p: ProcessedCheckItem) => ({
        artikelNr: p.artikelNr,
        artikelbezeichnung: p.artikelbezeichnung,
        aktionszeitraum: p.aktionszeitraum,
        checked: false,
      })
    );
    setCheckListData(mapped);
  }, [
    selectedRegion,
    germanyD1Processed,
    germanyD2Processed,
    austriaProcessed,
    beneluxProcessed,
    currentUser,
  ]);

  // Функция за изчистване
  const handleClear = () => {
    setCheckListData([]);
    setSheetsMap(null);
    setSelectedSheet(null);
    uploadRef.current?.clearFile();
  };

  // Функция за toggle на checkbox
  const handleToggleItem = (index: number) => {
    setCheckListData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Функция за принтиране на check-liste
  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: 'Check-Liste',
  });

  return (
    <main className='min-h-screen bg-black py-8'>
      <div className='container mx-auto px-4'>
        <h1 className='text-6xl font-bold text-center text-[#a8c706] mb-8'>
          Check-Liste Generator
        </h1>
        <div className='flex justify-center mb-8'>
          <ClipboardCheck size={100} className='text-[#a8c706]' />
        </div>

        <div className='max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8'>
          {/* Upload Component */}
          <CheckListUpload
            ref={uploadRef}
            onSheetsDetected={handleSheetsDetected}
            onSheetsDetectedFormatted={handleSheetsDetectedFormatted}
            fileUploaded={!!sheetsMap}
            onNewFileSelected={handleNewFileSelected}
          />

          {/* Dropdown за избор на лист */}
          {sheetsMap && (
            <div className='mt-4'>
              <label
                htmlFor='sheet-select'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Wählen Sie einen Monat:
              </label>
              <select
                id='sheet-select'
                value={selectedSheet || ''}
                onChange={handleSheetChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8c706]'
              >
                <option value=''>-- Bitte auswählen --</option>
                {Object.keys(sheetsMap).map((sheetName) => (
                  <option key={sheetName} value={sheetName}>
                    {sheetName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Регионален избор */}
          {selectedSheet &&
            (germanyD1Processed ||
              germanyD2Processed ||
              austriaProcessed ||
              beneluxProcessed) && (
              <div className='mt-4'>
                <label
                  htmlFor='region-select'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Wählen Sie eine Region:
                </label>
                <select
                  id='region-select'
                  value={selectedRegion}
                  onChange={(e) =>
                    setSelectedRegion(
                      e.target.value as
                        | 'GermanyD1'
                        | 'GermanyD2'
                        | 'Austria'
                        | 'Benelux'
                    )
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a8c706]'
                >
                  <option value='GermanyD1'>Deutschland D1</option>
                  <option value='GermanyD2'>Deutschland D2</option>
                  <option value='Austria'>Österreich</option>
                  <option value='Benelux'>Benelux</option>
                </select>
              </div>
            )}

          {/* Бутони */}
          {checkListData.length > 0 && (
            <div className='mt-6 text-center space-y-3'>
              <Button
                onClick={handlePrint}
                className='w-full cursor-pointer text-xl font-bold bg-[#a8c706] text-black hover:bg-[#97b305]'
              >
                Drucken
              </Button>

              <Button
                onClick={handleClear}
                className='w-full cursor-pointer text-xl font-bold bg-red-600 text-white hover:bg-red-700'
              >
                Alles löschen
              </Button>
            </div>
          )}
        </div>

        {/* Preview на check-liste */}
        <CheckListPreview
          checkListData={checkListData}
          onToggleItem={handleToggleItem}
        />

        {/* Невидим компонент за печат */}
        <div style={{ display: 'none' }}>
          <CheckListSheetForPrint
            ref={printComponentRef}
            checkListData={checkListData}
          />
        </div>
      </div>
    </main>
  );
}
