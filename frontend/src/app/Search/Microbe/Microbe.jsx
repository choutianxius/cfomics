import { default as React, useCallback, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile,
  faUpRightFromSquare,
  faChartColumn,
} from '@fortawesome/free-solid-svg-icons';

import MicrobeOptions from '../selectOptions/microbeOptions.json';
import AnalysisListGroup from '../../../components/AnalysisListGroup';
import { beautifyDataset, beautifyOmics, beautifySpecimen } from '../../../utils/beautify';
// import MicrobeComparison from './MicrobeComparison';
import MicrobeComparisonNew from './MicrobeComparisonNew';
import LoadingSpinner from '../../../components/LoadingSpinner';

import Breadcrumb from '../../../components/Breadcrumb';
import { defaultHashLinkScroll } from '../../../utils/hashLinkScroll';

function Selection ({ onConfirm, dOmics, dDataset, dSpecimen }) {
  function getOmicsList () {
    return MicrobeOptions.map((x) => x.value);
  }

  function getDatasetList (omics) {
    return MicrobeOptions
      .find((x) => x.value === omics).children
      .map((x) => x.value);
  }

  function getSpecimenList (omics, dataset) {
    return MicrobeOptions
      .find((x) => x.value === omics).children
      .find((x) => x.value === dataset).children
      .map((x) => x.value);
  }

  const [omics, setOmics] = useState(dOmics);
  const [dataset, setDataset] = useState(dDataset);
  const [specimen, setSpecimen] = useState(dSpecimen);

  const omicsList = getOmicsList();
  const datasetList = getDatasetList(omics);
  const specimenList = getSpecimenList(omics, dataset);

  function handleChangeSpecimen (nextSpecimen) {
    setSpecimen(nextSpecimen);
  }

  function handleChangeDataset (nextDataset) {
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(omics, nextDataset)[0];
    setSpecimen(nextSpecimen);
  }

  function handleChangeOmics (nextOmics) {
    setOmics(nextOmics);
    const nextDataset = getDatasetList(nextOmics)[0];
    setDataset(nextDataset);
    const nextSpecimen = getSpecimenList(nextOmics, nextDataset)[0];
    setSpecimen(nextSpecimen);
  }

  return (
    <>
      <div className="row mt-5">
        <div className="col">
          <AnalysisListGroup
            title="Omics"
            options={omicsList}
            activeIdx={
              omicsList.findIndex((x) => x === omics)
            }
            onChangeOption={handleChangeOmics}
            beautify={beautifyOmics}
          />
        </div>

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

      <div className="d-flex justify-content-center mt-5 mb-3">
        <button
          type="button"
          className="btn btn-info fw-bold text-white"
          onClick={
            () => {
              onConfirm(omics, dataset, specimen);
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

export default function Microbe () {
  const { id } = useParams();
  const taxoId = (id.split('|'))[0];
  let linkStateReady = false;
  let { dOmics, dDataset, dSpecimen } = {
    dOmics: 'cfdna',
    dDataset: 'gse113386',
    dSpecimen: 'blood',
  };
  try {
    ({ dOmics, dDataset, dSpecimen } = useLocation().state.linkState);
  } catch (e) {
    ({ dOmics, dDataset, dSpecimen } = {
      dOmics: 'cfdna',
      dDataset: 'gse113386',
      dSpecimen: 'blood',
    });
  } finally {
    linkStateReady = true;
  }
  const [confirmedOptions, setConfirmedOptions] = useState({
    omics: dOmics,
    dataset: dDataset,
    specimen: dSpecimen,
  });

  const breadcrumbItems = [
    beautifyOmics(confirmedOptions.omics),
    beautifyDataset(confirmedOptions.dataset),
    beautifySpecimen(confirmedOptions.specimen),
  ];

  const confirmSelection = useCallback((
    omics,
    dataset,
    specimen,
  ) => {
    setConfirmedOptions({
      omics,
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
        <span className="fw-bold fst-italic">Microbe</span>
        &nbsp;
        {id}
      </h4>

      <hr style={{ borderTop: '1px solid $gray-300', borderBottom: '0px' }} />

      <div className="container-fluid px-2">

        <div className="row gx-3 gy-3">
          <div className="col-12">
            <div className="card rounded-0 h-100">
              <div className="card-header rounded-0 d-flex align-items-center">
                <FontAwesomeIcon icon={faFile} className="me-2" />
                Basic Information on&nbsp;
                <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
                <a
                  className="link-dark fst-italic"
                  rel="noreferrer"
                  href={
                    'https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Tree&id='
                      + taxoId
                      + '&lvl=3&p=has_linkout&p=blast_url&p=genome_blast&keep=1&srchmode=1&unlock'
                  }
                  target="_blank"
                >
                  NCBI
                </a>
              </div>
            </div>
          </div>
        </div>

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
                          Explore microbe abundance data statistics across
                          different molecular types, datasets, and specimens.
                          Just select them by clicking and view corresponding
                          data statistics easily. Start uncovering insights today!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Selection
                  onConfirm={confirmSelection}
                  dOmics={dOmics}
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
                  <MicrobeComparisonNew
                    omics={confirmedOptions.omics}
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
