/* eslint-disable no-unused-vars */
import { default as React, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import '../../../components/Tooltip.css';
import { serverListeningUrl } from '../../../config';
import './Gene.css';
import BasicInfo from './BasicInfo';
import Analysis from './Analysis/Analysis';
import GenomeBrowser from './GenomeBrowser/GenomeBrowser';
import Biomarkers from './Biomarkers';
import Correlation from './Correlation/Correlation';

import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorAlert from '../../../components/ErrorAlert';

export default function Gene () {
  // Get basic information upon loading
  const { ensemblGeneId } = useParams();
  const [basicInfo, setBasicInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    fetch(serverListeningUrl + `/profile/gene/${ensemblGeneId}/generalInfo`)
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        if (!data.info) {
          throw new Error('No info available for gene: ' + ensemblGeneId);
        }
        setBasicInfo(data.info);
        setErrorMessage(null);
      })
      .catch((e) => { setErrorMessage(e.message); });
  }, [ensemblGeneId]);

  let { dOmics, dFeature, dDataset, dSpecimen, dElement } = {
    dOmics: 'cfdna',
    dFeature: 'dipseq',
    dDataset: 'gse112679',
    dSpecimen: 'plasma',
    dElement: 'gene',
  };
  let linkStateReady = false;
  try {
    ({ dOmics, dFeature, dDataset, dSpecimen, dElement } = useLocation().state.linkState);
  } catch (e) {
    ({ dOmics, dFeature, dDataset, dSpecimen, dElement } = {
      dOmics: 'cfdna',
      dFeature: 'dipseq',
      dDataset: 'gse112679',
      dSpecimen: 'plasma',
      dElement: 'gene',
    });
  } finally {
    linkStateReady = true;
  }

  if (errorMessage) {
    return <ErrorAlert message={errorMessage} />;
  }

  if (!(basicInfo && linkStateReady)) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <h4 className="py-3 mt-5">
        <span className="fw-bold fst-italic">Gene</span>
        &nbsp;
        {basicInfo.hgnc_symbol}
      </h4>

      <hr style={{ borderTop: '1px solid $gray-300', borderBottom: '0px' }} />

      <div className="d-flex gx-5">

        <div className="container-fluid px-2">

          <div className="row gx-3 gy-3">
            <div className="col-12">
              <BasicInfo basicInfo={basicInfo} />
            </div>
          </div>

          <div className="row gx-3 gy-3 mt-3">
            <div className="col-12">
              <Analysis
                gene={ensemblGeneId}
                dOmics={dOmics}
                dFeature={dFeature}
                dDataset={dDataset}
                dSpecimen={dSpecimen}
                dElement={dElement}
              />
            </div>
          </div>

          <div className="row gx-3 gy-3 mt-3">
            <div className="col-12">
              <Biomarkers gene={ensemblGeneId} />
            </div>
          </div>

          <div className="card rounded-0" style={{ marginTop: '2rem' }}>
            <div className="card-header rounded-0 d-flex align-items-center">
              <FontAwesomeIcon icon={faChartBar} className="me-2" />
              Multiomics Visualization
            </div>
            <div className="card-body">
              <GenomeBrowser gene={basicInfo.hgnc_symbol} />
            </div>
          </div>

          <div className="card rounded-0" style={{ marginTop: '2rem' }}>
            <div className="card-header rounded-0 d-flex align-items-center">
              <FontAwesomeIcon icon={faChartLine} className="me-2" />
              Correlation Analysis
            </div>
            <div className="card-body">
              <Correlation gene={ensemblGeneId} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
