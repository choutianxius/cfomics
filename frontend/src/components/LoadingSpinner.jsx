import React from 'react';

function LoadingSpinner () {
  return (
    <div className="d-flex justify-content-center h-75">
      <div className="d-flex flex-column justify-content-center">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary fs-3 m-5" role="status" />
        </div>
        <div className="d-flex justify-content-center">
          <div className="fw-bold">Loading...</div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;
