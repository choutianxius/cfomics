import { React } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import GdMap from './GdMap';

export default function Contact () {
  return (
    <div className="row g-3">
      {/* begin::left */}
      <div className="col-lg-5 col-12 d-flex flex-column justify-content-between">
        <div className="card w-100 mb-4">
          <div className="card-header fw-semibold">
            Lab Homepage
          </div>
          <div className="card-body">
            <p className="card-text mb-1">MOE Key Lab of Bioinformatics</p>
            <p className="card-text mb-1">School of Life Sciences, Tsinghua University</p>
            <a target="_blank" href="https://www.ncrnalab.org/home/" className="btn btn-primary btn-sm" rel="noreferrer">
              <FontAwesomeIcon icon={faHouse} className="pe-2" />
              View Homepage
            </a>
          </div>
        </div>
        <div className="card w-100 mb-4">
          <div className="card-header fw-semibold">
            Lab Address
          </div>
          <div className="card-body">
            <p className="card-text mb-1">Biotechnology Building, School of Life Sciences,</p>
            <p className="card-text mb-1">Tsinghua University, Beijing 100084, P.R.China</p>

          </div>
        </div>

        <div className="card w-100">
          <div className="card-header fw-semibold">
            Contact Information
          </div>
          <div className="card-body">
            <p className="card-text mb-1 d-flex align-items-center">
              <span className="me-2 text-primary-emphasis">
                <FontAwesomeIcon icon={faPhone} />
              </span>
              <a
                href="tel:+861062789217"
                className="card-link mb-1 text-decoration-none"
              >
                +86-10-62789217
              </a>
            </p>
            <p className="card-text mb-1 d-flex align-items-center">
              <span className="me-2 text-primary-emphasis">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <a
                href="mailto:lulab1@tsinghua.edu.cn"
                className="card-link mb-1 text-decoration-none"
              >
                lulab1@tsinghua.edu.cn
              </a>
            </p>
          </div>
        </div>

      </div>
      {/* end::left */}

      {/* begin::map */}
      <div className="col-lg-7 col-12">
        <div className="card h-100">
          <div className="card-header fw-semibold">
            Visit Us
          </div>
          <div className="card-body">
            <GdMap />
          </div>
        </div>
      </div>
      {/* end::map */}
    </div>
  );
}
