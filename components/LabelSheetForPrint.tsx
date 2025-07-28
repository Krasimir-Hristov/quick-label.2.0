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
      {labelData.map((data, index) => (
        <LabelForPrint key={index} data={data} index={index} />
      ))}
    </div>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
