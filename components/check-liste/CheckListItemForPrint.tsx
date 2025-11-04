import { CheckListData } from '@/types';

interface CheckListItemForPrintProps {
  data: CheckListData;
}

export default function CheckListItemForPrint({
  data,
}: CheckListItemForPrintProps) {
  return (
    <tr className='checklist-print-row'>
      <td className='checklist-print-cell checklist-print-artikelnr'>
        {data.artikelNr}
      </td>
      <td className='checklist-print-cell checklist-print-bezeichnung'>
        {data.artikelbezeichnung}
      </td>
      <td className='checklist-print-cell checklist-print-zeitraum'>
        {data.aktionszeitraum || ''}
      </td>
      <td className='checklist-print-cell checklist-print-checkbox-cell'>
        <span className='checklist-print-checkbox'>
          {data.checked ? '☑' : '☐'}
        </span>
      </td>
    </tr>
  );
}
