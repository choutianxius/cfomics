import React from 'react';

function LoadingGlower () {
  return (
    <div className="row d-flex justify-content-center">
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingGlower;
