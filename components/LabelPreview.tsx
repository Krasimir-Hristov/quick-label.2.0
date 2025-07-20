import React from 'react';
import { LabelData } from '@/types';
import Label from './Label';

interface LabelPreviewProps {
  labelData: LabelData[];
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ labelData }) => {
  if (!labelData || labelData.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Keine Daten zum Anzeigen. Bitte laden Sie eine Excel-Datei mit Produkten hoch.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Скриваме и това заглавие при печат */}
      <div className="mb-4 print-hide">
        <h2 className="text-2xl font-bold text-gray-800">
          Etikettenvorschau ({labelData.length} Produkte)
        </h2>
      </div>
      
      {/*
        На екрана: 4 колони с разстояние.
        При печат: нашият CSS ще го презапише с .print-grid-container
      */}
      <div className="grid grid-cols-4 gap-4 print-grid-container">
        {labelData.map((item, index) => (
          <div key={`${item.artikelbezeichnung}-${index}`} className="print-item-no-break">
            <Label data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelPreview;
