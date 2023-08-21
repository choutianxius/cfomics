import React from 'react';
import { nanoid } from 'nanoid';

/**
 * Basic table
 *
 * @param {object} props
 * @param {Array<string>} props.columnNames Memoized
 * @param {Array<object>} props.rows Memoized
 * @param {object | null} props.tableAttributes
 * @param {function | null} props.getThAttributes
 * @param {function | null} props.getTdAttributes (k, v) => ...
 * @param {function | null} props.thRender Memoized
 * @param {function | null} props.tdRender Memoized
 * @returns {JSX.Element} Table
 */
export default function Table ({
  columnNames,
  rows,
  tableAttributes,
  getThAttributes,
  getTdAttributes,
  thRender,
  tdRender,
}) {
  const getThAttributes1 = getThAttributes || (() => ({}));
  const getTdAttributes1 = getTdAttributes || (() => ({}));
  const thRender1 = thRender || ((th) => th);
  const tdRender1 = tdRender || ((colNameIgnored, td) => td);
  return (
    <table {...(tableAttributes || { style: { overflowY: 'visible' } })}>
      <thead>
        <tr>
          {columnNames.map((colName) => (
            <th key={nanoid()} {...getThAttributes1(colName)}>
              {thRender1(colName)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={nanoid()}>
            {Object.entries(row).map(([k, cell]) => (
              <td key={nanoid()} {...getTdAttributes1(k, cell)}>
                {tdRender1(k, cell)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
