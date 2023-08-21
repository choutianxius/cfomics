import React from 'react';
import ErrorAlert from './ErrorAlert';
import WarningAlert from './WarningAlert';

import NoDataError from '../utils/errors/NoDataError';

export default function MyAlert ({ error }) {
  if (!error) {
    return null;
  }
  if (error instanceof NoDataError) {
    return <WarningAlert message={error.message} />;
  }
  if (error instanceof Error) {
    return <ErrorAlert message={error.message} />;
  }
  return null;
}
