/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { HashLink } from 'react-router-hash-link';
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InnerHtml from 'dangerously-set-html-content';
import FsLightbox from 'fslightbox-react';

import SearchTypahead from '../../components/GeneTypeahead';

import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorPlaceholder from '../../components/ErrorPlaceholder.svg';

import { defaultHashLinkScroll } from '../../utils/hashLinkScroll';

import './Home.css';

import { plotUrl } from '../../config';

const { PUBLIC_URL } = process.env;

const dnaIcon = PUBLIC_URL + '/images/index_dna_icon.png';
const rnaIcon = PUBLIC_URL + '/images/index_rna_icon.png';
const proteinIcon = PUBLIC_URL + '/images/index_protein_icon.png';
const metaboliteIcon = PUBLIC_URL + '/images/index_metabolite_icon.png';

const Analysis = PUBLIC_URL + '/images/home/analysisNew.png';
const Pipeline = PUBLIC_URL + '/images/home/pipeline.png';
const CellFree = PUBLIC_URL + '/images/home/cellfree.png';

const Overview = PUBLIC_URL + '/images/cfOmicsOverview.webp';
const Modules = PUBLIC_URL + '/images/home/modules.png';

function figUrl (former, latter) {
  let url = plotUrl + '/statistics';
  url += `?former=${encodeURIComponent(former)}`;
  url += `&latter=${encodeURIComponent(latter)}`;
  url += `&main=${encodeURIComponent(1)}`;
  url += `&type=${encodeURIComponent('text')}`;
  return url;
}

function HomeStatisticsFig ({ url }) {
  const [fig, setFig] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(url)
      .then(async (res) => {
        if (res.ok) { return res.text(); }
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        setFig(data);
        setIsError(false);
      })
      .catch(() => { setIsError(true); })
      .finally(() => { setIsLoading(false); });
  }, [url]);

  if (isLoading) { return <LoadingSpinner />; }

  if (isError) { return <img src={ErrorPlaceholder} alt="An error occurred." />; }

  return fig && <InnerHtml html={fig} />;
}

/* eslint-disable react/jsx-one-expression-per-line */
export default function Home () {
  const [toggler1, setToggler1] = useState(false);
  const [toggler2, setToggler2] = useState(false);

  return (
    <>
      {/* start::banner */}
      <div className="row g-5 pt-2 mb-5">
        {/* start title */}
        <div className="col-xl-8 col-12">
          <h1
            className="display-5 fw-bold mb-2"
            style={{ fontFamily: '"Raleway","Helvetica Neue",Helvetica,Arial,sans-serif' }}
          >
            Welcome to&nbsp;
            <span className="fw-bolder text-primary">cf</span>
            <span className="fw-bolder">Omics</span>
          </h1>
          <h4
            className="fw-bold mb-3"
            style={{ fontFamily: '"Raleway","Helvetica Neue",Helvetica,Arial,sans-serif' }}
          >
            A <span className="text-primary">C</span>ell-<span className="text-primary">F</span>ree
            Multi<span className="text-primary">Omics</span> Database for Diseases
          </h4>
          <div className="lead p-0 align-text-bottom">
            cfOmics is a comprehensive database focusing on
            extracellular multi-omics data of multiple cancers and
            relative non-cancer diseases based on
            high-throughput sequencing and MS data, including cfDNA,
            cfRNA, extracellular proteome, metabolome, circulating tumor
            cells (CTC) and others.
          </div>
        </div>
        {/* end::title */}
        {/* begin::quick start */}
        <div className="col-xl-4 col-12">
          <div className="row h-100">
            {/* begin::search */}
            <div className="col-12">
              <h6>Search</h6>
              <SearchTypahead />
              <div className="d-flex mt-1 ps-2" style={{ fontSize: '.8rem' }}>
                <span className="me-2 fst-italic text-opacity-75">e.g.</span>
                <HashLink to="/search/gene/ENSG00000141510#" className="me-2 text-decoration-none link-opacity-75">TP53</HashLink>
                <HashLink to="/search/gene/ENSG00000141510#" className="me-2 text-decoration-none link-opacity-75">ENSG00000141510</HashLink>
              </div>
            </div>
            {/* end::search */}
            {/* begin::separator */}
            <div
              className="col-12 d-flex align-items-center justify-content-center exomics-separator-content"
            >
              <span className="fst-italic" style={{ fontSize: '.8rem' }}>
                Or
              </span>
            </div>
            {/* end::separator */}
            {/* begin::browse navs */}
            <div className="col-12 d-flex flex-column justify-content-end">
              <h6>Browse</h6>
              <div className="d-flex justify-content-between align-items-center exomics-home-browse">
                <HashLink to="/browse/dna#" className="d-flex flex-column align-items-center text-decoration-none">
                  <img src={dnaIcon} alt="browse dna" />
                  <span className="text-secondary">DNA</span>
                </HashLink>
                <HashLink to="/browse/rna#" className="d-flex flex-column align-items-center text-decoration-none">
                  <img src={rnaIcon} alt="browse rna" />
                  <span className="text-secondary">RNA</span>
                </HashLink>
                <HashLink to="/browse/protein#" className="d-flex flex-column align-items-center text-decoration-none">
                  <img src={proteinIcon} alt="browse protein" />
                  <span className="text-secondary">Protein</span>
                </HashLink>
                <HashLink to="/browse/metabolite#" className="d-flex flex-column align-items-center text-decoration-none">
                  <img src={metaboliteIcon} alt="browse metabolite" />
                  <span className="text-secondary">Metabolite</span>
                </HashLink>
              </div>
            </div>
            {/* end::browse navs */}
          </div>
        </div>
        {/* end::quick start */}
      </div>
      {/* end::banner */}

      {/* begin::separator */}
      <div className="exomics-horizontal-rule" />
      {/* end::separator */}

      {/* begin::stats and overview */}
      <div className="row g-5">

        {/* begin::stats */}
        <div className="order-2 col-xl-8 col-12 d-flex flex-column">
          <h5 className="text-body-secondary">Statistics</h5>
          <div className="row gx-3 gy-5 flex-grow-1 mb-3">
            {/* begin::stat item */}
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className="text-center">
                11345 Samples&nbsp;&nbsp;
                <span>
                  <HashLink to="/source#literature" scroll={defaultHashLinkScroll}>
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                  </HashLink>
                </span>
              </h6>
              <HomeStatisticsFig url={figUrl('dataset', 'sample')} />
            </div>
            {/* end::stat item */}
            {/* begin::stat item */}
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className="text-center">
                69 Disease Conditions&nbsp;&nbsp;
                <span>
                  <HashLink to="/help#nomenclature" scroll={defaultHashLinkScroll}>
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                  </HashLink>
                </span>
              </h6>
              <HomeStatisticsFig url={figUrl('disease', 'sample')} />
            </div>
            {/* end::stat item */}
            {/* begin::stat item */}
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className="text-center">
                17 Data Types&nbsp;&nbsp;
                <span>
                  <HashLink to="/help#pipeline" scroll={defaultHashLinkScroll}>
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                  </HashLink>
                </span>
              </h6>
              <HomeStatisticsFig url={figUrl('feature', 'sample')} />
            </div>
            {/* end::stat item */}
            {/* begin::stat item */}
            <div className="col-6 d-flex flex-column align-items-center">
              <h6 className="text-center">
                13 Specimen Types
              </h6>
              <HomeStatisticsFig url={figUrl('specimen', 'sample')} />
            </div>
            {/* end::stat item */}
          </div>
          {/* begin::callout */}
          <div className="exomics-callout mb-0">
            <div>
              <p>
                Check&nbsp;
                <HashLink className="fst-italic text-decoration-none" to="/statistics#">Statistics Page</HashLink>
                &nbsp;for more statistics information, such as biomarker statistics
              </p>
            </div>
            <div>
              <p>
                Check&nbsp;
                <HashLink className="fst-italic text-decoration-none" to="/help#">Help Page</HashLink>
                &nbsp;for cfOmics usage and
                more information about diseases and specimens
              </p>
            </div>
          </div>
          {/* end::callout */}
        </div>
        {/* end::stats */}

        {/* begin::overview */}
        <div className="order-1 col-xl-4 d-xl-flex flex-column d-none">
          <h5 className="text-body-secondary">Overview</h5>
          {/* begin::images container */}
          <div className="flex-grow-1 row g-2">
            {/* begin::image */}
            <div
              className="exomics-home-func shadow rounded-1 border p-0 col-12"
            >
              <img
                style={{ objectPosition: '0% 50%' }}
                src={Overview}
                alt="overview"
                onClick={() => { setToggler1(!toggler1); }}
              />
              <div>
                <h5 className="fst-italic">Overview</h5>
                <p>
                  cfOmics is a comprehensive database focusing on
                  extracellular multi-omics data of multiple cancers and
                  relative non-cancer diseases.
                </p>
              </div>
            </div>
            {/* end::image */}
            {/* begin::image */}
            <div
              className="exomics-home-func shadow rounded-1 border p-0 col-12"
            >
              <img
                style={{ objectPosition: '0% 50%' }}
                src={Modules}
                alt="modules"
                onClick={() => { setToggler2(!toggler2); }}
              />
              <div>
                <h5 className="fst-italic">Functional Modules</h5>
                <p>
                  In cfOmics, you may browse all of our organized data in
                  spreadsheets in our&nbsp;
                  <HashLink to="/browse/dna#" className="text-white">Browse</HashLink>
                  &nbsp;module, or you can get the detailed profile and analysis of a specific
                  molecule in our&nbsp;
                  <HashLink to="/search/gene#" className="text-white">Search</HashLink>
                  &nbsp;module.
                </p>
              </div>
            </div>
            {/* end::image */}
          </div>
          {/* end::images container */}
        </div>
        {/* end::overview */}
      </div>
      {/* end::stats and functions */}

      {/* begin::separator */}
      <div className="exomics-horizontal-rule" />
      {/* end::separator */}

      {/* begin::highlights */}
      <div className="d-flex flex-column">
        <h5 className="text-body-secondary" id="highlights">
          Highlights
        </h5>

        <div className="row my-2 gx-4 gy-4" id="exomics-home-cards">
          <div className="col-xl-4 col-12">
            <div className="card h-100">
              <img src={CellFree} className="card-img-top" alt="placeholder" />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">Extracellular Data for Biological Insights</h6>
                <ul className="text-dark-emphasis ps-3 p-0">
                  <li>
                    Extracellular high-throughput nucleic acid data
                  </li>
                  <li>
                    Mass spectrometry-based protein and metabolome data
                  </li>
                  <li>
                    A wide range of body fluid samples available:
                    <ul className="p-0 ps-3" style={{ fontSize: '.875rem' }}>
                      <li>Plasma</li>
                      <li>Serum</li>
                      <li>Whole blood</li>
                      <li>Urine</li>
                      <li>Cerebrospinal fluid</li>
                      <li>5 more different types of extracellular specimens</li>
                    </ul>
                  </li>
                  <li>
                    Comprehensive and intuitive data presentation
                  </li>
                  <li>
                    Detailed documentation to support your scientific research
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-12">
            <div className="card h-100">
              <img src={Pipeline} className="card-img-top" alt="placeholder" />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">
                  Multiple Data Types and Features
                </h6>
                <ul className="flex-grow-1 text-dark-emphasis ps-3 p-0">
                  <li>
                    A total of 15 distinct data types for exploration and analysis
                  </li>
                  <li>
                    Four omics domains: DNA, RNA, proteins, and metabolites
                  </li>
                  <li>
                    Essential data types including DNA methylation, RNA abundance,
                    end motif abundance, nucleosome occupation, RNA splicing,
                    alternative promoter, chimeric RNA and microbial abundance
                  </li>
                  <li>
                    Incorporation of biomarker information reported in current literature
                  </li>
                  <li>
                    Comprehensive data browsing and analysis functions
                    to facilitate effective utilization
                  </li>
                </ul>
                <div className="d-flex justify-content-end align-items-center">
                  <HashLink to="/help#pipeline-collapseButton" scroll={defaultHashLinkScroll}>
                    <FontAwesomeIcon icon={faUpRightFromSquare} />
                    &nbsp;Feature Calculation Details
                  </HashLink>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-12">
            <div className="card h-100">
              <img src={Analysis} className="card-img-top" alt="placeholder" />
              <div className="card-body d-flex flex-column">
                <h6 className="card-title">
                  Diverse Analysis Utilities
                </h6>
                <p className="card-text pb-0 mb-1">
                  We provide an avenue for in-depth exploration of gene, microbe,
                  and end motif performance in our&nbsp;
                  <HashLink to="/search/gene#" className="text-decoration-none fst-italic">
                    Search
                  </HashLink>
                  &nbsp;page.
                </p>
                <ul className="text-dark-emphasis p-0 ps-3">
                  <li>
                    Data Profiles:
                    Gene&rsquo;s feature
                    and activity patterns across various data types
                  </li>
                  <li>
                    Comparison Analysis:
                    Differential performace of a data type of the gene, microbe or end motif across
                    different conditions or sample groups
                  </li>
                  <li>
                    Correlation Analysis:
                    Investigation of correlations and associations of
                    the gene between two distinct data types
                  </li>
                  <li>
                    Genome Browser:
                    An interactive genome browser to visualize relevant genomic
                    features and associated omics data
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* end::highlights */}

      {/* begin::lightboxes */}
      <FsLightbox
        toggler={toggler1}
        sources={[Overview]}
      />
      <FsLightbox toggler={toggler2} sources={[Modules]} />
      {/* end::lightboxes */}
    </>
  );
}
