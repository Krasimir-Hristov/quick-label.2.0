import React from 'react';
import { LabelData } from '@/types';
import Label from './Label';

interface LabelPreviewProps {
  labelData: LabelData[];
}

const LabelPreview: React.FC<LabelPreviewProps> = ({ labelData }) => {
  if (!labelData || labelData.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-16'>
        <svg
          className='w-16 h-16 text-gray-400 mb-4'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
          />
        </svg>
        <p className='text-xl font-semibold text-gray-700 mb-2'>
          Keine Daten zum Anzeigen
        </p>
        <p className='text-gray-500 text-center max-w-md'>
          Bitte laden Sie eine Excel-Datei mit Produkten hoch, um Etiketten zu
          generieren.
        </p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4'>
      {/* Заглавие */}
      <div className='mb-8 text-center'>
        <h2 className='text-3xl font-bold mb-2' style={{ color: '#1a202c' }}>
          Etikettenvorschau ({labelData.length} Produkte)
        </h2>
      </div>

      {/* 4-колонен grid за етикетите като в скрийншота */}
      <div
        className='grid gap-4 mx-auto'
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          maxWidth: '1200px',
        }}
      >
        {labelData.map((item, index) => (
          <div
            key={`${item.artikelbezeichnung}-${index}`}
            className='relative'
            style={{
              width: '280px',
              height: '200px',
            }}
          >
            <Label data={item} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LabelPreview;
