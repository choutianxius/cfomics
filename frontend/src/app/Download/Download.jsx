/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { nanoid } from 'nanoid';
import { HashLink } from 'react-router-hash-link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import literatures from './literature.json';
import { defaultHashLinkScroll } from '../../utils/hashLinkScroll';

export default function Download () {
  // const HEADERS = [
  //   ['group'],
  //   ['expr'],
  //   ['microbe'],
  //   ['splc'],
  //   ['edit'],
  //   ['apa'],
  //   ['snp'],
  //   ['altp'],
  //   ['chim'],
  //   ['te'],
  //   ['bsseq'],
  //   ['dipseq'],
  // ];
  return (
    <>
      {/* begin::heading */}
      <h1 className="mb-2">Data Source & Download</h1>
      <p className="mb-2">
        We offer web based data browsing, searching and visualizing tools in the&nbsp;
        <HashLink scroll={defaultHashLinkScroll} to="/browse/dna#">browse</HashLink>
        &nbsp;and&nbsp;
        <HashLink scroll={defaultHashLinkScroll} to="/search/gene">search</HashLink>
        &nbsp;modules. You may also batch download both raw and processed data of cfOmics here.
      </p>
      {/* end::heading */}

      {/* begin::separator */}
      <div className="exomics-horizontal-rule" />
      {/* end::separator */}

      {/* begin::literature */}
      <h3 className="mb-2" id="literature">Raw Datasets</h3>
      <p className="mb-2">All cfOmics data are processed from publicly available sources.</p>
      <div className="table-responsive mb-2">
        <table
          className="table table-bordered table-sm text-center align-middle"
          style={{ fontSize: '.8rem' }}
        >
          <caption className="fst-italic">
            <span className="fw-semibold">** Disclaimer</span>:
            The datasets currently incorporated into cfOmics
            have all been sourced from publicly available repositories.
            In cases where additional requirements were stipulated
            in the data release statement, we diligently reached out
            to the respective authors to seek re-analysis and obtain permission
            for publication. If you discover that your dataset
            has been included in cfOmics, but for any particular reason
            it is deemed unsuitable for publication, please&nbsp;
            <HashLink scroll={defaultHashLinkScroll} to="../contact">contact us</HashLink>
            &nbsp;, and we will promptly retract the dataset.
          </caption>
          <thead className="table-light text-nowrap">
            <tr>
              <th>Title</th>
              <th>PMID</th>
              <th>Data Series</th>
              <th>Data Type</th>
              <th>Sample Size</th>
              <th>Specimen</th>
              <th>Library Type</th>
              <th>Disease Type</th>
              <th>Journal</th>
            </tr>
          </thead>
          <tbody>
            {literatures.slice(1).map(
              (r) => (
                <tr key={nanoid()}>
                  <td>
                    {r[0]}
                  </td>
                  <td>
                    {
                      r[1] === 'NA'
                        ? r[1]
                        : (
                          <a target="_blank" rel="noreferrer" href={`https://pubmed.ncbi.nlm.nih.gov/${r[1]}/`}>
                            {r[1]}
                          </a>
                        )
                  }
                  </td>
                  <td>
                    {
                      (r[2].match(/^GSE/))
                        ? (
                          <a target="_blank" rel="noreferrer" href={`https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=${r[2]}/`}>
                            {r[2]}
                          </a>
                        )
                        : (r[2].match(/^PXD/))
                          ? (
                            <a target="_blank" rel="noreferrer" href={`https://www.ebi.ac.uk/pride/archive/projects/${r[2]}/`}>
                              {r[2]}
                            </a>
                          )
                          : (r[2].match(/^MSV/))
                            ? (
                              <a target="_blank" rel="noreferrer" href={`https://massive.ucsd.edu/ProteoSAFe/dataset.jsp?accession=${r[2]}/`}>
                                {r[2]}
                              </a>
                            )
                            : r[2]
                  }
                  </td>
                  <td>{r[3]}</td>
                  <td>{r[4]}</td>
                  <td>{r[5]}</td>
                  <td>{r[6]}</td>
                  <td>{r[7]}</td>
                  <td>{r[8]}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
      {/* end::literature */}

      {/* <h3 id="metadata" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        Processed Features
        https://www.ncbi.nlm.nih.gov/geo/query/acc.cgi?acc=
      </h3>
      <p style={{ marginBottom: '1rem' }}>
        Each row represents a cancer, or a control group for a cancer.
        Each column represents a feature.
        <br />
        <HashLink to="../help#pipeline" smooth scroll={(el) => hashLinkScroll(el, -4.5)}>
          Feature calculation pipelines
        </HashLink>
        <br />
        <HashLink to="../help#cancer" smooth scroll={(el) => hashLinkScroll(el, -4.5)}>
          Group name meaning
        </HashLink>
      </p>
      <div
        className="w-100 overflow-auto"
      >
        <table className="table table-bordered text-center">
          <thead>
            <tr>
              {
                HEADERS.map((c) => <th>{c[0].slice(0, 1).toUpperCase() + c[0].slice(1)}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {quickDownload.slice(1).map(
              (r) => {
                const cancer = r[0][0];
                return (
                  <tr>
                    {
                      (r).map((c, idx) => {
                        if (idx === 0) { return <td>{c}</td>; }
                        if (c === null) { return <td>null</td>; }

                        const subomics = HEADERS[idx][0];

                        return (
                          <td>
                            <div className="d-flex flex-column">
                              {c.map((c1) => {
                                const [dataset, specimen, element, value] = c1.split('_');
                                return (
                                  <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={
                                      serverListeningUrl
                                      + '/download/'
                                      + `?subomics=${subomics}&`
                                      + `?dataset=${dataset}&`
                                      + `?specimen=${specimen}&`
                                      + `?element=${element}&`
                                      + `?value=${value}&`
                                      + `?cancer=${cancer}`
                                    }
                                  >
                                    {c1}
                                  </a>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })
                    }
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div> */}

      {/* begin::separator */}
      <div className="exomics-horizontal-rule" />
      {/* end::separator */}

      <h3 id="questionnaire" className="mb-2">
        Get Processed Data and Biomarker Tables
      </h3>
      <p className="mb-5">
        All processed data and biomarker tables are available
        upon request. Please fill out this&nbsp;
        <HashLink scroll={defaultHashLinkScroll} to="/questionnaire#">
          questionnaire
          <FontAwesomeIcon icon={faUpRightFromSquare} className="ms-2" />
        </HashLink>
        &nbsp;and we will notify you via email.
      </p>
    </>
  );
}
