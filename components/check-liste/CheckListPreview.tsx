import React from 'react';
import { CheckListData } from '@/types';
import CheckListItem from './CheckListItem';

interface CheckListPreviewProps {
  checkListData: CheckListData[];
  onToggleItem: (artikelNr: string) => void;
}

const CheckListPreview: React.FC<CheckListPreviewProps> = ({
  checkListData,
  onToggleItem,
}) => {
  if (!checkListData || checkListData.length === 0) {
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
            d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4'
          />
        </svg>
        <p className='text-xl font-semibold text-gray-700 mb-2'>
          Keine Daten zum Anzeigen
        </p>
        <p className='text-gray-500 text-center max-w-md'>
          Bitte laden Sie eine Excel-Datei mit Produkten hoch, um Check-Listen
          zu generieren.
        </p>
      </div>
    );
  }

  // Изчисляваме броя на checked артикули
  const checkedCount = checkListData.filter((item) => item.checked).length;

  return (
    <div className='w-full max-w-4xl mx-auto px-4'>
      {/* Заглавие с брояч */}
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-3xl font-bold text-white'>
          Check-Liste ({checkListData.length} Artikel)
        </h2>
        <div className='text-lg font-semibold text-[#a8c706]'>
          {checkedCount} / {checkListData.length} geprüft
        </div>
      </div>

      {/* Списък с артикули */}
      <div className='space-y-3'>
        {checkListData.map((item, index) => (
          <CheckListItem
            key={`${item.artikelNr}-${index}`}
            data={item}
            onToggle={onToggleItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckListPreview;
