'use client';

import { useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import FileUpload from "@/components/FileUpload";
import LabelPreview from "@/components/LabelPreview";
import { LabelData } from "@/types";

export default function Home() {
  // State за съхраняване на парсваните данни от Excel файла
  const [labelData, setLabelData] = useState<LabelData[]>([]);
  
  // Ref за контейнера с етикетите за принтиране
  const printRef = useRef<HTMLDivElement>(null);

  // Функция за обновяване на състоянието с нови данни
  const handleDataParsed = (data: LabelData[]) => {
    setLabelData(data);
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
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Генератор на етикети
        </h1>
        
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Подаваме функцията на FileUpload */}
          <FileUpload onDataParsed={handleDataParsed} />
          
          {/* Бутон за принтиране - показва се само ако има данни */}
          {labelData.length > 0 && (
            <div className="mt-6 text-center">
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center mx-auto gap-2"
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
                Принтирай етикети
              </button>
            </div>
          )}
        </div>
        
        {/* Лист хартия с етикети - същият цвят като етикетите */}
        <div 
          ref={printRef}
          className="max-w-7xl mx-auto p-8 rounded-lg"
          style={{ backgroundColor: 'rgb(249, 165, 37)' }}
        >
          <LabelPreview labelData={labelData} />
        </div>
      </div>
    </main>
  );
}
