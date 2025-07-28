import { LabelData } from '@/types';

interface LabelProps {
  data: LabelData;
  index: number;
}

export default function Label({ data, index }: LabelProps) {
  // Функция за форматиране на цената
  const formatPrice = (price: number) => {
    const formattedPrice = price.toFixed(2).replace('.', ',');
    return formattedPrice + '€';
  };

  // Логика за стрелките
  const positionInRow = (index + 1) % 4; // 1, 2, 3, 0
  const hasLeftArrow = positionInRow === 1; // Първи в реда
  const hasRightArrow = positionInRow === 0; // Последен в реда (четвърти)

  return (
    <div
      className='relative border-2 border-black overflow-hidden flex flex-col bg-orange-400 rounded-lg shadow-lg'
      style={{
        backgroundColor: '#F7A70A',
        borderColor: '#000000',
        width: '280px',
        height: '220px',
        boxSizing: 'border-box',
      }}
    >
      {/* Горна секция със стрелка и име на продукта */}
      <div className='flex items-start p-3 gap-2'>
        {/* Стрелка от ляво */}
        {hasLeftArrow && (
          <div
            className='flex-shrink-0'
            style={{ width: '16px', height: '28px' }}
          >
            <svg
              width='100%'
              height='100%'
              viewBox='0 0 20 36'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 36L0 22L5 22L5 0L15 0L15 22L20 22L10 36Z'
                fill='#951B81'
              />
            </svg>
          </div>
        )}

        {/* Име на продукта - винаги центрирано */}
        <div className='text-center flex-1'>
          <div
            className='font-bold leading-tight break-words font-lexia-std'
            style={{
              color: '#951B81',
              fontSize: '14px',
              lineHeight: '1.2',
            }}
          >
            {data.artikelbezeichnung}
          </div>
        </div>

        {/* Стрелка от дясно */}
        {hasRightArrow && (
          <div
            className='flex-shrink-0'
            style={{ width: '16px', height: '28px' }}
          >
            <svg
              width='100%'
              height='100%'
              viewBox='0 0 20 36'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M10 36L0 22L5 22L5 0L15 0L15 22L20 22L10 36Z'
                fill='#951B81'
              />
            </svg>
          </div>
        )}
      </div>

      {/* Основно съдържание */}
      <div className='flex-1 flex flex-col justify-between items-center px-4 py-2'>
        {/* APP VORTEIL бадж */}
        <div
          className='bg-black text-white font-bold rounded-full font-din-engschrift-std px-4 py-2'
          style={{
            fontSize: '18px',
            lineHeight: '1',
          }}
        >
          APP VORTEIL
        </div>

        {/* Текст за цената */}
        <div className='text-center'>
          <div
            className='font-bold text-black font-din-engschrift-std'
            style={{
              fontSize: '12px',
              lineHeight: '1.1',
              marginBottom: '4px',
            }}
          >
            DEIN PREIS MIT DER
          </div>
          <div
            className='font-bold text-black font-din-engschrift-std'
            style={{
              fontSize: '16px',
              lineHeight: '1',
            }}
          >
            KÖLLE ZOO APP
          </div>
        </div>

        {/* Цена */}
        <div
          className='font-bold text-black text-center font-din-engschrift-std'
          style={{
            fontSize: '36px',
            lineHeight: '1',
            letterSpacing: '-1px',
          }}
        >
          {formatPrice(data.verkaufspreis)}
        </div>
      </div>
    </div>
  );
}
