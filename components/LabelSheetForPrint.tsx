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
  return (
    <div className='pf-sheet' ref={ref}>
      {/* Вертикални линии за рязане */}
      <div className='cut-line cut-line-1'></div>
      <div className='cut-line cut-line-2'></div>
      <div className='cut-line cut-line-3'></div>
      <div className='cut-line cut-line-4'></div>
      <div className='cut-line cut-line-5'></div>

      {/* Всички етикети */}
      {labelData.map((data, index) => (
        <LabelForPrint key={index} data={data} index={index} />
      ))}
    </div>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
