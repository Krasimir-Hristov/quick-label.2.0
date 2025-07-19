'use client';

import FileUpload from "@/components/FileUpload";
import Label from "@/components/Label";

export default function Home() {
  // Тестови данни за визуализация на етикета
  const testLabelData = {
    artikelbezeichnung: "Whiskas Adult Lachs & Thunfisch 400g",
    verkaufspreis: 25.99
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Генератор на етикети
        </h1>
        
        {/* Тестов етикет за визуализация */}
        <div className="mb-8 flex justify-center">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Преглед на етикет:</h2>
            <Label data={testLabelData} />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          {/* Контейнер за съдържанието */}
          <FileUpload />
        </div>
      </div>
    </main>
  );
}
