import { default as React, useCallback, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';

import endmotifOptions from '../selectOptions/endmotifOptions.json';
import AnalysisListGroup from '../../../components/AnalysisListGroup';
import { beautifyDataset, beautifySpecimen } from '../../../utils/beautify';
// import EndmotifComparison from './EndmotifComparison';
import EndmotifComparisonNew from './EndmotifComparisonNew';
import LoadingSpinner from '../../../components/LoadingSpinner';

import Breadcrumb from '../../../components/Breadcrumb';
import { defaultHashLinkScroll } from '../../../utils/hashLinkScroll';

function Selection ({ onConfirm, dDataset, dSpecimen }) {
  function getDatasetList () {
    return endmotifOptions.map((x) => x.value);
  }

  function getSpecimenList (dataset) {
    return endmotifOptions
      .find((x) => x.value === dataset).children
      .map((x) => x.value);
  }

  const [dataset, setDataset] = useState(dDataset);
  const [specimen, setSpecimen] = useState(dSpecimen);

  const datasetList = getDatasetList();
  const specimenList = getSpecimenList(dataset);

  function handleChangeSpecimen (nextSpecimen) {
    setSpecimen(nextSpecimen);
  }

  function handleChangeDataset (nextDataset) {
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(nextDataset)[0];
    setSpecimen(nextSpecimen);
  }

  return (
    <>
      <div className="row">

        <div className="col">
          <AnalysisListGroup
            title="Collection"
            options={datasetList}
            activeIdx={
              datasetList.findIndex((x) => x === dataset)
            }
            onChangeOption={handleChangeDataset}
            beautify={beautifyDataset}
          />
        </div>

        <div className="col">
          <AnalysisListGroup
            title="Specimen"
            options={specimenList}
            activeIdx={
              specimenList.findIndex((x) => x === specimen)
            }
            onChangeOption={handleChangeSpecimen}
            beautify={beautifySpecimen}
          />
        </div>

      </div>

      <div className="d-flex mb-3 mt-5 justify-content-center">
        <button
          type="button"
          className="btn btn-info fw-bold text-white"
          onClick={
            () => {
              onConfirm(dataset, specimen);
            }
          }
        >
          Confirm
        </button>
      </div>

      <div className="exomics-callout">
        <div>
          <p>
            <strong>IMPORTANT</strong>
            :
            <br />
            To apply changes in the selected options, you must
            click the
            {' '}
            <strong>Confirm</strong>
            {' '}
            button above!
          </p>
        </div>
      </div>
    </>
  );
}

export default function Endmotif () {
  const { id } = useParams();
  let linkStateReady = false;
  let { dDataset, dSpecimen } = {
    dDataset: 'gse113386',
    dSpecimen: 'blood',
  };
  try {
    ({ dDataset, dSpecimen } = useLocation().state.linkState);
  } catch (e) {
    ({ dDataset, dSpecimen } = {
      dDataset: 'gse113386',
      dSpecimen: 'blood',
    });
  } finally {
    linkStateReady = true;
  }
  const [confirmedOptions, setConfirmedOptions] = useState({
    dataset: dDataset,
    specimen: dSpecimen,
  });

  const breadcrumbItems = [
    beautifyDataset(confirmedOptions.dataset),
    beautifySpecimen(confirmedOptions.specimen),
  ];

  const confirmSelection = useCallback((
    dataset,
    specimen,
  ) => {
    setConfirmedOptions({
      dataset,
      specimen,
    });
    const el = document.getElementById('analysis-start');
    defaultHashLinkScroll(el);
  }, []);

  if (!linkStateReady) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h4 className="py-3 mt-5">
        <span className="fw-bold fst-italic">End Motif</span>
        &nbsp;
        {id}
      </h4>

      <hr style={{ borderTop: '1px solid $gray-300', borderBottom: '0px' }} />

      <div className="container-fluid px-2">
        <div className="row gx-3 gy-3 mt-3">
          <div className="col-12">
            <div className="card rounded-0 h-100">

              <div className="card-header rounded-0 d-flex align-items-center">
                <FontAwesomeIcon icon={faChartColumn} className="me-2" />
                Analysis
              </div>

              <div className="card-body rounded-0 overflow-auto">
                <div className="row">
                  <div className="col">
                    <div className="exomics-callout">
                      <div>
                        <p>
                          Notes:
                          <br />
                          Explore end-motif data statistics across different
                          datasets and specimens. Just select them by clicking
                          and view corresponding data statistics easily.
                          Start uncovering insights today!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Selection
                  onConfirm={confirmSelection}
                  dDataset={dDataset}
                  dSpecimen={dSpecimen}
                />

                <div className="exomics-horizontal-rule" />

                <div id="analysis-start" />

                <div>
                  <h5 className="mt-3 mb-2">
                    <strong>{id}</strong>
                    &nbsp;Comparison
                  </h5>
                  <div className="exomics-callout">
                    <div>
                      <p>
                        Notes:
                        <br />
                        Using&nbsp;
                        <a href="https://en.wikipedia.org/wiki/Mann%E2%80%93Whitney_U_test">
                          Mann-Whitney U Test
                        </a>
                        , this module does comparison across different disease conditions
                        (ns: Not significant, *:p≤0.05, **:p≤0.01, ***:p≤0.001, ****:p≤0.0001) .
                      </p>
                    </div>
                  </div>
                  <Breadcrumb items={breadcrumbItems} />
                  <EndmotifComparisonNew
                    motif={id}
                    dataset={confirmedOptions.dataset}
                    specimen={confirmedOptions.specimen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
