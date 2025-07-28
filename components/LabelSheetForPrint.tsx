import React from 'react';
import { LabelData } from '@/types';
import LabelForPrint from './LabelForPrint';

interface LabelSheetForPrintProps {
  labelData: LabelData[];
}

const LabelSheetForPrint = React.forwardRef<
  HTMLDivElement,
  LabelSheetForPrintProps
>(({ labelData }, ref) => {
  // Създаваме масив с етикети + празни етикети след всеки 24
  const allLabels = [];

  for (let i = 0; i < labelData.length; i += 24) {
    // Добавяме следващите 24 етикета (или колкото остават)
    const batch = labelData.slice(i, i + 24);
    allLabels.push(...batch);

    // Ако има още етикети след тези 24, добавяме 4 празни етикета
    if (i + 24 < labelData.length) {
      // Добавяме 4 празни етикета
      for (let j = 0; j < 4; j++) {
        allLabels.push(null); // null означава празен етикет
      }
    }
  }

  return (
    <div className='pf-sheet' ref={ref}>
      {allLabels.map((data, index) => {
        if (data === null) {
          // Празен етикет
          return (
            <div
              key={`empty-${index}`}
              className='pf-label'
              style={{
                width: '44mm',
                height: '41mm',
                minWidth: '44mm',
                minHeight: '41mm',
                maxWidth: '44mm',
                maxHeight: '41mm',
              }}
            >
              {/* Горна секция с възможни стрелки */}
              <div className='pf-header'>
                {/* Логика за стрелките - същата като в LabelForPrint */}
                {(index + 1) % 4 === 1 && ( // Първи в реда
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

                <div className='pf-product-name'></div>

                {(index + 1) % 4 === 0 && ( // Последен в реда (четвърти)
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

              {/* Празно съдържание */}
              <div className='pf-content'></div>
            </div>
          );
        } else {
          // Нормален етикет
          return <LabelForPrint key={index} data={data} index={index} />;
        }
      })}
    </div>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
