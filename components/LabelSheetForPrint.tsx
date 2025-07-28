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
  // Разделяме етикетите на групи по 24 (6 реда × 4 колони) според документацията
  const pages = [];
  for (let i = 0; i < labelData.length; i += 24) {
    pages.push(labelData.slice(i, i + 24));
  }

  return (
    <>
      {/* Inline CSS за печат според документацията */}
      <style type='text/css' media='print'>{`
        @page { 
          size: A4; 
          margin: 10mm; 
        }
      `}</style>

      <div
        className='print-container'
        style={{ margin: '0', padding: '0' }}
        ref={ref}
      >
        {pages.map((pageLabels, pageIndex) => (
          <div key={pageIndex} className='print-page'>
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
        ))}
      </div>
    </>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
