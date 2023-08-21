import React from 'react';

export default function SuccessAlert ({ message = '' }) {
  return (
    <div className="alert alert-success w-100" role="alert">
      <i>{message}</i>
    </div>
  );
}
