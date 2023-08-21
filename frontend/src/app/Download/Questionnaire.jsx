import {
  default as React,
  useRef,
  useState,
} from 'react';
import { HashLink } from 'react-router-hash-link';

import ErrorAlert from '../../components/ErrorAlert';
import SuccessAlert from '../../components/SuccessAlert';
import LoadingGlower from '../../components/LoadingGlower';

export default function Questionnaire () {
  const [message, setMessage] = useState('');
  const [ok, setOkIgnored] = useState(true);
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  // function changeCheckBox (e) {
  //   const check1 = document.getElementById('request-form-check1');
  //   const check2 = document.getElementById('request-form-check2');
  //   if (e.target.checked) {
  //     check1.removeAttribute('required');
  //     check2.removeAttribute('required');
  //   } else {
  //     check1.required = true;
  //     check2.required = true;
  //   }
  // }

  function submitForm (e) {
    e.preventDefault();

    if (!formRef.current) { return; }
    const form = formRef.current;

    const valid = form.checkValidity();
    form.classList.add('was-validated');

    if (!valid) { return; }
    const formData = new FormData(form);

    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of formData.entries()) {
      console.log(`${k}, ${v}`);
    }
  }

  if (message) {
    return (
      <>
        {
          ok
            ? <SuccessAlert message={message} />
            : <ErrorAlert message={message} />
        }
        <div className="row gx-4 my-5 d-flex justify-content-center">
          <HashLink className="col-auto text-center" to="/home#">Go back to home page</HashLink>
          {(!ok) && (
          <button
            type="button"
            className="btn btn-link text-center col-auto p-0"
            onClick={() => { setLoading(false); setMessage(null); }}
          >
            Try again
          </button>
          )}
        </div>
      </>
    );
  }

  if (loading) {
    return <LoadingGlower />;
  }

  return (
    <div className="card">
      <div className="card-body">
        <ErrorAlert
          message={
            'This page is disabled for the demo application.\n'
            + 'If you click on \'Submit\', the form to be submitted will show up in the browser console.'
          }
        />

        <div className="exomics-callout">
          <div>
            <p>
              To download all data processed or biomarkers collected in this database,
              please fill the following form and we will email you data files you requested.
            </p>
          </div>
        </div>

        <form ref={formRef} className="container-fluid" onSubmit={submitForm}>
          {/* begin::first row */}
          <div className="row g-3 my-3">
            <div className="col-2">
              <label htmlFor="request-form-title" className="form-label">
                Title
              </label>
              <input id="request-form-title" name="title" type="text" className="form-control" />
            </div>
            <div className="col-5">
              <label htmlFor="request-form-firstname" className="form-label">
                First Name
              </label>
              <input id="request-form-firstname" name="firstName" className="form-control" type="text" required />
            </div>
            <div className="col-5">
              <label htmlFor="request-form-lastname" className="form-label">
                Last Name
              </label>
              <input id="request-form-lastname" name="lastName" className="form-control" type="text" required />
            </div>
          </div>
          {/* end::first row */}
          {/* begin::second row */}
          <div className="row g-3 my-3">
            <div className="col-6">
              <label htmlFor="request-form-email" className="form-label">
                Email
              </label>
              <input id="request-form-email" name="email" className="form-control" type="email" required />
            </div>
            <div className="col-6">
              <label htmlFor="request-form-affiliation" className="form-label">
                Affiliation
              </label>
              <input id="request-form-affiliation" name="affiliation" className="form-control" type="text" required />
            </div>
          </div>
          {/* end::second row */}
          {/* begin::third row */}
          {/* <div className="d-flex align-items-center my-3">
            <span className="me-3 fw-bold">
              What do you want?
            </span>
            <div>
              <div className="form-check form-check-inline">
                <label htmlFor="request-form-check1" className="form-check-label">
                  All processed data
                </label>
                <input
                  onChange={changeCheckBox}
                  id="request-form-check1"
                  name="processedData"
                  className="form-check-input"
                  type="checkbox"
                  required
                />
              </div>
              <div className="form-check form-check-inline">
                <label htmlFor="request-form-check2" className="form-check-label">
                  All biomarkers
                </label>
                <input
                  onChange={changeCheckBox}
                  id="request-form-check2"
                  name="biomarkers"
                  className="form-check-input"
                  type="checkbox"
                  required
                />
              </div>
            </div>
          </div> */}
          {/* end::third row */}
          {/* begin::fourth row */}
          <div className="my-3">
            <label htmlFor="request-form-purpose" className="form-label">
              Please briefly describe your purpose of using our data.
            </label>
            <textarea className="form-control" rows={3} id="request-form-purpose" name="purpose" required />
          </div>
          {/* end::fourth row */}
          {/* begin::fifth row */}
          <div className="form-check my-3">
            <label htmlFor="request-form-consent" className="form-check-label">
              I guarantee that the data will only be used for academic research purposes.
            </label>
            <input id="request-form-consent" name="consent" className="form-check-input" type="checkbox" required />
          </div>
          {/* end::fifth row */}
          <button className="btn btn-outline-primary mt-3" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
