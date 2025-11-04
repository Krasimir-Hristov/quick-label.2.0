import React from 'react';
import { CheckListData } from '@/types';
import CheckListItemForPrint from './CheckListItemForPrint';

interface CheckListSheetForPrintProps {
  checkListData: CheckListData[];
}

const CheckListSheetForPrint = React.forwardRef<
  HTMLDivElement,
  CheckListSheetForPrintProps
>(({ checkListData }, ref) => {
  if (!checkListData || checkListData.length === 0) {
    return (
      <div ref={ref} className='print-root-container'>
        <p>Keine Daten zum Drucken</p>
      </div>
    );
  }

  return (
    <div ref={ref} className='print-root-container'>
      <table className='checklist-print-table'>
        <thead>
          <tr className='checklist-print-header-row'>
            <th className='checklist-print-header-cell'>ArtikelNr</th>
            <th className='checklist-print-header-cell'>Artikelbezeichnung</th>
            <th className='checklist-print-header-cell'>Aktionszeitraum</th>
            <th className='checklist-print-header-cell'>✓</th>
          </tr>
        </thead>
        <tbody>
          {checkListData.map((item, index) => (
            <CheckListItemForPrint key={index} data={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
});

CheckListSheetForPrint.displayName = 'CheckListSheetForPrint';

export default CheckListSheetForPrint;
