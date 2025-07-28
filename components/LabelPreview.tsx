import React from 'react';
import { LabelData } from '@/types';
import Label from './Label';

interface LabelPreviewProps {
  labelData: LabelData[];
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ labelData }) => {
  if (!labelData || labelData.length === 0) {
    return (
      <div className='text-center text-2xl font-bold text-black py-12'>
        <p>
          Keine Daten zum Anzeigen. Bitte laden Sie eine Excel-Datei mit
          Produkten hoch.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4'>
      {/* Заглавие */}
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-bold text-black mb-2'>
          Etikettenvorschau
        </h2>
        <p className='text-lg text-gray-600'>
          {labelData.length} Produkte generiert
        </p>
      </div>

      {/* Красив grid за етикетите */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center'>
        {labelData.map((item, index) => (
          <div
            key={`${item.artikelbezeichnung}-${index}`}
            className='transform hover:scale-105 transition-transform duration-200'
          >
            <Label data={item} index={index} />
          </div>
        ))}
      </div>

      {/* Информация в дъното */}
      <div className='mt-12 text-center text-gray-500'>
        <p className='text-sm'>
          Готови за печат • Оптимизирани за A4 формат • 48x38mm размер
        </p>
      </div>
    </div>
  );
};

export default LabelPreview;
