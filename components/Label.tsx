import { LabelData } from '@/types';

interface LabelProps {
  data: LabelData;
  index: number;
}

export default function Label({ data, index }: LabelProps) {
  // Функция за форматиране на цената, за да е по-чисто в JSX-а
  const formatPrice = (price: number) => {
    // Форматираме до 2 знака и заменяваме точката със запетая
    const formattedPrice = price.toFixed(2).replace('.', ',');
    const [integerPart, decimalPart] = formattedPrice.split(',');

    // Проверяваме дали цялата част има 3 или повече цифри (напр. 100+)
    const isLargePrice = integerPart.length >= 3;
    const fontSize = isLargePrice ? '4.7rem' : '5.5rem'; // По-малък шрифт за големи цени

    return (
      <>
        <span
          className='font-bold text-black leading-none font-din-engschrift-std'
          style={{ fontSize }}
        >
          {integerPart}
        </span>
        <span
          className='font-bold text-black leading-none font-din-engschrift-std'
          style={{ fontSize }}
        >
          ,{decimalPart}€
        </span>
      </>
    );
  };

  // Логика за стрелките
  const positionInRow = (index + 1) % 4; // 1, 2, 3, 0
  const hasLeftArrow = positionInRow === 1; // Първи в реда
  const hasRightArrow = positionInRow === 0; // Последен в реда (четвърти)
  const hasNoArrow = positionInRow === 2 || positionInRow === 3; // Средните двама

  return (
    <div
      className='relative border border-black overflow-hidden flex flex-col bg-orange-400 print-label'
      style={{
        backgroundColor: '#F7A70A',
        borderColor: '#000000',
        width: '48mm',
        height: '38mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Горна секция със стрелка и име на продукта */}
      <div className='flex items-start gap-1' style={{ padding: '1mm' }}>
        {/* Стрелка от ляво (само за първия в реда) */}
        {hasLeftArrow && (
          <div
            className='flex-shrink-0'
            style={{ width: '2mm', height: '4mm' }}
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

        {/* Име на продукта */}
        <div className='text-left flex-1'>
          <div
            className='font-bold leading-tight break-words font-lexia-std'
            style={{
              color: '#951B81',
              fontSize: '7pt',
              lineHeight: '1.1',
            }}
          >
            {data.artikelbezeichnung}
          </div>
        </div>

        {/* Стрелка от дясно (само за последния в реда) */}
        {hasRightArrow && (
          <div
            className='flex-shrink-0'
            style={{ width: '2mm', height: '4mm' }}
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
      <div
        className='flex-1 flex flex-col justify-between items-center'
        style={{ padding: '1mm 2mm 2mm 2mm' }}
      >
        {/* APP VORTEIL бадж */}
        <div
          className='bg-black text-white font-bold rounded-full font-din-engschrift-std'
          style={{
            fontSize: '24.8pt',
            lineHeight: '1',
            padding: '0.5mm 2mm',
            borderRadius: '2mm',
          }}
        >
          APP VORTEIL
        </div>

        {/* Текст за цената */}
        <div className='text-center'>
          <div
            className='font-bold text-black font-din-engschrift-std'
            style={{
              fontSize: '10pt',
              lineHeight: '1',
              marginBottom: '1mm',
            }}
          >
            DEIN PREIS MIT DER
          </div>
          <div
            className='font-bold text-black font-din-engschrift-std'
            style={{
              fontSize: '14pt',
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
            fontSize: '46pt',
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
