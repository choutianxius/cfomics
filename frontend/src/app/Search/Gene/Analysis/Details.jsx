import { default as React, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InnerHtml from 'dangerously-set-html-content';
import Table from '../../../../components/Table';
import { getBarPlot, getCancers, parseTable } from '../../dataApi/getGeneData';
import MyAlert from '../../../../components/MyAlert';
import LoadingGlower from '../../../../components/LoadingGlower';
import { beautifyDiseaseCondition as beautifyDisease } from '../../../../utils/beautify';

export default function AnalysisDetailsWithCancer ({
  gene,
  omics,
  feature,
  dataset,
  specimen,
  element,
}) {
  const [cancer, setCancer] = useState();
  const [cancers, setCancers] = useState();
  const [data, setData] = useState();

  let table;
  let image;
  if (data) {
    table = parseTable(JSON.parse(data.table), data.error || false);
    image = data.image;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [errorMessage1, setErrorMessage1] = useState(); // cancers error
  const [errorMessage2, setErrorMessage2] = useState(); // plot error

  useEffect(() => {
    setIsLoading(true);
    getCancers(gene, omics, feature, dataset, specimen)
      .then((cancers) => {
        setCancers(cancers);
        setCancer(cancers[0]);
        setErrorMessage1(null);
      })
      .catch((e) => { setErrorMessage1(e); })
      .finally(() => { setIsLoading(false); });
  }, [gene, omics, feature, dataset, specimen]);

  useEffect(() => {
    setIsLoading1(true);
    if (!cancer) { return; }
    getBarPlot(gene, omics, feature, dataset, specimen, cancer, element)
      .then((data) => {
        setData(data);
        setErrorMessage2(null);
      })
      .catch((e) => {
        setErrorMessage2(e);
      })
      .finally(() => { setIsLoading1(false); });
  }, [gene, omics, feature, dataset, specimen, cancer, element]);

  if (isLoading) { return <LoadingGlower />; }

  if (errorMessage1) { return <MyAlert error={errorMessage1} />; }

  if (errorMessage2) { return <MyAlert error={errorMessage2} />; }

  if (cancers) {
    if (cancers.length === 0) {
      return <div>No details available.</div>;
    }
  }

  return (
    <>
      <div className="row">
        <ul className="nav nav-tabs justify-content-center">
          {cancers && cancers.map((c) => (
            <li className="nav-item" key={uuidv4()}>
              <button
                type="button"
                className={
                  'nav-link' + (c === cancer ? ' active' : '')
                }
                onClick={
                  () => { setCancer(c); }
                }
              >
                {beautifyDisease(c)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {
        isLoading1
          ? <LoadingGlower />
          : data && (
          <>
            <div className="row">
              <div
                className="table-responsive"
                style={{
                  maxHeight: '18rem',
                  overflowY: 'auto',
                  fontSize: '.8rem',
                }}
              >
                <Table
                  rows={table.rows}
                  columnNames={table.colNames}
                  tableAttributes={
                    { className: 'table table-hover' }
                  }
                  thRender={
                    // eslint-disable-next-line react/no-unstable-nested-components
                    (th) => (
                      <div
                        title={th}
                        style={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          maxWidth: '10rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {th}
                      </div>
                    )
                  }
                />
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <InnerHtml html={image} />
            </div>
          </>
          )
      }
    </>
  );
}
