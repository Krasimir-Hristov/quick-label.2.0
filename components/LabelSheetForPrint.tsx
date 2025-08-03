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
  // Изчисляваме колко хоризонтални линии трябват с правилния шаблон
  const totalRows = Math.ceil(labelData.length / 4);
  const horizontalLines = [];

  // Генерираме линии според шаблона: 8mm → +7mm → +38mm → +7mm → +38mm...
  let currentPosition = 8; // започваме с 8mm
  const pattern = [7, 38]; // чередуваме +7mm и +38mm
  let patternIndex = 0;

  // Първата линия винаги е на 8mm
  horizontalLines.push(
    <div
      key={`h-0`}
      className='cut-line-horizontal'
      style={{ top: `${currentPosition}mm` }}
    ></div>
  );

  // Генерираме останалите линии според шаблона
  // Трябват ни 2 линии на етикет × брой редове + 1 финална
  const totalLines = totalRows * 2 + 1;

  for (let i = 1; i < totalLines; i++) {
    currentPosition += pattern[patternIndex];
    horizontalLines.push(
      <div
        key={`h-${i}`}
        className='cut-line-horizontal'
        style={{ top: `${currentPosition}mm` }}
      ></div>
    );
    patternIndex = (patternIndex + 1) % 2; // чередуваме между 0 и 1
  }

  return (
    <div className='pf-sheet' ref={ref}>
      {/* Вертикални линии за рязане */}
      <div className='cut-line cut-line-1'></div>
      <div className='cut-line cut-line-2'></div>
      <div className='cut-line cut-line-3'></div>
      <div className='cut-line cut-line-4'></div>
      <div className='cut-line cut-line-5'></div>

      {/* Динамични хоризонтални линии */}
      {horizontalLines}

      {/* Всички етикети */}
      {labelData.map((data, index) => (
        <LabelForPrint key={index} data={data} index={index} />
      ))}
    </div>
  );
});

LabelSheetForPrint.displayName = 'LabelSheetForPrint';

export default LabelSheetForPrint;
