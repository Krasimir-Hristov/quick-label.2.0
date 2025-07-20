'use client';

import { useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import FileUpload, { FileUploadRef } from "@/components/FileUpload";
import LabelPreview from "@/components/LabelPreview";
import { LabelData } from "@/types";

export default function Home() {
  // State за съхраняване на парсваните данни от Excel файла
  const [labelData, setLabelData] = useState<LabelData[]>([]);
  
  // Ref за контейнера с етикетите за принтиране
  const printRef = useRef<HTMLDivElement>(null);
  
  // Ref за FileUpload компонента
  const fileUploadRef = useRef<FileUploadRef>(null);

  // Функция за обновяване на състоянието с нови данни
  const handleDataParsed = (data: LabelData[]) => {
    setLabelData(data);
  };
  
  // Функция за изчистване на всички етикети и файла
  const handleClear = () => {
    setLabelData([]);
    // Изчистваме и избрания файл
    fileUploadRef.current?.clearFile();
  };
  
  // Функция за принтиране на етикетите
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Етикети за продукти',
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
      }
    `
  });

  return (
    <main className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4">

        {/* Обвиваме всичко ненужно в този div */}
        <div className="print-hide">
          <h1 className="text-3xl font-bold text-center text-white mb-8">
            Etiketten-Generator
          </h1>
          
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
            {/* Подаваме функцията и ref на FileUpload */}
            <FileUpload ref={fileUploadRef} onDataParsed={handleDataParsed} />
            
            {/* Бутони - показват се само ако има данни */}
            {labelData.length > 0 && (
              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={handlePrint}
                  className="bg-black hover:bg-white text-lg text-[#a8c706] font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto gap-2 cursor-pointer"
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
                    />
                  </svg>
                  Etiketten drucken
                </button>
                
                <button
                  onClick={handleClear}
                  className="bg-red-600 hover:bg-red-700 text-lg text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto gap-2 cursor-pointer"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
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
          className="max-w-7xl mx-auto p-8 rounded-lg print-container"
          style={{ backgroundColor: '#a8c706' }}
        >
          <LabelPreview labelData={labelData} />
        </div>
        
      </div>
    </main>
  );
}
