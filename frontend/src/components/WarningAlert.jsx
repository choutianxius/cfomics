import React from 'react';

export default function WarningAlert ({ message = '' }) {
  return (
    <div className="alert alert-warning w-100" role="alert">
      <i>{message}</i>
    </div>
  );
}
