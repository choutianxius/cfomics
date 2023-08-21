import React from 'react';

export default function ErrorAlert ({ message = '' }) {
  return (
    <div className="alert alert-danger w-100" role="alert">
      Woops! An error occurred:
      <br />
      <i>{message}</i>
    </div>
  );
}
