import React from 'react';
import { LabelData } from '@/types';
import Label from './Label';

interface LabelPreviewProps {
  labelData: LabelData[];
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ labelData }) => {
  if (!labelData || labelData.length === 0) {
    return (
      <div className='text-center text-2xl font-bold text-black py-8'>
        <p>
          Keine Daten zum Anzeigen. Bitte laden Sie eine Excel-Datei mit
          Produkten hoch.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Заглавие - скрито при печат */}
      <div className='mb-4 print-hide'>
        <h2 className='text-2xl font-bold text-black'>
          Etikettenvorschau ({labelData.length} Produkte)
        </h2>
      </div>

      {/* A4 контейнер с етикети */}
      <div className='a4-container'>
        <div className='labels-grid'>
          {labelData.map((item, index) => (
            <div
              key={`${item.artikelbezeichnung}-${index}`}
              className='label-item'
            >
              <Label data={item} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LabelPreview;
