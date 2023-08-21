import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVirus,
  faUpRightFromSquare,
  faDroplet,
  faFontAwesome,
  faDatabase,
  faStethoscope,
} from '@fortawesome/free-solid-svg-icons';

import InnerHTML from 'dangerously-set-html-content';
import { HashLink } from 'react-router-hash-link';
import { defaultHashLinkScroll } from '../../utils/hashLinkScroll';

import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';

import { plotUrl } from '../../config';

function StatsFig ({ former = 'disease', latter = 'sample' }) {
  const [fig, setFig] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState();
  useEffect(() => {
    let url = plotUrl;
    url += '/statistics';
    url += '?type=text';
    url += `&former=${encodeURIComponent(former)}`;
    url += `&latter=${encodeURIComponent(latter)}`;

    fetch(url)
      .then(async (res) => {
        if (res.ok) return res.text();
        throw new Error((await res.json()).detail);
      })
      .then((data) => { setFig(data); })
      .catch((e) => {
        setFig(null);
        setErrorMessage(e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [former, latter]);

  if (isLoading) return <LoadingSpinner />;

  if (errorMessage) return <ErrorAlert message={errorMessage} />;

  return (fig && <InnerHTML html={fig} />);
}

export default function Statistics () {
  return (

    <>
      {/* begin::features */}
      <div className="card my-3">
        {/* begin::header */}
        <div className="card-header d-flex align-items-center">
          <FontAwesomeIcon icon={faFontAwesome} className="me-2" />
          <span className="me-auto">
            <span className="fw-bold text-primary">17</span>
            &nbsp;Feature Types Covered
          </span>
          <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
          <HashLink scroll={defaultHashLinkScroll} to="/help#pipeline-collapseButton" className="link-dark fst-italic">
            More details about features
          </HashLink>
        </div>
        {/* end::header */}
        {/* begin::body */}
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-xxl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Features by Samples</h6>
              <StatsFig former="feature" latter="sample" />
            </div>
            <div className="col-12 col-xxl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Features by Datasets</h6>
              <StatsFig former="feature" latter="dataset" />
            </div>
          </div>
        </div>
        {/* end::body */}
      </div>
      {/* end::features covered */}

      {/* begin::disease conditions */}
      <div className="card my-3">
        {/* begin::header */}
        <div className="card-header d-flex align-items-center">
          <FontAwesomeIcon icon={faVirus} className="me-2" />
          <span className="me-auto">
            <span className="fw-bold text-primary">69</span>
            &nbsp;Disease Conditions Including&nbsp;
            <span className="fw-bold text-primary">28</span>
            &nbsp;Cancer Types Covered
          </span>
          <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
          <HashLink to="/help#nomenclature-collapseButton" className="link-dark fst-italic">
            More details about diseases
          </HashLink>
        </div>
        {/* end::header */}
        {/* begin::body */}
        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-xl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Diseases by Samples</h6>
              <StatsFig former="disease" latter="sample" />
            </div>

            <div className="col-12 col-xl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Diseases by Datasets</h6>
              <StatsFig former="disease" latter="dataset" />
            </div>
          </div>
        </div>
        {/* end::body */}
      </div>
      {/* end::disease conditions */}

      {/* begin::specimens */}
      <div className="card my-3">
        <div className="card-header d-flex align-items-center">
          <FontAwesomeIcon icon={faDroplet} className="me-2" />
          <span className="me-auto">
            <span className="fw-bold text-primary">13</span>
            &nbsp;Specimen Types Covered
          </span>
          {/* <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" /> */}
          {/* <HashLink
            scroll={defaultHashLinkScroll}
            to="/help#nomenclature-collapseButton"
            className="link-dark fst-italic"
          >
            More details about specimens
          </HashLink> */}
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-12 col-xl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Specimens by Samples</h6>
              <StatsFig former="specimen" latter="sample" />
            </div>
            <div className="col-12 col-xl-6 d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Specimens by Datasets</h6>
              <StatsFig former="specimen" latter="dataset" />
            </div>
          </div>
        </div>
      </div>
      {/* end::specimens */}

      {/* begin::datasets and biomarkers */}
      <div className="row my-3 g-3">
        {/* begin::datasets */}
        <div className="col-12 col-xl-6 mt-xl-0">
          <div className="card w-100">
            {/* begin::header */}
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faDatabase} className="me-2" />
              <span className="me-auto">
                <span className="fw-bold text-primary">11345</span>
                &nbsp;Samples From&nbsp;
                <span className="fw-bold text-primary">42</span>
                &nbsp;Data Series
              </span>
              <FontAwesomeIcon icon={faUpRightFromSquare} className="me-2" />
              <HashLink scroll={defaultHashLinkScroll} to="/source#literature" className="link-dark fst-italic">
                Dataset Details
              </HashLink>
            </div>
            {/* end::header */}
            {/* begin::body */}
            <div className="card-body d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Datasets</h6>
              <StatsFig former="dataset" latter="sample" />
            </div>
            {/* end::body */}
          </div>
        </div>
        {/* end::datasets */}
        {/* begin::biomarkers */}
        <div className="col-12 col-xl-6 mt-xl-0">
          <div className="card w-100">
            {/* begin::header */}
            <div className="card-header d-flex align-items-center">
              <FontAwesomeIcon icon={faStethoscope} className="me-2" />
              <span className="me-auto">
                <span className="fw-bold text-primary">878</span>
                &nbsp;Biomarkers Collected
              </span>
            </div>
            {/* end::header */}
            {/* begin::body */}
            <div className="card-body d-flex flex-column align-items-center">
              <h6 className="card-title text-body-secondary">Statistics of Biomarkers</h6>
              <StatsFig former="marker" latter="moletype" />
            </div>
            {/* end::body */}
          </div>
        </div>
        {/* end::biomarkers */}
      </div>
      {/* end::datasets and biomarkers */}

    </>
  );
}
