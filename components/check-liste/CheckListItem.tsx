import { CheckListData } from '@/types';

interface CheckListItemProps {
  data: CheckListData;
  index: number;
  onToggle: (index: number) => void;
}

export default function CheckListItem({ data, index, onToggle }: CheckListItemProps) {
  return (
    <div className='flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'>
      {/* ArtikelNr */}
      <div className='flex-shrink-0 w-24'>
        <span className='font-bold text-black'>{data.artikelNr}</span>
      </div>

      {/* Artikelbezeichnung */}
      <div className='flex-1 min-w-0'>
        <p className='text-gray-800 font-medium truncate'>
          {data.artikelbezeichnung}
        </p>
      </div>

      {/* Aktionszeitraum */}
      {data.aktionszeitraum && (
        <div className='flex-shrink-0'>
          <span className='text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full'>
            {data.aktionszeitraum}
          </span>
        </div>
      )}

      {/* Checkbox - накрая */}
      <div className='flex-shrink-0'>
        <input
          type='checkbox'
          checked={data.checked || false}
          onChange={() => onToggle(index)}
          className='w-6 h-6 text-[#a8c706] border-gray-300 rounded focus:ring-[#a8c706] focus:ring-2 cursor-pointer'
        />
      </div>
    </div>
  );
}
