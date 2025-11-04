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
  // Implement data chunking for pages
  const LABELS_PER_PAGE = 24;
  const pages = [];

  // Create chunks of labels for each page
  for (let i = 0; i < labelData.length; i += LABELS_PER_PAGE) {
    const chunk = labelData.slice(i, i + LABELS_PER_PAGE);
    pages.push(chunk);
  }

  return (
    <div ref={ref} className='print-root-container'>
      {pages.map((pageLabels, pageIndex) => (
        <div key={`page-${pageIndex}`} className='print-page-wrapper'>
          {pageLabels.map((data, labelIndex) => {
            // Calculate correct global index for arrow logic
            const globalIndex = pageIndex * LABELS_PER_PAGE + labelIndex;
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
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
