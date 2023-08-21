import { default as React, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';

import { plotUrl } from '../../../config';
import Table from '../../../components/Table';
import LoadingSpinner from '../../../components/LoadingSpinner';
import NoDataError from '../../../utils/errors/NoDataError';
import MyAlert from '../../../components/MyAlert';

function tableParser (table) {
  // { k0: { '0': k0_v0, '1': k0_v1, ... }, ... }

  const colNames = (Object.keys(table)).slice(2);
  const noOfRows = (Object.keys(table[colNames[0]])).length;
  const rows = [];
  for (let i = 0; i < noOfRows; i += 1) {
    const row = {};
    colNames.forEach((cn) => {
      const col = table[cn];
      row[cn] = col[String(i)];
    });
    delete row.table_ID;
    delete row.marker_name;
    rows.push(row);
  }
  return { colNames, rows };
}

function Wrapper ({ children }) {
  return (
    <div className="card rounded-0 h-100">
      <div className="card-header rounded-0 d-flex align-items-center">
        <FontAwesomeIcon icon={faStethoscope} className="me-2" />
        Related Biomarkers
      </div>
      <div className="card-body rounded-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}

export default function Biomarkers ({ gene }) {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    setIsLoading(true);

    let url = plotUrl + '/misc/gene_biomarker';
    url += `?gene=${encodeURIComponent(gene)}`;
    fetch(url)
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        if (res.status === 400) throw new NoDataError((await res.json()).detail);
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        if (!data) throw new NoDataError('No Data Found for gene ' + gene);
        if (!JSON.parse(data)) throw new NoDataError('No Data Found for gene ' + gene);
        setData(JSON.parse(data));
        setErrorMessage(null);
      })
      .catch((e) => { setErrorMessage(e); })
      .finally(() => { setIsLoading(false); });
  }, [gene]);

  // hooks should appear before any return
  const thRenderer = useCallback((s) => {
    if (s === 'Publish_Year') { return 'Publish Year'; }
    if (s === 'mole_type') { return 'Molecule Type'; }
    return s;
  }, []);

  if (isLoading) {
    return (
      <Wrapper>
        <LoadingSpinner />
      </Wrapper>
    );
  }

  if (errorMessage) {
    return (
      <Wrapper>
        <MyAlert error={errorMessage} />
      </Wrapper>
    );
  }

  const { colNames, rows } = tableParser(data);

  return (
    <Wrapper>
      <Table
        columnNames={colNames}
        rows={rows}
        tableAttributes={
          { className: 'table table-hover' }
        }
        thRender={thRenderer}
      />
    </Wrapper>
  );
}
