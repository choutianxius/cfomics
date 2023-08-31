import React, { useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { plotUrl } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import SuccessAlert from '../../components/SuccessAlert';
import ErrorAlert from '../../components/ErrorAlert';

function MessageAlert ({ message }) {
  if (message.error) {
    return <ErrorAlert message={message.message} />;
  }
  return <SuccessAlert message={message.message} />;
}

export default function Admin () {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [requestList, setRequestList] = useState();
  const requestListMemo = useMemo(() => requestList, [requestList]); // ?? necessary
  const columnNames = [
    { field: 'title', headerName: 'Title' },
    { field: 'first_name', headerName: 'First Name' },
    { field: 'last_name', headerName: 'Last Name' },
    { field: 'affiliation', headerName: 'Affiliation' },
    { field: 'purpose', headerName: 'Purpose', width: 500 },
    { field: 'time', headerName: 'Time', width: 300 },
  ];

  function updateStats () {
    const url = plotUrl + '/misc/update_stats';
    setIsLoading(true);
    setMessage(null);
    fetch(
      url,
      { headers: { Authorization: token } },
    )
      .then(async (res) => {
        if (res.ok) {
          setMessage(
            { error: false, message: 'Update succeeded! 🎉🎈' },
          );
          return;
        }
        throw new Error((await res.json()).detail);
      })
      .catch((e) => {
        setMessage(
          { error: true, message: e.message + ' 😥😣' },
        );
      })
      .finally(() => { setIsLoading(false); setToken(''); });
  }

  function fetchRequestList () {
    const url = plotUrl + '/misc/get_request_list';
    setIsLoading1(true);
    setMessage(null);
    fetch(
      url,
      { headers: { Authorization: token } },
    )
      .then(async (res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error((await res.json()).detail);
      })
      .then((data) => {
        setRequestList(data);
      })
      .catch((e) => {
        setMessage(
          { error: true, message: e.message + ' 😥😣' },
        );
      })
      .finally(() => { setIsLoading1(false); setToken(''); });
  }

  return (
    <div className="card">
      <div className="card-body">
        <ErrorAlert message="This page is disabled for this demo project." />

        <div className="mb-3">
          <label htmlFor="admin_token" className="form-label">Token</label>
          <input
            style={{ width: '450px' }}
            type="password"
            className="form-control"
            id="admin_token"
            value={token}
            onChange={(e) => { setToken(e.target.value); }}
          />
        </div>

        <div className="mb-3 d-flex align-items-center">
          <button type="button" className="btn btn-primary me-3" onClick={updateStats} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update'}
          </button>
          <button type="button" className="btn btn-primary" onClick={fetchRequestList} disabled={isLoading1}>
            {isLoading1 ? 'Fetching...' : 'Fetch Request List'}
          </button>
        </div>

        {isLoading && <LoadingSpinner />}

        {message && <MessageAlert message={message} />}

        {requestList && requestList.length > 0 && (
          <DataGrid
            rows={requestListMemo}
            columns={columnNames}
            initialState={{ pagination: { paginationModel: { pageSize: 15, page: 0 } } }}
            getRowId={(row) => `${row.first_name}-${row.last_name}-${row.time}`}
          />
        )}
      </div>
    </div>
  );
}
