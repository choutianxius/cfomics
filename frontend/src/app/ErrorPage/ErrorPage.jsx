import React from 'react';
import { Link, useNavigate, useRouteError } from 'react-router-dom';

export default function ErrorPage () {
  const navigate = useNavigate();
  const error = useRouteError();
  // console.error(error);

  return (
    <div id="error-page" className="container" style={{ height: '100vh' }}>
      <div className="w-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-3">An Error Occurred.</h1>
        <h3 className="my-1 py-2" style={{ color: '#d3d3d3' }}>
          <i>{error.statusText || error.message}</i>
        </h3>
        <div className="d-flex flex-nowrap justify-content-between">
          <Link className="btn btn-link" to="home">Home Page</Link>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => navigate(-1)}
          >
            Previous Page
          </button>
        </div>
      </div>
    </div>
  );
}
