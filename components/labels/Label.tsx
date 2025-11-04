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

  // Логика за стрелките - показваме стрелки само на първия и последния в реда
  const positionInRow = (index + 1) % 4; // 1, 2, 3, 0
  const hasLeftArrow = positionInRow === 1; // Първи в реда
  const hasRightArrow = positionInRow === 0; // Последен в реда (четвърти)

  return (
    <div
      className='relative w-full h-full border-2 border-black flex flex-col p-3'
      style={{
        backgroundColor: '#F7A70A',
        minHeight: '200px',
      }}
    >
      {/* Стрелка от ляво - вътре в етикета */}
      {hasLeftArrow && (
        <div className='absolute left-2 top-2 z-10'>
          <svg
            width='16'
            height='28'
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

      {/* Стрелка от дясно - вътре в етикета */}
      {hasRightArrow && (
        <div className='absolute right-2 top-2 z-10'>
          <svg
            width='16'
            height='28'
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

      {/* Име на продукта - по-голям шрифт */}
      <div className='text-center' style={{ marginBottom: '8px' }}>
        <div
          className='font-bold leading-tight break-words'
          style={{
            color: '#951B81',
            fontSize: '16px',
            lineHeight: '1.1',
          }}
        >
          {data.artikelbezeichnung}
        </div>
      </div>

      {/* APP VORTEIL бадж - по-голям и по-широк */}
      <div className='flex justify-center' style={{ marginBottom: '10px' }}>
        <div
          className='bg-black text-white font-bold rounded-full'
          style={{
            fontSize: '14px',
            lineHeight: '1',
            paddingLeft: '28px',
            paddingRight: '28px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          APP VORTEIL
        </div>
      </div>

      {/* Текст за цената */}
      <div className='text-center' style={{ marginBottom: '8px' }}>
        <div
          className='font-bold text-black'
          style={{
            fontSize: '10px',
            lineHeight: '1',
            marginBottom: '2px',
          }}
        >
          DEIN PREIS MIT DER
        </div>
        <div
          className='font-bold text-black'
          style={{
            fontSize: '13px',
            lineHeight: '1',
          }}
        >
          KÖLLE ZOO APP
        </div>
      </div>

      {/* Цена - по-голям шрифт */}
      <div className='text-center'>
        <div
          className='font-bold text-black'
          style={{
            fontSize: '46px',
            lineHeight: '1',
            letterSpacing: '-1px',
          }}
        >
          {formatPrice(data.verkaufspreis)}
        </div>
      </div>

      {/* Aktionszeitraum - валидност под цената */}
      {data.aktionszeitraum && (
        <div className='text-center' style={{ marginTop: '4px' }}>
          <div
            className='font-bold text-black'
            style={{
              fontSize: '10px',
              lineHeight: '1',
            }}
          >
            {data.aktionszeitraum}
          </div>
        </div>
      )}
    </div>
  );
}
