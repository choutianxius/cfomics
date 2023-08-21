import React from 'react';
import './App.css';
import { HashLink } from 'react-router-hash-link';
import { Outlet, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

import ScrollToTop from 'react-scroll-to-top';

const { PUBLIC_URL } = process.env;

function App () {
  // pathname: /search/gene/TP53
  const { pathname } = useLocation();
  const moduleName = (pathname.split('/'))[1];

  return (
    <>
      <div id="page-top" />

      <div className="exomics-navbar position-sticky container-fluid py-0 bg-light-subtle">
        <nav className="navbar navbar-expand-md py-0" aria-label="navbar">
          <div className="container py-0">
            <HashLink to="/home#" className="navbar-brand d-flex">
              <img src={PUBLIC_URL + '/cfomics-icon.svg'} alt="cfomics icon" height={30} style={{ marginTop: '.75rem' }} />
            </HashLink>

            <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="toggle navbar">
              <span className="navbar-toggler-icon" />
            </button>

            <div
              className="collapse navbar-collapse fw-semibold"
              id="navbar"
            >
              <ul className="navbar-nav navbar-nav-scroll ms-auto">
                <li className="nav-item exomics-dropdown">
                  <a
                    href="#page-top"
                    className={'nav-link' + ((moduleName === 'browse') ? ' active' : '')}
                    aria-expanded="false"
                    aria-label="nav to browse"
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="me-1">Browse</span>
                    <FontAwesomeIcon icon={faAngleDown} />
                  </a>
                  <ul
                    id="exomics-nav-browse-dropdown-menu"
                    className="exomics-dropdown-menu fw-normal"
                  >
                    <li><HashLink to="/browse/dna#" className="nav-link" aria-label="nav to browse dna">DNA</HashLink></li>
                    <li><HashLink to="/browse/rna#" className="nav-link" aria-label="nav to browse dna">RNA</HashLink></li>
                    <li><HashLink to="/browse/protein#" className="nav-link" aria-label="nav to browse dna">Protein</HashLink></li>
                    <li><HashLink to="/browse/metabolite#" className="nav-link" aria-label="nav to browse dna">Metabolite</HashLink></li>
                  </ul>
                </li>
                <li className="nav-item">
                  <HashLink
                    to="/search/gene#"
                    className={'nav-link' + ((moduleName === 'search') ? ' active' : '')}
                    aria-label="nav to search"
                  >
                    Search
                  </HashLink>
                </li>
                <li className="nav-item">
                  <HashLink
                    to="/source#"
                    className={'nav-link' + ((moduleName === 'source') ? ' active' : '')}
                    aria-label="nav to source"
                  >
                    Source
                  </HashLink>
                </li>
                <li className="nav-item">
                  <HashLink
                    to="/statistics#"
                    className={'nav-link' + ((moduleName === 'statistics') ? ' active' : '')}
                    aria-label="nav to statistics"
                  >
                    Statistics
                  </HashLink>
                </li>
                <li className="nav-item">
                  <HashLink
                    to="/help#"
                    className={'nav-link' + ((moduleName.includes('help')) ? ' active' : '')}
                    aria-label="nav to help"
                  >
                    Help
                  </HashLink>
                </li>
                <li className="nav-item">
                  <HashLink
                    to="/contact#"
                    className={'nav-link' + ((moduleName === 'contact') ? ' active' : '')}
                    aria-label="nav to contact"
                  >
                    Contact
                  </HashLink>
                </li>
              </ul>
            </div>

          </div>

        </nav>
      </div>

      <div id="outlet" className="container flex-grow-1 mt-3 mb-2">
        <Outlet />
      </div>

      <footer style={{ fontSize: '.75rem', height: '2rem' }}>
        <div className="container-fluid bg-light py-2 h-100">
          <div className="container d-flex align-items-center h-100">
            <span className="me-auto fw-semibold">
              &copy; 2023&nbsp;
              <a className="text-decoration-none" href="https://www.ncrnalab.org/home/" rel="noreferrer" target="_blank">
                Lu Lab @ Tsinghua University
              </a>
            </span>
            <HashLink
              className="link-dark text-decoration-none me-4"
              to="#"
            >
              Scroll Top
            </HashLink>
            <HashLink
              className="link-dark text-decoration-none me-4"
              to="/admin#"
            >
              Admin
            </HashLink>
            <a className="link-dark text-decoration-none me-4" href="mailto:choutianxius@gmail.com">Email Us</a>
            <a className="link-dark text-decoration-none" href="https://www.ncrnalab.org/home/" rel="noreferrer" target="_blank">
              Lab Homepage
            </a>
          </div>
        </div>
      </footer>

      <ScrollToTop smooth className="d-xl-block d-none exomics-scrolltop" component={<FontAwesomeIcon icon={faArrowUp} />} />
    </>
  );
}

export default App;
