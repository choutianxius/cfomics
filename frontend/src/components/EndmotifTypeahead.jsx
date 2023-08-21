/* eslint-disable no-unused-vars */
import { default as React, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import { v4 as uuidv4 } from 'uuid';
import endmotifs from './endmotifs.json';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const PER_PAGE = 50;
const CACHE = {};

function requestApi (query, page) {
  const totalOptions = endmotifs.filter((x) => x.startsWith(query.toUpperCase()));
  const totalCount = endmotifs.length;
  const firstRow = page * PER_PAGE;
  const options = totalOptions.slice(firstRow);
  return new Promise((resolve) => {
    resolve({ options, totalCount });
  });
}

export default function EndmotifTypeahead ({ dInput }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState(dInput);

  const makeAndHandleRequest = (query, page = 0) => requestApi(query, page);

  const handleInputChange = (q) => { setQuery(q); };

  const handlePaginate = (e, shownResults) => {
    const cachedQuery = CACHE[query];
    if (
      cachedQuery.options.length > shownResults
        || cachedQuery.options.length === cachedQuery.options.totalCount
    ) { return; }

    setIsLoading(true);

    const page = cachedQuery.page + 1;
    makeAndHandleRequest(query, page)
      .then((data) => {
        const updatedOptions = cachedQuery.options.concat(data.options);
        CACHE[query] = { ...cachedQuery, options: updatedOptions, page };
        setIsLoading(false);
        setOptions(options);
      });
  };

  const handleSearch = useCallback((query) => {
    if (CACHE[query]) {
      setOptions(CACHE[query].options);
      return;
    }

    setIsLoading(true);
    makeAndHandleRequest(query)
      .then((data) => {
        CACHE[query] = { ...data, page: 0 };
        setIsLoading(false);
        setOptions(data.options);
      });
  }, []);

  const menuRenderer = (results) => (
    <Menu id="main-search-menu">
      {results.map((result, index) => (
        <MenuItem
          key={uuidv4()}
          option={result}
          position={index}
          onClick={() => {
            navigate(`/search/endmotif/${result}`);
          }}
        >
          {String(result)}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AsyncTypeahead
      id="main-search"
      isLoading={isLoading}
      maxResults={PER_PAGE - 1}
      minLength={1}
      onInputChange={handleInputChange}
      onPaginate={handlePaginate}
      onSearch={handleSearch}
      options={options}
      paginate
      renderMenu={menuRenderer}
      useCache={false}
      filterBy={() => true}
      placeholder="4-mer Sequence of A/C/G/T/N"
      defaultInputValue={dInput}
    />
  );
}
