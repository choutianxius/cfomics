/* eslint-disable no-unused-vars */
import { default as React, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AsyncTypeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import { serverListeningUrl } from '../config';
import 'react-bootstrap-typeahead/css/Typeahead.css';

const PER_PAGE = 50;
const CACHE = {};

export default function MicrobeTypeahead ({ dInput }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [query, setQuery] = useState(dInput);

  const makeAndHandleRequest = async (query, page = 0) => {
    const firstRow = page * PER_PAGE; // sql row index starts from 0
    let url = serverListeningUrl + '/search/performSearch';
    url += '?type=microbe';
    url += `&query=${query}`;
    url += `&firstRow=${firstRow}`;
    url += `&rowsPerPage=${PER_PAGE}`;
    const res = await fetch(url);
    return res.json();
  };

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
          key={result.feature}
          option={result}
          position={index}
          onClick={() => {
            navigate(`/search/microbe/${result.feature}`);
          }}
        >
          {result.feature}
        </MenuItem>
      ))}
    </Menu>
  );

  return (
    <AsyncTypeahead
      id="main-search"
      isLoading={isLoading}
      labelKey="feature"
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
      placeholder="Microbe ID"
      defaultInputValue={dInput}
    />
  );
}
