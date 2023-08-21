import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { default as React, useCallback, useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'bs';

import myAsyncFunction from '../utils/myAsync';
import { beautifyBrowseColNames, beautifyBrowseCells } from '../utils/beautify';
import LoadingSpinner from './LoadingSpinner';
import Table from './Table';

function TooltipInit () {
  useEffect(() => {
    // add initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl),
    );
    return () => { tooltipList.forEach((tooltip) => { tooltip.dispose(); }); };
  });
}

const indexCols = Array.from(new Set([
  // gene_index
  'chromosome_name', 'end_position', 'ensembl_gene_id',
  'gene_biotype', 'Gene_ID', 'hgnc_symbol', 'Promoter_Gene_ID',
  'start_position', 'strand',
  // cgi_index
  'Cgi_ID', 'chr', 'end', 'start',
  // promoter_index
  'chromosome_name', 'end_position', 'ensembl_gene_id',
  'ensembl_gene_id_version', 'gene_biotype', 'hgnc_symbol',
  'Promoter_Gene_ID', 'Promoter_ID', 'start_position',
  'strand',
  // mirna_index
  'ensembl_gene_id', 'mir_id',
  // microbe_taxo
  'feature', 'taxo', 'taxo_id',
  // proteins
  'gene_id', 'protein_id',
  // custom
  'gene_locus',
  // error
  'Result',
]));

const unsortableCols = ['Result', 'gene_locus'];

/**
 * Table component. Displays a single page at a time.
 * @component
 * @param {object} props Wrapper
 * @param {function} props.getTotalRowNumber Must be memoized
 * @param {function} props.getRows Each row: {column1: data1, ...}. Must be memoized
 * @param {function | null} props.rowMapper Must be memoized
 * @returns {JSX.Element} SSRTable component in JSX
 */
export default function SSRTable ({ getTotalRowNumber, getRows, rowMapper, valueColTitle = '' }) {
  const rowMapper1 = rowMapper || ((r) => r);
  const [totalRowNumber, setTotalRowNumber] = useState(0);
  const [rows, setRows] = useState([{ Result: 'Loading' }]);
  const [sortBy, setSortBy] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const sortDirection = ((count) => {
    if (count === 0) return null;
    if (count === 1) return 'asc';
    return 'desc';
  })(clickCount);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [currPage, setCurrPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [clearStateIndicator, setClearStateIndicator] = useState(false);

  // Initial rendering
  useEffect(() => {
    getTotalRowNumber()
      .catch(() => {})
      .then((trn) => { setTotalRowNumber(trn); })
      .then(() => getRows(null, null, 15, 1))
      .catch(() => {})
      .then((rs) => { setRows(rs); })
      .then(() => { setIsLoading(false); });
  }, [getTotalRowNumber, getRows]);

  // State change
  useEffect(() => {
    myAsyncFunction()
      .then(() => { setIsLoading(true); })
      .then(async () => getRows(sortBy, sortDirection, rowsPerPage, currPage))
      .catch(() => {})
      .then((rs) => { setRows(rs); })
      .then(() => { setIsLoading(false); });
  }, [getTotalRowNumber, getRows, sortBy, sortDirection, rowsPerPage, currPage]);

  useEffect(() => {
    setClearStateIndicator((prev) => !prev);
  }, [getRows, getTotalRowNumber, rowMapper]);

  const convertColName = useCallback((s) => beautifyBrowseColNames(s), []);

  const handleSort = useCallback((by, count) => {
    if (by !== sortBy) setSortBy(by);
    if (count !== clickCount) setClickCount(count);
  }, [sortBy, clickCount]);

  const handleChangePage = useCallback((newRowsPerPage, newCurrPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrPage(newCurrPage);
  }, []);

  return (
    <>
      <div className="container-fluid p-0 overflow-auto my-2">
        {isLoading
          ? (<LoadingSpinner />)
          : (
            <SortableTable
              rows={rows.map((row) => rowMapper1(row))}
              convertColName={convertColName}
              sortBy={sortBy}
              clickCount={clickCount}
              onSort={handleSort}
              indexCols={indexCols}
              valueColTitle={valueColTitle}
            />
          )}
      </div>

      <Pagination
        totalRowNumber={totalRowNumber}
        onChangePage={handleChangePage}
        clearStateIndicator={clearStateIndicator}
      />

    </>
  );
}

/**
 * Table content.
 * @param {object} props
 * @param {Array<object>} props.rows [{col1: data1, col2: data2, ...}]
 * @param {function} props.convertColName function(sql) => [... columnNames to be displayed]
 * @param {string | null} props.sortBy Which column is currently sorted by?
 * @param {number} props.clickCount How many times has the column been clicked?
 * @param {function} props.onSort (by, count) => {...}
 * @param {Array<string>} props.indexCols
 * @returns {JSX.Element} Table content in JSX.
 */
function SortableTable ({ rows, convertColName, sortBy, clickCount, onSort, indexCols = [], valueColTitle = '' }) {
  // Return the fontawesome arrow icon that indicates the sorting state
  function sortIndicator (currColumnName, columnName, cc) {
    if (currColumnName === columnName) {
      if (cc === 1) {
        return (<FontAwesomeIcon icon={faSortUp} />);
      }
      if (cc === 2) {
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

  const rowsMemo = useMemo(() => rows, [rows]);
  const colNamesMemo = useMemo(() => Object.keys(rows[0]), [rows]);

  const getThAttributes = useCallback((columnName) => ({
    onClick: () => {
      if (unsortableCols.includes(columnName)) { return; }
      if (columnName === sortBy) {
        onSort(sortBy, (clickCount + 1) % 3);
      } else {
        onSort(columnName, 1);
      }
    },
    style: { whiteSpace: 'nowrap', minWidth: '8rem' },
    className: indexCols.includes(columnName) ? 'table-info' : 'table-success',
    'data-bs-toggle': indexCols.includes(columnName) ? '' : 'tooltip',
    'data-bs-title': indexCols.includes(columnName)
      ? ''
      : valueColTitle + ` of ${beautifyBrowseColNames(columnName)} samples`,
  }), [sortBy, clickCount, onSort, indexCols, valueColTitle]);

  const getTdAttributes = useCallback(
    (columnName) => ({
      className: indexCols.includes(columnName) ? 'table-info' : 'table-success',
      style: {
        whiteSpace: 'nowrap',
        minWidth: '8rem',
        maxWidth: '12rem',
        textOverflow: 'ellipsis',
        overflow: indexCols.includes(columnName) ? 'hidden' : 'visible',
      },
      'data-bs-toggle': indexCols.includes(columnName) ? '' : 'tooltip',
      'data-bs-title': indexCols.includes(columnName)
        ? ''
        : valueColTitle + ` of ${beautifyBrowseColNames(columnName)} samples`,
    }),
    [indexCols, valueColTitle],
  );

  const thRender = useCallback((columnName) => (
    <div className="d-flex align-items-center">
      <span className="me-3">{convertColName(columnName)}</span>
      {!unsortableCols.includes(columnName) && (
        <span>
          {sortIndicator(sortBy, columnName, clickCount)}
        </span>
      )}
    </div>
  ), [sortBy, clickCount, convertColName]);

  const tdRender = useCallback((colName, cell) => (
    beautifyBrowseCells(colName, cell)
  ), []);

  return (
    <>
      <Table
        columnNames={colNamesMemo}
        rows={rowsMemo}
        tableAttributes={{ className: 'table table-hover' }}
        getThAttributes={getThAttributes}
        getTdAttributes={getTdAttributes}
        thRender={thRender}
        tdRender={tdRender}
      />
      <TooltipInit />
    </>
  );
}

/**
 *
 * @param {object} props
 * @param {number} props.totalRowNumber
 * @param {function} props.onChangePage (rowsPerPage, currPage) => {...}
 * @returns {JSX.Element}
 */
function Pagination ({ totalRowNumber, onChangePage, clearStateIndicator }) {
  const [currPage, setCurrPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(15);

  const [destinationPage, setDestinationPage] = useState(1);

  const noOfPages = Math.ceil(totalRowNumber / rowsPerPage) > 1
    ? Math.ceil(totalRowNumber / rowsPerPage)
    : 1;
  const canNextPage = currPage < noOfPages;
  const canPreviousPage = currPage > 1;
  const canGoToPage = destinationPage >= 1 && destinationPage <= noOfPages;

  const onNextPage = () => setCurrPage(currPage + 1);
  const onPrevPage = () => setCurrPage(currPage - 1);
  const onPageSelect = (pageNo) => setCurrPage(pageNo <= noOfPages ? pageNo : noOfPages);

  useEffect(() => {
    setCurrPage(1);
    setDestinationPage(1);
    setRowsPerPage(15);
  }, [totalRowNumber, clearStateIndicator]);

  // Handle pagination
  useEffect(() => {
    onChangePage(rowsPerPage, currPage <= noOfPages ? currPage : noOfPages);
  }, [onChangePage, currPage, rowsPerPage, noOfPages]);

  return noOfPages > 0 && (
    <div className="row gy-1">
      <div className="col-6 col-xl-3 btn-group">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onPrevPage}
          disabled={!canPreviousPage}
        >
          <span>Previous</span>
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onNextPage}
          disabled={!canNextPage}
        >
          <span>&nbsp;&nbsp;&nbsp;&nbsp;Next&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </button>
      </div>

      <div className="col-6 col-xl-3 text-center p-2">
        Page&nbsp;
        <strong>
          {currPage}

        </strong>
        {' '}
        of
        {' '}
        <strong>
          {noOfPages}
        </strong>
      </div>

      <div className="col-md-6 col-xl-4">
        <div className="input-group">
          <span className="p-2">Go to page</span>
          <input
            className="form-control"
            type="number"
            value={destinationPage}
            onChange={(e) => {
              const page = e.target.value > 0 ? Number(e.target.value) : 1;
              setDestinationPage(page);
            }}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => onPageSelect(destinationPage)}
            disabled={!canGoToPage}
          >
            Confirm
          </button>
        </div>
      </div>

      <div className="col-md-6 col-xl-2">
        <div className="input-group">
          <span className="p-2">Show</span>
          <select
            className="form-select"
            value={rowsPerPage}
            onChange={(e) => {
              const size = Number(e.target.value);
              const currentRows = (currPage - 1) * rowsPerPage;
              setRowsPerPage(size);
              setCurrPage(Math.floor(currentRows / size) + 1);
            }}
          >
            {[10, 15, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
