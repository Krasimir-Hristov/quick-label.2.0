import { LabelData } from '@/types';

interface LabelForPrintProps {
  data: LabelData;
  index: number;
}

export default function LabelForPrint({ data, index }: LabelForPrintProps) {
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
      className='pf-label'
      style={{
        width: '45mm',
        height: '41mm',
        minWidth: '45mm',
        minHeight: '41mm',
        maxWidth: '45mm',
        maxHeight: '41mm',
        margin: '0',
      }}
    >
      {/* Горна секция със стрелка и име на продукта */}
      <div className='pf-header'>
        {/* Стрелка от ляво */}
        {hasLeftArrow && (
          <div className='pf-arrow-left'>
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
        <div className='pf-product-name'>
          <div className='pf-product-title'>{data.artikelbezeichnung}</div>
        </div>

        {/* Стрелка от дясно */}
        {hasRightArrow && (
          <div className='pf-arrow-right'>
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
      <div className='pf-content'>
        {/* APP VORTEIL бадж */}
        <div className='pf-badge'>APP VORTEIL</div>

        {/* Текст за цената */}
        <div className='pf-price-text'>
          <div className='pf-price-text-line1'>DEIN PREIS MIT DER</div>
          <div className='pf-price-text-line2'>KÖLLE ZOO APP</div>
        </div>

        {/* Цена */}
        <div className='pf-price'>{formatPrice(data.verkaufspreis)}</div>
      </div>
    </div>
  );
}
