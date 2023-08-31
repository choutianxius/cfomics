import React, { useState } from 'react';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { nanoid } from 'nanoid';

/**
 *
 * @param {object} props
 * @param {Array<object>} props.colDefinitions
 * @param {Array<object>} props.data
 * @param {object} props.tableAttributes
 * @param {object} props.theadAttributes
 * @returns {JSX.Element}
 */
export default function SortableTable ({
  colDefinitions,
  data,
  tableAttributes = {},
  theadAttributes = {},
}) {
  /**
   * colDefintions
   * [ { accessor: 'Col_Name', name: 'Col Name', sortable: true, render: (x) => x } ]
   *
   * data
   * [ { accessor0: v0, accessor1: v1 } ]
   */
  const [sortedData, setSortedData] = useState(data);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(0); // 0, 1 <=> asc, 2 <=> desc

  function compareFn (a, b) {
    if (/^[0-9]+$/.test(a)) { // a is a number
      if (/^[0-9]+$/.test(b)) { // a, b are numbers
        return Number(a) - Number(b);
      }
      return -1;
    }
    if (/^[0-9]+$/.test(b)) { return 1; } // a is a string, b is a number
    if (String(a).toLowerCase() < String(b).toLowerCase()) { // a, b are strings
      return -1;
    }
    return 1;
  }

  function sortCol (accessor) {
    let newSortOrder;
    if (sortBy === accessor) {
      newSortOrder = (sortOrder + 1) % 3;
    } else {
      newSortOrder = 1;
    }
    setSortBy(accessor);
    setSortOrder(newSortOrder);
    switch (newSortOrder) {
      case 0:
        setSortedData(data);
        break;
      case 1:
        setSortedData(data.toSorted((a, b) => compareFn(a[accessor], b[accessor])));
        break;
      case 2:
        setSortedData(data.toSorted((a, b) => compareFn(b[accessor], a[accessor])));
        break;
      default:
        break;
    }
  }

  // Return the fontawesome arrow icon that indicates the sorting state
  function sortIndicator (currColumnName, columnName, order) {
    if (currColumnName === columnName) {
      if (order === 1) {
        return (<FontAwesomeIcon icon={faSortUp} />);
      }
      if (order === 2) {
        return (<FontAwesomeIcon icon={faSortDown} />);
      }
    }
    return (
      <FontAwesomeIcon
        style={{ color: 'rgba(100, 100, 100, .5)' }}
        icon={faSort}
      />
    );
  }

  return (
    <table {...tableAttributes}>
      <thead {...theadAttributes}>
        <tr>
          {colDefinitions.map((def) => {
            const { accessor, name, sortable = true } = def;
            if (!sortable) {
              return <th key={nanoid()}>{name}</th>;
            }
            return (
              <th key={nanoid()}>
                <span className="me-2">{name}</span>
                <span
                  role="button"
                  onKeyDown={() => sortCol(accessor)}
                  tabIndex={0}
                  onClick={() => sortCol(accessor)}
                  style={{ cursor: 'pointer' }}
                >
                  {sortIndicator(sortBy, accessor, sortOrder)}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row) => (
          <tr key={nanoid()}>
            {colDefinitions.map((def) => (
              <td key={nanoid()}>
                {(function f1 () {
                  const f = def.render || ((x) => x);
                  return f(row[def.accessor]);
                }())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
