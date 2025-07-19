'use client';

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import LabelPreview from "@/components/LabelPreview";
import { LabelData } from "@/types";

export default function Home() {
  // State за съхраняване на парсваните данни от Excel файла
  const [labelData, setLabelData] = useState<LabelData[]>([]);

  // Функция за обновяване на състоянието с нови данни
  const handleDataParsed = (data: LabelData[]) => {
    console.log("Данните пристигнаха в Home компонента:", data);
    console.log("Брой елементи в Home:", data.length);
    console.log("Преди setLabelData - текущо labelData.length:", labelData.length);
    setLabelData(data);
    console.log("След setLabelData - ново labelData.length:", data.length);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Генератор на етикети
        </h1>
        
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Подаваме функцията на FileUpload */}
          <FileUpload onDataParsed={handleDataParsed} />
        </div>
        
        {/* LabelPreview ще се покаже, когато labelData се промени */}
        <div className="max-w-7xl mx-auto">
          <LabelPreview labelData={labelData} />
        </div>
      </div>
    </main>
  );
}
