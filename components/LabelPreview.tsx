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
        <p>Няма данни за показване. Моля, качете Excel файл с продукти.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Преглед на етикети ({labelData.length} продукта)
        </h2>
      </div>
      
      {/* CSS Grid с точно 4 колони на ред */}
      <div className="grid grid-cols-4 gap-4">
        {labelData.map((item, index) => (
          <Label
            key={`${item.artikelbezeichnung}-${index}`}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};

export default LabelPreview;
