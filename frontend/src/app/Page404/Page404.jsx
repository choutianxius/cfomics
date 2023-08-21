import { React } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Page404 () {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-3">Page Not Found.</h1>
        <h3 className="my-1 py-2" style={{ color: '#d3d3d3' }}>
          <i>{404}</i>
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
