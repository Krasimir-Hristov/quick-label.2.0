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
  // Разделяме етикетите на групи по 24 (6 реда × 4 колони)
  const pages = [];
  for (let i = 0; i < labelData.length; i += 24) {
    pages.push(labelData.slice(i, i + 24));
  }

  return (
    <div
      className='print-container'
      style={{ margin: '0', padding: '0' }}
      ref={ref}
    >
      {pages.map((pageLabels, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {/* Page break преди всяка страница освен първата */}
          {pageIndex > 0 && <div className='page-break' />}

          {/* Етикетите за тази страница в grid layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 44mm)',
              gridTemplateRows: 'repeat(6, 41mm)',
              gap: 0,
              width: '176mm', // 4 × 44mm
              margin: '0 auto',
            }}
          >
            {pageLabels.map((data, labelIndex) => {
              const globalIndex = pageIndex * 24 + labelIndex;
              return (
                <LabelForPrint
                  key={globalIndex}
                  data={data}
                  index={globalIndex}
                />
              );
            })}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
