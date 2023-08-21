import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import './Tooltip.css';

/**
 *
 * @param {object} props
 * @param {string} props.downloadLink
 * @param {string} props.downloadFormat csv | json
 * @param {function} props.onChangeDownloadFormat
 * @returns {JSX.Element} Table header in JSX
 */
export default function TableDownloadHeader ({
  downloadLink,
  downloadFormat,
  onChangeDownloadFormat,
}) {
  return (
    <div className="d-flex align-items-center">
      <div className="exomics-tooltip me-1">
        <FontAwesomeIcon
          className="p-1"
          style={{ height: '1.5rem', alignSelf: 'center' }}
          icon={faInfoCircle}
        />
        <span className="exomics-tooltip-text exomics-tooltip-text-start">Click column names to sort</span>
      </div>

      <div className="btn-group">
        <a
          type="button"
          className="btn btn-outline-secondary"
          style={{ width: '5rem' }}
          href={downloadLink}
        >
          {downloadFormat.toUpperCase()}
        </a>
        <button
          type="button"
          className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="visually-hidden">Toggle Dropdown Split</span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => { onChangeDownloadFormat('csv'); }}
            >
              CSV
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => { onChangeDownloadFormat('json'); }}
            >
              JSON
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 *
 * @param {object} props
 * @param {function} props.onInput
 * @param {string} props.inputPlaceholder
 * @param {object} props.inputValue
 * @param {function} props.onSearch
 * @param {boolean} props.searchDisabled
 * @param {string} props.downloadLink
 * @param {string} props.downloadFormat csv | json
 * @param {function} props.onChangeDownloadFormat
 * @returns {JSX.Element} Table header in JSX
 */
export function TableDownloadSearchHeader ({
  onInput,
  inputPlaceholder,
  inputValue,
  onSearch,
  searchDisabled = false,
  downloadLink,
  downloadFormat,
  onChangeDownloadFormat,
}) {
  const myCSS = {
    btn: { borderRadius: '0% 10% 10% 0%' },
    input: {
      borderRadius: '0% 0% 0% 0%',
      width: '20rem',
    },
  };

  return (
    <div className="d-flex">

      <input
        className="form-control"
        style={myCSS.input}
        onChange={onInput}
        placeholder={inputPlaceholder}
        value={inputValue}
        disabled={searchDisabled}
        title={searchDisabled ? 'Can\'t search when element is not gene' : null}
      />
      <button
        type="button"
        className="btn btn-primary me-auto"
        style={myCSS.btn}
        onClick={onSearch}
        disabled={searchDisabled || !inputValue}
      >
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
        />
      </button>

      <div className="exomics-tooltip me-1">
        <FontAwesomeIcon
          className="p-1"
          style={{ height: '1.5rem', alignSelf: 'center' }}
          icon={faInfoCircle}
        />
        <span className="exomics-tooltip-text exomics-tooltip-text-start">Click column names to sort</span>
      </div>

      <div className="btn-group">
        <a
          type="button"
          className="btn btn-outline-secondary"
          style={{ width: '5rem' }}
          href={downloadLink}
          target="_blank"
          rel="noreferrer"
        >
          {downloadFormat.toUpperCase()}
        </a>
        <button
          type="button"
          className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="visually-hidden">Toggle Dropdown Split</span>
        </button>
        <ul className="dropdown-menu">
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => { onChangeDownloadFormat('csv'); }}
            >
              CSV
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => { onChangeDownloadFormat('json'); }}
            >
              JSON
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
